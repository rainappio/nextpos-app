import React from 'react'
import {TouchableOpacity, View, Image, Text} from 'react-native'
import images from '../assets/images'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import styles from '../styles'
import {api, dispatchFetchRequest, dispatchFetchRequestWithOption, successMessage, warningMessage} from '../constants/Backend'
import {LocaleContext} from "../locales/LocaleContext"
import {formatDate, normalizeTimeString} from "../actions"
import ScreenHeader from "../components/ScreenHeader";
import * as Location from 'expo-location';
import * as TaskManager from "expo-task-manager";
import {connect} from "react-redux";
import {getCurrentClient} from "../actions/client"
import {getDistance} from 'geolib'
import LoadingScreen from "./LoadingScreen";
import {withContext} from "../helpers/contextHelper";
import {compose} from "redux";
import {StyledText} from "../components/StyledText";
import {ThemeContainer} from "../components/ThemeContainer";
import {CardFourNumberKeyboard} from '../components/MoneyKeyboard'
import * as Device from 'expo-device';


class ClockIn extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        timeCardTitle: 'Staff Time Card',
        storeAddressNotSetup: 'Store address is not setup to use geo-fencing',
        currentLocation: 'Current Location',
        storeLocation: 'Store Location',
        distance: 'Distance',
        kilometers: 'Kilometers',
        username: 'Username',
        currentTime: 'Current Time',
        timeCardStatus: 'Time Card Status',
        clockInTime: 'Clock In Time',
        clockOutTime: 'Clock Out Time',
        clockIn: 'Clock In',
        clockOut: 'Clock Out',
        workingHours: 'Working Hours',
        status: {
          INACTIVE: 'Inactive',
          ACTIVE: 'At Work',
          COMPLETE: 'Off Work'
        },
        clockedIn: 'Clocked in',
        clockedOut: 'Clocked out',
        enterPasswordMsg: 'Please enter pin using the keypad',
        clockInMsg: 'Ready to start your shift!',
        clockOutMsg: 'Ready to finish work!',
        distanceCalculatingMsg: 'Calculating distance from store...',
        distanceExceedMsg: 'The Distance is too far, please try again',
        deviceCheckMsg: 'This device is not time card device, please clock-in by the set device'
      },
      zh: {
        timeCardTitle: '員工打卡',
        storeAddressNotSetup: '地理圍欄功能需要先設定店面地址',
        currentLocation: '您的位置',
        storeLocation: '店家地址',
        distance: '距離',
        kilometers: '公里',
        username: '使用者名稱',
        currentTime: '現在時間',
        timeCardStatus: '打卡狀態',
        clockInTime: '上班時間',
        clockOutTime: '下班時間',
        clockIn: '上班',
        clockOut: '下班',
        workingHours: '上班時數',
        status: {
          INACTIVE: '未曾打卡',
          ACTIVE: '上班中',
          COMPLETE: '下班'
        },
        clockedIn: '上班打卡完成',
        clockedOut: '下班打卡完成',
        enterPasswordMsg: '請在右邊輸入密碼登入打卡',
        clockInMsg: '打卡上班囉',
        clockOutMsg: '辛苦了，打卡下班囉',
        distanceCalculatingMsg: '正在計算店家距離...',
        distanceExceedMsg: '距離太遠，請重新再試',
        deviceCheckMsg: '此裝置非設定的打卡機，請至打卡機上登入打卡'
      }
    })

    this.state = {
      storeLocation: null,
      location: null,
      distance: 0,
      message: null,
      timecard: null,
      cardKeyboardResult: [],
      timecardUserToken: null,
      nowDate: new Date(),
    }
  }

  /**
   * Custom expo client is needed to use geofencing: https://docs.expo.io/versions/latest/guides/adhoc-builds/
   */
  _getLocationAsync = async () => {

    let fgPermission = await Location.requestForegroundPermissionsAsync()

    console.log('fg', fgPermission.status)

    if (fgPermission.status !== 'granted') {
      this.setState({
        message: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log(`Current location: ${JSON.stringify(location)}`)

    let addresses = await Location.reverseGeocodeAsync(
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }
    )

    const address = addresses[0]
    this.setState({location: `${address.name}`});

    if (this.props.client.attributes.hasOwnProperty('ADDRESS')) {
      const storeAddress = this.props.client.attributes['ADDRESS'] || ''
      console.log(`using resolved store address: ${storeAddress}`)

      let storeLocation = await Location.geocodeAsync(storeAddress)
      console.log(`resolved store location: ${JSON.stringify(storeLocation)}`)

      let registeredTasks = await TaskManager.getRegisteredTasksAsync()
      console.debug(registeredTasks)

      if (storeLocation.length === 0) {
        warningMessage(this.context.t('storeAddressNotSetup'))
      } else {
        console.log(`starting geofencing at ${storeAddress}`)
        await Location.startGeofencingAsync('geoFencingTask', [{
          latitude: storeLocation[0].latitude,
          longitude: storeLocation[0].longitude,
          radius: 500
        }])

        console.log('started geofencing')

        const distanceInMeters = getDistance(
          {latitude: location.coords.latitude, longitude: location.coords.longitude},
          {latitude: storeLocation[0].latitude, longitude: storeLocation[0].longitude}
        );

        this.setState({storeLocation: storeAddress, distance: distanceInMeters})
      }
    }

    console.log(`Can you clock in: ${this.props.canClockIn}`)
  };

  componentDidMount = async () => {
    this.getUserTimeCard()
    await this.props.getCurrentClient()

    if (this.props.client !== undefined) {
      console.log('start location based service')

      if (Platform.OS === 'android' && !Device.isDevice) {
        this.setState({
          message: 'This will not work on Sketch in an Android emulator. Try it on your device!',
        });
      } else {
        //this._getLocationAsync();
      }
    }
    this.timerID = setInterval(
      () => this.setState({nowDate: new Date()}),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  renderTimeCardStatus = timeCardStatus => {
    return this.context.t(`status.${timeCardStatus}`)
  }

  renderWorkingHours = timecard => {
    return `${timecard.hours} ${this.context.t('timecard.hours')} ${timecard.minutes} ${this.context.t('timecard.minutes')}`
  }

  getUserTimeCard = (token = null) => {
    dispatchFetchRequest(api.timecard.mostRecent, {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',
      headers: {Authorization: token}
    },
      response => {
        response.json().then(data => {
          console.log('getUserTimeCard', data)
          this.setState({timecard: data})
        })
      }).then()
  }

  handleClockIn = (token = null) => {
    dispatchFetchRequestWithOption(api.timecard.clockin, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    }, {
      defaultMessage: false
    },
      response => {
        successMessage(this.context.t('clockedIn'))
        this.props.navigation.navigate('LoginSuccess')
      }).then()
  }

  handleClockOut = (token = null) => {
    dispatchFetchRequestWithOption(api.timecard.clockout, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    }, {
      defaultMessage: false
    },
      response => {
        successMessage(this.context.t('clockedOut'))
        this.props.navigation.navigate('LoginSuccess')
      }).then()
  }

  getUserToken = async (value) => {
    const formData = new FormData()
    formData.append('password', value)
    dispatchFetchRequestWithOption(api.getClientUserTokens, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
      },
      body: formData
    }, {
      defaultMessage: false
    },
      response => {
        response.json().then(data => {
          dispatchFetchRequest(api.timecard.mostRecent, {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {Authorization: `Bearer ${data?.access_token}`}
          },
            response => {
              response.json().then(data2 => {
                this.setState({timecard: data2, timecardUserToken: data?.access_token})
              })
            }).then()
        })
      }).then()

  }



  render() {
    const {client, canClockIn} = this.props
    const {t, isTablet, themeStyle, customMainThemeColor, customBackgroundColor} = this.context
    const {timecard, storeLocation, distance} = this.state

    const locationBasedService = false //client.clientSettings.LOCATION_BASED_SERVICE != null ? client.clientSettings.LOCATION_BASED_SERVICE.enabled : false

    const timeCardDevice = client.attributes?.TIME_CARD_DEVICE ?? null

    /**
     * This check exists to circumvent the issue that the first render() call hasn't set the this.state.timecard object yet.
     * https://stackoverflow.com/questions/50082423/why-is-render-being-called-twice-in-reactnative
     */
    if (!timecard) {
      return (
        <LoadingScreen />
      )
    }

    let timeCardStatus = timecard.timeCardStatus
    // let authClientUserName =
    //   this.props.route.params !== undefined &&
    //   this.props.route.params.authClientUserName

    let text = 'Waiting..';
    if (this.state.message) {
      text = this.state.message;
    } else if (this.state.location) {
      text = this.state.location;
    }

    if (isTablet) {
      return (
        <ThemeContainer>
          <View style={[styles.container, {justifyContent: 'flex-start'}]}>
            <ScreenHeader backNavigation={true} title={t('timeCardTitle')} />

            {!!timeCardDevice && Device.deviceName !== timeCardDevice ?
              <View style={{borderColor: customMainThemeColor, borderTopWidth: 1}}>
                <View style={styles.sectionTitleContainer}>
                  <Text style={[styles.sectionTitleText, {color: customMainThemeColor, fontSize: 24, fontWeight: 'bold'}]}>{t('deviceCheckMsg')}</Text>
                </View>
              </View>
              :
              <View style={{flex: 1, flexDirection: 'row', borderColor: customMainThemeColor, borderTopWidth: 1, marginHorizontal: -15}}>
                <View style={{flex: 2}}>
                  {(this.state?.timecardUserToken === null) && <View
                    style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                  >
                    <View style={{flex: 4, justifyContent: 'center', alignItems: 'center'}}>
                      <Image
                        source={images.beenclock}
                        style={[{width: 150, height: 150}]}
                        resizeMode={'contain'}
                      />
                    </View>
                    <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
                      <View style={{backgroundColor: customMainThemeColor, padding: 8, borderRadius: 8}}>
                        <Text style={{color: '#fff', fontWeight: 'bold'}}>{t('enterPasswordMsg')}</Text>
                      </View>
                    </View>
                  </View>}
                  <View style={{flex: 1, paddingHorizontal: '10%'}}>
                    <View style={[styles.fieldContainer, {marginBottom: 64, marginTop: 64}]}>

                      <View style={{flex: 1, alignItems: 'center'}}>
                        <StyledText style={{fontSize: 28, marginVertical: 2, fontWeight: 'bold', backgroundColor: customBackgroundColor}}>{normalizeTimeString(this.state?.nowDate, 'YYYY/M/D dddd h:mm:ss a')}</StyledText>
                      </View>
                    </View>
                    {locationBasedService && <View >
                      <View style={[styles.fieldContainer, {marginBottom: 20}]}>
                        <View style={{flex: 2}}>
                          <Text style={[styles.fieldTitle, {fontSize: 16, marginVertical: 2, color: customMainThemeColor}]}>{t('currentLocation')}</Text>
                        </View>
                        <View style={{flex: 3}}>
                          <StyledText style={{alignSelf: 'flex-end', fontSize: 16, marginVertical: 2}}>{text}</StyledText>
                        </View>
                      </View>

                      <View style={[styles.fieldContainer, {marginBottom: 20}]}>
                        <View style={{flex: 2}}>
                          <Text style={[styles.fieldTitle, {fontSize: 16, marginVertical: 2, color: customMainThemeColor}]}>{t('storeLocation')}</Text>
                        </View>
                        <View style={{flex: 3}}>
                          <StyledText style={{alignSelf: 'flex-end', fontSize: 16, marginVertical: 2}}>{storeLocation}</StyledText>
                        </View>
                      </View>

                      <View style={[styles.fieldContainer, {marginBottom: 20}]}>
                        <View style={{flex: 2}}>
                          <Text style={[styles.fieldTitle, {fontSize: 16, marginVertical: 2, color: customMainThemeColor}]}>{t('distance')}</Text>
                        </View>
                        <View style={{flex: 3}}>
                          <StyledText style={{alignSelf: 'flex-end', fontSize: 16, marginVertical: 2}}>
                            {distance / 1000} {t('kilometers')}
                          </StyledText>
                        </View>
                      </View>
                    </View>}

                    {(locationBasedService && this.state?.timecardUserToken !== null && storeLocation === null) &&
                      <View style={styles.sectionTitleContainer}>
                        <Text style={[styles.sectionTitleText, {color: customMainThemeColor, fontSize: 24, fontWeight: 'bold'}]}>{t('distanceCalculatingMsg')}</Text>
                      </View>
                    }
                    {(locationBasedService && this.state?.timecardUserToken !== null && distance > 200) &&
                      <View style={styles.sectionTitleContainer}>
                        <Text style={[styles.sectionTitleText, {color: customMainThemeColor, fontSize: 24, fontWeight: 'bold'}]}>{t('distanceExceedMsg')}</Text>
                      </View>
                    }

                    {(!locationBasedService && this.state?.timecardUserToken !== null || this.state?.timecardUserToken !== null && storeLocation !== null && distance < 200) && <View style={{flex: 1}}>
                      <View style={styles.sectionTitleContainer}>
                        <Text style={[styles.sectionTitleText, {color: customMainThemeColor, fontSize: 24, fontWeight: 'bold'}]}>{t('timeCardStatus')}</Text>
                      </View>

                      <View style={[styles.fieldContainer, {marginBottom: 20, marginTop: 20}]}>
                        <View style={{flex: 2}}>
                          <Text style={[styles.fieldTitle, {fontSize: 16, marginVertical: 2, color: customMainThemeColor}]}>{t('timeCardStatus')}</Text>
                        </View>
                        <View style={{flex: 3}}>
                          <StyledText style={{alignSelf: 'flex-end', fontSize: 16, marginVertical: 2}}>{this.renderTimeCardStatus(timecard.timeCardStatus)}</StyledText>
                        </View>
                      </View>
                      <View style={[styles.fieldContainer, {marginBottom: 20}]}>
                        <View style={{flex: 2}}>
                          <Text style={[styles.fieldTitle, {fontSize: 16, marginVertical: 2, color: customMainThemeColor}]}>{t('clockInTime')}</Text>
                        </View>
                        <View style={{flex: 3}}>
                          <StyledText style={{alignSelf: 'flex-end', fontSize: 16, marginVertical: 2}}>{timecard.clockIn != null ? `${formatDate(timecard.clockIn)}` : ''}</StyledText>
                        </View>
                      </View>
                      {timeCardStatus === 'COMPLETE' && (
                        <View>
                          <View style={[styles.fieldContainer, {marginBottom: 20}]}>
                            <View style={{flex: 2}}>
                              <Text style={[styles.fieldTitle, {fontSize: 16, marginVertical: 2, color: customMainThemeColor}]}>
                                {t('clockOutTime')}
                              </Text>
                            </View>
                            <View style={{flex: 3}}>
                              <StyledText style={{alignSelf: 'flex-end', fontSize: 16, marginVertical: 2}}>{timecard.clockOut != null ? `${formatDate(timecard.clockOut)}` : ''}</StyledText>
                            </View>
                          </View>
                          <View style={[styles.fieldContainer, {marginBottom: 20}]}>
                            <View style={{flex: 1}}>
                              <Text style={[styles.fieldTitle, {fontSize: 16, marginVertical: 2, color: customMainThemeColor}]}>
                                {t('workingHours')}
                              </Text>
                            </View>
                            <View style={{flex: 3}}>
                              <StyledText style={{alignSelf: 'flex-end', fontSize: 16, marginVertical: 2}}>{this.renderWorkingHours(timecard)}</StyledText>
                            </View>
                          </View>
                        </View>
                      )}
                    </View>}
                  </View>
                </View>

                {(this.state?.timecardUserToken === null) && (
                  <View style={{maxWidth: 400, maxHeight: 600, alignSelf: 'center', flex: 1}}>
                    <CardFourNumberKeyboard
                      initialValue={[]}
                      value={this.state.cardKeyboardResult}
                      getResult={(result) => {
                        this.setState({cardKeyboardResult: result})
                        if (result.length === 4 && !result.some((item) => {return item === ''})) {
                          this.getUserToken(result.join(''))
                          this.setState({cardKeyboardResult: []})
                        }
                      }} />
                  </View>
                )}
                {(!locationBasedService && this.state?.timecardUserToken !== null || this.state?.timecardUserToken !== null && storeLocation !== null && distance < 200) && (
                  <View style={[{flex: 1, alignItems: 'center', justifyContent: 'space-evenly'}]}>
                    <View >
                      <StyledText style={{fontSize: 24, color: customMainThemeColor, fontWeight: 'bold'}}>
                        {t('greeting')}, {timecard?.displayName}
                      </StyledText>
                    </View>
                    <TouchableOpacity
                      style={styles?.squareButton(customMainThemeColor)}
                      onPress={
                        timeCardStatus === 'ACTIVE'
                          ? () => this.handleClockOut(`Bearer ${this.state?.timecardUserToken}`)
                          : () => this.handleClockIn(`Bearer ${this.state?.timecardUserToken}`)
                      }
                    >
                      <View>
                        <FontAwesomeIcon
                          name="hand-o-up"
                          size={40}
                          color="#fff"
                          style={[styles.centerText, styles.margin_15]}
                        />
                        <StyledText style={[styles.whiteColor, styles.centerText]}>
                          {timeCardStatus === 'ACTIVE' ? t('clockOut') : t('clockIn')}
                        </StyledText>
                      </View>
                    </TouchableOpacity>
                    <View>
                      <StyledText style={{fontSize: 24, color: customMainThemeColor, fontWeight: 'bold'}}>
                        {t(timeCardStatus === 'ACTIVE' ? 'clockOutMsg' : 'clockInMsg')}
                      </StyledText>
                    </View>
                  </View>
                )}
              </View>
            }
          </View>
        </ThemeContainer>
      )
    } else {
      return (
        <ThemeContainer>
          <View style={[styles.container, {justifyContent: 'flex-start'}]}>
            <ScreenHeader backNavigation={true} title={t('timeCardTitle')} />

            {!!timeCardDevice && Device.deviceName !== timeCardDevice ?
              <View style={{borderColor: customMainThemeColor, borderTopWidth: 1}}>
                <View style={styles.sectionTitleContainer}>
                  <Text style={[styles.sectionTitleText, {color: customMainThemeColor, fontSize: 24, fontWeight: 'bold'}]}>{t('deviceCheckMsg')}</Text>
                </View>
              </View>
              :
              <>
                <View >
                  <View style={[styles.fieldContainer, {marginBottom: 16, marginTop: 16}]}>

                    <View style={{flex: 1, alignItems: 'center'}}>
                      <StyledText
                        adjustsFontSizeToFit
                        numberOfLines={1}
                        style={[{fontSize: 24, marginVertical: 2, fontWeight: 'bold', backgroundColor: customBackgroundColor}]}>{normalizeTimeString(this.state?.nowDate, 'YYYY/M/D dddd h:mm:ss a')}
                      </StyledText>
                    </View>
                  </View>
                  {locationBasedService && <>
                    <View style={[styles.fieldContainer]}>
                      <View style={{flex: 2}}>
                        <Text style={[styles.fieldTitle, {fontSize: 16, marginVertical: 2, color: customMainThemeColor}]}>{t('currentLocation')}</Text>
                      </View>
                      <View style={{flex: 3}}>
                        <StyledText style={{alignSelf: 'flex-end', fontSize: 16, marginVertical: 2}}>{text}</StyledText>
                      </View>
                    </View>

                    <View style={[styles.fieldContainer]}>
                      <View style={{flex: 2}}>
                        <Text style={[styles.fieldTitle, {fontSize: 16, marginVertical: 2, color: customMainThemeColor}]}>{t('storeLocation')}</Text>
                      </View>
                      <View style={{flex: 3}}>
                        <StyledText style={{alignSelf: 'flex-end', fontSize: 16, marginVertical: 2}}>{storeLocation}</StyledText>
                      </View>
                    </View>

                    <View style={[styles.fieldContainer]}>
                      <View style={{flex: 2}}>
                        <Text style={[styles.fieldTitle, {fontSize: 16, marginVertical: 2, color: customMainThemeColor}]}>{t('distance')}</Text>
                      </View>
                      <View style={{flex: 3}}>
                        <StyledText style={{alignSelf: 'flex-end', fontSize: 16, marginVertical: 2}}>
                          {distance / 1000} {t('kilometers')}
                        </StyledText>
                      </View>
                    </View>
                  </>}

                  {(locationBasedService && this.state?.timecardUserToken !== null && storeLocation === null) &&
                    <View style={styles.sectionTitleContainer}>
                      <Text style={[styles.sectionTitleText, {color: customMainThemeColor, fontSize: 24, fontWeight: 'bold'}]}>{t('distanceCalculatingMsg')}</Text>
                    </View>
                  }
                  {(locationBasedService && this.state?.timecardUserToken !== null && distance > 200) &&
                    <View style={styles.sectionTitleContainer}>
                      <Text style={[styles.sectionTitleText, {color: customMainThemeColor, fontSize: 24, fontWeight: 'bold'}]}>{t('distanceExceedMsg')}</Text>
                    </View>
                  }

                  {(!locationBasedService && this.state?.timecardUserToken !== null) || (this.state?.timecardUserToken !== null && storeLocation !== null && distance < 200) && <>
                    <View style={styles.sectionTitleContainer}>
                      <StyledText style={styles.sectionTitleText}>{t('timeCardStatus')}</StyledText>
                    </View>

                    <View style={styles.fieldContainer}>
                      <View style={{flex: 2}}>
                        <Text style={[styles.fieldTitle, {fontSize: 16, marginVertical: 2, color: customMainThemeColor}]}>{t('timeCardStatus')}</Text>
                      </View>
                      <View style={{flex: 3}}>
                        <StyledText style={{alignSelf: 'flex-end', fontSize: 16, marginVertical: 2}}>{this.renderTimeCardStatus(timecard.timeCardStatus)}</StyledText>
                      </View>
                    </View>
                    <View style={styles.fieldContainer}>
                      <View style={{flex: 2}}>
                        <Text style={[styles.fieldTitle, {fontSize: 16, marginVertical: 2, color: customMainThemeColor}]}>{t('clockInTime')}</Text>
                      </View>
                      <View style={{flex: 3}}>
                        <StyledText style={{alignSelf: 'flex-end', fontSize: 16, marginVertical: 2}}>{timecard.clockIn != null ? `${formatDate(timecard.clockIn)}` : ''}</StyledText>
                      </View>
                    </View>
                    {timeCardStatus === 'COMPLETE' && (
                      <View>
                        <View style={styles.fieldContainer}>
                          <View style={{flex: 2}}>
                            <Text style={[styles.fieldTitle, {fontSize: 16, marginVertical: 2, color: customMainThemeColor}]}>
                              {t('clockOutTime')}
                            </Text>
                          </View>
                          <View style={{flex: 3}}>
                            <StyledText style={{alignSelf: 'flex-end', fontSize: 16, marginVertical: 2}}>{timecard.clockOut != null ? `${formatDate(timecard.clockOut)}` : ''}</StyledText>
                          </View>
                        </View>
                        <View style={styles.fieldContainer}>
                          <View style={{flex: 1}}>
                            <Text style={[styles.fieldTitle, {fontSize: 16, marginVertical: 2, color: customMainThemeColor}]}>
                              {t('workingHours')}
                            </Text>
                          </View>
                          <View style={{flex: 3}}>
                            <StyledText style={{alignSelf: 'flex-end', fontSize: 16, marginVertical: 2}}>{this.renderWorkingHours(timecard)}</StyledText>
                          </View>
                        </View>
                      </View>
                    )}
                  </>}
                </View>

                {(this.state?.timecardUserToken === null) && (
                  <View style={{maxWidth: 400, maxHeight: 600, alignSelf: 'center', flex: 1}}>
                    <CardFourNumberKeyboard
                      initialValue={[]}
                      value={this.state.cardKeyboardResult}
                      getResult={(result) => {
                        this.setState({cardKeyboardResult: result})
                        if (result.length === 4 && !result.some((item) => {return item === ''})) {
                          this.getUserToken(result.join(''))
                          this.setState({cardKeyboardResult: []})
                        }
                      }} />
                  </View>
                )}

                {(!locationBasedService && this.state?.timecardUserToken !== null || this.state?.timecardUserToken !== null && storeLocation !== null && distance < 200) && (
                  <View style={[{flex: 1, alignItems: 'center', justifyContent: 'space-evenly'}]}>
                    <View >
                      <StyledText style={{fontSize: 24, color: customMainThemeColor, fontWeight: 'bold'}}>
                        {t('greeting')}, {timecard?.displayName}
                      </StyledText>
                    </View>
                    <TouchableOpacity
                      style={styles?.squareButton(customMainThemeColor)}
                      onPress={
                        timeCardStatus === 'ACTIVE'
                          ? () => this.handleClockOut(`Bearer ${this.state?.timecardUserToken}`)
                          : () => this.handleClockIn(`Bearer ${this.state?.timecardUserToken}`)
                      }
                    >
                      <View>
                        <FontAwesomeIcon
                          name="hand-o-up"
                          size={40}
                          color="#fff"
                          style={[styles.centerText, styles.margin_15]}
                        />
                        <StyledText style={[styles.whiteColor, styles.centerText]}>
                          {timeCardStatus === 'ACTIVE' ? t('clockOut') : t('clockIn')}
                        </StyledText>
                      </View>
                    </TouchableOpacity>
                    <View>
                      <StyledText style={{fontSize: 24, color: customMainThemeColor, fontWeight: 'bold'}}>
                        {t(timeCardStatus === 'ACTIVE' ? 'clockOutMsg' : 'clockInMsg')}
                      </StyledText>
                    </View>
                  </View>
                )}
              </>
            }
          </View>
        </ThemeContainer>
      )
    }


  }
}

const mapStateToProps = state => ({
  client: state.client.data,
  loading: state.client.loading,
  haveData: state.client.haveData,
  canClockIn: state.clockIn.canClockIn
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getCurrentClient: () => dispatch(getCurrentClient())
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withContext
)

export default enhance(ClockIn)


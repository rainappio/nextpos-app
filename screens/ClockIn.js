import React from 'react'
import {ActivityIndicator, Text, TouchableOpacity, View, AsyncStorage} from 'react-native'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { DismissKeyboard } from '../components/DismissKeyboard'
import styles from '../styles'
import {api, dispatchFetchRequest, dispatchFetchRequestWithOption, successMessage, warningMessage} from '../constants/Backend'
import {LocaleContext} from "../locales/LocaleContext"
import {dateToLocaleString, doLogout, formatDate, getAnnouncements, getClientUsr, getShiftStatus} from "../actions"
import BackBtn from "../components/BackBtn"
import ScreenHeader from "../components/ScreenHeader";
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions'
import * as TaskManager from "expo-task-manager";
import {connect} from "react-redux";
import {getCurrentClient} from "../actions/client"
import { getDistance } from 'geolib'
import LoadingScreen from "./LoadingScreen";
import {withContext} from "../helpers/contextHelper";
import {compose} from "redux";
import {StyledText} from "../components/StyledText";
import {ThemeContainer} from "../components/ThemeContainer";

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
        clockedOut: 'Clocked out'
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
        clockedOut: '下班打卡完成'
      }
    })

    this.state = {
      storeLocation: null,
      location: null,
      distance: 0,
      message: null,
      timecard: null
    }
  }

  /**
   * Custom expo client is needed to use geofencing: https://docs.expo.io/versions/latest/guides/adhoc-builds/
   */
  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status !== 'granted') {
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
    this.setState({ location: `${address.name}` });

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

        const distanceInMeters = getDistance(
          { latitude: location.coords.latitude, longitude: location.coords.longitude },
          { latitude: storeLocation[0].latitude, longitude: storeLocation[0].longitude }
        );

        this.setState({ storeLocation: storeAddress, distance: distanceInMeters })
      }
    }

    console.log(`Can you clock in: ${this.props.canClockIn}`)
  };

  componentDidMount = async () => {
    this.getUserTimeCard()
    await this.props.getCurrentClient()

    if (this.props.client !== undefined) {
      console.log('start location based service')

      if (Platform.OS === 'android' && !Constants.isDevice) {
        this.setState({
          message: 'This will not work on Sketch in an Android emulator. Try it on your device!',
        });
      } else {
        this._getLocationAsync();
      }
    }
  }

  renderTimeCardStatus = timeCardStatus => {
    return this.context.t(`status.${timeCardStatus}`)
  }

  renderWorkingHours = timecard => {
    return `${timecard.hours} ${this.context.t('timecard.hours')} ${timecard.minutes} ${this.context.t('timecard.minutes')}`
  }

  getUserTimeCard = () => {
    dispatchFetchRequest(api.timecard.mostRecent, {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          this.setState({ timecard: data })
        })
      }).then()
  }

  handleClockIn = () => {
    dispatchFetchRequestWithOption(api.timecard.clockin, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      }, {
        defaultMessage: false
      },
      response => {
        successMessage(this.context.t('clockedIn'))
        this.props.navigation.navigate('LoginSuccess')
      }).then()
  }

  handleClockOut = () => {
    dispatchFetchRequestWithOption(api.timecard.clockout, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      }, {
        defaultMessage: false
      },
      response => {
        successMessage(this.context.t('clockedOut'))
        this.props.navigation.navigate('LoginSuccess')
      }).then()
  }

  render() {
    const {canClockIn} = this.props
    const { t } = this.context
    const { timecard, storeLocation, distance} = this.state

    /**
     * This check exists to circumvent the issue that the first render() call hasn't set the this.state.timecard object yet.
     * https://stackoverflow.com/questions/50082423/why-is-render-being-called-twice-in-reactnative
     */
    if (!timecard) {
      return (
        <LoadingScreen/>
      )
    }

    let timeCardStatus = timecard.timeCardStatus
    let authClientUserName =
      this.props.navigation.state.params !== undefined &&
      this.props.navigation.state.params.authClientUserName

    let text = 'Waiting..';
    if (this.state.message) {
      text = this.state.message;
    } else if (this.state.location) {
      text = this.state.location;
    }

    return (
      <ThemeContainer>
        <View style={[styles.container, {justifyContent: 'flex-start'}]}>
          <ScreenHeader backNavigation={true} title={t('timeCardTitle')} />

          <View style={{ flex: 1}}>
            <View style={[styles.fieldContainer]}>
              <View style={{ flex: 2 }}>
                <StyledText style={styles.fieldTitle}>{t('currentLocation')}</StyledText>
              </View>
              <View style={{ flex: 3 }}>
                <StyledText style={{alignSelf: 'flex-end'}}>{text}</StyledText>
              </View>
            </View>

            <View style={[styles.fieldContainer]}>
              <View style={{ flex: 2 }}>
                <StyledText style={styles.fieldTitle}>{t('storeLocation')}</StyledText>
              </View>
              <View style={{ flex: 3 }}>
                <StyledText style={{ alignSelf: 'flex-end' }}>{storeLocation}</StyledText>
              </View>
            </View>

            <View style={[styles.fieldContainer]}>
              <View style={{ flex: 2 }}>
                <StyledText style={styles.fieldTitle}>{t('distance')}</StyledText>
              </View>
              <View style={{ flex: 3 }}>
                <StyledText style={{ alignSelf: 'flex-end' }}>
                  {distance/1000} {t('kilometers')}
                </StyledText>
              </View>
            </View>

            <View style={[styles.fieldContainer]}>
              <View style={{ flex: 2 }}>
                <StyledText style={styles.fieldTitle}>{t('username')}</StyledText>
              </View>
              <View style={{ flex: 3 }}>
                <StyledText style={{ alignSelf: 'flex-end' }}>
                  {authClientUserName}
                </StyledText>
              </View>
            </View>
            <View style={styles.fieldContainer}>
              <View style={{ flex: 2 }}>
                <StyledText style={[styles.fieldTitle]}>{t('currentTime')}</StyledText>
              </View>
              <View style={{ flex: 3 }}>
                <StyledText style={{alignSelf: 'flex-end'}}>{dateToLocaleString(new Date())}</StyledText>
              </View>
            </View>
            <View style={styles.sectionTitleContainer}>
              <StyledText style={styles.sectionTitleText}>{t('timeCardStatus')}</StyledText>
            </View>
            <View style={styles.fieldContainer}>
              <View style={{ flex: 2 }}>
                <StyledText style={styles.fieldTitle}>{t('timeCardStatus')}</StyledText>
              </View>
              <View style={{flex: 3}}>
                <StyledText style={{alignSelf: 'flex-end'}}>{this.renderTimeCardStatus(timecard.timeCardStatus)}</StyledText>
              </View>
            </View>
            <View style={styles.fieldContainer}>
              <View style={{flex: 2}}>
                <StyledText style={styles.fieldTitle}>{t('clockInTime')}</StyledText>
              </View>
              <View style={{flex: 3}}>
                <StyledText style={{alignSelf: 'flex-end'}}>{timecard.clockIn != null ? `${formatDate(timecard.clockIn)}` : ''}</StyledText>
              </View>
            </View>
            { timeCardStatus === 'COMPLETE' && (
              <View>
                <View style={styles.fieldContainer}>
                  <View style={{flex: 2}}>
                    <StyledText style={styles.fieldTitle}>
                      {t('clockOutTime')}
                    </StyledText>
                  </View>
                  <View style={{flex: 3}}>
                    <StyledText style={{alignSelf: 'flex-end'}}>{timecard.clockOut != null ? `${formatDate(timecard.clockOut)}` : ''}</StyledText>
                  </View>
                </View>
                <View style={styles.fieldContainer}>
                  <View style={{flex: 1}}>
                    <StyledText style={styles.fieldTitle}>
                      {t('workingHours')}
                    </StyledText>
                  </View>
                  <View style={{flex: 3}}>
                    <StyledText style={{alignSelf: 'flex-end'}}>{this.renderWorkingHours(timecard)}</StyledText>
                  </View>
                </View>
              </View>
            )}
          </View>

          {canClockIn && (
            <View style={[{flex: 1, alignItems: 'center'}]}>
              <TouchableOpacity
                style={styles.squareButton}
                onPress={
                  timeCardStatus === 'ACTIVE'
                    ? () => this.handleClockOut()
                    : () => this.handleClockIn()
                }
              >
                <View>
                  <FontAwesomeIcon
                    name="hand-o-up"
                    size={40}
                    color="#fff"
                    style={[styles.centerText, styles.margin_15]}
                  />
                  <StyledText style={[styles.centerText, styles.whiteColor]}>
                    {timeCardStatus === 'ACTIVE' ? t('clockOut') : t('clockIn')}
                  </StyledText>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ThemeContainer>
    )
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


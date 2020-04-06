import React from 'react'
import {ActivityIndicator, Text, TouchableOpacity, View, AsyncStorage} from 'react-native'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { DismissKeyboard } from '../components/DismissKeyboard'
import styles from '../styles'
import {api, dispatchFetchRequest, successMessage, warningMessage} from '../constants/Backend'
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
        }
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
        }
      }
    })

    this.state = {
      storeLocation: null,
      location: null,
      distance: 0,
      message: null,
      timecard: null,
      canClockIn: false
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

    const canClockIn = await AsyncStorage.getItem('canClockIn')
    this.setState({ canClockIn: canClockIn === 'true' })
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
    dispatchFetchRequest(api.timecard.clockin, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      },
      response => {
        successMessage('Clocked in')
        this.props.navigation.navigate('LoginSuccess')
      }).then()
  }

  handleClockOut = () => {
    dispatchFetchRequest(api.timecard.clockout, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      },
      response => {
        successMessage('Clocked out')
        this.props.navigation.navigate('LoginSuccess')
      }).then()
  }

  render() {
    const { t } = this.context
    const { timecard, storeLocation, distance, canClockIn } = this.state

    /**
     * This check exists to circumvent the issue that the first render() call hasn't set the this.state.timecard object yet.
     * https://stackoverflow.com/questions/50082423/why-is-render-being-called-twice-in-reactnative
     */
    if (!timecard) {
      return (
        <View style={[styles.container]}>
          <ActivityIndicator size="large" color="#ccc"/>
        </View>
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
      <DismissKeyboard>
        <View style={[styles.container_nocenterCnt]}>
          <ScreenHeader backNavigation={true} title={t('timeCardTitle')} />

          <View style={{ flex: 3, justifyContent: 'center' }}>
            <View style={[styles.fieldContainer]}>
              <View style={{ flex: 2 }}>
                <Text style={styles.fieldTitle}>{t('currentLocation')}</Text>
              </View>
              <View style={{ flex: 3 }}>
                <Text style={{ alignSelf: 'flex-end' }}>
                  {text}
                </Text>
              </View>
            </View>

            <View style={[styles.fieldContainer]}>
              <View style={{ flex: 2 }}>
                <Text style={styles.fieldTitle}>{t('storeLocation')}</Text>
              </View>
              <View style={{ flex: 3 }}>
                <Text style={{ alignSelf: 'flex-end' }}>
                  {storeLocation}
                </Text>
              </View>
            </View>

            <View style={[styles.fieldContainer]}>
              <View style={{ flex: 2 }}>
                <Text style={styles.fieldTitle}>{t('distance')}</Text>
              </View>
              <View style={{ flex: 3 }}>
                <Text style={{ alignSelf: 'flex-end' }}>
                  {distance/1000} {t('kilometers')}
                </Text>
              </View>
            </View>

            <View style={[styles.fieldContainer]}>
              <View style={{ flex: 2 }}>
                <Text style={styles.fieldTitle}>{t('username')}</Text>
              </View>
              <View style={{ flex: 3 }}>
                <Text style={{ alignSelf: 'flex-end' }}>
                  {authClientUserName}
                </Text>
              </View>
            </View>
            <View style={styles.fieldContainer}>
              <View style={{ flex: 2 }}>
                <Text style={[styles.fieldTitle]}>{t('currentTime')}</Text>
              </View>
              <View style={{ flex: 3 }}>
                <Text style={{ alignSelf: 'flex-end' }}>{`${dateToLocaleString(
                  new Date()
                )}`}</Text>
              </View>
            </View>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitleText}>{t('timeCardStatus')}</Text>
            </View>
            <View style={styles.fieldContainer}>
              <View style={{ flex: 2 }}>
                <Text style={styles.fieldTitle}>{t('timeCardStatus')}</Text>
              </View>
              <View style={{flex: 3}}>
                <Text style={{alignSelf: 'flex-end'}}>{this.renderTimeCardStatus(timecard.timeCardStatus)}</Text>
              </View>
            </View>
            <View style={styles.fieldContainer}>
              <View style={{flex: 2}}>
                <Text style={styles.fieldTitle}>
                  {t('clockInTime')}
                </Text>
              </View>
              <View style={{flex: 3}}>
                <Text style={{alignSelf: 'flex-end'}}>{timecard.clockIn != null ? `${formatDate(timecard.clockIn)}` : ''}</Text>
              </View>
            </View>
            { timeCardStatus === 'COMPLETE' && (
              <View>
                <View style={styles.fieldContainer}>
                  <View style={{flex: 2}}>
                    <Text style={styles.fieldTitle}>
                      {t('clockOutTime')}
                    </Text>
                  </View>
                  <View style={{flex: 3}}>
                    <Text style={{alignSelf: 'flex-end'}}>{timecard.clockOut != null ? `${formatDate(timecard.clockOut)}` : ''}</Text>
                  </View>
                </View>
                <View style={styles.fieldContainer}>
                  <View style={{flex: 1}}>
                    <Text style={styles.fieldTitle}>
                      {t('workingHours')}
                    </Text>
                  </View>
                  <View style={{flex: 3}}>
                    <Text style={{alignSelf: 'flex-end'}}>{this.renderWorkingHours(timecard)}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {canClockIn && (
            <View style={[{flex: 2, alignItems: 'center'}]}>
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
                  <Text style={[styles.centerText, styles.whiteColor]}>
                    {timeCardStatus === 'ACTIVE' ? t('clockOut') : t('clockIn')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </DismissKeyboard>
    )
  }
}

const mapStateToProps = state => ({
  client: state.client.data,
  loading: state.client.loading,
  haveData: state.client.haveData
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getCurrentClient: () => dispatch(getCurrentClient())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClockIn)

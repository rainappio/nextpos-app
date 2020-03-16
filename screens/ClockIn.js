import React from 'react'
import {ActivityIndicator, Text, TouchableHighlight, TouchableOpacity, View} from 'react-native'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { DismissKeyboard } from '../components/DismissKeyboard'
import styles from '../styles'
import {api, dispatchFetchRequest, successMessage} from '../constants/Backend'
import {LocaleContext} from "../locales/LocaleContext"
import {dateToLocaleString, formatDate} from "../actions"
import BackBtn from "../components/BackBtn"
import ScreenHeader from "../components/ScreenHeader";

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
      timecard: null
    }
  }

  componentDidMount() {
    this.getUserTimeCard()
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
    const { timecard } = this.state

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

    return (
      <DismissKeyboard>
        <View style={[styles.container_nocenterCnt]}>
          <ScreenHeader backNavigation={true} title={t('timeCardTitle')} />

          <View style={{ flex: 3, justifyContent: 'center' }}>
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
        </View>
      </DismissKeyboard>
    )
  }
}

export default ClockIn

import React from 'react'
import {ActivityIndicator, Text, TouchableHighlight, TouchableOpacity, View} from 'react-native'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { DismissKeyboard } from '../components/DismissKeyboard'
import styles from '../styles'
import {api, dispatchFetchRequest, successMessage} from '../constants/Backend'
import {LocaleContext} from "../locales/LocaleContext"
import {dateToLocaleString, formatDate, isTablet} from "../actions"
import BackBtn from "../components/BackBtn"

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
        clockOut: 'Clock Out'
      },
      zh: {
        timeCardTitle: '員工打卡',
        username: '使用者名稱',
        currentTime: '現在時間',
        timeCardStatus: '打卡狀態',
        clockInTime: '上班時間',
        clockOutTime: '下班時間',
        clockIn: '上班',
        clockOut: '下班'
      }
    })

    this.state = {
      timecard: null
    }
  }

  componentDidMount() {
    this.getUserTimeCard()
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
        <View style={[styles.container,{paddingLeft: 0, paddingRight: 0}]}>
          <BackBtn size={isTablet ? 44 : 28}/>
          <View>
            <TouchableHighlight>
              <Text style={[
            			styles.welcomeText,
            			styles.orange_color,
            			styles.textBold
          			]}>{t('timeCardTitle')}</Text>
            </TouchableHighlight>
          </View>

          <View style={{ flex: 2, justifyContent: 'center' }}>
            <View style={[styles.fieldContainer]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldTitle, styles.textMedium]}>{t('username')}</Text>
              </View>
              <View style={{ flex: 3 }}>
                <Text style={[{ alignSelf: 'flex-end' }, styles.textMedium]}>
                  {authClientUserName}
                </Text>
              </View>
            </View>
            <View style={styles.fieldContainer}>
              <View style={{ width: '40%' }}>
                <Text style={[styles.fieldTitle, styles.textMedium]}>{t('currentTime')}</Text>
              </View>
              <View style={{ width: '60%'}}>
                <Text style={[{ alignSelf: 'flex-end' }, styles.textMedium]}>{`${dateToLocaleString(
                  new Date()
                )}`}</Text>
              </View>
            </View>
            <View style={styles.fieldContainer}>
              <View style={{ width: '55%' }}>
                <Text style={[styles.fieldTitle, styles.textMedium]}>{t('timeCardStatus')}:</Text>
              </View>
              <View style={{ width: '45%'}}>
                <Text style={[{alignSelf: 'flex-end'}, styles.textMedium]}>{timecard.timeCardStatus}</Text>
              </View>
            </View>
            <View style={styles.fieldContainer}>
              <View style={{ width: '40%' }}>
                <Text style={[styles.fieldTitle, styles.textMedium]}>
                  {t('clockInTime')}:
                </Text>
              </View>
              <View style={{ width: '60%'}}>
                <Text style={[{alignSelf: 'flex-end'}, styles.textMedium]}>{timecard.clockIn != null ? `${formatDate(timecard.clockIn)}` : ''}</Text>
              </View>
            </View>
            { timeCardStatus === 'COMPLETE' && (
              <View style={styles.fieldContainer}>
                <View style={{flex: 1}}>
                  <Text style={[styles.fieldTitle,styles.textMedium]}>
                    {t('clockOutTime')}:
                  </Text>
                </View>
                <View style={{flex: 3}}>
                  <Text style={[{alignSelf: 'flex-end'}, styles.textMedium]}>{timecard.clockOut != null ? `${formatDate(timecard.clockOut)}` : ''}</Text>
                </View>
              </View>
            )}
          </View>

          <View style={[{ flex: 3, alignItems: 'center' }]}>
            <View style={styles.squareButton}>
              <TouchableOpacity
                onPress={
                  timeCardStatus === 'ACTIVE'
                    ? () => this.handleClockOut()
                    : () => this.handleClockIn()
                }
              >
                <View>
                  <FontAwesomeIcon
                    name="hand-o-up"
                    size={isTablet ? 80 : 40}
                    color="#fff"
                    style={[styles.centerText, styles.iconMargin]}
                  />
                  <Text style={[styles.centerText, styles.whiteColor, styles.defaultfontSize]}>
                    {timeCardStatus === 'ACTIVE' ? t('clockOut') : t('clockIn')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </DismissKeyboard>
    )
  }
}

export default ClockIn

import React from 'react'
import { Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { DismissKeyboard } from '../components/DismissKeyboard'
import styles from '../styles'
import {api, makeFetchRequest} from '../constants/Backend'
import {LocaleContext} from "../locales/LocaleContext";
import {dateToLocaleString, formatDate} from "../actions";
import BackBtn from "../components/BackBtn";

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
        timeCardStatus: 'Status',
        clockIn: 'Clock In',
        clockOut: 'Clock Out'
      },
      zh: {
        timeCardTitle: '員工打卡',
        username: '使用者名稱',
        currentTime: '現在時間',
        timeCardStatus: '狀態',
        clockIn: '上班',
        clockOut: '下班'
      }
    })

    this.state = {
      t: context.t,
      timecard: null
    }
  }

  componentDidMount() {
    this.getUserTimeCard()
  }

  getUserTimeCard = () => {
    makeFetchRequest(token => {
      fetch(api.timecard.getActive, {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token.access_token
        }
      })
        .then(response => response.json())
        .then(res => {
          this.setState({
            timecard: res
          })
        })
        .catch(error => {
          console.error(error)
        })
    })
  }

  handleClockIn = () => {
    makeFetchRequest(token => {
      fetch(api.timecard.clockin, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token.access_token
        }
      })
        .then(response => response.json())
        .then(res => {
          if (Object.keys(res).length > 0) {
            this.props.navigation.navigate('LoginSuccess')
          } else {
            alert('pls try again')
          }
        })
        .catch(error => {
          console.error(error)
        })
    })
  }

  handleClockOut = () => {
    makeFetchRequest(token => {
      fetch(api.timecard.clockout, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token.access_token
        }
      })
        .then(response => response.json())
        .then(res => {
          if (Object.keys(res).length > 0) {
            this.props.navigation.navigate('LoginSuccess')
          } else {
            alert(res.error)
          }
        })
        .catch(error => {
          console.error(error)
        })
    })
  }

  render() {
    const { t } = this.state

    /**
     * This check exists to circumvent the issue that the first render() call hasn't set the this.state.timecard object yet.
     * https://stackoverflow.com/questions/50082423/why-is-render-being-called-twice-in-reactnative
     */
    if (!this.state.timecard) {
      return <Text>Loading...</Text>
    }

    let timeCardStatus = this.state.timecard.timeCardStatus
    let authClientUserName =
      this.props.navigation.state.params !== undefined &&
      this.props.navigation.state.params.authClientUserName

    let clockedIn = null

    if (timeCardStatus === 'ACTIVE') {
      let clockIn = this.state.timecard.clockIn
      let index = clockIn.indexOf('+')
      clockedIn = formatDate(clockIn);
    }

    return (
      <DismissKeyboard>
        <View style={styles.container}>
          <BackBtn/>
          <View>
            <TouchableHighlight>
              <Text style={styles.screenTitle}>
                {t('timeCardTitle')}
              </Text>
            </TouchableHighlight>
          </View>

          <View style={{flex: 2, justifyContent: 'center'}}>
            <View style={[styles.fieldContainer]}>
              <View style={{flex: 1}}>
                <Text style={styles.fieldTitle}>
                  {t('username')}
                </Text>
              </View>
              <View style={{flex: 3}}>
                <Text style={{alignSelf: 'flex-end'}}>{authClientUserName}</Text>
              </View>
            </View>
            <View style={styles.fieldContainer}>
              <View style={{flex: 1}}>
                <Text style={[styles.fieldTitle]}>
                  {t('currentTime')}
                </Text>
              </View>
              <View style={{flex: 3}}>
                <Text style={{alignSelf: 'flex-end'}}>{`${dateToLocaleString(new Date())}`}</Text>
              </View>
            </View>
            <View style={styles.fieldContainer}>
              <View style={{flex: 1}}>
                <Text style={styles.fieldTitle}>
                  {t('timeCardStatus')}:
                </Text>
              </View>
              <View style={{flex: 3}}>
                <Text style={{alignSelf: 'flex-end'}}>{timeCardStatus} {clockedIn != null ? `at ${clockedIn}` : ''}</Text>
              </View>
            </View>
          </View>

          <View style={[{flex: 3, alignItems: 'center'}]}>
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
        </View>
      </DismissKeyboard>
    )
  }
}

export default ClockIn

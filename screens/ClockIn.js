import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlight,
  TextInput,
  AsyncStorage
} from 'react-native'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { DismissKeyboard } from '../components/DismissKeyboard'
import styles from '../styles'

class ClockIn extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    timecardStatus: ''
  }

  componentDidMount() {
    AsyncStorage.getItem('timecardStatus', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        return value
      }
    }).then(val => {
      this.setState({
        timecardStatus: val
      })
    })
  }

  handleClockIn = currentTime => {
    AsyncStorage.getItem('clientusrToken', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      fetch('http://35.234.63.193/timecards/clockin', {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + tokenObj.access_token
        },
        body: JSON.stringify(currentTime)
      })
        .then(response => response.json())
        .then(res => {
          if (Object.keys(res).length > 0) {
            AsyncStorage.setItem('timecardStatus', res.timeCardStatus)
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

  handleClockOut = currentTime => {
    AsyncStorage.getItem('clientusrToken', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      fetch('http://35.234.63.193/timecards/clockout', {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + tokenObj.access_token
        },
        body: JSON.stringify(currentTime)
      })
        .then(response => response.json())
        .then(res => {
          if (Object.keys(res).length > 0) {
            AsyncStorage.setItem('timecardStatus', res.timeCardStatus)
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
    const { navigation } = this.props
    const { timecardStatus } = this.state
    var authClientUserName =
      this.props.navigation.state.params !== undefined &&
      this.props.navigation.state.params.authClientUserName

    return (
      <DismissKeyboard>
        <View style={styles.container}>
          <View
            style={[
              {
                width: '100%',
                position: 'absolute',
                top: 0
              }
            ]}
          >
            <TouchableHighlight>
              <Text
                style={{
                  color: '#F39F86',
                  fontSize: 26,
                  textAlign: 'center'
                }}
              >
                Time Card
              </Text>
            </TouchableHighlight>
          </View>

          <Text style={[styles.welcomeText, styles.textBig, styles.textBold]}>
            Hello{' '}
            {`${authClientUserName[0].toUpperCase()}${authClientUserName.slice(
              1
            )}`}
          </Text>

          <Text
            style={{ marginTop: 25, marginBottom: 35, textAlign: 'center' }}
          >
            {new Date().toISOString()}
          </Text>

          <View style={[styles.jc_alignIem_center]}>
            <View
              style={[
                styles.margin_15,
                styles.orange_bg,
                styles.half_width,
                styles.jc_alignIem_center,
                styles.paddTop_30,
                styles.paddBottom_30,
                styles.borderRadius4
              ]}
            >
              <TouchableOpacity
                onPress={
                  timecardStatus === 'ACTIVE'
                    ? () => this.handleClockOut(new Date().toISOString())
                    : () => this.handleClockIn(new Date().toISOString())
                }
              >
                <View>
                  <FontAwesomeIcon
                    name="hand-o-up"
                    size={40}
                    color="#fff"
                    style={[styles.centerText, styles.margin_15]}
                  />
                  <Text style={(styles.centerText, styles.whiteColor)}>
                    {timecardStatus === 'ACTIVE' ? 'Clock Out' : 'Clock In'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={[
              {
                width: '100%',
                position: 'absolute',
                bottom: 0,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#F39F86'
              }
            ]}
          >
            <TouchableHighlight>
              <Text
                style={styles.signInText}
                onPress={() => this.props.navigation.goBack()}
              >
                Cancel
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </DismissKeyboard>
    )
  }
}

export default ClockIn

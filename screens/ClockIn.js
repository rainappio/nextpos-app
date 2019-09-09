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
    isClockIn: false
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
        .then(response => {
          if (response.status === 200) {
            this.setState({
              isClockIn: true
            })
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
        .then(response => {
          if (response.status === 200) {
            this.setState({
              isClockIn: false
            })
          } else {
            alert('pls try again')
          }
        })
        .catch(error => {
          console.error(error)
        })
    })
  }

  async handleoverAllLogout(navigation) {
    try {
      await AsyncStorage.removeItem('token')
      await AsyncStorage.removeItem('clientusrToken')
      navigation.navigate('Intro')
    } catch (err) {
      console.log(`The error is: ${err}`)
    }
  }

  render() {
    const { navigation } = this.props
    const { isClockIn } = this.state
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
                  isClockIn
                    ? currentTime =>
                        this.handleClockOut(new Date().toISOString())
                    : currentTime =>
                        this.handleClockIn(new Date().toISOString())
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
                    {isClockIn ? 'Clock Out' : 'Clock In'}
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
                bottom: 80
              }
            ]}
          >
            <TouchableHighlight>
              <Text
                style={styles.signInText}
                onPress={() => this.handleoverAllLogout(navigation)}
              >
                Logout
              </Text>
            </TouchableHighlight>
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

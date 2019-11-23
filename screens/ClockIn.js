import React from 'react'
import { Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { DismissKeyboard } from '../components/DismissKeyboard'
import styles from '../styles'
import { api, fetchAuthenticatedRequest } from '../constants/Backend'

class ClockIn extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props)

    this.state = {
      timecard: null
    }
  }

  componentDidMount() {
    this.getUserTimeCard()
  }

  getUserTimeCard = () => {
    fetchAuthenticatedRequest(token => {
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
    fetchAuthenticatedRequest(token => {
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
    fetchAuthenticatedRequest(token => {
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
      clockedIn = new Date(clockIn.slice(0, index)).toLocaleTimeString()
    }

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
            {authClientUserName}
          </Text>

          <Text
            style={{ marginTop: 25, marginBottom: 35, textAlign: 'center' }}
          >
            Current time:{' '}
            {`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`}
          </Text>

          <Text
            style={{ marginTop: 25, marginBottom: 35, textAlign: 'center' }}
          >
            Status: {timeCardStatus}{' '}
            {clockedIn != null ? `at ${clockedIn}` : ''}
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
                  <Text style={(styles.centerText, styles.whiteColor)}>
                    {timeCardStatus === 'ACTIVE' ? 'Clock Out' : 'Clock In'}
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

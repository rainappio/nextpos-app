import React from 'react'
import { AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import { encode as btoa } from 'base-64'
import { doLoggedIn } from '../actions'
import LoginScreen from './LoginScreen'
import { api, warningMessage } from '../constants/Backend'

class Login extends React.Component {
  static navigationOptions = {
    header: null
  }

  handleSubmit = async values => {
    const formData = new FormData()
    formData.append('grant_type', 'password')
    formData.append('password', values.masterPassword)
    formData.append('username', values.username)
    const auth = 'Basic ' + btoa(values.username + ':' + values.masterPassword)

    let response = await fetch(api.getAuthToken, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        Authorization: auth
      },
      body: formData
    })

    if (!response.ok) {
      warningMessage('Incorrect username or password.')
    } else {
      let res = await response.json()
      await AsyncStorage.removeItem('token')
      await AsyncStorage.removeItem('clientusrToken')

      const loggedIn = new Date()
      res.loggedIn = loggedIn
      res.tokenExp = new Date().setSeconds(
        loggedIn.getSeconds() + parseInt(res.expires_in)
      )

      res.cli_userName = values.username
      res.cli_masterPwd = values.masterPassword

      // this is used for LoginSuccessScreen.
      res.username = res.cli_userName

      await AsyncStorage.setItem('token', JSON.stringify(res))
      this.props.dispatch(doLoggedIn(res.access_token))
      this.props.navigation.navigate('LoginSuccess')
    }

    return response
  }

  render() {
    return (
      <LoginScreen
        onSubmit={this.handleSubmit}
        screenProps={this.props.screenProps}
      />
    )
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  clientusers: state.clientusers.data.users
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  doLoggedIn: () => {
    dispatch(doLoggedIn())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)

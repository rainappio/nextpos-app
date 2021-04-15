import React from 'react'
import {AsyncStorage} from 'react-native'
import {connect} from 'react-redux'
import {encode as btoa} from 'base-64'
import {doLoggedIn} from '../actions'
import LoginScreen from './LoginScreen'
import {api, storage, warningMessage} from '../constants/Backend'
import {LocaleContext} from "../locales/LocaleContext";

class Login extends React.Component {
  static navigationOptions = {
    header: null
  }

  static contextType = LocaleContext

  constructor(props) {
    super(props)
    this.state = {
      loginSuccess: false,
      loginMode: 'ACCOUNT',
    }
  }

  handleLoginAs = async () => {

    const username = await AsyncStorage.getItem(storage.clientUsername)
    const masterPassword = await AsyncStorage.getItem(storage.clientPassword)

    const values = {
      username: username,
      masterPassword: masterPassword
    }

    await this.handleSubmit(values)
  }

  handleSubmit = async values => {

    if (values.token && values.loginMode == 'TOKEN') {
      const formData = new FormData()

      let res = await fetch(api.decodeToken, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'token': values.token
        })
      })

      if (!res.ok) {
        warningMessage(this.context.t('errors.loginFailed'))

      } else {

        let decodeRes = await res.json()

        if (decodeRes.message) {
          warningMessage(this.context.t('errors.expiredToken'))
        } else {
          formData.append('grant_type', 'password')
          formData.append('username', decodeRes.username)
          formData.append('password', decodeRes.password)
        }

        const auth = 'Basic ' + btoa(decodeRes.username + ':' + decodeRes.password)


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
          warningMessage(this.context.t('errors.loginFailed'))
        } else {
          let res = await response.json()
          await AsyncStorage.removeItem('token')
          await AsyncStorage.removeItem('clientusrToken')

          await AsyncStorage.setItem(storage.clientUsername, decodeRes.username)
          await AsyncStorage.setItem(storage.clientPassword, decodeRes.password)


          const loggedIn = new Date()
          res.loggedIn = loggedIn
          res.tokenExp = new Date().setSeconds(
            loggedIn.getSeconds() + parseInt(res.expires_in)
          )

          res.cli_userName = decodeRes.username
          res.cli_masterPwd = decodeRes.password


          // this is used for LoginSuccessScreen.
          res.username = res.cli_userName

          await AsyncStorage.setItem('token', JSON.stringify(res))
          this.props.dispatch(doLoggedIn(res.access_token))
          this.props.navigation.navigate('ClientUsers')
        }
        return response
      }


    } else {

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
        warningMessage(this.context.t('errors.loginFailed'))
      } else {
        let res = await response.json()
        await AsyncStorage.removeItem('token')
        await AsyncStorage.removeItem('clientusrToken')

        await AsyncStorage.setItem(storage.clientUsername, values.username)
        await AsyncStorage.setItem(storage.clientPassword, values.masterPassword)


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
        this.props.navigation.navigate('ClientUsers')
      }

      return response
    }

  }

  render() {
    return (
      <LoginScreen
        onSubmit={this.handleSubmit}
        handleLoginAs={this.handleLoginAs}
        loginSuccess={this.state.loginSuccess}
        loginMode={this.state.loginMode}
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

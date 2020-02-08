import React from 'react'
import ClientUserLoginForm from './ClientUserLoginForm'
import { AsyncStorage } from 'react-native'
import {api, warningMessage} from "../constants/Backend";
import { encode as btoa } from 'base-64'

class ClientUserLogin extends React.Component {
  static navigationOptions = {
    header: null
  }

  clientLogin = async values => {

    let token = await AsyncStorage.getItem('token')
    const tokenObj = JSON.parse(token)
    const username = tokenObj.cli_userName
    const masterPassword = tokenObj.cli_masterPwd

    const formData = new FormData()
    formData.append('grant_type', 'password')
    formData.append('username', values.username)
    formData.append('password', values.password)
    const auth = 'Basic ' + btoa(username + ':' + masterPassword)

    let response = await fetch(api.getAuthToken, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        Authorization: auth
      },
      body: formData
    })

    if (response.status === 400) {
      this.props.navigation.navigate('ClientUsers')
      warningMessage('Incorrect password.')
    } else {
      const res = await response.json()
      const loggedIn = new Date()
      res.loggedIn = loggedIn
      res.tokenExp = new Date().setSeconds(
        loggedIn.getSeconds() + parseInt(res.expires_in)
      )
      res.username = values.username
      await AsyncStorage.setItem('clientusrToken', JSON.stringify(res))

      this.props.navigation.navigate('LoginSuccess')
    }
  }

  render() {
    const { navigation } = this.props
    return (
      <ClientUserLoginForm
        initialValues={{username: this.props.navigation.state.params.clientusersName}}
        clientusersName={this.props.navigation.state.params.clientusersName}
        defaultUser={this.props.navigation.state.params.defaultUser}
        navigation={navigation}
        onSubmit={this.clientLogin}
      />
    )
  }
}

export default ClientUserLogin

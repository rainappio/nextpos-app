import React from 'react'
import { AsyncStorage, View } from 'react-native'
import { connect } from 'react-redux'
import { encode as btoa } from 'base-64'
import { doLoggedIn, getClientUsrs } from '../actions'
import LoginScreen from './LoginScreen'
import LoginSuccessScreen from './LoginSuccessScreen'

class Login extends React.Component {
  static navigationOptions = {
    header: null
  }

  componentDidMount() {
    this.props.getClientUsrs()
  }

  handleSubmit = values => {
    const formData = new FormData()
    formData.append('grant_type', 'password') //client_credentials
    formData.append('password', values.masterPassword)
    formData.append('username', values.username)
    var auth = 'Basic ' + btoa(values.username + ':' + values.masterPassword)

    fetch('http://35.234.63.193/oauth/token', {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        Authorization: auth
      },
      body: formData
    })
      .then(response => response.json())
      .then(res => {
        if (res.error) {
          alert(res.error)
        } else {
          var tokenexpiration = new Date().setSeconds(
            new Date().getSeconds() + parseInt(3599)
          )
          res.tokenExp = tokenexpiration
          res.cli_userName = values.username
          res.cli_masterPwd = values.masterPassword
          AsyncStorage.setItem('token', JSON.stringify(res))
            .then(x => AsyncStorage.getItem('token'))
            .then(val => {
              var tokenObj = JSON.parse(val)
              var accessToken = tokenObj !== null && tokenObj.access_token
              this.props.dispatch(doLoggedIn(accessToken))
              this.props.getClientUsrs()
              this.props.navigation.navigate('LoginSuccess')
            })
        }
        return res
      })
      .catch(error => console.log(error))
  }

  render() {
    const { isLoggedIn, navigation, clientusers } = this.props
    return <LoginScreen onSubmit={this.handleSubmit} screenProps={this.props.screenProps} />
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
  },
  getClientUsrs: () => {
    dispatch(getClientUsrs())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)

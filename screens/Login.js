import React from 'react'
import LoginScreen from './LoginScreen'

class Login extends React.Component {
  static navigationOptions = {
    header: null
  }

  handleSubmit = values => {
    //console.warn('handleSubmit hit');
    console.warn(values)
  }

  render() {
    return <LoginScreen onSubmit={this.handleSubmit} />
  }
}

export default Login

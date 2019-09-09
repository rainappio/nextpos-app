import React from 'react'
import ClientUserLoginForm from './ClientUserLoginForm'

class ClientUserLogin extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    const { navigation } = this.props
    return (
      <ClientUserLoginForm
        clientusersName={this.props.navigation.state.params.clientusersName}
        navigation={navigation}
      />
    )
  }
}

export default ClientUserLogin

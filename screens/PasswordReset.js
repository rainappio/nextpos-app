import React from 'react'
import PasswordResetForm from './PasswordResetForm'

class PasswordReset extends React.Component {
  static navigationOptions = {
    header: null
  }

  handlePasswordReset = (values) => {
  	console.log(values);
  	console.log("handlePasswordReset hit")
  }

  render() {
    return (
      <PasswordResetForm
      	onSubmit={this.handlePasswordReset}
      	/>
    )
  }
}

export default PasswordReset

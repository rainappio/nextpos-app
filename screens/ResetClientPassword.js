import React from "react";
import {LocaleContext} from "../locales/LocaleContext";
import ResetClientPasswordScreen from "./ResetClientPasswordScreen";
import {api, warningMessage} from "../constants/Backend";

class ResetClientPassword extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        resetPasswordTitle: 'Reset Password',
        enterEmail: 'Please enter your client email address',
        enterPasscode: 'Enter passcode from your email',
        resetPassword: 'Enter a new password',
        clientAccountNotFound: 'Client email is not registered',
        passcodeVerificationFailed: 'Passcode verification failed',
        resetPasswordFailed: 'Reset password failed'
      },
      zh: {
        resetPasswordTitle: '重置密碼',
        enterEmail: '請輸入帳號電子郵件',
        enterPasscode: '請輸入寄到您的電子郵件的代碼',
        resetPassword: '輸入新的密碼',
        clientAccountNotFound: '帳號電子郵件尚未註冊',
        passcodeVerificationFailed: '待碼驗證失敗',
        resetPasswordFailed: '重置密碼失敗'
      }
    })

    this.state = {
      showPasscodeField: false,
      showResetPasswordField: false
    }
  }

  handleSubmit = values => {
    fetch(api.account.sendResetPasscode(values.clientEmail), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          warningMessage(this.context.t('clientAccountNotFound'))
        } else {
          this.setState({showPasscodeField: true})
        }
      })
      .catch(error => {
        console.error(error)
      })
  }

  handleVerifyPasscode = (clientEmail, passcodeToVerify) => {
    fetch(api.account.verifyResetPasscode, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clientEmail: clientEmail,
        passcode: passcodeToVerify
      })
    })
      .then(response => {
        if (!response.ok) {
          warningMessage(this.context.t('clientAccountNotFound'))
        } else {
          response.json().then((data) => {
            if (data) {
              this.setState({showResetPasswordField: true})
            } else {
              warningMessage(this.context.t('passcodeVerificationFailed'))
            }
          })

        }
      })
      .catch(error => {
        console.error(error)
      })
  }

  handleResetPassword = (clientEmail, resetPassword) => {

    fetch(api.account.resetClientPassword, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clientEmail: clientEmail,
        password: resetPassword
      })
    })
      .then(response => {
        if (!response.ok) {
          warningMessage(this.context.t('resetPasswordFailed'))
        } else {
          this.props.navigation.navigate('Login', {
            removeLoginAs: true
          })
        }
      })
      .catch(error => {
        console.error(error)
      })
  }

  render() {
    return (
      <ResetClientPasswordScreen
        onSubmit={this.handleSubmit}
        handleVerifyPasscode={this.handleVerifyPasscode}
        handleResetPassword={this.handleResetPassword}
        showPasscodeField={this.state.showPasscodeField}
        showResetPasswordField={this.state.showResetPasswordField}
      />
    )
  }
}

export default ResetClientPassword

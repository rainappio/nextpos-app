import React from 'react'
import CreateAccFormScreen from './CreateAccFormScreen'
import {api, successMessage, warningMessage} from '../constants/Backend'
import {LocaleContext} from '../locales/LocaleContext'

class CreateAccScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    this.context.localize({
      en: {
        signUp: 'Sign Up',
        accountCreated: 'Your account is created',
        errorMessage: 'Email is already registered, please choose another email address.',
        privacyAgreement: 'By signing up, you agree to the seller agreement and privacy policy.',
        viewPrivacy: 'View Privacy Policy'
      },
      zh: {
        signUp: '註冊',
        accountCreated: '帳號註冊成功',
        errorMessage: '此email已經註冊過，請使用新的email來註冊。',
        privacyAgreement: '您創立新的帳號的同時，也等同同意我們的賣家條款以及隱私政策.',
        viewPrivacy: '參閱隱私政策'
      }
    })
  }

  handleSubmit = values => {
    fetch(api.client.new, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values) // data can be `string` or {object}!
    })
      .then(response => {
        if (!response.ok) {
          warningMessage(this.context.t('errorMessage'))
        } else {
          successMessage(this.context.t('accountCreated'))
          this.props.navigation.navigate('Login')
        }
      })
      .catch(error => {
        console.error(error)
      })
  }

  render() {
    return (
      <CreateAccFormScreen
        onSubmit={this.handleSubmit}
      />
    )
  }
}

export default CreateAccScreen

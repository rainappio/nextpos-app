import React from 'react'
import CreateAccFormScreen from './CreateAccFormScreen'
import {
  api,
  errorAlert,
  successMessage,
  warningMessage
} from '../constants/Backend'
import { LocaleContext } from '../locales/LocaleContext'

class CreateAccScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      t: context.t
    }
  }

  componentDidMount() {
    this.context.localize({
      en: {
        signUp: 'Sign Up',
        errorMessage:
          'Email is already registered, please choose another email address.'
      },
      zh: {
        signUp: '註冊',
        errorMessage: '此email已經註冊過，請使用新的email來註冊。'
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
          warningMessage(this.state.t('errorMessage'))
        } else {
          successMessage('Client created')
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
        screenProps={this.props.screenProps}
      />
    )
  }
}

export default CreateAccScreen

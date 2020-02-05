import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  Image,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
  Modal
} from 'react-native'
import { isEmail, isRequired } from '../validators'
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import styles from '../styles'
import { withNavigation } from 'react-navigation'
import {LocaleContext} from "../locales/LocaleContext";
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

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

class PasswordResetForm extends React.Component {
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
      	title: 'Please enter temporary password from your account email',
      	newPwd: 'Enter Password',
        resetPwd: 'Reset Password'
      },
      zh: {
      	title: '請輸入在您的帳號信箱收到的一組臨時密碼',
      	newPwd: '輸入密碼',
        resetPwd: '重置密碼'
      }
    })
  }

  render() {
  	const { handleSubmit } = this.props
    const { t, theme } = this.context

    return (
      <DismissKeyboard>
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          enabled
        >
          <View style={{ flex: 3, justifyContent: 'center' }}>
            <View style={[{ position: 'absolute', top: 0 }]}>
              <Image
                source={
                  __DEV__
                    ? require('../assets/images/logo.png')
                    : require('../assets/images/logo.png')
                }
                style={styles.welcomeImage}
              />
            </View>

						<Text>{t('title')}</Text>
              <Field
              	name="newpassword"
              	component={InputText}
              	validate={isRequired}
              	placeholder={t('newPwd')}
              	secureTextEntry={true}
              	//onSubmitEditing={val => this.clientLogin(val.nativeEvent.text)}
                theme={theme}
            	/>
          </View>

          <View style={[styles.bottom]}>
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss()
                handleSubmit()
              }}
            >
              <Text style={[styles.bottomActionButton, styles.actionButton]}>
                {t('resetPwd')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Login')}
            >
              <Text style={[styles.bottomActionButton, styles.cancelButton]}>
                {t('action.cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </DismissKeyboard>
    )
  }
}

PasswordResetForm = reduxForm({
  form: 'passwordResetForm'
})(PasswordResetForm)

export default withNavigation(PasswordResetForm)

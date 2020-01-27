import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  Image,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
  Keyboard
} from 'react-native'
import { isEmail, isRequired } from '../validators'
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import styles from '../styles'
import { withNavigation } from 'react-navigation'
import {LocaleContext} from "../locales/LocaleContext"
import { isTablet } from '../actions'

class LoginScreen extends React.Component {
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
        login: 'Login'
      },
      zh: {
        login: '登入'
      }
    })
  }

  render() {
    const { handleSubmit } = this.props
    const { t } = this.context

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

            <Field
              name="username"
              component={InputText}
              validate={[isRequired, isEmail]}
              placeholder={t('email')}
              autoCapitalize="none"
            />

            <Field
              name="masterPassword"
              component={InputText}
              validate={isRequired}
              placeholder={t('password')}
              secureTextEntry={true}
            />
          </View>

            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss()
                handleSubmit()
              }}
              style={styles.jc_alignIem_center}
            >
              <Text style={[styles.bottomActionButton, styles.actionButton]}>
                {t('login')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Intro')}
              style={[styles.jc_alignIem_center, styles.mgrbtn40]}
            >
              <Text style={[styles.bottomActionButton, styles.cancelButton ]}>
                {t('cancel')}
              </Text>
            </TouchableOpacity>

        </KeyboardAvoidingView>
      </DismissKeyboard>
    )
  }
}

LoginScreen = reduxForm({
  form: 'loginForm'
})(LoginScreen)

export default withNavigation(LoginScreen)

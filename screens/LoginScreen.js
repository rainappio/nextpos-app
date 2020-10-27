import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {AsyncStorage, Image, Keyboard, Text, TouchableOpacity, View} from 'react-native'
import {isEmail, isRequired} from '../validators'
import InputText from '../components/InputText'
import styles from '../styles'
import {withNavigation} from 'react-navigation'
import {LocaleContext} from "../locales/LocaleContext";
import {storage} from "../constants/Backend";
import {StyledText} from "../components/StyledText";
import {ThemeContainer} from "../components/ThemeContainer";
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";

class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      clientUsername: null
    }


  }

  componentDidMount() {
    this.context.localize({
      en: {
        loginTitle: 'Login',
        forgotPwd: 'Forgot Password',
        loginAs: 'Login as {{username}}'
      },
      zh: {
        loginTitle: '登入',
        forgotPwd: '忘記密碼',
        loginAs: '以 {{username}} 登入'
      }
    })

    const removeLoginAs = this.props.navigation.getParam('removeLoginAs');

    if (!removeLoginAs) {
      AsyncStorage.getItem(storage.clientUsername).then(value => {
        this.setState({clientUsername: value})
      })
    }
  }

  render() {
    const {handleSubmit, handleLoginAs} = this.props
    const {t} = this.context

    return (
      <ThemeKeyboardAwareScrollView>
        <View style={styles.container}>
          <View style={{flex: 1}}>
            <View>
              <Image
                source={
                  __DEV__
                    ? require('../assets/images/logo.png')
                    : require('../assets/images/logo.png')
                }
                style={styles.welcomeImage}
              />
            </View>

            <StyledText style={styles.welcomeText}>{t('loginTitle')}</StyledText>

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

          <View style={styles.flex(1)}>

          </View>

          <View style={[styles.bottom]}>
            {this.state.clientUsername != null && (
              <TouchableOpacity
                onPress={() => handleLoginAs()}
              >
                <Text style={[styles.bottomActionButton, styles.actionButton]}>
                  {t('loginAs', {username: this.state.clientUsername})}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss()
                handleSubmit()
              }}
            >
              <Text style={[styles.bottomActionButton, styles.actionButton]}>
                {t('login')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Intro')}
            >
              <Text style={[styles.bottomActionButton, styles.cancelButton]}>
                {t('action.cancel')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              this.props.navigation.navigate('ResetClientPassword')
            }}>
              <Text style={[styles.bottomActionButton, styles.cancelButton]}>
                {t('forgotPwd')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ThemeKeyboardAwareScrollView>
    )
  }
}

LoginScreen = reduxForm({
  form: 'loginForm'
})(LoginScreen)

export default withNavigation(LoginScreen)

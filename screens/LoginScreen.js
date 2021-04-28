import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {AsyncStorage, Image, Keyboard, Text, TouchableOpacity, View, Animated} from 'react-native'
import {isEmail, isRequired} from '../validators'
import InputText from '../components/InputText'
import styles from '../styles'
import {withNavigation} from 'react-navigation'
import {LocaleContext} from "../locales/LocaleContext";
import {storage} from "../constants/Backend";
import {StyledText} from "../components/StyledText";
import {ThemeContainer} from "../components/ThemeContainer";
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";
import SegmentedControl from "../components/SegmentedControl";


class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      clientUsername: null,
      fadeAnimation: new Animated.Value(1),
      showLoginBlock: true,
      selectedLoginMode: this.props?.loginMode ? 0 : 1,
      loginMode: this.props?.loginMode,
      loginDisplayTypes: {
        0: {label: context.t('account.loginWithAccount'), value: 'ACCOUNT'},
        1: {label: context.t('account.loginWithToken'), value: 'TOKEN'}
      },
    }


  }

  fadeIn = () => {
    Animated.timing(this.state.fadeAnimation, {
      toValue: 1,
      duration: 4000
    }).start();
  };

  fadeOut = () => {
    Animated.timing(this.state.fadeAnimation, {
      toValue: 0,
      duration: 500
    }).start(() => {
      this.setState({showLoginBlock: false})
    });
  };

  handleLoginModeSelection = (index) => {
    this.setState({
      selectedLoginMode: index,
      loginMode: this.state.loginDisplayTypes[index].value
    })
  }

  componentDidMount() {
    this.context.localize({
      en: {
        loginTitle: 'Login',
        forgotPwd: 'Forgot Password',
        loginAs: 'Login as {{username}}',
        token: 'Staff Login Code'
      },
      zh: {
        loginTitle: '登入',
        forgotPwd: '忘記密碼',
        loginAs: '以 {{username}} 登入',
        token: '員工登入碼'
      }
    })

    const removeLoginAs = this.props.navigation.getParam('removeLoginAs');

    if (!removeLoginAs) {
      AsyncStorage.getItem(storage.clientUsername).then(value => {
        this.setState({clientUsername: value})
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.loginSuccess !== prevProps.loginSuccess) {
      this.fadeOut()
    }
  }

  render() {
    const {handleSubmit, handleLoginAs, loginSuccess, loginMode} = this.props
    const {t, isTablet, customMainThemeColor} = this.context

    const loginTypes = Object.keys(this.state.loginDisplayTypes).map(key => this.state.loginDisplayTypes[key].label)


    if (isTablet) {
      return (
        <ThemeKeyboardAwareScrollView>
          <View style={[styles.container, {flexDirection: 'row'}]}>
            {this.state.showLoginBlock && <Animated.View style={{flex: 1, flexDirection: 'column', opacity: this.state.fadeAnimation}}>
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

                <StyledText style={styles?.welcomeText(this.context)}>{t('loginTitle')}</StyledText>

                <View style={[styles.fieldContainer, styles.mgrbtn20]}>

                  <View style={{flex: 1}}>
                    <Field
                      name="loginMode"
                      component={SegmentedControl}
                      selectedIndex={this.state.selectedLoginMode}
                      onChange={this.handleLoginModeSelection}
                      values={loginTypes}
                      normalize={value => {
                        return this.state.loginDisplayTypes[value].value
                      }}
                    />
                  </View>
                </View>

                {this.state?.loginMode == 'ACCOUNT' && <View>
                  <View style={{marginBottom: 16}}>
                    <Field
                      name="username"
                      component={InputText}
                      validate={[isRequired, isEmail]}
                      placeholder={t('email')}
                      autoCapitalize="none"
                    />
                  </View>
                  <Field
                    name="masterPassword"
                    component={InputText}
                    validate={isRequired}
                    placeholder={t('password')}
                    secureTextEntry={true}
                  />
                </View>}
                {this.state?.loginMode == 'TOKEN' && <View>
                  <View>
                    <Field
                      name="token"
                      component={InputText}
                      validate={isRequired}
                      placeholder={t('token')}
                    />
                  </View>
                </View>
                }

              </View>

              <View style={styles.flex(1)}>

              </View>

              <View style={[styles.bottom]}>
                {this.state.clientUsername != null && (
                  <TouchableOpacity
                    onPress={() => handleLoginAs()}
                  >
                    <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
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
                  <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                    {t('login')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Intro')}
                >
                  <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>
                    {t('action.cancel')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                  this.props.navigation.navigate('ResetClientPassword')
                }}>
                  <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>
                    {t('forgotPwd')}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>}
            <View style={{flex: 3, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <StyledText style={styles?.welcomeText(this.context)}>Simplify</StyledText>
                <StyledText style={styles?.welcomeText(this.context)}>Your</StyledText>
                <StyledText style={styles?.welcomeText(this.context)}>Selling</StyledText>
              </View>
            </View>
          </View>
        </ThemeKeyboardAwareScrollView>
      )
    }
    else {
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

              <StyledText style={styles?.welcomeText(this.context)}>{t('loginTitle')}</StyledText>

              <View style={[styles.fieldContainer, styles.mgrbtn20]}>

                <View style={{flex: 1}}>
                  <Field
                    name="loginMode"
                    component={SegmentedControl}
                    selectedIndex={this.state.selectedLoginMode}
                    onChange={this.handleLoginModeSelection}
                    values={loginTypes}
                    normalize={value => {
                      return this.state.loginDisplayTypes[value].value
                    }}
                  />
                </View>
              </View>

              {this.state?.loginMode == 'ACCOUNT' && <View>
                <View style={{marginBottom: 16}}>
                  <Field
                    name="username"
                    component={InputText}
                    validate={[isRequired, isEmail]}
                    placeholder={t('email')}
                    autoCapitalize="none"
                  />
                </View>
                <Field
                  name="masterPassword"
                  component={InputText}
                  validate={isRequired}
                  placeholder={t('password')}
                  secureTextEntry={true}
                />
              </View>}
              {this.state?.loginMode == 'TOKEN' && <View>
                <View>
                  <Field
                    name="token"
                    component={InputText}
                    validate={isRequired}
                    placeholder={t('token')}
                  />
                </View>
              </View>
              }

            </View>

            <View style={styles.flex(1)}>

            </View>

            <View style={[styles.bottom]}>
              {this.state.clientUsername != null && (
                <TouchableOpacity
                  onPress={() => handleLoginAs()}
                >
                  <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
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
                <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                  {t('login')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Intro')}
              >
                <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>
                  {t('action.cancel')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('ResetClientPassword')
              }}>
                <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>
                  {t('forgotPwd')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ThemeKeyboardAwareScrollView>
      )
    }
  }
}

LoginScreen = reduxForm({
  form: 'loginForm'
})(LoginScreen)

export default withNavigation(LoginScreen)

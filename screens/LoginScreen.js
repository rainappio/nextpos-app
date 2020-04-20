import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  Image,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
  Modal,
  Dimensions, TouchableWithoutFeedback
} from 'react-native'
import { isEmail, isRequired } from '../validators'
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import styles from '../styles'
import { withNavigation } from 'react-navigation'
import {LocaleContext} from "../locales/LocaleContext";

class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }

  state = {
  	modalVisible: false
  }

  toggleModal = (visible) => {
    this.setState({modalVisible: visible});
  }

  getEmail = (values) => {
  	values.email !== null && this.props.navigation.navigate('PasswordReset')
  	this.toggleModal(!this.state.modalVisible)
  }

  componentDidMount() {
    this.context.localize({
      en: {
        title: 'Please enter your account email',
        next: 'Send',
        forgotPwd: 'Forgot Password'
      },
      zh: {
        title: '請輸入你的帳號email',
        next: '送出',
        forgotPwd: '忘記密碼'
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

            <View style={[{marginVertical: 10}]}>
              <Field
                name="username"
                component={InputText}
                validate={[isRequired, isEmail]}
                placeholder={t('email')}
                autoCapitalize="none"
                extraStyle={{borderWidth: 1, borderColor: '#f1f1f1', textAlign: 'left'}}
              />
            </View>
            <View>
              <Field
                name="masterPassword"
                component={InputText}
                validate={isRequired}
                placeholder={t('password')}
                secureTextEntry={true}
                extraStyle={{borderWidth: 1, borderColor: '#f1f1f1', textAlign: 'left'}}
              />
            </View>
          </View>

          <View style={[styles.bottom]}>
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
							this.toggleModal(true)
						}}>
            	<Text style={[styles.bottomActionButton, styles.cancelButton]}>
            	{t('forgotPwd')}
            	</Text>
          	</TouchableOpacity>
          </View>

          <ResetModal
          	onSubmit={this.getEmail}
          	modalVisible={this.state.modalVisible}
          	toggleModal={this.toggleModal}
          	navigation={this.props.navigation}
          	/>

        </KeyboardAvoidingView>
      </DismissKeyboard>
    )
  }
}

LoginScreen = reduxForm({
  form: 'loginForm'
})(LoginScreen)

export default withNavigation(LoginScreen)

class ResetModal extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  render() {
    const { handleSubmit, toggleModal, modalVisible, title, email, next, props } = this.props
    const { t } = this.context

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.modalContainer]}
          onPressOut={() => {
            toggleModal(false)
          }}
        >
          <TouchableWithoutFeedback>
            <View
              style={[styles.whiteBg, styles.boxShadow, styles.popUpLayout, {width: '90%', height: Dimensions.get('window').height / 2}]}>
              <Text>{t('title')}</Text>
              <Field
                name="email"
                component={InputText}
                validate={[isRequired, isEmail]}
                autoCapitalize="none"
                placeholder={t('email')}
              />

              <View style={styles.bottom}>
                <TouchableOpacity
                  onPress={() => handleSubmit()}>
                  <Text style={[styles.bottomActionButton, styles.actionButton]}>{t('next')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => toggleModal(false)}
                >
                  <Text style={[styles.bottomActionButton, styles.cancelButton]}>
                    {t('action.cancel')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    )
  }
}

ResetModal = reduxForm({
  form: 'pwdResetForm'
})(ResetModal)


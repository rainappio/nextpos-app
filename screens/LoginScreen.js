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
  AsyncStorage
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
  	console.log(AsyncStorage.getItem('token'))
  	values.email !== null && this.props.navigation.navigate('PasswordReset')
  	this.toggleModal(!this.state.modalVisible)
  }

  componentDidMount() {
    this.context.localize({
      en: {
        login: 'Login',
        title: 'Forgot Password ?',
        Next: 'Next',
        forgotPwd: 'Forgot Password'
      },
      zh: {
        login: '登入',
        title: 'FP-Chinese ?',
        Next: 'Next-Chinese',
        forgotPwd: 'FP-Chinese'
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
                {t('cancel')}
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
          	title={t('title')}
          	email={t('email')}
          	Next={t('Next')}
          	props={this.props.navigation}
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

  render() {
    const { handleSubmit, toggleModal, modalVisible, title, email, Next, props } = this.props
    const { t } = this.context

    return (
      <Modal
        animationType="fade"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => toggleModal(false)}
        >
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.container, styles.no_mgrTop]}
          onPressOut={() => {
            toggleModal(false)
          }}
          >
          <Text>{title}</Text>
          <Field
            name="email"
            component={InputText}
            validate={[isRequired, isEmail]}
            placeholder={email}
            //onSubmitEditing={val => this.clientLogin(val.nativeEvent.text)}
          />

          <TouchableOpacity
          	style={{position:'absolute', bottom: 10, width: '100%'}}
            onPress={() => {
              handleSubmit()
              // props.navigate('PasswordReset')
              // toggleModal(!modalVisible)
            }}>
            <Text style={[styles.bottomActionButton, styles.actionButton]}>{Next}</Text>
          </TouchableOpacity>

        </TouchableOpacity>
      </Modal>
    )
  }
}

ResetModal = reduxForm({
  form: 'pwdResetForm'
})(ResetModal)


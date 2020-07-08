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
  Dimensions, TouchableWithoutFeedback, AsyncStorage
} from 'react-native'
import { isEmail, isRequired } from '../validators'
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import styles from '../styles'
import { withNavigation } from 'react-navigation'
import {LocaleContext} from "../locales/LocaleContext";
import {storage} from "../constants/Backend";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scrollview";

class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      modalVisible: false,
      clientUsername: null
    }


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
        forgotPwd: 'Forgot Password',
        loginAs: 'Login as {{username}}'
      },
      zh: {
        title: '請輸入你的帳號email',
        next: '送出',
        forgotPwd: '忘記密碼',
        loginAs: '以 {{username}} 登入'
      }
    })

    AsyncStorage.getItem(storage.clientUsername).then(value => {
      this.setState({ clientUsername: value })
    })
  }

  render() {
    const { handleSubmit, handleLoginAs } = this.props
    const { t } = this.context

    return (
      <KeyboardAwareScrollView contentContainerStyle={[styles.container, {justifyContent: 'space-around'}]}>
        <View style={{flex: 1}}>
          <View style={[styles.flex(1)]}>
              <Image
                source={
                  __DEV__
                    ? require('../assets/images/logo.png')
                    : require('../assets/images/logo.png')
                }
                style={styles.welcomeImage}
              />
            </View>

          <View style={[styles.flex(1), styles.dynamicVerticalPadding(10)]}>
          <View style={[styles.flex(1)]}>
            <Field
              name="username"
              component={InputText}
              validate={[isRequired, isEmail]}
              placeholder={t('email')}
              autoCapitalize="none"
              extraStyle={{borderWidth: 1, borderColor: '#f1f1f1', textAlign: 'left'}}
            />
          </View>
            <View style={styles.dynamicVerticalPadding(2)}/>
          <View style={styles.flex(1)}>
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
      </KeyboardAwareScrollView>
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
    const { handleSubmit, toggleModal, modalVisible } = this.props
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


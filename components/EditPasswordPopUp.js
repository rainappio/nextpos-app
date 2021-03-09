import React, {Component} from 'react'
import {Field} from 'redux-form'
import {AsyncStorage, Keyboard, Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, KeyboardAvoidingView, Alert} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import PinCodeInput from '../components/PinCodeInput'
import styles from '../styles'
import {api, dispatchFetchRequestWithOption, successMessage, warningMessage, storage} from '../constants/Backend'
import {LocaleContext} from '../locales/LocaleContext'
import {encode as btoa} from "base-64";
import {isvalidPassword} from "../validators";
import ScreenHeader from "./ScreenHeader";
import {withContext} from "../helpers/contextHelper";
import {StyledText} from "./StyledText";
import {CardFourNumberKeyboard} from './MoneyKeyboard'
import {ThemeKeyboardAwareScrollView} from './ThemeKeyboardAwareScrollView'
import {GesturePassword} from '../components/GesturePassword'
import {doLoggedIn} from '../actions'
import {compose} from "redux";
import {connect} from "react-redux";

class EditPasswordPopUpBase extends Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)


    this.state = {
      isVisible: false,
      originalPassword: null,
      newPassword: null,
      showEnterNewPassword: !this.props.ownAccount,
      cardKeyboardResult: []
    }

    // https://reactjs.org/docs/handling-events.html
    this.handleChangeMasterPwd = this.handleChangeMasterPwd.bind(this)
  }



  toggleModal = visible => {
    this.setState({
      isVisible: visible,
      showEnterNewPassword: !this.props.ownAccount,
    })
  }

  handleCheckPassword = async password => {
    let token = await AsyncStorage.getItem('token')
    const tokenObj = JSON.parse(token)
    const username = tokenObj.cli_userName
    const masterPassword = tokenObj.cli_masterPwd

    const formData = new FormData()
    formData.append('grant_type', 'password')
    formData.append('username', this.props.name)
    formData.append('password', password)
    const auth = 'Basic ' + btoa(username + ':' + masterPassword)

    let response = await fetch(api.getAuthToken, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        Authorization: auth
      },
      body: formData
    })

    if (response.status === 200) {
      this.setState({showEnterNewPassword: true})
    } else {
      await this.toggleModal(false)
      warningMessage(this.context.t('editPasswordPopUp.incorrectPassword'))
    }
  }

  handleChangePwd = async updatedPassword => {
    Keyboard.dismiss()
    const updatePasswordUrl = this.props.ownAccount ? api.clientUser.updateCurrentUserPassword : api.clientUser.updatePassword(this.props.name)

    dispatchFetchRequestWithOption(updatePasswordUrl,
      {
        method: 'PATCH',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({password: updatedPassword})
      }, {
      defaultMessage: false
    },
      response => {
        // async/await is to avoid update on unmounted component error in SmoothPinCodeInput.
        response.json().then(data => {
          if (data.username) {
            successMessage(this.context.t('editPasswordPopUp.passwordUpdated'))
          }
        })
      }).then()

    await this.setState({showEnterNewPassword: false})
    await this.toggleModal(false)
  }

  handleChangeMasterPwd = async updatedPassword => {
    // dismiss keyboard after pin code is fulfilled.
    Keyboard.dismiss()
    Alert.alert(
      ``,
      `${this.context.t('editPasswordPopUp.changePasswordAlert')}`,
      [
        {
          text: `${this.context.t('action.yes')}`,
          onPress: () => {
            const updatePasswordUrl = this.props.ownAccount ? api.clientUser.updateCurrentUserPassword : api.clientUser.updatePassword(this.props.name)

            dispatchFetchRequestWithOption(updatePasswordUrl,
              {
                method: 'PATCH',
                withCredentials: true,
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({password: updatedPassword})
              }, {
              defaultMessage: false
            },
              response => {
                // async/await is to avoid update on unmounted component error in SmoothPinCodeInput.
                response.json().then(data => {
                  if (data.username) {
                    successMessage(this.context.t('editPasswordPopUp.passwordUpdated'))
                    this.getToken(updatedPassword)
                    AsyncStorage.removeItem(`gesturePassword_${this.props?.client?.id}`)
                    this.props?.updateCallback && this.props?.updateCallback()
                  }
                })
              }).then()

            this.setState({showEnterNewPassword: false})
            this.toggleModal(false)
          }
        },
        {
          text: `${this.context.t('action.no')}`,
          onPress: () => {
            this.setState({showEnterNewPassword: false})
            this.toggleModal(false)
          },
          style: 'cancel'
        }
      ]
    )

  }

  async componentDidMount() {
    await this.checkGesturePassword()
  }


  checkGesturePassword = async (result = null) => {
    try {
      const value = await AsyncStorage.getItem(`gesturePassword_${this.props?.client?.id}`);
      if (value !== null) {
        this.setState({hasGesturePassword: true})
        // We have data!!
        console.log(value);

      } else {
        this.setState({hasGesturePassword: false})
      }
    } catch (error) {
      // Error retrieving data
    }
  }

  getToken = async (password) => {
    const formData = new FormData()
    formData.append('grant_type', 'password')
    formData.append('username', this.props.name)
    formData.append('password', password)
    const auth = 'Basic ' + btoa(this.props.name + ':' + password)

    let response = await fetch(api.getAuthToken, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        Authorization: auth
      },
      body: formData
    })

    if (!response.ok) {
      warningMessage(this.context.t('errors.loginFailed'))
    } else {
      let res = await response.json()
      await AsyncStorage.removeItem('token')
      await AsyncStorage.removeItem('clientusrToken')

      await AsyncStorage.setItem(storage.clientUsername, this.props.name)
      await AsyncStorage.setItem(storage.clientPassword, password)

      const loggedIn = new Date()
      res.loggedIn = loggedIn
      res.tokenExp = new Date().setSeconds(
        loggedIn.getSeconds() + parseInt(res.expires_in)
      )

      res.cli_userName = this.props.name
      res.cli_masterPwd = password

      // this is used for LoginSuccessScreen.
      res.username = res.cli_userName

      await AsyncStorage.setItem('token', JSON.stringify(res))
      doLoggedIn(res.access_token)
    }

    return response
  }

  /**
   * https://stackoverflow.com/questions/40483034/close-react-native-modal-by-clicking-on-overlay
   *
   * Direct manipulation:
   * https://facebook.github.io/react-native/docs/direct-manipulation
   * https://medium.com/@payalmaniyar/deep-understanding-of-ref-direct-manipulation-in-react-native-e89726ddb78e
   */
  render() {
    const {themeStyle} = this.props
    const {t, customMainThemeColor} = this.context

    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.toggleModal(true)
          }}
        >
          <Icon name="md-create" size={24} color={customMainThemeColor} />
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.isVisible}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalContainer}
            onPressOut={() => {
              this.toggleModal(false)
            }}
          >
            <KeyboardAvoidingView behavior='position' >
              <View style={[styles.boxShadow, styles.popUpLayout, themeStyle, {maxWidth: 640}]}>
                <TouchableWithoutFeedback>
                  <View>
                    <ScreenHeader backNavigation={false}
                      title={t('editPasswordPopUp.editPassword')} />

                    {this.props.ownAccount && !this.state.showEnterNewPassword && (
                      <View>
                        <StyledText style={{marginBottom: 10, textAlign: 'center'}}>
                          {t('editPasswordPopUp.enterOldPassword')}
                        </StyledText>
                        {this.props.defaultUser ? (
                          <View style={[styles.tableRowContainer]}>
                            <TextInput
                              name="originalPassword"
                              value={this.state.originalPassword}
                              onChangeText={(value) => this.setState({originalPassword: value})}
                              placeholder={t('editPasswordPopUp.originalPassword')}
                              secureTextEntry={true}
                              style={[themeStyle, styles?.rootInput(this.context), styles?.withBorder(this.context), {flex: 1}]}
                            />
                            <TouchableOpacity
                              style={{marginLeft: 10}}
                              onPress={() => this.handleCheckPassword(this.state.originalPassword)}
                            >
                              <Text style={[styles?.searchButton(customMainThemeColor)]}>{t('editPasswordPopUp.enter')}</Text>
                            </TouchableOpacity>
                          </View>
                        ) : (

                            <View style={{maxWidth: 400, maxHeight: 500, alignSelf: 'center'}}>
                              <CardFourNumberKeyboard
                                initialValue={[]}
                                value={this.state.cardKeyboardResult}
                                getResult={(result) => {
                                  this.setState({cardKeyboardResult: result})
                                  if (result.length === 4 && !result.some((item) => {return item === ''})) {
                                    this.handleCheckPassword(result.join(''))
                                    this.setState({cardKeyboardResult: []})
                                  }
                                }} />
                            </View>
                          )}
                      </View>
                    )}

                    {this.state.showEnterNewPassword && (
                      <View>
                        <StyledText style={{marginBottom: 10, textAlign: 'center'}}>
                          {t('editPasswordPopUp.enterNewPassword')}
                        </StyledText>
                        {this.props.defaultUser ? (
                          <View style={styles.tableRowContainer}>
                            <TextInput
                              name="originalPassword"
                              value={this.state.newPassword}
                              onChangeText={(value) => this.setState({newPassword: value})}
                              placeholder={t('editPasswordPopUp.newPassword')}
                              secureTextEntry={true}
                              validate={isvalidPassword}
                              style={[themeStyle, styles?.rootInput(this.context), styles?.withBorder(this.context), {flex: 1}]}
                            />
                            <TouchableOpacity
                              style={{marginLeft: 10}}
                              onPress={() => this.handleChangeMasterPwd(this.state.newPassword)}
                            >
                              <Text style={[styles?.searchButton(customMainThemeColor)]}>{t('editPasswordPopUp.enter')}</Text>
                            </TouchableOpacity>
                          </View>
                        ) : (

                            <View style={{maxWidth: 400, maxHeight: 500, alignSelf: 'center'}}>
                              <CardFourNumberKeyboard
                                initialValue={[]}
                                value={this.state.cardKeyboardResult}
                                getResult={(result) => {
                                  this.setState({cardKeyboardResult: result})
                                  if (result.length === 4 && !result.some((item) => {return item === ''})) {
                                    this.handleChangePwd(result.join(''))
                                    this.setState({cardKeyboardResult: []})
                                  }
                                }} />
                            </View>
                          )}
                      </View>
                    )}
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </KeyboardAvoidingView>
          </TouchableOpacity>
        </Modal>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  client: state.client.data
})

const enhance = compose(
  connect(mapStateToProps, null),
  withContext
)

export const EditPasswordPopUp = enhance(EditPasswordPopUpBase)

class EditGesturePasswordPopUpBase extends Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)


    this.state = {
      isVisible: false,
      originalPassword: null,
      newPassword: null,
      showEnterNewPassword: !this.props.ownAccount,
      cardKeyboardResult: [],
      wrongPassword: false,
      oldPassword: null,
      hasGesturePassword: false
    }

  }



  toggleModal = visible => {
    this.setState({
      isVisible: visible,
      showEnterNewPassword: !this.props.ownAccount,
    })
  }

  handleCheckPassword = async password => {
    let token = await AsyncStorage.getItem('token')
    const tokenObj = JSON.parse(token)
    const username = tokenObj.cli_userName
    const masterPassword = tokenObj.cli_masterPwd

    const formData = new FormData()
    formData.append('grant_type', 'password')
    formData.append('username', this.props.name)
    formData.append('password', password)
    const auth = 'Basic ' + btoa(username + ':' + masterPassword)

    let response = await fetch(api.getAuthToken, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        Authorization: auth
      },
      body: formData
    })

    if (response.status === 200) {
      this.setState({showEnterNewPassword: true, oldPassword: password})
    } else {
      await this.toggleModal(false)
      warningMessage(this.context.t('editPasswordPopUp.incorrectPassword'))
    }
  }




  async componentDidMount() {
    await this.checkGesturePassword()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps?.updateGestureFlag !== this.props?.updateGestureFlag) {
      this.setState({hasGesturePassword: false})
    }
  }

  checkGesturePassword = async (result = null) => {

    try {
      const value = await AsyncStorage.getItem(`gesturePassword_${this.props?.client?.id}`);
      if (value !== null) {
        this.setState({hasGesturePassword: true})
        // We have data!!
        console.log(value);
        if (!!result) {
          if (result === value) {
            this.setState({showEnterNewPassword: true})
          } else {
            this.setState({showEnterNewPassword: false, wrongPassword: true})
          }
        }
      } else {
        this.setState({hasGesturePassword: false})
      }
    } catch (error) {
      // Error retrieving data
    }
  }
  updateGesturePassword = async (result = null) => {

    try {
      await AsyncStorage.setItem(`gesturePassword_${this.props?.client?.id}`, result);
      await AsyncStorage.setItem(`gesturePassword_${result}`, this.state?.oldPassword);
      successMessage(this.context.t('editPasswordPopUp.passwordUpdated'))
      this.setState({hasGesturePassword: true, showEnterNewPassword: false, wrongPassword: false})
      this.toggleModal(false)
    } catch (error) {
      // Error retrieving data
    }
  }
  render() {
    const {themeStyle} = this.props
    const {t, isTablet, customMainThemeColor} = this.context

    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.toggleModal(true)
          }}
        >
          <Icon name={this.state?.hasGesturePassword ? "md-create" : 'add'} size={24} color={customMainThemeColor} />
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.isVisible}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalContainer}
            onPressOut={() => {
              this.toggleModal(false)
            }}
          >
            <KeyboardAvoidingView behavior='position' >
              <View style={[styles.boxShadow, styles.popUpLayout, themeStyle, {maxWidth: 640}]}>
                <TouchableWithoutFeedback>
                  <View>
                    <ScreenHeader backNavigation={false}
                      title={t('editPasswordPopUp.editPassword')} />

                    {this.props.ownAccount && !this.state.showEnterNewPassword && (
                      <View>
                        <StyledText style={{marginBottom: 10, textAlign: 'center'}}>
                          {t('editPasswordPopUp.enterOldPassword')}
                        </StyledText>
                        {this.state?.wrongPassword &&
                          <StyledText style={{marginBottom: 10, textAlign: 'center', color: '#f75336'}}>
                            {t('editPasswordPopUp.incorrectPassword')}
                          </StyledText>}
                        {this.props.defaultUser ? (
                          <View style={[styles.tableRowContainer]}>
                            <TextInput
                              name="originalPassword"
                              value={this.state.originalPassword}
                              onChangeText={(value) => this.setState({originalPassword: value})}
                              placeholder={t('editPasswordPopUp.originalPassword')}
                              secureTextEntry={true}
                              style={[themeStyle, styles?.rootInput(this.context), styles?.withBorder(this.context), {flex: 1}]}
                            />
                            <TouchableOpacity
                              style={{marginLeft: 10}}
                              onPress={() => this.handleCheckPassword(this.state.originalPassword)}
                            >
                              <Text style={[styles?.searchButton(customMainThemeColor)]}>{t('editPasswordPopUp.enter')}</Text>
                            </TouchableOpacity>
                          </View>
                        ) : (

                            <View style={{maxWidth: 400, maxHeight: 500, alignSelf: 'center'}}>
                              <CardFourNumberKeyboard
                                initialValue={[]}
                                value={this.state.cardKeyboardResult}
                                getResult={(result) => {
                                  this.setState({cardKeyboardResult: result})
                                  if (result.length === 4 && !result.some((item) => {return item === ''})) {
                                    this.handleCheckPassword(result.join(''))
                                    this.setState({cardKeyboardResult: []})
                                  }
                                }} />
                            </View>
                          )}
                      </View>
                    )}

                    {this.state.showEnterNewPassword && (
                      <View>
                        <StyledText style={{marginBottom: 10, textAlign: 'center'}}>
                          {t('editPasswordPopUp.enterNewPassword')}
                        </StyledText>
                        {this.props.defaultUser ? (
                          <View style={[styles.sectionContainer]}>
                            <GesturePassword gestureAreaLength={isTablet ? 400 : 320} style={{alignSelf: 'center'}} getResult={(result) => this.updateGesturePassword(result)} />
                          </View>
                        ) : (

                            <View style={{maxWidth: 400, maxHeight: 500, alignSelf: 'center'}}>
                              <CardFourNumberKeyboard
                                initialValue={[]}
                                value={this.state.cardKeyboardResult}
                                getResult={(result) => {
                                  this.setState({cardKeyboardResult: result})
                                  if (result.length === 4 && !result.some((item) => {return item === ''})) {
                                    this.setState({cardKeyboardResult: []})
                                  }
                                }} />
                            </View>
                          )}
                      </View>
                    )}
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </KeyboardAvoidingView>
          </TouchableOpacity>
        </Modal>
      </View>
    )
  }
}

export const EditGesturePasswordPopUp = enhance(EditGesturePasswordPopUpBase)

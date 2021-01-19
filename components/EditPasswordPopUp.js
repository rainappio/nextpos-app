import React, {Component} from 'react'
import {Field} from 'redux-form'
import {AsyncStorage, Keyboard, Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, KeyboardAvoidingView} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import PinCodeInput from '../components/PinCodeInput'
import styles, {mainThemeColor} from '../styles'
import {api, dispatchFetchRequestWithOption, successMessage, warningMessage} from '../constants/Backend'
import {LocaleContext} from '../locales/LocaleContext'
import {encode as btoa} from "base-64";
import {isvalidPassword} from "../validators";
import ScreenHeader from "./ScreenHeader";
import {withContext} from "../helpers/contextHelper";
import {StyledText} from "./StyledText";
import {CardFourNumberKeyboard} from './MoneyKeyboard'
import {ThemeKeyboardAwareScrollView} from './ThemeKeyboardAwareScrollView'

class EditPasswordPopUp extends Component {
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
    this.handleChangePwd = this.handleChangePwd.bind(this)
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
    // dismiss keyboard after pin code is fulfilled.
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

  /**
   * https://stackoverflow.com/questions/40483034/close-react-native-modal-by-clicking-on-overlay
   *
   * Direct manipulation:
   * https://facebook.github.io/react-native/docs/direct-manipulation
   * https://medium.com/@payalmaniyar/deep-understanding-of-ref-direct-manipulation-in-react-native-e89726ddb78e
   */
  render() {
    const {themeStyle} = this.props
    const {t} = this.context

    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.toggleModal(true)
          }}
        >
          <Icon name="md-create" size={24} color={mainThemeColor} />
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
                              style={[styles.rootInput, styles.withBorder, themeStyle, {flex: 1}]}
                            />
                            <TouchableOpacity
                              style={{marginLeft: 10}}
                              onPress={() => this.handleCheckPassword(this.state.originalPassword)}
                            >
                              <Text style={[styles.searchButton]}>{t('editPasswordPopUp.enter')}</Text>
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
                              style={[styles.rootInput, styles.withBorder, themeStyle, {flex: 1}]}
                            />
                            <TouchableOpacity
                              style={{marginLeft: 10}}
                              onPress={() => this.handleChangePwd(this.state.newPassword)}
                            >
                              <Text style={[styles.searchButton]}>{t('editPasswordPopUp.enter')}</Text>
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

export default withContext(EditPasswordPopUp)

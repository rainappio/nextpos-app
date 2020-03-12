import React, { Component } from 'react'
import { Field } from 'redux-form'
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard, AsyncStorage, TextInput
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import PinCodeInput from '../components/PinCodeInput'
import styles from '../styles'
import {api, dispatchFetchRequest, successMessage, warningMessage} from '../constants/Backend'
import { LocaleContext } from '../locales/LocaleContext'
import {encode as btoa} from "base-64";
import InputText from "./InputText";
import {isvalidPassword} from "../validators";
import ScreenHeader from "./ScreenHeader";

class EditPasswordPopUp extends Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      isVisible: false,
      originalPassword: null,
      newPassword: null,
      showEnterNewPassword: !this.props.ownAccount
    }

    // https://reactjs.org/docs/handling-events.html
    this.handleChangePwd = this.handleChangePwd.bind(this)
  }

  async componentDidMount() {
    await this.context.localize({
      en: {
        passwordTitle: 'Password',
        editPassword: 'Edit Password',
        enterOldPassword: 'Enter Old Password',
        originalPassword: 'Original Password',
        enter: 'Enter',
        enterNewPassword: 'Enter New Password'
      },
      zh: {
        passwordTitle: '設定密碼',
        editPassword: '編輯密碼',
        enterOldPassword: '輸入原本密碼',
        originalPassword: '原本密碼',
        enter: '輸入',
        enterNewPassword: '輸入新密碼'
      }
    })
  }

  toggleModal = visible => {
    this.setState({
      isVisible: visible,
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
      this.setState({ showEnterNewPassword: true })
    } else {
      await this.toggleModal(false)
      warningMessage('Password is incorrect')
    }
  }

  handleChangePwd = async updatedPassword => {
    // dismiss keyboard after pin code is fulfilled.
    Keyboard.dismiss()
    const updatePasswordUrl = this.props.ownAccount? api.clientUser.updateCurrentUserPassword : api.clientUser.updatePassword(this.props.name)

    dispatchFetchRequest(updatePasswordUrl,
      {
        method: 'PATCH',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({password: updatedPassword})
      },
      response => {
        // async/await is to avoid update on unmounted component error in SmoothPinCodeInput.
        response.json().then(data => {
          if (data.username) {
            successMessage('Password updated')
          }
        })


      }).then()

    await this.setState( { showEnterNewPassword: false })
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
    const { t } = this.context

    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.toggleModal(true)
          }}
        >
          <Icon name="md-create" size={22} color="#f18d1a">
            &nbsp;<Text style={{ fontSize: 15 }}>{t('passwordTitle')}</Text>
          </Icon>
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
            <ScrollView
              directionalLockEnabled={true}
              contentContainerStyle={styles.modalContainer}
            >
              <TouchableWithoutFeedback>
                <View
                  style={[styles.whiteBg, styles.boxShadow, styles.popUpLayout]}
                >
                  <ScreenHeader backNavigation={false}
                                title={t('editPassword')}/>

                  {this.props.ownAccount && (
                    <View
                      style={[
                        styles.jc_alignIem_center,
                        styles.paddLeft20,
                        styles.paddRight20
                      ]}
                    >
                      <Text style={{marginBottom: 10, textAlign: 'center'}}>
                        {t('enterOldPassword')}
                      </Text>
                      {this.props.defaultUser ? (
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                          <TextInput
                            name="originalPassword"
                            value={this.state.originalPassword}
                            onChangeText={(value) => this.setState({originalPassword: value})}
                            placeholder={t('originalPassword')}
                            secureTextEntry={true}
                            style={[styles.rootInput, {width: 200}]}
                          />
                          <TouchableOpacity
                            style={{marginLeft: 10}}
                            onPress={() => this.handleCheckPassword(this.state.originalPassword)}
                          >
                            <Text style={[styles.bottomActionButton, styles.actionButton]}>{t('enter')}</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <Field
                          name="originalPassword"
                          component={PinCodeInput}
                          onChange={val => this.handleCheckPassword(val)}
                          customHeight={40}
                        />
                      )}
                    </View>
                  )}

                  {this.state.showEnterNewPassword && (
                    <View
                      style={[
                        styles.jc_alignIem_center,
                        styles.paddLeft20,
                        styles.paddRight20
                      ]}
                    >
                      <Text style={{marginBottom: 10, textAlign: 'center'}}>
                        {t('enterNewPassword')}
                      </Text>
                      {this.props.defaultUser ? (
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                          <TextInput
                            name="originalPassword"
                            value={this.state.newPassword}
                            onChangeText={(value) => this.setState({newPassword: value})}
                            placeholder={t('newPassword')}
                            secureTextEntry={true}
                            validate={isvalidPassword}
                            style={[styles.rootInput, {width: 200}]}
                          />
                          <TouchableOpacity
                            style={{marginLeft: 10}}
                            onPress={() => this.handleChangePwd(this.state.newPassword)}
                          >
                            <Text style={[styles.bottomActionButton, styles.actionButton]}>{t('enter')}</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <Field
                          name="password"
                          component={PinCodeInput}
                          onChange={val => this.handleChangePwd(val)}
                          customHeight={40}
                        />
                      )}
                    </View>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </TouchableOpacity>
        </Modal>
      </View>
    )
  }
}
export default EditPasswordPopUp

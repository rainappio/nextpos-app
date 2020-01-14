import React, { Component } from 'react'
import { Field } from 'redux-form'
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import PinCodeInput from '../components/PinCodeInput'
import styles from '../styles'
import {api, dispatchFetchRequest, successMessage} from '../constants/Backend'
import {LocaleContext} from "../locales/LocaleContext";

class EditPasswordPopUp extends Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      t: context.t,
      isVisible: false
    }

    // https://reactjs.org/docs/handling-events.html
    this.handleChangePwd = this.handleChangePwd.bind(this)
  }

  async componentDidMount() {
    await this.context.localize({
      en: {
        passwordTitle: 'Password',
        editPassword: 'Edit Password',
        enterNewPassword: 'Enter New Password'
      },
      zh: {
        passwordTitle: '設定密碼',
        editPassword: '編輯密碼',
        enterNewPassword: '輸入新密碼'
      }
    })
  }

  toggleModal = visible => {
    this.setState({
      isVisible: visible
    })
  }

  handleChangePwd = updatedPassword => {
    var name = this.props.name
    var newPwd = {}
    newPwd['password'] = updatedPassword

    // dismiss keyboard after pin code is fulfilled.
    Keyboard.dismiss()

    dispatchFetchRequest(api.clientUser.updatePassword(name), {
        method: 'PATCH',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPwd)
      },
      response => {
        // async/await is to avoid update on unmounted component error in SmoothPinCodeInput.
        response.json().then(async data => {
          if (data.username) {
            successMessage('Password updated')
          }

          await this.toggleModal(false)
        })
      }).then()
  }

  /**
   * https://stackoverflow.com/questions/40483034/close-react-native-modal-by-clicking-on-overlay
   *
   * Direct manipulation:
   * https://facebook.github.io/react-native/docs/direct-manipulation
   * https://medium.com/@payalmaniyar/deep-understanding-of-ref-direct-manipulation-in-react-native-e89726ddb78e
   */
  render() {
    const { t } = this.state

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
            ref={component => (this._touchable = component)}
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
                  <Text
                    style={[
                      styles.welcomeText,
                      styles.orange_color,
                      styles.mgrbtn40
                    ]}
                  >
                    {t('editPassword')}
                  </Text>

                  <Text style={{ marginBottom: 10, textAlign: 'center' }}>
                    {t('enterNewPassword')}
                  </Text>
                  <View
                    style={[
                      styles.jc_alignIem_center,
                      styles.flex_dir_row,
                      styles.paddLeft20,
                      styles.paddRight20
                    ]}
                  >
                    <Field
                      name="password"
                      component={PinCodeInput}
                      onChange={val => this.handleChangePwd(val)}
                      customHeight={40}
                    />
                  </View>
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

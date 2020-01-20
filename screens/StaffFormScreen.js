import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Keyboard, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { isRequired } from '../validators'
import InputText from '../components/InputText'
import PinCodeInput from '../components/PinCodeInput'
import { DismissKeyboard } from '../components/DismissKeyboard'
import { getClientUsrs } from '../actions'
import EditPasswordPopUp from '../components/EditPasswordPopUp'
import RNSwitch from '../components/RNSwitch'
import styles from '../styles'
import DeleteBtn from '../components/DeleteBtn'
import { api, dispatchFetchRequest, successMessage } from '../constants/Backend'
import { LocaleContext } from '../locales/LocaleContext'

class StaffFormScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      t: context.t
    }
  }

  componentDidMount() {
    this.context.localize({
      en: {
        staffTitle: 'Staff',
        nickName: 'Nick Name',
        username: 'User Name',
        password: 'Password',
        manager: 'Manager Role',
        passwordTitle: 'Password',
        editPassword: 'Edit Password',
        enterNewPassword: 'Enter New Password'
      },
      zh: {
        staffTitle: '員工',
        nickName: '匿稱',
        username: '使用者名稱',
        password: '密碼',
        manager: '主管權限',
        passwordTitle: '設定密碼',
        editPassword: '編輯密碼',
        enterNewPassword: '輸入新密碼'
      }
    })
  }

  handleDelete = values => {
    dispatchFetchRequest(
      api.clientUser.delete(values.name),
      {
        method: 'DELETE',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      response => {
        successMessage('Deleted')
        this.props.navigation.navigate('StaffsOverview')
        this.props.getClientUsrs()
      }
    ).then()
  }

  render() {
    const {
      handleSubmit,
      isEditForm,
      handleEditCancel,
      initialValues,
      onCancel
    } = this.props
    const { t } = this.state

    return (
      <DismissKeyboard>
        <View style={styles.container_nocenterCnt}>
          <View>
            {isEditForm ? (
              <Text
                style={[
                  styles.welcomeText,
                  styles.orange_color,
                  styles.textMedium,
                  styles.textBold,
                  styles.mgrbtn80
                ]}
              >
                {t('staffTitle')}
              </Text>
            ) : (
              <Text
                style={[
                  styles.welcomeText,
                  styles.orange_color,
                  styles.textMedium,
                  styles.textBold,
                  styles.mgrbtn80
                ]}
              >
                {t('staffTitle')}
              </Text>
            )}

            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <View style={[styles.onethirdWidth, styles.mgrtotop8]}>
                <Text>{t('nickName')}</Text>
              </View>
              <View style={[styles.onesixthWidth]}>
                <Field
                  name="nickname"
                  component={InputText}
                  placeholder="Nick Name"
                  secureTextEntry={false}
                  autoFocus={!isEditForm}
                />
              </View>
            </View>

            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <View style={[styles.onethirdWidth, styles.mgrtotop8]}>
                <Text>{t('username')}</Text>
              </View>
              <View style={[styles.onesixthWidth]}>
                <Field
                  name="username"
                  component={InputText}
                  validate={isRequired}
                  placeholder="User Name"
                  secureTextEntry={false}
                  editable={!isEditForm}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <View style={[styles.onethirdWidth, styles.mgrtotop8]}>
                <Text>{t('password')}</Text>
              </View>
              <View style={[styles.onesixthWidth, styles.mgrtotop8]}>
                <Field
                  name="password"
                  component={PinCodeInput}
                  onChange={val => Keyboard.dismiss()}
                  customHeight={40}
                  editable={!isEditForm}
                />
              </View>
            </View>

            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              {isEditForm && (
                <EditPasswordPopUp name={initialValues.username} />
              )}
            </View>

            {isEditForm ? (
              <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
                <View style={[styles.onethirdWidth, styles.mgrtotop8]}>
                  <Text>{t('manager')}</Text>
                </View>
                <View style={[styles.onesixthWidth, styles.mgrtotop8]}>
                  <Field name="isManager" component={RNSwitch} />
                </View>
              </View>
            ) : (
              <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
                <View style={[styles.onethirdWidth, styles.mgrtotop20]}>
                  <Text>{t('manager')}</Text>
                </View>
                <View style={[styles.onesixthWidth, styles.mgrtotop20]}>
                  <Field name="isManager" component={RNSwitch} />
                </View>
              </View>
            )}
          </View>

          <View style={[styles.bottom]}>
            <TouchableOpacity onPress={handleSubmit}>
              <Text style={[styles.bottomActionButton, styles.actionButton]}>
                {t('action.save')}
              </Text>
            </TouchableOpacity>

            {isEditForm ? (
              <View>
                <TouchableOpacity onPress={handleEditCancel}>
                  <Text
                    style={[styles.bottomActionButton, styles.cancelButton]}
                  >
                    {t('action.cancel')}
                  </Text>
                </TouchableOpacity>
                <DeleteBtn
                  handleDeleteAction={this.handleDelete}
                  params={{
                    name: this.props.navigation.state.params.staffname
                  }}
                />
              </View>
            ) : (
              <View>
                <TouchableOpacity onPress={onCancel}>
                  <Text
                    style={[styles.bottomActionButton, styles.cancelButton]}
                  >
                    {t('action.cancel')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </DismissKeyboard>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
  getClientUsrs: () => dispatch(getClientUsrs())
})

StaffFormScreen = reduxForm({
  form: 'staffForm'
})(StaffFormScreen)

export default connect(
  null,
  mapDispatchToProps
)(StaffFormScreen)

import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Keyboard, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { isRequired } from '../validators'
import InputText from '../components/InputText'
import PinCodeInput from '../components/PinCodeInput'
import { DismissKeyboard } from '../components/DismissKeyboard'
import { getClientUsrs, resolveRoles } from '../actions'
import EditPasswordPopUp from '../components/EditPasswordPopUp'
import DeleteBtn from '../components/DeleteBtn'
import { api, dispatchFetchRequest, successMessage } from '../constants/Backend'
import { LocaleContext } from '../locales/LocaleContext'
import SegmentedControl from "../components/SegmentedControl"
import ScreenHeader from "../components/ScreenHeader";
import DropDown from '../components/DropDown'
import Icon from 'react-native-vector-icons/Ionicons'
import styles, { mainThemeColor } from '../styles'


class StaffFormScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    const selectedRoleIndex = this.props.initialValues !== undefined ? this.props.initialValues.selectedRole : null

    this.state = {
      selectedRole: selectedRoleIndex
    }
  }

  componentDidMount() {
    this.context.localize({
      en: {
        staffTitle: 'Staff',
        nickName: 'Nick Name',
        username: 'User Name',
        password: 'Password',
        role: 'Role',
        manager: 'Manager Role',
        passwordTitle: 'Password',
        editPassword: 'Edit Password',
        enterNewPassword: 'Enter New Password',
        editRole: 'Edit Role',
        roleId: 'Role Id'
      },
      zh: {
        staffTitle: '員工',
        nickName: '匿稱',
        username: '使用者名稱',
        password: '密碼',
        role: '權限',
        manager: '主管權限',
        passwordTitle: '設定密碼',
        editPassword: '編輯密碼',
        enterNewPassword: '輸入新密碼',
        editRole: 'Edit Role-CH',
        roleId: 'Role Id-CH'
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
        this.props.navigation.navigate('StaffsOverview')
        this.props.getClientUsrs()
      }
    ).then()
  }

  handleRoleSelection = (index) => {
    this.setState({ selectedRole: index })
  }

  render() {
    const {
      handleSubmit,
      isEditForm,
      handleEditCancel,
      initialValues,
      onCancel,
      userRoles = []
    } = this.props
    const { t } = this.context
    var roleIdArr = [];
    userRoles !== undefined && userRoles.map(usrRole => roleIdArr.push({ label: usrRole.roleName, value: usrRole.id }))

    return (
      <DismissKeyboard>
        <View style={styles.container_nocenterCnt}>
          <View>
            <ScreenHeader title={t('staffTitle')} />

            <View style={styles.fieldContainer}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldTitle}>{t('nickName')}</Text>
              </View>
              <View style={{ flex: 3 }}>
                <Field
                  name="nickname"
                  component={InputText}
                  placeholder={t('nickName')}
                  secureTextEntry={false}
                  autoFocus={!isEditForm}
                />
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldTitle}>{t('username')}</Text>
              </View>
              <View style={{ flex: 3 }}>
                <Field
                  name="username"
                  component={InputText}
                  validate={isRequired}
                  placeholder={t('username')}
                  secureTextEntry={false}
                  editable={!isEditForm}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldTitle}>{t('password')}</Text>
              </View>
              <View style={{ flex: 3, alignItems: 'flex-end' }}>
                {isEditForm ? (
                  <EditPasswordPopUp name={initialValues.username} />
                ) : (
                    <Field
                      name="password"
                      component={PinCodeInput}
                      onChange={val => Keyboard.dismiss()}
                      customHeight={40}
                      editable={!isEditForm}
                    />
                  )}

              </View>
            </View>

            <View style={styles.fieldContainer}>
              <View style={{ flex: 2 }}>
                <Text style={styles.fieldTitle}>{t('role')}</Text>
              </View>
              <View style={{ flex: 2 }}>
                <Field
                  name="selectedRole"
                  component={SegmentedControl}
                  values={["USER", "MANAGER", "OWNER"]}
                  selectedIndex={this.state.selectedRole}
                  onChange={this.handleRoleSelection}
                  normalize={value => {
                    return resolveRoles(value)
                  }}
                />
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <View style={{ flex: 2 }}>
                <Text style={styles.fieldTitle}>{t('roleId')}</Text>
              </View>
              <View style={{ flex: 2 }}>
                <Field
                  name="userRoleId"
                  component={DropDown}
                  placeholder={{ value: null, label: t('role') }}
                  options={roleIdArr}
                  forFilter={true}
                  search
                  selection
                  fluid
                />
              </View>
            </View>
          </View>

          {
            isEditForm &&
            <View style={styles.fieldContainer}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldTitle}>{t('editRole')}</Text>
              </View>
              <View style={{ flex: 3, alignItems: 'flex-end' }}>
                <Icon name="md-create"
                  size={24}
                  color={mainThemeColor}
                  onPress={() => this.props.navigation.navigate('ManageUserRole')}
                />
              </View>
            </View>
          }

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

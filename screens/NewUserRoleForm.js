import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Text, TouchableOpacity, View } from 'react-native'
import { isRequired } from '../validators'
import InputText from '../components/InputText'
import { LocaleContext } from '../locales/LocaleContext'
import styles from '../styles'
import RNSwitchGroup from "../components/RNSwitchGroup"
import DeleteBtn from '../components/DeleteBtn'


class NewUserRoleForm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  handleRoleSelection = (index) => {
    this.setState({ selectedRole: index })
  }

  render() {
    const {
      handleSubmit,
      isEditForm,
      handleEditCancel,
      permissions,
      onCancel,
      handleDeleteUserRole,
      labels
    } = this.props
    const { t, theme } = this.context

    return (
      <View>
        <View style={styles.fieldContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldTitle}>{t('roleName')}</Text>
          </View>
          <View style={{ flex: 3 }}>
            <Field
              name="roleName"
              component={InputText}
              placeholder={t('roleName')}
              secureTextEntry={false}
              autoFocus={!isEditForm}
              validate={isRequired}
              theme={theme}
            />
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <View style={{ flex: 1 }}>
            <Field
              name="permissions"
              component={RNSwitchGroup}
              customarr={permissions}
              labels={labels}
            />
          </View>
        </View>

        <View style={[styles.bottom]}>
          <TouchableOpacity
            onPress={handleSubmit}
          >
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
                handleDeleteAction={handleDeleteUserRole}
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
    )
  }
}

NewUserRoleForm = reduxForm({
  form: 'newuserRoleForm'
})(NewUserRoleForm)

export default NewUserRoleForm

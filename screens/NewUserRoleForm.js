import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {Text, TouchableOpacity, View} from 'react-native'
import {isRequired} from '../validators'
import InputText from '../components/InputText'
import {LocaleContext} from '../locales/LocaleContext'
import styles from '../styles'
import RNSwitchGroup from "../components/RNSwitchGroup"
import DeleteBtn from '../components/DeleteBtn'
import {StyledText} from "../components/StyledText";


class NewUserRoleForm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  handleRoleSelection = (index) => {
    this.setState({selectedRole: index})
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
    const {t} = this.context

    return (
      <View>
        <View style={[styles.tableRowContainerWithBorder]}>
          <View style={[styles.tableCellView, {flex: 1}]}>
            <StyledText style={styles.fieldTitle}>{t('roleName')}</StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 1}]}>
            <Field
              name="roleName"
              component={InputText}
              placeholder={t('roleName')}
              secureTextEntry={false}
              //autoFocus={!isEditForm}
              validate={isRequired}
            />
          </View>
        </View>

        <View style={styles.flex(1)}>
          <Field
            name="permissions"
            component={RNSwitchGroup}
            customarr={permissions}
            labels={labels}
          />
        </View>

        <View style={[styles.bottom, styles.horizontalMargin]}>
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

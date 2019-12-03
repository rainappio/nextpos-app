import React from 'react'
import { Field, reduxForm, FieldArray } from 'redux-form'
import {
  Image,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { isRequired } from '../validators'
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import RenderCheckboxGroup from '../components/CheckBoxGroup'
import styles from '../styles'

class PrinterForm extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    const { handleSubmit, isEdit, handleEditCancel } = this.props
    //const { t } = this.props.screenProps

    return (
      <DismissKeyboard>
        <KeyboardAvoidingView behavior="padding" enabled>
          <Text
            style={[styles.textBig, styles.centerText, styles.paddingTopBtn20]}
          >
            {isEdit ? 'Edit Printers' : 'Add Printers'}
          </Text>
          <Field
            name="name"
            component={InputText}
            type="text"
            validate={[isRequired]}
            //placeholder={t('email')}
            placeholder="Name"
            autoFocus={true}
          />
          <Field
            name="ipAddress"
            component={InputText}
            validate={isRequired}
            //placeholder={t('password')}
            placeholder="IP Address"
            // secureTextEntry={true}
          />

          <Field
            name="serviceType"
            component={InputText}
            validate={isRequired}
            placeholder="Service Type"
          />

          <View
            style={[
              {
                width: '100%',
                backgroundColor: '#F39F86',
                marginTop: 40,
                borderRadius: 4
              }
            ]}
          >
            <TouchableOpacity onPress={handleSubmit}>
              {/* <Text style={styles.gsText}>{t('login')}</Text>*/}
              <Text style={styles.gsText}>{isEdit ? 'Update' : 'Save'}</Text>
            </TouchableOpacity>
          </View>

          <View
            style={[
              {
                width: '100%',
                marginTop: 8,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#F39F86'
              }
            ]}
          >
            {isEdit ? (
              <TouchableOpacity onPress={handleEditCancel}>
                <Text style={styles.signInText}>Cancel</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('PrinternKDS')}
              >
                <Text style={[styles.signInText, styles.orange_color]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </DismissKeyboard>
    )
  }
}

PrinterForm = reduxForm({
  form: 'printerForm'
})(PrinterForm)

export default PrinterForm

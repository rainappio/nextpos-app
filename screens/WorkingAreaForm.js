import React from 'react'
import { Field, reduxForm, FieldArray } from 'redux-form'
import {
  Image,
  KeyboardAvoidingView,
  Text,
  TouchableHighlight,
  View
} from 'react-native'
import { isRequired } from '../validators'
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import RenderCheckboxGroup from '../components/CheckBoxGroup'
import styles from '../styles'

class WorkingAreaForm extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    const { handleSubmit, isEdit, handleEditCancel, navigation } = this.props
    //const { t } = this.props.screenProps
    return (
      <DismissKeyboard>
        <KeyboardAvoidingView          
          behavior="padding"
          enabled
        >
        	<Text style={[styles.textBig, styles.centerText, styles.paddingTopBtn20]}>{isEdit ? 'Edit Woking Areas' : 'Add Working Areas'}</Text>
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
            name="noOfPrintCopies"
            component={InputText}
            validate={isRequired}
            //placeholder={t('password')}
            placeholder="Default"
            // secureTextEntry={true}
          />

          <Field
          	name="printerIds"
						component={RenderCheckboxGroup}
						customarr={isEdit ? this.props.dataArr : this.props.navigation.state.params.dataArr}
						navigation={navigation}
						customRoute={'PrinterEdit'}
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
            <TouchableHighlight onPress={handleSubmit}>
             {/* <Text style={styles.gsText}>{t('login')}</Text>*/}
              <Text style={styles.gsText}>{ isEdit? 'Update' : 'Save' }</Text>
            </TouchableHighlight>
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
                <TouchableHighlight onPress={handleEditCancel}>
                  <Text style={styles.signInText}>Cancel</Text>
                </TouchableHighlight>
              ) : (
                <TouchableHighlight
                  onPress={() =>
                    this.props.navigation.navigate('PrinternKDS')
                  }
                >
                  <Text style={[styles.signInText, styles.orange_color]}>Cancel</Text>
                </TouchableHighlight>
              )}
          </View>
        </KeyboardAvoidingView>
      </DismissKeyboard>
    )
  }
}

WorkingAreaForm = reduxForm({
  form: 'workingAreaForm'
})(WorkingAreaForm)

export default WorkingAreaForm

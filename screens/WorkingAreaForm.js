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
import { LocaleContext } from '../locales/LocaleContext'

class WorkingAreaForm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        editWorkingAreaTitle: 'Edit Working Area',
        addWorkingAreaTitle: 'Add Working Area',
        workingAreaName: 'Name',
        noOfPrintCopies: 'No. of Print Copies',
        linkedPrinters: 'Linked Printer(s)'
      },
      zh: {
        editWorkingAreaTitle: '編輯工作區',
        addWorkingAreaTitle: '新增工作區',
        workingAreaName: '名稱',
        noOfPrintCopies: '預設出單張數',
        linkedPrinters: '連結出單機設定'
      }
    })

    this.state = {
      t: context.t
    }
  }

  render() {
    const { handleSubmit, isEdit, handleEditCancel, navigation } = this.props
    const { t } = this.state

    return (
      <DismissKeyboard>
        <KeyboardAvoidingView behavior="padding" enabled>
          <Text
            style={[styles.textBig, styles.centerText, styles.paddingTopBtn20]}
          >
            {isEdit ? t('editWorkingAreaTitle') : t('addWorkingAreaTitle')}
          </Text>
          <Field
            name="name"
            component={InputText}
            type="text"
            validate={[isRequired]}
            placeholder={t('workingAreaName')}
          />

          <Field
            name="noOfPrintCopies"
            component={InputText}
            validate={isRequired}
            placeholder={t('noOfPrintCopies')}
            keyboardType="numeric"
            format={(value, name) => {
              return value !== undefined && value !== null ? String(value) : ''
            }}
          />

          <View style={[styles.paddingTopBtn20, styles.borderBottomLine]}>
            <Text style={styles.textBold}>{t('linkedPrinters')}</Text>
          </View>

          <Field
            name="printerIds"
            component={RenderCheckboxGroup}
            customarr={
              isEdit
                ? this.props.dataArr
                : this.props.navigation.state.params.dataArr
            }
            navigation={navigation}
            customRoute={'PrinterEdit'}
          />

          <View style={styles.bottom}>
            <TouchableOpacity onPress={handleSubmit}>
              <Text style={[styles.bottomActionButton, styles.actionButton]}>
                {isEdit ? t('action.update') : t('action.save')}
              </Text>
            </TouchableOpacity>
            {isEdit ? (
              <TouchableOpacity onPress={handleEditCancel}>
                <Text style={[styles.bottomActionButton, styles.cancelButton]}>{t('action.cancel')}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('PrinternKDS')}
              >
                <Text style={[styles.bottomActionButton, styles.cancelButton]}>
                  {t('action.cancel')}
                </Text>
              </TouchableOpacity>
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

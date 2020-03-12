import React from 'react'
import { Field, reduxForm, FieldArray } from 'redux-form'
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
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
  }

  render() {
    const { handleSubmit, isEdit, handleEditCancel, navigation } = this.props
    const { t } = this.context

    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View>
          <View style={styles.fieldContainer}>
            <View style={{ flex: 2 }}>
              <Text style={styles.fieldTitle}>{t('workingAreaName')}</Text>
            </View>
            <View style={{ flex: 3 }}>
              <Field
                name="name"
                component={InputText}
                type="text"
                validate={[isRequired]}
                placeholder={t('workingAreaName')}
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <View style={{ flex: 2 }}>
              <Text style={styles.fieldTitle}>{t('noOfPrintCopies')}</Text>
            </View>
            <View style={{ flex: 3 }}>
              <Field
                name="noOfPrintCopies"
                component={InputText}
                validate={isRequired}
                placeholder={t('noOfPrintCopies')}
                keyboardType="numeric"
                defaultvalue="1"
                format={(value, name) => {
                  return value !== undefined && value !== null
                    ? String(value)
                    : ''
                }}
              />
            </View>
          </View>

          <View style={[styles.paddingTopBtn20, styles.borderBottomLine]}>
            <Text style={styles.fieldTitle}>{t('linkedPrinters')}</Text>
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
        </View>

        <View style={styles.bottom}>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={[styles.bottomActionButton, styles.actionButton]}>
              {isEdit ? t('action.update') : t('action.save')}
            </Text>
          </TouchableOpacity>
          {isEdit ? (
            <TouchableOpacity onPress={handleEditCancel}>
              <Text style={[styles.bottomActionButton, styles.cancelButton]}>
                {t('action.cancel')}
              </Text>
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
      </ScrollView>
    )
  }
}

WorkingAreaForm = reduxForm({
  form: 'workingAreaForm'
})(WorkingAreaForm)

export default WorkingAreaForm

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
import RenderRadioBtn from '../components/RadioItem'

class PrinterForm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        editPrinterTitle: 'Edit Printer',
        addPrinterTitle: 'Add Printer',
        printerName: 'Printer Name',
        ipAddress: 'IP Address',
        serviceType: {
          title: 'Service Type',
          workingArea: 'Working Area',
          checkout: 'Checkout'
        }
      },
      zh: {
        editPrinterTitle: '編輯出單機',
        addPrinterTitle: '新增出單機',
        printerName: '名稱',
        ipAddress: 'IP地址',
        serviceType: {
          title: '綁定區域',
          workingArea: '工作區',
          checkout: '結帳區'
        }
      }
    })

    this.state = {
      t: context.t
    }
  }

  render() {
    const { handleSubmit, isEdit, handleEditCancel } = this.props
    const { t } = this.state

    return (
      <DismissKeyboard>
        <KeyboardAvoidingView behavior="padding" enabled>
          <Text
            style={[styles.textBig, styles.centerText, styles.paddingTopBtn20]}
          >
            {isEdit ? t('editPrinterTitle') : t('addPrinterTitle')}
          </Text>
          <Field
            name="name"
            component={InputText}
            type="text"
            validate={[isRequired]}
            placeholder={t('printerName')}
          />
          <Field
            name="ipAddress"
            component={InputText}
            validate={isRequired}
            placeholder={t('ipAddress')}
            keyboardType="numeric"
          />

          <View style={[styles.paddingTopBtn20, styles.borderBottomLine]}>
            <Text style={styles.textBold}>{t('serviceType.title')}</Text>
          </View>

          <View style={[styles.borderBottomLine, styles.paddingTopBtn20]}>
            <Field
              name="serviceType"
              component={RenderRadioBtn}
              customValue="WORKING_AREA"
              optionName={t('serviceType.workingArea')}
            />
          </View>

          <View style={[styles.borderBottomLine, styles.paddingTopBtn20]}>
            <Field
              name="serviceType"
              component={RenderRadioBtn}
              customValue="CHECKOUT"
              optionName={t('serviceType.checkout')}
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

PrinterForm = reduxForm({
  form: 'printerForm'
})(PrinterForm)

export default PrinterForm

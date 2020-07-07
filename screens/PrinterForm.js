import React from 'react'
import {Field, reduxForm, FieldArray, formValueSelector} from 'redux-form'
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
import RenderRadioBtn from '../components/RadioItem'
import {testPrinter} from "../helpers/printerActions";
import {connect} from "react-redux";
import {successMessage, warningMessage} from "../constants/Backend";

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
        },
        testPrint: 'Test Printer'
      },
      zh: {
        editPrinterTitle: '編輯出單機',
        addPrinterTitle: '新增出單機',
        printerName: '出單機名稱',
        ipAddress: 'IP地址',
        serviceType: {
          title: '綁定區域',
          workingArea: '工作區',
          checkout: '結帳區'
        },
        testPrint: '測試出單機'
      }
    })
  }

  handleTestPrint = (ipAddress) => {
    testPrinter(ipAddress, () => {
        successMessage('Test printer succeeded')

      }, () => {
        warningMessage("Test printer failed. Please check printer's IP address")
      }
    )
  }

  render() {
    const { handleSubmit, isEdit, handleEditCancel, ipAddress } = this.props
    const { t, theme } = this.context

    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View>
          <View style={styles.fieldContainer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldTitle}>{t('printerName')}</Text>
            </View>
            <View style={{ flex: 2 }}>
              <Field
                name="name"
                component={InputText}
                type="text"
                validate={[isRequired]}
                placeholder={t('printerName')}
                theme={theme}
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldTitle}>{t('ipAddress')}</Text>
            </View>
            <View style={{ flex: 2 }}>
              <Field
                name="ipAddress"
                component={InputText}
                validate={isRequired}
                placeholder={t('ipAddress')}
                keyboardType="numeric"
                onChange={(value) => this.setState({ ipAddress: value })}
                theme={theme}
              />
            </View>
          </View>

          <View style={[styles.paddingTopBtn20, styles.borderBottomLine]}>
            <Text style={styles.fieldTitle}>{t('serviceType.title')}</Text>
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
        </View>

        <View style={styles.bottom}>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={[styles.bottomActionButton, styles.actionButton]}>
              {isEdit ? t('action.update') : t('action.save')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.handleTestPrint(ipAddress) }}>
            <Text style={[styles.bottomActionButton, styles.actionButton]}>
              {t('testPrint')}
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

PrinterForm = reduxForm({
  form: 'printerForm'
})(PrinterForm)

/**
 * Reference: https://redux-form.com/8.3.0/examples/selectingformvalues/
 */
const selector = formValueSelector('printerForm')
PrinterForm = connect(state => {
  const ipAddress = selector(state, 'ipAddress')

  return {
    ipAddress
  }
})(PrinterForm);

export default PrinterForm

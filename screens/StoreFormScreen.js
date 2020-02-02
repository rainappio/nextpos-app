import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { ScrollView, Text, TouchableOpacity, View} from 'react-native'
import { fieldValidate, isRequired } from '../validators'
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import styles from '../styles'
import RNSwitch from '../components/RNSwitch'
import { LocaleContext } from '../locales/LocaleContext'

class StoreFormScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        clientName: 'Client Name',
        clientEmail: 'Client Email',
        clientStatus: 'Status',
        address: 'Address',
        ubn: 'UBN',
        taxInclusive: 'Tax Inclusive',
        serviceCharge: 'Service Charge'
      },
      zh: {
        clientName: '商家名稱',
        clientEmail: '用戶 Email',
        clientStatus: '狀態',
        address: '商家地址',
        ubn: '統一編號',
        taxInclusive: '價格已含稅',
        serviceCharge: '服務費'
      }
    })
  }

  render() {
    const { t } = this.context
    const { handleSubmit } = this.props

    return (
      <ScrollView
        scrollIndicatorInsets={{ right: 1 }}
        contentContainerStyle={styles.contentContainer}
      >
        <DismissKeyboard>
          <View style={styles.container_nocenterCnt}>
            <View>
              <View>
                <BackBtn />
                <View>
                  <Text style={styles.screenTitle}>{t('settings.stores')}</Text>
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fieldTitle}>{t('clientStatus')}</Text>
                </View>
                <View style={{ flex: 3 }}>
                  <Field
                    name="status"
                    component={InputText}
                    placeholder="User Email Address"
                    editable={false}
                  />
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fieldTitle}>{t('clientEmail')}</Text>
                </View>
                <View style={{ flex: 3 }}>
                  <Field
                    name="username"
                    component={InputText}
                    placeholder="User Email Address"
                    editable={false}
                  />
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fieldTitle}>{t('clientName')}</Text>
                </View>
                <View style={{ flex: 3 }}>
                  <Field
                    name="clientName"
                    component={InputText}
                    validate={isRequired}
                    placeholder="Client Name"
                  />
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fieldTitle}>{t('address')}</Text>
                </View>
                <View style={{ flex: 3 }}>
                  <Field
                    name="attributes.address"
                    component={InputText}
                    placeholder="Address"
                  />
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fieldTitle}>{t('ubn')}</Text>
                </View>
                <View style={{ flex: 3 }}>
                  <Field
                    name="attributes.UBN"
                    component={InputText}
                    placeholder="UBN"
                  />
                </View>
              </View>

              <View style={[styles.fieldContainer]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fieldTitle}>{t('serviceCharge')}</Text>
                </View>
                <View style={{ flex: 2 }}>
                  <Field
                    name="clientSettings.SERVICE_CHARGE.value"
                    component={InputText}
                    placeholder={t('serviceCharge')}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
                  <Field
                    name="clientSettings.SERVICE_CHARGE.enabled"
                    component={RNSwitch}
                  />
                </View>
              </View>

              <View
                style={[
                  { justifyContent: 'space-between' },
                  styles.fieldContainer
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.fieldTitle}>{t('taxInclusive')}</Text>
                </View>
                <View style={{ flex: 3, flexDirection: 'row-reverse' }}>
                  <Field
                    name="clientSettings.TAX_INCLUSIVE.enabled"
                    component={RNSwitch}
                  />
                </View>
              </View>
            </View>

            <View style={styles.bottom}>
              <TouchableOpacity onPress={handleSubmit}>
                <Text style={[styles.bottomActionButton, styles.actionButton]}>
                  {t('action.save')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Text style={[styles.bottomActionButton, styles.cancelButton]}>
                  {t('action.cancel')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </DismissKeyboard>
      </ScrollView>
    )
  }
}

StoreFormScreen = reduxForm({
  form: 'storeForm'
})(StoreFormScreen)

export default StoreFormScreen

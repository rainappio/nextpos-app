import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {KeyboardAvoidingView, ScrollView, Text, TouchableOpacity, View} from 'react-native'
import {fieldValidate, isPercentage, isRequired} from '../validators'
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import styles from '../styles'
import RNSwitch from '../components/RNSwitch'
import { LocaleContext } from '../locales/LocaleContext'
import SegmentedControl from "../components/SegmentedControl";
import ScreenHeader from "../components/ScreenHeader";

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
        serviceCharge: 'Service Charge %',
        tableAvailabilityDisplayTitle: 'Table Availability Display',
        tableAvailabilityDisplay: {
          showSeat: 'Vacant Seat',
          showTable: 'Vacant Table'
        },
        inEffectRule: 'These settings will take effect on future orders'
      },
      zh: {
        clientName: '商家名稱',
        clientEmail: '用戶 Email',
        clientStatus: '狀態',
        address: '商家地址',
        ubn: '統一編號',
        taxInclusive: '價格已含稅',
        serviceCharge: '服務費(％)',
        tableAvailabilityDisplayTitle: '座位顯示方式',
        tableAvailabilityDisplay: {
          showSeat: '座位數',
          showTable: '桌數'
        },
        inEffectRule: '以下設定的更改將套用在未來訂單'
      }
    })

    this.state = {
      selectedTableDisplayType: null,
      tableDisplayTypes: {
        0: {label: context.t('tableAvailabilityDisplay.showSeat'), value: 'SHOW_SEAT'},
        1: {label: context.t('tableAvailabilityDisplay.showTable'), value: 'SHOW_TABLE'}
      }
    }
  }

  componentDidMount() {
    const client = this.props.initialValues

    if (client.attributes !== undefined) {
      switch (client.attributes.tableAvailabilityDisplay) {
        case 'SHOW_SEAT':
          this.handleTableDisplaySelection(0)
          break
        case 'SHOW_TABLE':
          this.handleTableDisplaySelection(1)
          break
      }
    }
  }

  handleTableDisplaySelection = (index) => {
    const selectedIndex = this.selectedTableDisplayType === index ? null : index
    this.setState({ selectedTableDisplayType: selectedIndex })
  }

  render() {
    const { t } = this.context
    const { handleSubmit } = this.props

    const tableDisplayTypes = Object.keys(this.state.tableDisplayTypes).map(key => this.state.tableDisplayTypes[key].label)

    return (
      <KeyboardAvoidingView style={styles.mainContainer} behavior="padding" enabled>
        <ScrollView scrollIndicatorInsets={{right: 1}}>
          <DismissKeyboard>
            <View style={styles.container}>
              <View>
                <ScreenHeader title={t('settings.stores')}/>

                <View style={styles.fieldContainer}>
                  <View style={[styles.tableCellView, {flex: 2}]}>
                    <Text style={styles.fieldTitle}>{t('clientStatus')}</Text>
                  </View>
                  <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                    <Field
                      name="status"
                      component={InputText}
                      placeholder="User Email Address"
                      editable={false}
                    />
                  </View>
                </View>

                <View style={styles.fieldContainer}>
                  <View style={{flex: 2}}>
                    <Text style={styles.fieldTitle}>{t('clientEmail')}</Text>
                  </View>
                  <View style={{flex: 3}}>
                    <Field
                      name="username"
                      component={InputText}
                      placeholder="User Email Address"
                      editable={false}
                    />
                  </View>
                </View>

                <View style={styles.fieldContainer}>
                  <View style={{flex: 2}}>
                    <Text style={styles.fieldTitle}>{t('clientName')}</Text>
                  </View>
                  <View style={{flex: 3}}>
                    <Field
                      name="clientName"
                      component={InputText}
                      validate={isRequired}
                      placeholder={t('clientName')}
                    />
                  </View>
                </View>

                <View style={styles.fieldContainer}>
                  <View style={{flex: 2}}>
                    <Text style={styles.fieldTitle}>{t('address')}</Text>
                  </View>
                  <View style={{flex: 3}}>
                    <Field
                      name="attributes.address"
                      component={InputText}
                      placeholder={t('address')}
                    />
                  </View>
                </View>

                <View style={styles.fieldContainer}>
                  <View style={{flex: 2}}>
                    <Text style={styles.fieldTitle}>{t('ubn')}</Text>
                  </View>
                  <View style={{flex: 3}}>
                    <Field
                      name="attributes.UBN"
                      component={InputText}
                      placeholder={t('ubn')}
                    />
                  </View>
                </View>

                <View style={styles.sectionTitleContainer}>
                  <Text style={styles.sectionTitleText}>
                    {t('inEffectRule')}
                  </Text>
                </View>
                <View style={[styles.fieldContainer]}>
                  <View style={{flex: 2}}>
                    <Text style={styles.fieldTitle}>{t('serviceCharge')}</Text>
                  </View>
                  <View style={{flex: 3}}>
                    <Field
                      name="clientSettings.SERVICE_CHARGE.value"
                      component={InputText}
                      placeholder={t('serviceCharge')}
                      keyboardType="numeric"
                      validate={isPercentage}
                      format={(value, name) => {
                        return value !== undefined && value !== null ? String(value * 100) : ''
                      }}
                      normalize={(value) => {
                        return value / 100
                      }}
                    />
                  </View>
                  <View style={{flex: 1, flexDirection: 'row-reverse'}}>
                    <Field
                      name="clientSettings.SERVICE_CHARGE.enabled"
                      component={RNSwitch}
                    />
                  </View>
                </View>

                <View
                  style={[
                    {justifyContent: 'space-between'},
                    styles.fieldContainer
                  ]}
                >
                  <View style={{flex: 2}}>
                    <Text style={styles.fieldTitle}>{t('taxInclusive')}</Text>
                  </View>
                  <View style={{flex: 3, flexDirection: 'row-reverse'}}>
                    <Field
                      name="clientSettings.TAX_INCLUSIVE.enabled"
                      component={RNSwitch}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <View style={{flex: 2}}>
                  <Text style={styles.fieldTitle}>{t('tableAvailabilityDisplayTitle')}</Text>
                </View>
                <View style={{flex: 3}}>
                  <Field
                    name="attributes.tableAvailabilityDisplay"
                    component={SegmentedControl}
                    selectedIndex={this.state.selectedTableDisplayType}
                    onChange={this.handleTableDisplaySelection}
                    values={tableDisplayTypes}
                    normalize={value => {
                      return this.state.tableDisplayTypes[value].value
                    }}
                  />
                </View>
              </View>

              <View style={[styles.bottom, {marginTop: 30}]}>
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
      </KeyboardAvoidingView>
    )
  }
}

StoreFormScreen = reduxForm({
  form: 'storeForm'
})(StoreFormScreen)

export default StoreFormScreen

import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {ScrollView, Text, TouchableOpacity, View} from 'react-native'
import {isPercentage, isRequired} from '../validators'
import InputText from '../components/InputText'
import styles from '../styles'
import RNSwitch from '../components/RNSwitch'
import {LocaleContext} from '../locales/LocaleContext'
import SegmentedControl from "../components/SegmentedControl";
import ScreenHeader from "../components/ScreenHeader";
import moment from "moment-timezone";
import DropDown from "../components/DropDown";
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";
import {StyledText} from "../components/StyledText";
import ThemeToggleButton from "../themes/ThemeToggleButton";

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
        companyName: 'Company Name',
        companyNameHint: 'e.g. Legal entity name',
        address: 'Address',
        ubn: 'UBN',
        taxInclusive: 'Tax Inclusive',
        serviceCharge: 'Service Charge %',
        tableAvailabilityDisplayTitle: 'Table Availability Display',
        orderAvailabilityDisplayTitle: 'Order Display Mode',
        tableAvailabilityDisplay: {
          showSeat: 'Vacant Seat',
          showTable: 'Vacant Table'
        },
        orderDisplayMode: {
          LINE_ITEM: 'Line Item',
          ORDER: 'Order'
        },
        invoiceData: 'Required by Electronic Invoice',
        inEffectRule: 'These settings will take effect on future orders',
        locationData: 'Location',
        country: 'Country',
        timezone: 'Timezone',
        featureToggle: 'Features',
        locationBasedService: 'Location Based Clock In',
        applyOffer: 'Apply Offer',
        uiPreferences: 'UI Preferences',
      },
      zh: {
        clientName: '商家名稱',
        clientEmail: '用戶 Email',
        clientStatus: '狀態',
        companyName: '公司名稱',
        companyNameHint: '註冊公司名稱',
        address: '商家地址',
        ubn: '統一編號',
        taxInclusive: '價格已含稅',
        serviceCharge: '服務費(％)',
        tableAvailabilityDisplayTitle: '座位顯示方式',
        orderAvailabilityDisplayTitle: '即時訂單顯示方式',
        tableAvailabilityDisplay: {
          showSeat: '座位數',
          showTable: '桌數'
        },
        orderDisplayMode: {
          LINE_ITEM: '品項',
          ORDER: '訂單'
        },
        invoiceData: '電子發票必填',
        inEffectRule: '以下設定的更改將套用在未來訂單',
        locationData: '位置資訊',
        country: '國家',
        timezone: '時區',
        featureToggle: '進階功能',
        locationBasedService: '位置打卡功能',
        applyOffer: '套用促銷',
        uiPreferences: '介面喜好',
      }
    })

    this.state = {
      selectedTableDisplayType: null,
      tableDisplayTypes: {
        0: {label: context.t('tableAvailabilityDisplay.showSeat'), value: 'SHOW_SEAT'},
        1: {label: context.t('tableAvailabilityDisplay.showTable'), value: 'SHOW_TABLE'}
      },
      selectedOrderDisplayType: this.props?.initialValues?.attributes?.ORDER_DISPLAY_MODE === 'ORDER' ? 1 : 0,
      orderDisplayTypes: {
        0: {label: context.t('orderDisplayMode.LINE_ITEM'), value: 'LINE_ITEM'},
        1: {label: context.t('orderDisplayMode.ORDER'), value: 'ORDER'}
      },
    }
  }

  componentDidMount() {
    const client = this.props.initialValues

    if (client.attributes !== undefined) {
      switch (client.attributes.TABLE_AVAILABILITY_DISPLAY) {
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
    this.setState({selectedTableDisplayType: selectedIndex})
  }
  handleOrderDisplaySelection = (index) => {
    this.setState({selectedOrderDisplayType: index})
  }

  render() {
    const {t} = this.context
    const {handleSubmit} = this.props

    const tableDisplayTypes = Object.keys(this.state.tableDisplayTypes).map(key => this.state.tableDisplayTypes[key].label)
    const orderDisplayTypes = Object.keys(this.state.orderDisplayTypes).map(key => this.state.orderDisplayTypes[key].label)

    const timezones = moment.tz.names().filter(tz => {
      return tz.includes('Asia/Taipei') || tz.includes('Australia/Brisbane')
    }).map(tz => {
      return {label: tz, value: tz}
    })

    return (
      <ThemeKeyboardAwareScrollView>
        <ScrollView scrollIndicatorInsets={{right: 1}}>
          <View style={styles.container}>
            <View>
              <ScreenHeader title={t('settings.stores')} />

              <View style={styles.fieldContainer}>
                <View style={[styles.tableCellView, {flex: 2}]}>
                  <StyledText style={styles.fieldTitle}>{t('clientStatus')}</StyledText>
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
                  <StyledText style={styles.fieldTitle}>{t('clientEmail')}</StyledText>
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
                  <StyledText style={styles.fieldTitle}>{t('clientName')}</StyledText>
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

              <View style={styles.sectionTitleContainer}>
                <StyledText style={styles.sectionTitleText}>
                  {t('invoiceData')}
                </StyledText>
              </View>

              <View style={styles.fieldContainer}>
                <View style={{flex: 2}}>
                  <StyledText style={styles.fieldTitle}>{t('companyName')}</StyledText>
                </View>
                <View style={{flex: 3}}>
                  <Field
                    name="attributes.COMPANY_NAME"
                    component={InputText}
                    placeholder={t('companyNameHint')}
                  />
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <View style={{flex: 2}}>
                  <StyledText style={styles.fieldTitle}>{t('address')}</StyledText>
                </View>
                <View style={{flex: 3}}>
                  <Field
                    name="attributes.ADDRESS"
                    component={InputText}
                    placeholder={t('address')}
                  />
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <View style={{flex: 2}}>
                  <StyledText style={styles.fieldTitle}>{t('ubn')}</StyledText>
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
                <StyledText style={styles.sectionTitleText}>
                  {t('inEffectRule')}
                </StyledText>
              </View>
              <View style={[styles.fieldContainer]}>
                <View style={{flex: 2}}>
                  <StyledText style={styles.fieldTitle}>{t('serviceCharge')}</StyledText>
                </View>
                <View style={{flex: 2}}>
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
                  <StyledText style={styles.fieldTitle}>{t('taxInclusive')}</StyledText>
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
                <StyledText style={styles.fieldTitle}>{t('tableAvailabilityDisplayTitle')}</StyledText>
              </View>
              <View style={{flex: 3}}>
                <Field
                  name="attributes.TABLE_AVAILABILITY_DISPLAY"
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

            <View style={styles.fieldContainer}>
              <View style={{flex: 2}}>
                <StyledText style={styles.fieldTitle}>{t('orderAvailabilityDisplayTitle')}</StyledText>
              </View>
              <View style={{flex: 3}}>
                <Field
                  name="attributes.ORDER_DISPLAY_MODE"
                  component={SegmentedControl}
                  selectedIndex={this.state.selectedOrderDisplayType}
                  onChange={this.handleOrderDisplaySelection}
                  values={orderDisplayTypes}
                  normalize={value => {
                    return this.state.orderDisplayTypes[value].value
                  }}
                />
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.sectionTitleContainer}>
                <StyledText style={styles.sectionTitleText}>{t('locationData')}</StyledText>
              </View>

              <View style={styles.fieldContainer}>
                <View style={[styles.tableCellView, styles.flex(1)]}>
                  <StyledText style={styles.fieldTitle}>{t('timezone')}</StyledText>
                </View>
                <View style={[styles.justifyRight]}>
                  <Field
                    name="timezone"
                    component={DropDown}
                    options={timezones}
                  />
                </View>
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.sectionTitleContainer}>
                <StyledText style={styles.sectionTitleText}>{t('featureToggle')}</StyledText>
              </View>

              <View style={styles.fieldContainer}>
                <View style={{flex: 1}}>
                  <StyledText style={styles.fieldTitle}>{t('locationBasedService')}</StyledText>
                </View>
                <View style={[styles.alignRight]}>
                  <Field
                    name="clientSettings.LOCATION_BASED_SERVICE.enabled"
                    component={RNSwitch}
                  />
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <View style={{flex: 1}}>
                  <StyledText style={styles.fieldTitle}>{t('applyOffer')}</StyledText>
                </View>
                <View style={[styles.alignRight]}>
                  <Field
                    name="clientSettings.APPLY_CUSTOM_OFFER.enabled"
                    component={RNSwitch}
                  />
                </View>
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.sectionTitleContainer}>
                <StyledText style={styles.sectionTitleText}>{t('uiPreferences')}</StyledText>
              </View>
              <View style={styles.fieldContainer}>
                <ThemeToggleButton />
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
        </ScrollView>
      </ThemeKeyboardAwareScrollView>
    )
  }
}

StoreFormScreen = reduxForm({
  form: 'storeForm'
})(StoreFormScreen)

export default StoreFormScreen

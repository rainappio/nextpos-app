import React, {Component} from 'react'
import {Field, reduxForm, getFormMeta} from 'redux-form'
import {ScrollView, Text, TouchableOpacity, View, Alert} from 'react-native'
import {isPercentage, isRequired, isPositiveInteger} from '../validators'
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
import {connect} from 'react-redux';
import RNSwitchPayGroup from "../components/RNSwitchPayGroup"
import Icon from 'react-native-vector-icons/Ionicons'
import * as Device from 'expo-device';


class StoreFormScreen extends Component {
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
        notificationEmail: 'Notification Email',
        companyName: 'Company Name',
        companyNameHint: 'e.g. Legal entity name',
        address: 'Address',
        phoneNumber: 'Phone Number',
        ubn: 'UBN',
        taxInclusive: 'Tax Inclusive',
        serviceCharge: 'Service Charge %',
        timeLimit: 'Time Limit in Min',
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
        locationBasedService: 'Location Based Time Card',
        reservationNotification: 'Reservation Notification',
        applyOffer: 'Apply Offer',
        uiPreferences: 'UI Preferences',
        paymentMethods: 'Payment Methods',
        timeCardDeviceSetting: {
          title: 'Time Card Device',
          noSet: 'No Set Device',
          reset: 'Reset Device',
          resetMsg: 'Reset time card Device info?',
          newSet: 'Set New Device',
          setMsg: 'Set current device as time card device?',

        },
      },
      zh: {
        clientName: '商家名稱',
        clientEmail: '用戶 Email',
        clientStatus: '狀態',
        notificationEmail: '寄送通知Email',
        companyName: '公司名稱',
        companyNameHint: '註冊公司名稱',
        address: '商家地址',
        phoneNumber: '聯絡電話',
        ubn: '統一編號',
        taxInclusive: '價格已含稅',
        serviceCharge: '服務費(％)',
        timeLimit: '時間限制(分)',
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
        reservationNotification: '訂位推播通知',
        applyOffer: '套用促銷',
        uiPreferences: '介面喜好',
        paymentMethods: '付款方式',
        timeCardDeviceSetting: {
          title: '打卡機',
          noSet: '目前未設定打卡機',
          reset: '重置打卡機',
          resetMsg: '是否重置現在設定的打卡機？',
          newSet: '設定新打卡機',
          setMsg: '將本裝置設為打卡機?',
        },
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
      timeCardDevice: this.props?.initialValues?.attributes?.TIME_CARD_DEVICE ?? null
    }
  }

  componentDidMount() {
    const client = this.props.initialValues

    console.log("client data : ", client)

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

  handleSetTimeCardDevice = () => {
    Alert.alert(
      `${this.props?.alertTitle ?? this.context.t('timeCardDeviceSetting.newSet')}`,
      `${this.props?.alertMessage ?? this.context.t('timeCardDeviceSetting.setMsg')}`,
      [
        {
          text: `${this.context.t('action.yes')}`,
          onPress: () => {
            this.props.change(`attributes.TIME_CARD_DEVICE`, Device.deviceName)
            this.setState({timeCardDevice: Device.deviceName})
          }
        },
        {
          text: `${this.context.t('action.no')}`,
          onPress: () => console.log('Cancelled'),
          style: 'cancel'
        }
      ]
    )
  }
  handleResetTimeCardDevice = () => {
    Alert.alert(
      `${this.props?.alertTitle ?? this.context.t('timeCardDeviceSetting.reset')}`,
      `${this.props?.alertMessage ?? this.context.t('timeCardDeviceSetting.resetMsg')}`,
      [
        {
          text: `${this.context.t('action.yes')}`,
          onPress: () => {
            this.props.change(`attributes.TIME_CARD_DEVICE`, null)
            this.setState({timeCardDevice: null})
          }
        },
        {
          text: `${this.context.t('action.no')}`,
          onPress: () => console.log('Cancelled'),
          style: 'cancel'
        }
      ]
    )
  }

  render() {
    const {isTablet, t, customMainThemeColor, changeCustomMainThemeColor, theme, toggleTheme} = this.context
    const {handleSubmit, paymentMethods, deviceInfo} = this.props

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
          <View style={[styles.container, isTablet && styles.horizontalPaddingScreen]}>
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
              <View style={styles.fieldContainer}>
                <View style={{flex: 2}}>
                  <StyledText style={styles.fieldTitle}>{t('notificationEmail')}</StyledText>
                </View>
                <View style={{flex: 3}}>
                  <Field
                    name="attributes.NOTIFICATION_EMAIL"
                    component={InputText}
                    placeholder={t('notificationEmail')}
                  />
                </View>
              </View>

              <View style={[styles.sectionTitleContainer, styles.mgrtotop20]}>
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
                  <StyledText style={styles.fieldTitle}>{t('phoneNumber')}</StyledText>
                </View>
                <View style={{flex: 3}}>
                  <Field
                    name="attributes.PHONE_NUMBER"
                    component={InputText}
                    placeholder={t('phoneNumber')}
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

              <View style={[styles.sectionTitleContainer, styles.mgrtotop20]}>
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
                    format={(value, name) => {
                      return (value !== undefined && value !== null) ? String(value * 100) : String(0.1 * 100)
                    }}
                    normalize={(newValue, prevValue) => {
                      if (isNaN(newValue)) {newValue = prevValue}
                      return (newValue / 100)
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

              <View style={[styles.fieldContainer]}>
                <View style={{flex: 2}}>
                  <StyledText style={styles.fieldTitle}>{t('timeLimit')}</StyledText>
                </View>
                <View style={{flex: 2}}>
                  <Field
                    name="clientSettings.TABLE_TIME_LIMIT.value"
                    component={InputText}
                    placeholder={t('timeLimit')}
                    keyboardType="numeric"
                    validate={this.props.initialValues?.clientSettings?.TABLE_TIME_LIMIT ? isPositiveInteger : null}
                    format={(value, name) => {
                      return value !== undefined && value !== null ? String(value) : '120'
                    }}
                  />
                </View>
                <View style={{flex: 1, flexDirection: 'row-reverse'}}>
                  <Field
                    name="clientSettings.TABLE_TIME_LIMIT.enabled"
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
                <StyledText style={styles.sectionTitleText}>{t('paymentMethods')}</StyledText>
              </View>
              <View style={{flex: 1}}>
                {!!paymentMethods &&
                  <Field
                    name="paymentMethods"
                    component={RNSwitchPayGroup}
                    customarr={paymentMethods?.results}
                  />
                }
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
              <View style={[styles.fieldContainer, {marginTop: 8}]}>
                <View style={{flex: 2}}>
                  <StyledText style={styles.fieldTitle}>{t('timeCardDeviceSetting.title')}</StyledText>
                </View>
                <View style={isTablet ? {flex: 2.7} : {flex: 2.2}}>
                  <Field
                    name="attributes.TIME_CARD_DEVICE"
                    component={InputText}
                    placeholder={this.state.timeCardDevice ?? t('timeCardDeviceSetting.noSet')}
                    editable={false}
                  />
                </View>
                <View style={[isTablet ? {flex: 0.3} : {flex: 0.8}, {flexDirection: 'row-reverse'}]}>
                  <TouchableOpacity
                    onPress={() => {
                      this.handleSetTimeCardDevice()
                    }}>
                    <StyledText>
                      <Icon name={this.state.timeCardDevice ? "md-create" : 'add'} size={24} color={customMainThemeColor} />
                    </StyledText>
                  </TouchableOpacity>
                  {this.state.timeCardDevice && <TouchableOpacity
                    style={{marginRight: 8}}
                    onPress={() => {
                      this.handleResetTimeCardDevice()
                    }}>
                    <StyledText>
                      <Icon name="md-trash-sharp" size={24} color={customMainThemeColor} />
                    </StyledText>
                  </TouchableOpacity>}
                </View>
              </View>


              <View style={styles.fieldContainer}>
                <View style={{flex: 1}}>
                  <StyledText style={styles.fieldTitle}>{t('reservationNotification')}</StyledText>
                </View>
                <View style={[styles.alignRight]}>
                  <Field
                    name="clientSettings.PUSH_NOTIFICATION.enabled"
                    component={RNSwitch}
                  />
                </View>
              </View>

            </View>

            <View style={[styles.bottom, {marginTop: 30}]}>
              <TouchableOpacity onPress={handleSubmit}>
                <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                  {t('action.save')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>
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


const mapStateToProps = (state) => {
  return {
    formMeta: getFormMeta('storeForm')(state)
  };
};

StoreFormScreen = reduxForm({
  form: 'storeForm',
})(
  connect(mapStateToProps)(StoreFormScreen)
)


export default (StoreFormScreen);

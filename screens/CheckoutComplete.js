import React from 'react'
import {connect} from 'react-redux'
import {Text, TouchableOpacity, View} from 'react-native'
import {formatCurrency, getPrinters, getWorkingAreas} from '../actions'
import {api, dispatchFetchRequestWithOption, successMessage, warningMessage, dispatchFetchRequest} from '../constants/Backend'
import styles, {mainThemeColor} from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import Icon from "react-native-vector-icons/Ionicons";
import {ThemeContainer} from "../components/ThemeContainer";
import {StyledText} from "../components/StyledText";
import {testPrinter} from "../helpers/printerActions";


class CheckoutComplete extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        checkoutCompletedTitle: 'Checkout Completed',
        totalAmount: 'Total Amount',
        serviceCharge: 'Service Charge',
        change: 'Change',
        backToTables: 'Back to Tables',
        completeOrder: 'Complete Order',
        printInvoiceXML: 'Print invoice again',
        printReceiptXML: 'Print receipt details again',
        printerSuccess: 'Print Success',
        printerWarning: 'Print Failure',
        invoiceWarning: 'Invoice has not been set',
        noPrinterWarning: 'Printer has not been set'
      },
      zh: {
        checkoutCompletedTitle: '結帳完成',
        totalAmount: '總金額',
        serviceCharge: '服務費',
        change: '找錢',
        backToTables: '回到桌位頁面',
        completeOrder: '結束訂單',
        printInvoiceXML: '重印電子發票',
        printReceiptXML: '重印明細',
        printerSuccess: '列印成功',
        printerWarning: '列印失敗',
        invoiceWarning: '尚未設定電子發票',
        noPrinterWarning: '尚未設定出單機'
      }
    })
    this.state = {
      invoiceXML: null,
      receiptXML: null,
      printer: null,
      isPrintFirst: false,
    }

  }

  componentDidMount() {
    this.getXML(this.props.navigation.state.params?.transactionResponse?.transactionId)
    this.getOnePrinter()
    this.props.getWorkingAreas()
  }

  componentDidUpdate(prevProps, prevState) {

    if (!this.state.isPrintFirst && !!this.state.printer && (!!this.state.invoiceXML || !!this.state.receiptXML)) {
      this.setState({isPrintFirst: true})
      if (!!this.state?.invoiceXML)
        this.handleTestPrint(this.state?.invoiceXML, this.state.printer.ipAddress)
      else
        warningMessage(this.context.t('invoiceWarning'))
      this.handleTestPrint(this.state?.receiptXML, this.state.printer.ipAddress)
    }
  }

  getOnePrinter = () => {
    dispatchFetchRequest(
      api.printer.getOnePrinter,
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          this.setState({printer: data})
        })
      },
      response => {
        console.warn('getOnePrinter ERROR')
      }
    ).then()


  }

  getXML = (transactionId) => {
    dispatchFetchRequestWithOption(api.payment.getTransaction(transactionId), {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }, {
      defaultMessage: false
    }, response => {
      response.json().then(data => {

        this.setState({receiptXML: data?.receiptXML, invoiceXML: data?.invoiceXML})
      })
    }).then()
  }

  handleTestPrint = (xml, ipAddress) => {
    testPrinter(xml, ipAddress, () => {
      successMessage(this.context.t('printerSuccess'))

    }, () => {
      warningMessage(this.context.t('printerWarning'))
    }
    )
  }

  render() {
    const {
      printers = [],
      workingareas = [],

    } = this.props
    const {t} = this.context
    const {transactionResponse} = this.props.navigation.state.params
    if (this.context.isTablet) {
      return (
        <ThemeContainer>
          <View style={[styles.container]}>
            <ScreenHeader backNavigation={false}
              title={t('checkoutCompletedTitle')} />

            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            >
              <Icon
                name='md-checkmark-circle-outline'
                size={42}
                style={styles.buttonIconStyle}
              />
              <StyledText style={styles.messageBlock}>
                {t('totalAmount')}: {formatCurrency(transactionResponse.settleAmount)}
              </StyledText>
              {transactionResponse.paymentMethod === 'CASH' && (
                <StyledText style={styles.messageBlock}>
                  {t('change')}: {formatCurrency(transactionResponse.paymentDetails.values['CASH_CHANGE'])}
                </StyledText>
              )}

            </View>

            <View style={{
              flex: 1,
              paddingHorizontal: '30%',
              alignContent: 'flex-end',
              marginTop: 10,
              marginBottom: 10,
              flexDirection: 'row',
              flexWrap: 'wrap'
            }}>
              <View style={{width: '50%', padding: '3%', height: '50%', alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity
                  onPress={() => {
                    if (!!this.state.printer) {
                      if (!!this.state?.invoiceXML)
                        this.handleTestPrint(this.state?.invoiceXML, this.state.printer.ipAddress)
                      else
                        warningMessage(t('invoiceWarning'))
                    }

                    else
                      warningMessage(t('noPrinterWarning'))
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                    backgroundColor: mainThemeColor,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    padding: 10,
                    marginBottom: 10,
                    overflow: 'hidden',
                    color: '#fff'
                  }}>
                    {t('printInvoiceXML')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{width: '50%', padding: '3%', height: '50%', alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity
                  onPress={() => {
                    if (!!this.state.printer)
                      this.handleTestPrint(this.state?.receiptXML, this.state.printer.ipAddress)
                    else
                      warningMessage(t('noPrinterWarning'))
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                    backgroundColor: mainThemeColor,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    padding: 10,
                    marginBottom: 10,
                    overflow: 'hidden',
                    color: '#fff'
                  }}>
                    {t('printReceiptXML')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{width: '50%', padding: '3%', height: '50%', alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('TablesSrc')
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                    backgroundColor: mainThemeColor,
                    borderRadius: 10,
                  }}
                >
                  <Text style={[styles.bottomActionButton, styles.actionButton]}>
                    {t('backToTables')}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{width: '50%', padding: '3%', height: '50%', alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.state.params.onSubmit(
                      transactionResponse.orderId
                    )
                  }
                  style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderColor: mainThemeColor,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    padding: 10,
                    marginBottom: 10,
                    overflow: 'hidden',
                    color: mainThemeColor
                  }}>{t('completeOrder')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ThemeContainer>
      )
    }
    else {
      return (
        <ThemeContainer>
          <View style={[styles.container]}>
            <ScreenHeader backNavigation={false}
              title={t('checkoutCompletedTitle')} />

            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            >
              <Icon
                name='md-checkmark-circle-outline'
                size={42}
                style={styles.buttonIconStyle}
              />
              <StyledText style={styles.messageBlock}>
                {t('totalAmount')}: {formatCurrency(transactionResponse.settleAmount)}
              </StyledText>
              {transactionResponse.paymentMethod === 'CASH' && (
                <StyledText style={styles.messageBlock}>
                  {t('change')}: {formatCurrency(transactionResponse.paymentDetails.values['CASH_CHANGE'])}
                </StyledText>
              )}

            </View>

            <View style={styles.bottom}>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    if (printers.length > 0)
                      this.handleTestPrint(this.state?.invoiceXML, this.state.printer.ipAddress)
                    else
                      console.warn('no printer')
                  }}
                >
                  <Text style={[styles.bottomActionButton, styles.actionButton]}>
                    {t('printInvoiceXML')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    if (printers.length > 0)
                      this.handleTestPrint(this.state?.receiptXML, this.state.printer.ipAddress)
                    else
                      console.warn('no printer')
                  }}
                >
                  <Text style={[styles.bottomActionButton, styles.actionButton]}>
                    {t('printReceiptXML')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('TablesSrc')
                  }}
                >
                  <Text style={[styles.bottomActionButton, styles.actionButton]}>
                    {t('backToTables')}
                  </Text>
                </TouchableOpacity>
              </View>

              <View>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.state.params.onSubmit(
                      transactionResponse.orderId
                    )
                  }
                >
                  <Text style={[styles.bottomActionButton, styles.secondActionButton]}>{t('completeOrder')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ThemeContainer>
      )
    }

  }
}

const mapStateToProps = state => ({
  printers: state.printers.data.printers,
  workingareas: state.workingareas.data.workingAreas,
})
const mapDispatchToProps = (dispatch, props) => ({
  clearOrder: () => dispatch(clearOrder(props.order.orderId)),
  getPrinters: () => dispatch(getPrinters()),
  getWorkingAreas: () => dispatch(getWorkingAreas())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckoutComplete)

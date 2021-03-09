import React from 'react'
import {connect} from 'react-redux'
import {Text, TouchableOpacity, View} from 'react-native'
import {formatCurrency, getPrinters, getWorkingAreas} from '../actions'
import {api, dispatchFetchRequestWithOption, successMessage, warningMessage, dispatchFetchRequest} from '../constants/Backend'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import Icon from "react-native-vector-icons/Ionicons";
import {ThemeContainer} from "../components/ThemeContainer";
import {StyledText} from "../components/StyledText";
import {printMessage} from "../helpers/printerActions";
import {handleDelete} from "../helpers/orderActions";


class RetailCheckoutComplete extends React.Component {
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
                printInvoiceXML: 'Print invoice again',
                printReceiptXML: 'Print receipt details again',
                printerSuccess: 'Print succeeded',
                printerWarning: 'Print failed',
                invoiceWarning: 'Invoice has not been set',
                eInvoiceCheckout: 'E-invoice',
                orderReceipt: 'Order Receipt',
                continueSplitBill: 'Proceed to split bill'
            },
            zh: {
                checkoutCompletedTitle: '結帳完成',
                totalAmount: '總金額',
                serviceCharge: '服務費',
                change: '找錢',
                backToTables: '回到桌位頁面',
                printInvoiceXML: '重印電子發票',
                printReceiptXML: '重印明細',
                printerSuccess: '列印成功',
                printerWarning: '列印失敗',
                invoiceWarning: '尚未設定電子發票',
                eInvoiceCheckout: '電子發票',
                orderReceipt: '訂單明細',
                continueSplitBill: '繼續拆帳'
            }
        })
        this.state = {
            invoiceXML: null,
            receiptXML: null,
            printer: null,
            isPrintFirst: false,
            isInvoicePrint: false,
            isReceiptPrint: false,
        }

    }

    componentDidMount() {
        this.getXML(this.props.navigation.state.params?.transactionResponse?.transactionId)
        this.getOnePrinter()
        this.props.getWorkingAreas()
        this.context?.saveSplitOrderId(null)

    }

    // If dev , commet this function
    componentDidUpdate(prevProps, prevState) {

        if (!this.state.isPrintFirst && !!this.state.printer && (!!this.state.invoiceXML || !!this.state.receiptXML)) {
            this.setState({isPrintFirst: true})
            if (!!this.state?.invoiceXML)
                this.handlePrint(this.state?.invoiceXML, this.state.printer.ipAddress, true)
            this.handlePrint(this.state?.receiptXML, this.state.printer.ipAddress, false)
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

    handlePrint = (xml, ipAddress, isInvoice) => {
        if (isInvoice) {
            printMessage(xml, ipAddress, () => {
                this.setState({isInvoicePrint: true})

            }, () => {
                this.setState({isInvoicePrint: false})
            }
            )
        }
        else {
            printMessage(xml, ipAddress, () => {
                this.setState({isReceiptPrint: true})

            }, () => {
                this.setState({isReceiptPrint: false})
            }
            )
        }
    }

    render() {
        const {
            printers = [],
            workingareas = [],

        } = this.props
        const {t, customMainThemeColor} = this.context
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
                                style={styles?.buttonIconStyle(customMainThemeColor)}
                            />
                            <StyledText style={styles.messageBlock}>
                                {t('totalAmount')}: {formatCurrency(transactionResponse.settleAmount)}
                            </StyledText>
                            {transactionResponse.paymentMethod === 'CASH' && (
                                <StyledText style={styles.messageBlock}>
                                    {t('change')}: {formatCurrency(transactionResponse.paymentDetails.values['CASH_CHANGE'])}
                                </StyledText>
                            )}
                            {!!this.state.invoiceXML && <View style={{flexDirection: 'row'}}>
                                <StyledText style={styles.messageBlock}>
                                    {t('eInvoiceCheckout')}
                                </StyledText>
                                <Icon
                                    name={this.state.isInvoicePrint ? 'md-checkmark-circle-outline' : 'md-close-circle-outline'}
                                    size={32}
                                    style={styles?.buttonIconStyle(customMainThemeColor)}
                                />
                            </View>}
                            {!!this.state.receiptXML && <View style={{flexDirection: 'row'}}>
                                <StyledText style={styles.messageBlock}>
                                    {t('orderReceipt')}
                                </StyledText>
                                <Icon
                                    name={this.state.isReceiptPrint ? 'md-checkmark-circle-outline' : 'md-close-circle-outline'}
                                    size={32}
                                    style={styles?.buttonIconStyle(customMainThemeColor)}
                                />
                            </View>}

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
                            {!!this.state.invoiceXML && <View style={{width: '50%', padding: '3%', height: '50%', alignItems: 'center', justifyContent: 'center'}}>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (!!this.state.printer) {
                                            if (!!this.state?.invoiceXML)
                                                this.handlePrint(this.state?.invoiceXML, this.state.printer.ipAddress, true)
                                        }

                                    }}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        alignContent: 'center',
                                        backgroundColor: customMainThemeColor,
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
                            </View>}
                            <View style={{width: `${!!this.state.invoiceXML ? '50%' : '100%'}`, padding: '3%', height: '50%', alignItems: 'center', justifyContent: 'center'}}>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (!!this.state.printer)
                                            this.handlePrint(this.state?.receiptXML, this.state.printer.ipAddress, false)

                                    }}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        alignContent: 'center',
                                        backgroundColor: customMainThemeColor,
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



                            <View style={{width: '100%', padding: '3%', height: '50%', alignItems: 'center', justifyContent: 'center'}}>
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
                                        borderColor: customMainThemeColor,
                                        borderRadius: 10,
                                    }}
                                >
                                    <Text style={{
                                        fontSize: 16,
                                        padding: 10,
                                        marginBottom: 10,
                                        overflow: 'hidden',
                                        color: customMainThemeColor
                                    }}>{t('order.completeOrder')}</Text>
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
                                style={styles?.buttonIconStyle(customMainThemeColor)}
                            />
                            <StyledText style={styles.messageBlock}>
                                {t('totalAmount')}: {formatCurrency(transactionResponse.settleAmount)}
                            </StyledText>
                            {transactionResponse.paymentMethod === 'CASH' && (
                                <StyledText style={styles.messageBlock}>
                                    {t('change')}: {formatCurrency(transactionResponse.paymentDetails.values['CASH_CHANGE'])}
                                </StyledText>
                            )}
                            {!!this.state.invoiceXML && <View style={{flexDirection: 'row'}}>
                                <StyledText style={styles.messageBlock}>
                                    {t('eInvoiceCheckout')}
                                </StyledText>
                                <Icon
                                    name={this.state.isInvoicePrint ? 'md-checkmark-circle-outline' : 'md-close-circle-outline'}
                                    size={32}
                                    style={styles?.buttonIconStyle(customMainThemeColor)}
                                />
                            </View>}
                            {!!this.state.receiptXML && <View style={{flexDirection: 'row'}}>
                                <StyledText style={styles.messageBlock}>
                                    {t('orderReceipt')}
                                </StyledText>
                                <Icon
                                    name={this.state.isReceiptPrint ? 'md-checkmark-circle-outline' : 'md-close-circle-outline'}
                                    size={32}
                                    style={styles?.buttonIconStyle(customMainThemeColor)}
                                />
                            </View>}

                        </View>

                        <View style={styles.bottom}>
                            <View>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (!!this.state.printer) {
                                            if (!!this.state?.invoiceXML)
                                                this.handlePrint(this.state?.invoiceXML, this.state.printer.ipAddress, true)
                                        }

                                    }}
                                >
                                    <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                                        {t('printInvoiceXML')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (!!this.state.printer)
                                            this.handlePrint(this.state?.receiptXML, this.state.printer.ipAddress, false)

                                    }}
                                >
                                    <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                                        {t('printReceiptXML')}
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
                                    <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>{t('order.completeOrder')}</Text>
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
)(RetailCheckoutComplete)

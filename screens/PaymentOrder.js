import React from 'react'
import {connect} from 'react-redux'
import {Alert} from 'react-native'
import {getOrder, getCurrentClient} from '../actions'
import {api, dispatchFetchRequestWithOption, successMessage} from '../constants/Backend'
import PaymentOrderForm from './PaymentOrderForm'
import {LocaleContext} from '../locales/LocaleContext'
import LoadingScreen from "./LoadingScreen";
import {handleDelete} from "../helpers/orderActions";

class PaymentOrder extends React.Component {
  static navigationOptions = {
    header: null
  }

  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      numbersArr: [],
      dynamicTotal: 0,
      paymentsTypes: {
        0: {label: context.t('payment.cashPayment'), value: 'CASH'},
        1: {label: context.t('payment.cardPayment'), value: 'CARD'},
        2: {label: context.t('payment.mobilePayment'), value: 'MOBILE'},
      },
      selectedPaymentType: 0
    }
  }

  componentDidMount() {
    this.props.getOrder()
    this.props.getCurrentClient()
  }

  handlePaymentTypeSelection = (index) => {
    const selectedIndex = this.selectedPaymentType === index ? null : index
    this.setState({selectedPaymentType: selectedIndex})
  }

  addNum = num => {
    const total = this.state.dynamicTotal + Number(num)
    this.setState({dynamicTotal: total})
  }

  resetTotal = () => {
    this.setState({dynamicTotal: 0})
  }

  handleSplitByHeadComplete = id => {
    const formData = new FormData()
    formData.append('action', 'COMPLETE')

    dispatchFetchRequestWithOption(api.order.process(id), {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {},
      body: formData
    }, {
      defaultMessage: false
    }, response => {
      this.props.navigation.navigate('TablesScr')
    }).then()
  }


  handleComplete = id => {
    if (this.props.route.params?.isSplitByHeadCount) {
      if (!this.props.route.params?.isLastOne) {
        this.props.navigation.navigate('SplitBillByHeadScreen', {
          order: this.props.route.params?.parentOrder
        })
      } else {
        this.context?.saveSplitParentOrderId(null)
        this.handleSplitByHeadComplete(this.props.route.params?.parentOrder?.orderId, () => this.props.navigation.navigate(this.context?.appType === 'store' && (this.props?.order?.orderType !== 'TAKE_OUT') ? ('Tables', {screen: 'TablesScr'}) : ('Home', {screen: 'LoginSuccess'})))

        console.log("route: complete 1")

      }

    } else {
      const formData = new FormData()
      formData.append('action', 'COMPLETE')
      dispatchFetchRequestWithOption(api.order.process(id), {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {},
        body: formData
      }, {
        defaultMessage: false
      }, response => {
        if (!!this.props.route.params?.isSplitting) {
          if (this.props.route.params?.isSplitByHeadCount && !this.props.route.params?.isLastOne) {
            this.props.navigation.navigate('SplitBillByHeadScreen', {
              order: this.props.route.params?.parentOrder
            })
          }
          else if (this.props.route.params?.parentOrder?.lineItems.length !== 0) {
            this.props.navigation.navigate('SpiltBillScreen', {
              order: this.props.route.params?.parentOrder
            })
          } else {
            this.context?.saveSplitParentOrderId(null)
            this.props.navigation.navigate(this.context?.appType === 'store' && (this.props?.order?.orderType !== 'TAKE_OUT') ? ('Tables', {screen: 'TablesScr'}) : 'Home', {screen: 'LoginSuccess'})
            console.log("route: complete 2")
          }

        } else {
          this.context?.saveSplitParentOrderId(null)
          this.props.navigation.navigate(this.context?.appType === 'store' && (this.props?.order?.orderType !== 'TAKE_OUT') ? ('Tables', {screen: 'TablesScr'}) : 'Home', {screen: 'LoginSuccess'})
          console.log("route: complete 3", this.props?.order?.orderType)
        }
      }).then()
    }

  }


  checkAutoComplete = (values) => {
    const totalAmount = !!this.props.route.params?.isSplitByHeadCount ? this.props.route.params?.splitAmount : this.props?.order?.orderTotal
    if (values.paymentMethod === 'CASH' && values.cash < totalAmount) {
      Alert.alert(
        ``,
        `${this.context.t('payment.checkAutoComplete')}`,
        [
          {text: `${this.context.t('action.yes')}`, onPress: () => this.handleSubmit(values, true, totalAmount)},
          {
            text: `${this.context.t('action.no')}`,
            onPress: () => console.log('Cancelled'),
            style: 'cancel'
          }
        ]
      )
    } else {
      this.handleSubmit(values)
    }
  }
  handleSubmit = (values, autoComplete = false, cash = 0) => {

    const fetchApi = (transactionObj) => {
      dispatchFetchRequestWithOption(api.payment.charge, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transactionObj)
      }, {
        defaultMessage: false
      }, response => {
        successMessage(this.context.t('charged'))

        response.json().then(data => {
          this.props.navigation.navigate(this.context?.appType === 'store' ? 'CheckoutComplete' : 'RetailCheckoutComplete', {
            transactionResponse: data,
            onSubmit: this.handleComplete,
            isSplitting: this.props.route.params?.isSplitting ?? false,
            parentOrder: this.props.route.params?.parentOrder ?? null,
            isSplitByHeadCount: this.props.route.params?.isSplitByHeadCount ?? false,
            splitAmount: this.props.route.params?.splitAmount ?? null,
            isLastOne: this.props.route.params?.isLastOne ?? false,
          })
        })
      }, response => {
        this.context?.saveSplitParentOrderId(null)
        this.props.navigation.navigate(this.context?.appType === 'store' && (this.props?.order?.orderType !== 'TAKE_OUT') ? ('Tables', {screen: 'TablesScr'}) : 'Home', {screen: 'LoginSuccess'})
        console.log("route: props submit")
      }).then()
    }

    const transactionObj = {
      orderId: this.props.route.params.orderId,
      paymentMethod: values.paymentMethod,
      billType: this.props.route.params?.isSplitByHeadCount ? 'SPLIT' : 'SINGLE',
      taxIdNumber: values?.taxIdNumber ?? null,
      paymentDetails: {},
      printMark: true
    }
    if (!!values?.npoBan) {
      transactionObj.npoBan = values?.npoBan
    }
    if (!!values?.carrierId) {
      transactionObj.carrierType = 'MOBILE'
      transactionObj.carrierId = values?.carrierId
    }
    if (values.paymentMethod === 'CASH') {
      transactionObj.paymentDetails['CASH'] = autoComplete ? cash : values.cash
      this.props.route.params?.isSplitByHeadCount && (transactionObj.settleAmount = this.props.route.params?.splitAmount)
    }
    if (values.paymentMethod === 'CARD') {
      transactionObj.paymentDetails['CARD_TYPE'] = values.cardType
      transactionObj.paymentDetails['LAST_FOUR_DIGITS'] = values.cardNumber
      this.props.route.params?.isSplitByHeadCount && (transactionObj.settleAmount = this.props.route.params?.splitAmount)
    }
    if (values.paymentMethod === 'MOBILE') {
      transactionObj.paymentMethod = values.mobilePayType
      this.props.route.params?.isSplitByHeadCount && (transactionObj.settleAmount = this.props.route.params?.splitAmount)
    }

    if (!!values?.carrierId && !!values?.taxIdNumber) {
      Alert.alert(
        ``,
        `${this.context.t('payment.checkPrintInvoice')}`,
        [
          {
            text: `${this.context.t('action.yes')}`,
            onPress: () => {
              transactionObj.printMark = true
              fetchApi(transactionObj)
            }
          },
          {
            text: `${this.context.t('action.no')}`,
            onPress: () => {
              transactionObj.printMark = false
              fetchApi(transactionObj)
            },
            style: 'cancel'
          }
        ]
      )
    } else if (values.paymentMethod === 'MOBILE' && !values.mobilePayType) {
      Alert.alert(
        `${this.context.t('payment.checkmobilePayType')}`,
        ` `,
        [
          {text: `${this.context.t('action.yes')}`, onPress: () => console.log("OK Pressed")}
        ]
      )
    } else {
      fetchApi(transactionObj)
    }



  }

  render() {
    const {isLoading, order, client} = this.props
    const {paymentsTypes, selectedPaymentType} = this.state
    const paymentsTypeslbl = Object.keys(paymentsTypes).map(key => paymentsTypes[key].label)

    if (isLoading) {
      return (
        <LoadingScreen />
      )
    } else {

      return (
        <PaymentOrderForm
          onSubmit={this.checkAutoComplete}
          order={order}
          client={client}
          navigation={this.props.navigation}
          addNum={this.addNum}
          resetTotal={this.resetTotal}
          dynamicTotal={this.state.dynamicTotal}
          paymentsTypeslbl={paymentsTypeslbl}
          selectedPaymentType={selectedPaymentType}
          paymentsTypes={paymentsTypes}
          handlePaymentTypeSelection={this.handlePaymentTypeSelection}
          isSplitting={this.props.route.params?.isSplitting ?? false}
          parentOrder={this.props.route.params?.parentOrder ?? null}
          isSplitByHeadCount={this.props.route.params?.isSplitByHeadCount ?? false}
          splitAmount={this.props.route.params?.splitAmount ?? null}
          isLastOne={this.props.route.params?.isLastOne ?? false}
        />
      )
    }
  }
}

const mapStateToProps = state => ({
  order: state.order.data,
  haveData: state.order.haveData,
  haveError: state.order.haveError,
  isLoading: state.order.loading,
  client: state.client.data,
})

const mapDispatchToProps = (dispatch, props) => ({
  getOrder: () => dispatch(getOrder(props.route.params.orderId)),
  getCurrentClient: () => dispatch(getCurrentClient()),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentOrder)

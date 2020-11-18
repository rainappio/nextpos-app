import React from 'react'
import {connect} from 'react-redux'
import {Alert} from 'react-native'
import {getOrder} from '../actions'
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
        1: {label: context.t('payment.cardPayment'), value: 'CARD'}
      },
      selectedPaymentType: 0
    }
  }

  componentDidMount() {
    this.props.getOrder()
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


  handleComplete = id => {
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
      if (!!this.props.navigation.state.params?.isSplitting) {
        if (this.props.navigation.state.params?.parentOrder?.lineItems.length !== 0) {
          this.props.navigation.navigate('SpiltBillScreen', {
            order: this.props.navigation.state.params?.parentOrder
          })
        } else {
          this.context?.saveSplitParentOrderId(null)
          handleDelete(this.props.navigation.state.params?.parentOrder?.orderId, () => NavigationService.navigate('TablesSrc'))
        }

      } else {
        this.context?.saveSplitParentOrderId(null)
        this.props.navigation.navigate('TablesSrc')
      }
    }).then()
  }


  checkAutoComplete = (values) => {
    if (values.paymentMethod === 'CASH' && values.cash < this.props?.order?.orderTotal) {
      Alert.alert(
        ``,
        `${this.context.t('payment.checkAutoComplete')}`,
        [
          {text: `${this.context.t('action.yes')}`, onPress: () => this.handleSubmit(values, true, this.props?.order?.orderTotal)},
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
          this.props.navigation.navigate('CheckoutComplete', {
            transactionResponse: data,
            onSubmit: this.handleComplete,
            isSplitting: this.props.navigation.state.params?.isSplitting ?? false,
            parentOrder: this.props.navigation.state.params?.parentOrder ?? null,
          })
        })
      }).then()
    }
    const transactionObj = {
      orderId: this.props.navigation.state.params.orderId,
      paymentMethod: values.paymentMethod,
      billType: 'SINGLE',
      taxIdNumber: values?.taxIdNumber ?? null,
      paymentDetails: {},
      printMark: true
    }
    if (!!values?.carrierId) {
      transactionObj.carrierType = 'MOBILE'
      transactionObj.carrierId = values?.carrierId
    }
    if (values.paymentMethod === 'CASH') {
      transactionObj.paymentDetails['CASH'] = autoComplete ? cash : values.cash
    }
    if (values.paymentMethod === 'CARD') {
      transactionObj.paymentDetails['CARD_TYPE'] = values.cardType
      transactionObj.paymentDetails['LAST_FOUR_DIGITS'] = values.cardNumber
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
    } else {
      fetchApi(transactionObj)
    }



  }

  render() {
    const {isLoading, order} = this.props
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
          navigation={this.props.navigation}
          addNum={this.addNum}
          resetTotal={this.resetTotal}
          dynamicTotal={this.state.dynamicTotal}
          paymentsTypeslbl={paymentsTypeslbl}
          selectedPaymentType={selectedPaymentType}
          paymentsTypes={paymentsTypes}
          handlePaymentTypeSelection={this.handlePaymentTypeSelection}
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
})

const mapDispatchToProps = (dispatch, props) => ({
  getOrder: () => dispatch(getOrder(props.navigation.state.params.orderId))
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentOrder)

import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
import {
  getProducts,
  getLables,
  getLabel,
  getfetchOrderInflights,
  clearOrder,
  getOrder,
  getOrdersByDateRange
} from '../actions'
import {
  successMessage,
  api,
  makeFetchRequest,
  errorAlert, dispatchFetchRequest, dispatchFetchRequestWithOption
} from '../constants/Backend'
import BackBtn from '../components/BackBtn'
import InputText from '../components/InputText'
import { isRequired } from '../validators'
import { DismissKeyboard } from '../components/DismissKeyboard'
import PaymentOrderForm from './PaymentOrderForm'
import { LocaleContext } from '../locales/LocaleContext'
import styles from '../styles'
import LoadingScreen from "./LoadingScreen";

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
    this.setState({ selectedPaymentType: selectedIndex })
  }

  addNum = num => {
    const total = this.state.dynamicTotal + Number(num)
    this.setState({ dynamicTotal: total})
  }

  resetTotal = () => {
    this.setState({ dynamicTotal: 0 })
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
    },response => {
      this.props.navigation.navigate('TablesSrc')
    }).then()
  }

  handleSubmit = values => {
    const transactionObj = {
      orderId: this.props.navigation.state.params.orderId,
      paymentMethod: values.paymentMethod,
      billType: 'SINGLE',
      paymentDetails: {}
    }
    if (values.paymentMethod === 'CASH') {
      transactionObj.paymentDetails['CASH'] = values.cash
    }
    if (values.paymentMethod === 'CARD') {
      transactionObj.paymentDetails['CARD_TYPE'] = values.cardType
      transactionObj.paymentDetails['LAST_FOUR_DIGITS'] = values.cardNumber
    }

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
          onSubmit: this.handleComplete
        })
      })
    }).then()
  }

  render() {
    const { isLoading, order } = this.props
  	const { paymentsTypes, selectedPaymentType } = this.state
		const paymentsTypeslbl = Object.keys(paymentsTypes).map(key => paymentsTypes[key].label)

    if (isLoading) {
      return (
        <LoadingScreen />
      )
    } else {

      return (
        <PaymentOrderForm
          onSubmit={this.handleSubmit}
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

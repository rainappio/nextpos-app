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
  errorAlert, dispatchFetchRequest
} from '../constants/Backend'
import BackBtn from '../components/BackBtn'
import InputText from '../components/InputText'
import { isRequired } from '../validators'
import { DismissKeyboard } from '../components/DismissKeyboard'
import PaymentOrderForm from './PaymentOrderForm'
import { LocaleContext } from '../locales/LocaleContext'
import styles from '../styles'

class PaymentOrder extends React.Component {
  static navigationOptions = {
    header: null
  }

  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
    context.localize({
    	en:{
      	cashPayment: 'Cash',
      	cardPayment: 'Credit Card'
    	},
    	zh: {
      	cashPayment: '現金',
      	cardPayment: '信用卡'
    	}
  	})

    this.state = {
    	numbersArr: [],
    	dynamicTotal: 0,
			paymentsTypes: {
  			0: {label: context.t('cashPayment'), value: 'CASH'},
  			1: {label: context.t('cardPayment'), value: 'CARD'}
  			},
    	selectedPaymentType: null
  	}
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

    dispatchFetchRequest(api.order.process(id), {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {},
      body: formData
    }, response => {
      this.props.navigation.navigate('TablesSrc')
    }).then()
  }

  handleSubmit = values => {
    const transactionObj = {
      orderId: this.props.navigation.state.params.order.orderId,
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

    makeFetchRequest(token => {
      fetch(api.payment.charge, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token.access_token
        },
        body: JSON.stringify(transactionObj)
      })
        .then(response => {
          if (response.status === 200) {
            successMessage('Charged')

            response.json().then(data => {
              this.props.navigation.navigate('CheckoutComplete', {
                transactionResponse: data,
                onSubmit: this.handleComplete
              })
            })
            this.props.getOrdersByDateRange()
          } else {
            errorAlert(response)
          }
        })
        .catch(error => {
          console.error(error)
        })
    })
  }

  render() {
  	const { paymentsTypes, selectedPaymentType } = this.state
		const paymentsTypeslbl = Object.keys(paymentsTypes).map(key => paymentsTypes[key].label)

    return (
      <PaymentOrderForm
        onSubmit={this.handleSubmit}
        order={this.props.navigation.state.params.order}
        navigation={this.props.navigation}
        discountTotal={this.props.navigation.state.params.discountTotal}
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

const mapDispatchToProps = dispatch => ({
  getfetchOrderInflights: () => dispatch(getfetchOrderInflights()),
  clearOrder: id => dispatch(clearOrder(id)),
  getOrdersByDateRange: () => dispatch(getOrdersByDateRange())
})
export default connect(
  null,
  mapDispatchToProps
)(PaymentOrder)

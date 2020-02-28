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
  errorAlert
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
      	cardPayment: 'Credit Card-CH'
    	}
  	})

    this.state = {
    	numbersArr: [],
    	dynamicTotal: 0,
			paymentsTypes: {
  			0: {label: context.t('cashPayment'), value: 'CASH'},
  			1: {label: context.t('cardPayment'), value: 'CARD'}
  			},
				//paymentsTypes: ['CASH','CARD'],
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
    makeFetchRequest(token => {
      const formData = new FormData()
      formData.append('action', 'COMPLETED')
      fetch(`${api.apiRoot}/orders/${id}/process?action=COMPLETE`, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          Authorization: 'Bearer ' + token.access_token
        },
        body: formData
      })
        .then(response => response.json())
        .then(res => {
          if (res) {
            this.props.navigation.navigate('TablesSrc')
            this.props.getfetchOrderInflights()
            this.props.clearOrder(id)
            this.props.getOrdersByDateRange()
          } else {
            alert(res.message === undefined ? 'pls try again' : res.message)
          }
        })
        .catch(error => {
          console.error(error)
        })
    })
  }

  handleSubmit = values => {
    var cashObj = {
      orderId: this.props.navigation.state.params.order.orderId,
      paymentMethod: values.paymentMethod,
      billType: 'SINGLE'      
    }
    if(values.paymentMethod == 'CASH'){
    	cashObj.cash = values.cash 
    }
		if(values.paymentMethod == 'CARD'){
			cashObj.cardType = values.cardType
			cashObj.cardNumber = values.cardNumber
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
        body: JSON.stringify(cashObj)
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

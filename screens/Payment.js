import React from 'react'
import PaymentFormScreen from './PaymentFormScreen'
import {
  getProducts,
  getLables,
  getLabel,
  calculatePercentage
} from '../actions'
import {
  api,
  makeFetchRequest,
  successMessage,
  errorAlert
} from '../constants/Backend'

class Payment extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    discountTotal: null
  }

  handleCash = () => {
    var cashObj = {
      orderId: this.props.navigation.state.params.order.orderId,
      paymentMethod: 'CASH',
      billType: 'SINGLE'
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
            this.props.navigation.navigate('CheckoutComplete', {
              payAmt: this.state.discountTotal
            })
          } else {
            errorAlert(response)
          }
        })
        .catch(error => {
          console.error(error)
        })
    })
  }

  handlePayment = values => {
    var discountTotal =
      values.orderTotal -
      calculatePercentage(values.orderTotal, values.discountPercent)
    this.setState({
      discountTotal: discountTotal
    })
    var orderId = this.props.navigation.state.params.order.orderId
    makeFetchRequest(token => {
      fetch(`${api.apiRoot}/orders/${orderId}/applyDiscount`, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token.access_token
        },
        body: JSON.stringify({ discount: values.discountPercent / 100 })
      })
        .then(response => {
          if (response.status === 200) {
            this.props.navigation.navigate('PaymentOrder', {
              order: this.props.navigation.state.params.order,
              navigation: this.props.navigation,
              onSubmit: this.handleCash,
              payAmt: discountTotal
            })
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
    const { navigation } = this.props
    return (
      <PaymentFormScreen
        order={this.props.navigation.state.params.order}
        navigation={navigation}
        onSubmit={this.handlePayment}
      />
    )
  }
}

export default Payment

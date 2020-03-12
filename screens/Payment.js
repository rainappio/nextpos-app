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
  errorAlert, dispatchFetchRequest
} from '../constants/Backend'

class Payment extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    discountTotal: null
  }

  handlePayment = values => {
    const hasDiscount =
      values.discount !== undefined && values.discount.discount > 0
    const discountTotal =
      values.orderTotal -
      calculatePercentage(
        values.orderTotal,
        hasDiscount && values.discount.discount
      )
    this.setState({
      discountTotal: discountTotal
    })

    if (!hasDiscount) {
      this.props.navigation.navigate('PaymentOrder', {
        order: this.props.navigation.state.params.order,
        navigation: this.props.navigation,
        discountTotal: discountTotal
      })
    } else {
      const orderId = this.props.navigation.state.params.order.orderId

      dispatchFetchRequest(api.order.applyDiscount(orderId), {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values.discount)

      }, response => {
        successMessage('Discount applied')
        response.json().then(orderData => {
          this.props.navigation.navigate('PaymentOrder', {
            order: orderData,
            navigation: this.props.navigation,
            discountTotal: discountTotal
          })
        })

      }).then()
    }
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

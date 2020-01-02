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

  handlePayment = values => {
    const hasDiscount = values.discount !== undefined && values.discount.discount > 0
    const discountTotal = values.orderTotal - calculatePercentage(values.orderTotal, values.discount.discount)
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
          body: JSON.stringify(values.discount)
        })
          .then(response => {
            if (response.status === 200) {
              successMessage('Discount applied')
              this.props.navigation.navigate('PaymentOrder', {
                order: this.props.navigation.state.params.order,
                navigation: this.props.navigation,
                discountTotal: discountTotal
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

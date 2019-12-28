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
    // console.log(values)
    // console.log("handlePayment hit")
    var discountTotal =
      values.orderTotal -
      calculatePercentage(values.orderTotal, values.discount)
    this.setState({
      discountTotal: discountTotal
    })
    if (values.discount === 0) {
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
          body: JSON.stringify({
            discount: values.discount,
            orderDiscount: values.orderDiscount
          })
        })
          .then(response => {
            if (response.status === 200) {
              successMessage('Saved %')
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

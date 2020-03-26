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

  handlePayment = async values => {
    const orderId = this.props.navigation.state.params.order.orderId
    const hasDiscount = values.discount !== undefined && values.discount.discount > 0
    const discountTotal = values.orderTotal - calculatePercentage(values.orderTotal, hasDiscount && values.discount.discount)
    this.setState({
      discountTotal: discountTotal
    })

    if (values.orderOption === 'resetAllOffers') {
      dispatchFetchRequest(api.order.resetOrderOffers(orderId), {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      }, response => {
        successMessage('Reset order offers')
        this.props.navigation.navigate('PaymentOrder', {
          orderId: this.props.navigation.state.params.order.orderId,
          navigation: this.props.navigation
        })
      }).then()
    } else {
      const waiveServiceCharge = async () => {
        if (values.orderOption === 'waiveServiceCharge') {
          await dispatchFetchRequest(api.order.waiveServiceCharge(orderId), {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            }
          }, response => {
            successMessage('Service charge waived')
          }).then()
        }
      }

      const applyDiscount = async () => {
        if (hasDiscount) {
          await dispatchFetchRequest(api.order.applyDiscount(orderId), {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values.discount)

          }, response => {
            successMessage('Discount applied')
          }).then()
        }
      }

      const goToPaymentOrder = async () => {
        this.props.navigation.navigate('PaymentOrder', {
          orderId: this.props.navigation.state.params.order.orderId,
          navigation: this.props.navigation
        })
      }

      await [waiveServiceCharge, applyDiscount, goToPaymentOrder].reduce(async (previousPromise, nextAsyncFunction) => {
        await previousPromise;
        const result = await nextAsyncFunction();
      }, Promise.resolve());
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

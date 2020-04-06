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
import warnValidStyle from "react-native-web/dist/vendor/react-dom/warnValidStyle";

class Payment extends React.Component {
  static navigationOptions = {
    header: null
  }

  handlePayment = async values => {
    const orderId = this.props.navigation.state.params.order.orderId

    const waiveServiceCharge = async () => {
      const waiveServiceCharge = values.waiveServiceCharge === true

      await dispatchFetchRequest(api.order.waiveServiceCharge(orderId, waiveServiceCharge), {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      }, response => {
      }).then()

    }

    const applyDiscount = async () => {
      await dispatchFetchRequest(api.order.applyDiscount(orderId), {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values.discount)

      }, response => {
      }).then()

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

  render() {
    const { navigation } = this.props
    const order= this.props.navigation.state.params.order

    return (
      <PaymentFormScreen
        initialValues={{ waiveServiceCharge: order.serviceCharge === 0, discount: { orderDiscount: 'NO_DISCOUNT' } }}
        order={order}
        navigation={navigation}
        onSubmit={this.handlePayment}
      />
    )
  }
}

export default Payment

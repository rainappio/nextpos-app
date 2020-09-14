import React from 'react'
import PaymentFormScreen from './PaymentFormScreen'
import PaymentFormScreenTablet from './PaymentFormScreenTablet'
import {api, dispatchFetchRequestWithOption} from '../constants/Backend'
import {LocaleContext} from '../locales/LocaleContext'

class Payment extends React.Component {
  static navigationOptions = {
    header: null
  }

  static contextType = LocaleContext
  constructor(props, context) {
    super(props, context)

  }

  handlePayment = async values => {
    const orderId = this.props.navigation.state.params.order.orderId

    const waiveServiceCharge = async () => {
      const waiveServiceCharge = values.waiveServiceCharge === true

      await dispatchFetchRequestWithOption(api.order.waiveServiceCharge(orderId, waiveServiceCharge), {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      }, {
        defaultMessage: false
      }, response => {
      }).then()

    }

    const applyDiscount = async () => {
      const url = values.discount.offerId === 'NO_DISCOUNT' ? api.order.removeDiscount(orderId) : api.order.applyDiscount(orderId)

      await dispatchFetchRequestWithOption(url, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values.discount)

      }, {
        defaultMessage: false
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
    const {navigation} = this.props
    const order = this.props.navigation.state.params.order

    const initialDiscount = {
      offerId: 'NO_DISCOUNT',
      orderDiscount: 'NO_DISCOUNT',
      discount: -1,
    }

    if (order.appliedOfferInfo != null) {
      let overrideDiscount = order.appliedOfferInfo.overrideDiscount

      if (order.appliedOfferInfo.discountDetails.discountType === 'PERCENT_OFF') {
        overrideDiscount = overrideDiscount * 100
      }

      initialDiscount.offerId = order.appliedOfferInfo.offerId
      initialDiscount.orderDiscount = order.appliedOfferInfo.offerId
      initialDiscount.discount = overrideDiscount
    }

    return (<>
      {this.context.isTablet ? <PaymentFormScreenTablet
        initialValues={{
          waiveServiceCharge: order.serviceCharge === 0,
          discount: initialDiscount
        }}
        order={order}
        navigation={navigation}
        onSubmit={this.handlePayment}
      />
        : <PaymentFormScreen
          initialValues={{
            waiveServiceCharge: order.serviceCharge === 0,
            discount: initialDiscount
          }}
          order={order}
          navigation={navigation}
          onSubmit={this.handlePayment}
        />}
    </>
    )
  }
}

export default Payment

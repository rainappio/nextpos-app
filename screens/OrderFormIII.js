import React from 'react'
// import { reduxForm } from 'redux-form'
import {connect} from 'react-redux'
import {getGlobalProductOffers, getOrder, getProduct} from '../actions'
import OrderFormIV from './OrderFormIV'
import {LocaleContext} from '../locales/LocaleContext'
import {api, dispatchFetchRequest, successMessage} from '../constants/Backend'
import LoadingScreen from "./LoadingScreen";
import BackendErrorScreen from "./BackendErrorScreen";
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";
import {View} from 'react-native'

class OrderFormIII extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    this.props.getProduct()
    this.props.getOrder(this.props.route.params.orderId)
    this.props.getGlobalProductOffers()
  }

  handleSubmit = values => {
    const orderId = this.props.route.params.orderId

    const updatedOptions = []
    values.productOptions != null && values.productOptions.map(option => {
      if (!option.optionName) {
        option.optionName = this.context.t('freeTextProductOption')
      }
      if (Array.isArray(option)) {

        updatedOptions.push(...option)

      } else {
        updatedOptions.push(option)
      }
    })

    const lineItemRequest = {
      productId: this.props.route.params.prdId,
      quantity: values.quantity,
      sku: values.sku,
      overridePrice: values.overridePrice,
      productOptions: updatedOptions,
      productDiscount: values.lineItemDiscount.productDiscount,
      discountValue: values.lineItemDiscount.discount
    }

    dispatchFetchRequest(
      api.order.newLineItem(orderId),
      {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(lineItemRequest)
      },
      response => {
        successMessage(this.context.t('orderForm.addItemSuccess', {quantity: values.quantity, product: this.props?.product.name}))
        this.props.navigation.goBack()
        this.props.getOrder(orderId)
      }
    ).then()
  }

  handleUpdate = values => {

    const orderId = this.props.route.params.orderId
    const lineItemId = values.lineItemId

    const updatedOptions = []
    values.productOptions != null && values.productOptions.map(option => {
      if (!option.optionName) {
        option.optionName = this.context.t('freeTextProductOption')
      }
      if (Array.isArray(option)) {

        updatedOptions.push(...option)
      } else {
        updatedOptions.push(option)
      }
    })

    const lineItemRequest = {
      quantity: values.quantity,
      sku: values.sku,
      productOptions: updatedOptions,
      overridePrice: values.overridePrice,
      productDiscount: values.lineItemDiscount.productDiscount,
      discountValue: values.lineItemDiscount.discount
    }

    dispatchFetchRequest(api.order.updateLineItem(orderId, lineItemId), {
      method: 'PATCH',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lineItemRequest)
    }, response => {
      this.props.navigation.goBack()
      this.props.getOrder()
    }).then()
  }

  render() {
    const {product, globalProductOffers, haveError, isLoading} = this.props
    const {customBackgroundColor} = this.context


    const isEditLineItem = this.props.route.params?.lineItem != null
    const lineItemDiscount = {
      offerId: 'NO_DISCOUNT',
      productDiscount: 'NO_DISCOUNT',
      discount: -1
    }

    const initialValues = {
      ...this.props.route.params?.lineItem,
      lineItemDiscount: lineItemDiscount
    }

    if (initialValues.appliedOfferInfo != null) {
      let overrideDiscount = initialValues.appliedOfferInfo.overrideDiscount

      if (initialValues.appliedOfferInfo.discountDetails.discountType === 'PERCENT_OFF') {
        overrideDiscount = overrideDiscount * 100
      }

      initialValues.lineItemDiscount = {
        offerId: initialValues.appliedOfferInfo.offerId,
        productDiscount: initialValues.appliedOfferInfo.offerId,
        discount: overrideDiscount
      }
    }

    if (isLoading) {
      return (
        <LoadingScreen />
      )
    } else if (haveError) {
      return (
        <BackendErrorScreen />
      )
    }
    return (
      <View style={{flex: 1, backgroundColor: customBackgroundColor}}>
        {isEditLineItem ? (
          <OrderFormIV
            onSubmit={this.handleUpdate}
            product={product}
            initialValues={initialValues}
            globalProductOffers={globalProductOffers}
          />
        ) : (
            <OrderFormIV
              onSubmit={this.handleSubmit}
              product={product}
              initialValues={{lineItemDiscount: lineItemDiscount, quantity: 1}}
              globalProductOffers={globalProductOffers}
            />
          )}
      </View>
    )
  }
}

const mapStateToProps = state => ({
  globalProductOffers: state.globalProductOffers.data.results,
  product: state.product.data,
  haveData: state.product.haveData,
  haveError: state.product.haveError,
  isLoading: state.product.loading,
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getProduct: () => dispatch(getProduct(props.route.params.prdId)),
  getOrder: () => dispatch(getOrder(props.route.params.orderId)),
  getGlobalProductOffers: () => dispatch(getGlobalProductOffers())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderFormIII)

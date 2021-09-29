import React from 'react'
// import { reduxForm } from 'redux-form'
import {connect} from 'react-redux'
import {getGlobalProductOffers, getOrder, getProduct, getLables, getProductsDetail} from '../actions'
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
    this.props.getLables()
    this.props.getProductsDetail()
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
    const updatechildLineItems = []
    !!values?.childLineItems && values.childLineItems.map(product => {
      product.map((item) => {
        if (item !== undefined) {
          let newOptions = []
          !!item.productOptions && item.productOptions.map((option) => {
            if (Array.isArray(option)) {
              newOptions.push(...option)
            }
          })
          updatechildLineItems.push({...item, productOptions: newOptions, quantity: values.quantity})
        }
      })
    })

    if (this.props.product?.productType !== 'PRODUCT_COMBO') {
      const lineItemRequest = {
        productId: this.props.route.params.prdId,
        quantity: values.quantity,
        sku: values.sku,
        overridePrice: values.overridePrice,
        productOptions: updatedOptions,
        productDiscount: values.lineItemDiscount.productDiscount,
        discountValue: values.lineItemDiscount.discount,
      }
      console.log("submit lineItemRequest= ", lineItemRequest)

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
          this.props.getOrder(orderId)
          this.props.navigation.goBack()
        }
      ).then()

    } else {
      const lineItemRequest = {
        productId: this.props.route.params.prdId,
        quantity: values.quantity,
        sku: values.sku,
        overridePrice: values.overridePrice,
        productOptions: updatedOptions,
        productDiscount: values.lineItemDiscount.productDiscount,
        discountValue: values.lineItemDiscount.discount,
        childLineItems: updatechildLineItems
      }
      console.log("submit lineItemRequest= ", lineItemRequest)
      let checkAllRequired = values.checkChildProduct.every(value => value === true)
      if (checkAllRequired) {
        dispatchFetchRequest(
          api.order.newComboLineItem(orderId),
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
            this.props.getOrder(orderId)
            this.props.navigation.goBack()
          }
        ).then()
      }
    }
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
    const {product, productsDetail = [], labels = [], globalProductOffers, haveError, isLoading} = this.props
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
            productsDetail={productsDetail}
            labels={labels}
            initialValues={initialValues}
            globalProductOffers={globalProductOffers}
          />
        ) : (
            <OrderFormIV
              onSubmit={this.handleSubmit}
              product={product}
              productsDetail={productsDetail}
              labels={labels}
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
  labels: state.labels.data.labels,
  subproducts: state.label.data.subLabels,
  productsDetail: state.productsDetail.data.results,
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getProduct: () => dispatch(getProduct(props.route.params.prdId)),
  getOrder: () => dispatch(getOrder(props.route.params.orderId)),
  getGlobalProductOffers: () => dispatch(getGlobalProductOffers()),
  getLables: () => dispatch(getLables()),
  getProductsDetail: () => dispatch(getProductsDetail()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderFormIII)

import React from 'react'
// import { reduxForm } from 'redux-form'
import {
  ScrollView,
  Text,
  View,
  RefreshControl,
  AsyncStorage,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import { getProduct, getOrder } from '../actions'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import styles from '../styles'
import OrderFormIV from './OrderFormIV'
import { LocaleContext } from '../locales/LocaleContext'
import { api, dispatchFetchRequest, errorAlert, makeFetchRequest, successMessage } from '../constants/Backend'
import LoadingScreen from "./LoadingScreen";
import BackendErrorScreen from "./BackendErrorScreen";

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
    this.props.getOrder(this.props.navigation.state.params.orderId)
  }

  handleSubmit = values => {

    const orderId = this.props.navigation.state.params.orderId

    const updatedOptions = []
    values.productOptions != null && values.productOptions.map(option => {
      if (Array.isArray(option)) {
        if (option.length > 0) {

          const optionValues = option.map(o => {
            return o.optionValue
          })

          updatedOptions.push({
            optionName: option[0].optionName,
            optionValue: optionValues.join()
          })
        }
      } else {
        updatedOptions.push(option)
      }
    })

    const lineItemRequest = {
      productId: this.props.navigation.state.params.prdId,
      quantity: values.quantity,
      productOptions: updatedOptions
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
        this.props.navigation.navigate('OrderFormII', {
          orderId: orderId
        })
        this.props.getOrder(orderId)
      }
    ).then()
  }

  handleUpdate = values => {

    const orderId = this.props.navigation.state.params.orderId
    const lineItemId = values.lineItemId

    const updatedOptions = []
    values.productOptions != null && values.productOptions.map(option => {
      if (Array.isArray(option)) {
        if (option.length > 0) {

          const optionValues = option.map(o => {
            return o.optionValue
          })

          updatedOptions.push({
            optionName: option[0].optionName,
            optionValue: optionValues.join()
          })
        }
      } else {
        updatedOptions.push(option)
      }
    })

    const lineItemRequest = {
      quantity: values.quantity,
      productOptions: updatedOptions
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
      this.props.navigation.navigate('OrdersSummary')
      this.props.getOrder()
    }).then()
  }

  render() {
    const { product, haveError, isLoading } = this.props

    const isEditLineItem = this.props.navigation.getParam('lineItem') != null

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
      <View>
        {isEditLineItem ? (
          <OrderFormIV
            onSubmit={this.handleUpdate}
            product={product}
            initialValues={this.props.navigation.getParam('lineItem')}
          />
        ) : (
            <OrderFormIV
              onSubmit={this.handleSubmit}
              product={product}
              initialValues={{ quantity: 1 }}
            />
          )}
      </View>

    )
  }
}

const mapStateToProps = state => ({
  product: state.product.data,
  haveData: state.products.haveData,
  haveError: state.products.haveError,
  isLoading: state.products.loading,
  order: state.order.data
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getProduct: () => dispatch(getProduct(props.navigation.state.params.prdId)),
  getOrder: () => dispatch(getOrder(props.navigation.state.params.orderId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderFormIII)

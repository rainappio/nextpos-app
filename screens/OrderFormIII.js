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
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import {DismissKeyboard} from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import {getProduct, getOrder} from '../actions'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import styles from '../styles'
import OrderFormIV from './OrderFormIV'
import {LocaleContext} from '../locales/LocaleContext'
import {api, dispatchFetchRequest, successMessage} from "../constants/Backend";

class OrderFormIII extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      t: context.t,
    }
  }

  componentDidMount() {
    this.props.getProduct()
    this.props.getOrder(this.props.navigation.state.params.orderId)
  }

  handleSubmit = values => {
    let createOrderObj = {}

    createOrderObj['productId'] = this.props.navigation.state.params.prdId
    createOrderObj['quantity'] = values.quantity
    delete values.quantity

    let prdOptionsCollections = []
    let dirtyArr = Object.values(values)
    if (dirtyArr.some(dr => dr.optionName !== undefined)) {
      dirtyArr.map(
        dr => dr.optionName !== undefined && prdOptionsCollections.push(dr)
      )
    }

    if (dirtyArr.some(dr => Array.isArray(dr))) {
      dirtyArr.map(
        dr =>
          Array.isArray(dr) &&
          dr.map(d =>
            prdOptionsCollections.push({
              optionName: d.optionName,
              optionValue: d.optionValue,
              optionPrice: d.optionPrice
            })
          )
      )
    }

    createOrderObj['productOptions'] = prdOptionsCollections
    var orderId = this.props.navigation.state.params.orderId

    dispatchFetchRequest(api.order.newLineItem(orderId), {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createOrderObj)
      },
      response => {
        successMessage('Line item saved')
        this.props.navigation.navigate('OrderFormII', {
          orderId: orderId
        })
        this.props.getOrder(orderId)
      }).then()
  }

  render() {
    const {navigation, haveError, isLoading} = this.props

    if (isLoading) {
      return (
        <View style={[styles.container]}>
          <ActivityIndicator size="large" color="#ccc"/>
        </View>
      )
    } else if (haveError) {
      return (
        <View style={[styles.container]}>
          <Text>Err during loading, check internet conn...</Text>
        </View>
      )
    }
    return (
      <OrderFormIV
        onSubmit={this.handleSubmit}
        product={this.props.product}
        navigation={navigation}
      />
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

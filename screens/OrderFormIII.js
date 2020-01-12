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

class OrderFormIII extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      t: context.t,
      activeSections: [2, 0],
      selectedProducts: [],
      refreshing: false,
      status: '',
      labelId: null,
      totalItems: null,
      orderInfo: null
    }
    this.onChange = activeSections => {
      this.setState({ activeSections })
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

    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      fetch(`http://35.234.63.193/orders/${orderId}/lineitems/`, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + tokenObj.access_token
        },
        body: JSON.stringify(createOrderObj)
      })
        .then(response => {
          if (response.status === 200) {
            this.props.navigation.navigate('OrderFormII', {
              orderId: orderId
            })
            this.props.getOrder(orderId)
          }
        })
        .catch(error => console.log(error))
    })
  }

  render() {
    const { navigation, haveError, isLoading, order } = this.props
    const { t } = this.state

    function Item({ title, price }) {
      return (
        <View style={[styles.item, styles.paddingTopBtn20]}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.rightAlign}>{price}</Text>
        </View>
      )
    }

    const right = [
      {
        text: (
          <Icon
            name="md-create"
            size={25}
            color="#fff"
            onPress={() =>
              this.props.navigation.navigate('ProductEdit', {
                productId: this.state.labelId
              })
            }
          />
        ),
        onPress: () => console.log('read'),
        style: { backgroundColor: '#f18d1a90' }
      }
    ]

    if (isLoading) {
      return (
        <View style={[styles.container]}>
          <ActivityIndicator size="large" color="#ccc" />
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
      <View style={{ flex: 1 }}>
        <ScrollView
          refreshControl={<RefreshControl refreshing={this.state.refreshing} />}
        >
          <DismissKeyboard>
            <View style={[styles.container]}>
              <BackBtn />
              <Text
                style={[
                  styles.welcomeText,
                  styles.orange_color,
                  styles.textMedium,
                  styles.textBold
                ]}
              >
                {this.props.navigation.state.params.prdName}
              </Text>

              <SafeAreaView>
                <OrderFormIV
                  onSubmit={this.handleSubmit}
                  product={this.props.product}
                  navigation={navigation}
                />
              </SafeAreaView>
            </View>
          </DismissKeyboard>
        </ScrollView>
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

// OrderFormIII = reduxForm({
//   form: 'orderformIII',
// })(OrderFormIII)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderFormIII)

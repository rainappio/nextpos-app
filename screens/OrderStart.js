import React from 'react'
import { connect } from 'react-redux'
import { ActivityIndicator, AsyncStorage, Text, View } from 'react-native'
import {
  clearProduct,
  getTablesAvailable,
  getOrdersByDateRange
} from '../actions'
import OrderForm from './OrderForm'
import {api, dispatchFetchRequest, makeFetchRequest} from '../constants/Backend'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import BackBtn from '../components/BackBtn'

class OrderStart extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    this.props.getTablesAvailable()
  }

  handleSubmit = values => {

    const createOrder = {}
    createOrder.orderType = values.orderType
    createOrder.tableId = values.tableId
    createOrder.demographicData = {
      male: values.male,
      female: values.female,
      kid: values.kid,
      ageGroup: values.ageGroup,
      visitFrequency: values.visitFrequency
    }
    var Person = createOrder.demographicData
    var male = Person.male !== undefined ? Person.male : 0
    var female = Person.female !== undefined ? Person.male : 0
    var kid = Person.kid !== undefined ? Person.kid : 0
    var customerCount = male + female + kid

    dispatchFetchRequest(api.order.new, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createOrder)
      },
      response => {
        response.json().then(data => {
          this.props.navigation.navigate('OrderFormII', {
            orderId: data.orderId,
            onSubmit: this.props.navigation.state.params.handleOrderSubmit,
            handleDelete: this.props.navigation.state.params.handleDelete,
            customerCount: customerCount
          })
        })
      }).then()
  }

  render() {
    const { navigation, isLoading, haveData, availableTables, tableLayouts } = this.props

    let tablesMap = {}

    tableLayouts && availableTables && tableLayouts.map(layout => {
      const tables = availableTables[layout.id];

      if (tables !== undefined) {
        tablesMap[layout.layoutName] = tables
      }
    })

    if (isLoading || !haveData) {
      return (
        <View style={[styles.container]}>
          <ActivityIndicator size="large" color="#ccc" />
        </View>
      )
    }

    return (
      <OrderForm
        onSubmit={this.handleSubmit}
        navigation={navigation}
        tablesMap={tablesMap}
      />
    )
  }
}

const mapStateToProps = state => ({
  tableLayouts: state.tablelayouts.data.tableLayouts,
  availableTables: state.tablesavailable.data.availableTables,
  haveData: state.tablesavailable.haveData,
  haveError: state.tablesavailable.haveError,
  isLoading: state.tablesavailable.loading
})

const mapDispatchToProps = dispatch => ({
  clearProduct: () => dispatch(clearProduct()),
  getTablesAvailable: () => dispatch(getTablesAvailable()),
  getOrdersByDateRange: () => dispatch(getOrdersByDateRange())
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderStart)

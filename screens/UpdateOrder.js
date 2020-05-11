import React from 'react'
import {connect} from 'react-redux'
import {clearProduct, getTablesAvailable} from '../actions'
import OrderForm from './OrderForm'
import {api, dispatchFetchRequest} from '../constants/Backend'
import {LocaleContext} from '../locales/LocaleContext'
import LoadingScreen from "./LoadingScreen";

class UpdateOrder extends React.Component {
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
    console.log(values)

    const updateOrder = {}
    updateOrder.orderType = values.orderType
    updateOrder.tableId = values.tableId
    updateOrder.demographicData = {
      male: values.male,
      female: values.female,
      kid: values.kid,
      ageGroup: values.ageGroup,
      visitFrequency: values.visitFrequency
    }

    dispatchFetchRequest(api.order.update(values.orderId), {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateOrder)
      },
      response => {
        response.json().then(data => {
          this.props.navigation.navigate('OrdersSummary', {
            orderId: data.orderId
          })
        })
      }).then()
  }

  render() {
    const { navigation, isLoading, haveData, availableTables, tableLayouts } = this.props
    const order = this.props.navigation.getParam('order')

    const initialValues = {
      orderId: order.orderId,
      orderType: order.orderType,
      tableId: order.tableInfo != null ? order.tableInfo.tableId : null,
      ageGroup: order.demographicData != null ? order.demographicData.ageGroup : null,
      visitFrequency: order.demographicData != null ? order.demographicData.visitFrequency : null,
      male: order.demographicData != null ? order.demographicData.male : 0,
      female: order.demographicData != null ? order.demographicData.female : 0,
      kid: order.demographicData != null ? order.demographicData.kid : 0
    }

    let tablesMap = {}

    tableLayouts && availableTables && tableLayouts.map(layout => {
      const availableTableIds = availableTables[layout.id] != null ? availableTables[layout.id].map(t => t.tableId) : []

      const tables = layout.tables.filter(table => {
        return availableTableIds.includes(table.tableId) || table.tableId === initialValues.tableId
      })

      if (tables != null && tables.length > 0) {
        tablesMap[layout.layoutName] = tables
      }
    })

    if (isLoading) {
      return (
        <LoadingScreen/>
      )
    } else {
      return (
        <OrderForm
          onSubmit={this.handleSubmit}
          navigation={navigation}
          tablesMap={tablesMap}
          initialValues={initialValues}
        />
      )
    }
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
  getTablesAvailable: () => dispatch(getTablesAvailable())
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateOrder)

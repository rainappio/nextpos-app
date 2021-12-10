import React from 'react'
import {connect} from 'react-redux'
import {clearProduct, getTablesAvailable, getTableLayouts} from '../actions'
import OrderForm from './OrderForm'
import {api, dispatchFetchRequest} from '../constants/Backend'
import {LocaleContext} from '../locales/LocaleContext'
import LoadingScreen from "./LoadingScreen";
import RetailStartOrderForm from './RetailStartOrderForm'

class OrderStart extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    this._getTables = this.props.navigation.addListener('focus', () => {
      this.props.getTablesAvailable()
      this.props.getTableLayouts()
    })
  }
  componentWillUnmount() {
    this._getTables()
  }

  handleSubmit = values => {

    const createOrder = {}
    createOrder.orderType = values.orderType
    createOrder.tableIds = values?.tableIds
    createOrder.demographicData = {
      male: values.male,
      female: values.female,
      kid: values.kid,
      ageGroup: values.ageGroup,
      visitFrequency: values.visitFrequency
    }

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
          this.props.navigation.navigate(this.context.appType === 'store' ? 'OrderFormII' : 'RetailOrderForm', {
            orderId: data.orderId,
            route: this.props?.route?.params?.route ?? null
          })
        })
      }).then()
  }

  render() {
    const {navigation, route, isLoading, haveData, availableTables, tableLayouts} = this.props
    const {appType} = this.context
    const initialValues = {
      male: 0,
      female: 0,
      kid: 0
    }


    let tablesMap = {}

    tableLayouts && availableTables && tableLayouts.map(layout => {
      const tables = availableTables[layout.id];

      if (tables !== undefined) {
        tablesMap[layout.layoutName] = tables
      }
    })


    if (isLoading || !haveData) {
      return (
        <LoadingScreen />
      )
    } else {
      return (
        appType === 'store' ?
          <OrderForm
            onSubmit={this.handleSubmit}
            navigation={navigation}
            route={route}
            tablesMap={tablesMap}
            initialValues={{...initialValues, orderType: route?.params?.orderType ?? null}}
          /> :
          <RetailStartOrderForm
            onSubmit={this.handleSubmit}
            navigation={navigation}
            route={route}
            tablesMap={tablesMap}
            initialValues={{...initialValues, orderType: 'TAKE_OUT'}}
          />
      )
    }
  }
}

const mapStateToProps = state => ({
  tableLayouts: state.tablelayouts.data.tableLayouts,
  availableTables: state.tablesavailable.data.availableTables,
  haveData: state.tablesavailable.haveData || state.tablelayouts.haveData,
  haveError: state.tablesavailable.haveError,
  isLoading: state.tablesavailable.loading || state.tablelayouts.loading
})

const mapDispatchToProps = dispatch => ({
  clearProduct: () => dispatch(clearProduct()),
  getTableLayouts: () => dispatch(getTableLayouts()),
  getTablesAvailable: () => dispatch(getTablesAvailable()),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderStart)

import React from 'react'
import { connect } from 'react-redux'
import { ActivityIndicator, AsyncStorage, Text, View } from 'react-native'
import {
  clearProduct,
  getTablesAvailable,
  getOrdersByDateRange
} from '../actions'
import OrderForm from './OrderForm'
import { api, makeFetchRequest } from '../constants/Backend'
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

    this.state = {
      t: context.t
    }
  }

  componentDidMount() {
    this.props.getTablesAvailable()

    this.context.localize({
      en: {
        noAvailableTables: 'There is no available table.'
      },
      zh: {
        noAvailableTables: '目前沒有空桌.'
      }
    })
  }

  handleSubmit = values => {
    var createOrder = {}
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

    makeFetchRequest(token => {
      fetch(api.order.new, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.access_token}`
        },
        body: JSON.stringify(createOrder)
      })
        .then(response => {
          if (response.status === 200) {
            this.props.getTablesAvailable()
            this.props.navigation.navigate('OrderFormII', {
              tableId: createOrder.tableId,
              onSubmit: this.props.navigation.state.params.handleOrderSubmit,
              handleDelete: this.props.navigation.state.params.handleDelete,
              customerCount: customerCount
            })
            this.props.getOrdersByDateRange()
          } else {
            alert('pls try again')
          }
        })
        .catch(error => {
          console.error(error)
        })
    })
  }

  render() {
    const { navigation, isLoading, haveData, availableTables } = this.props
    const { t } = this.state

    let tables = []
    const availableTablesArr =
      availableTables !== undefined && Object.keys(availableTables)
    availableTablesArr &&
      availableTablesArr.map(key => {
        availableTables[key].map(table => {
          tables.push({
            value: table.tableId,
            label: table.tableName
          })
        })
      })

    if (isLoading || !haveData) {
      return (
        <View style={[styles.container]}>
          <ActivityIndicator size="large" color="#ccc" />
        </View>
      )
    } else if (!availableTablesArr || availableTablesArr.length === 0) {
      return (
        <View style={[styles.container]}>
          <BackBtn />
          <Text>{t('noAvailableTables')}</Text>
        </View>
      )
    }

    return (
      <OrderForm
        onSubmit={this.handleSubmit}
        navigation={navigation}
        tables={tables}
      />
    )
  }
}

const mapStateToProps = state => ({
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

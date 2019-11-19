import React from 'react'
import { connect } from 'react-redux'
import { AsyncStorage, View, Text } from 'react-native'
import ProductFormScreen from './ProductFormScreen'
import { getProducts, getLables, getLabel, clearProduct } from '../actions'
import OrderForm from './OrderForm'

class OrderStart extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    refreshing: false
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
    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      fetch('http://35.234.63.193/orders', {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': tokenObj.application_client_id,
          Authorization: 'Bearer ' + tokenObj.access_token
        },
        body: JSON.stringify(createOrder)
      })
        .then(response => {
          if (response.status === 200) {
            this.props.navigation.navigate('OrderFormII', {
              tableId: createOrder.tableId,
              onSubmit: this.props.navigation.state.params.handleOrderSubmit,
              handleDelete: this.props.navigation.state.params.handleDelete,
              customerCount: customerCount
            })
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
    const { navigation } = this.props
    const { refreshing } = this.state

    return (
      <OrderForm
        onSubmit={this.handleSubmit}
        navigation={navigation}
        refreshing={refreshing}
        tables={this.props.navigation.state.params.tables}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  clearProduct: () => dispatch(clearProduct())
})
export default connect(
  null,
  mapDispatchToProps
)(OrderStart)

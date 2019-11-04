import React from 'react'
import { connect } from 'react-redux'
import { AsyncStorage, View, Text } from 'react-native'
import ProductFormScreen from './ProductFormScreen'
import { getProducts, getLables, getLabel } from '../actions'
import OrderForm from './OrderForm'

class OrderStart extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    refreshing: false
  }

  handleSubmit = values => {
  	console.log(values);
  	console.log("first order")
    var createOrder = {}
    createOrder.tableId = values.tableId
    createOrder.demographicData = {
      male: values.male,
      female: values.female,
      kid: values.kid,
      ageGroup: values.ageGroup,
      visitFrequency: values.visitFrequency
    }
		console.log(createOrder)
    //AsyncStorage.getItem('orderToken', (err, value) => {
    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      console.log(tokenObj)
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
              tableId: createOrder.tableId
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

export default OrderStart

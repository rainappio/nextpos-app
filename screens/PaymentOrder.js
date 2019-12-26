import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
import {
  getProducts,
  getLables,
  getLabel,
  getfetchOrderInflights,
  clearOrder,
  getOrder
} from '../actions'
import {
  successMessage,
  api,
  makeFetchRequest,
  errorAlert
} from '../constants/Backend'
import BackBtn from '../components/BackBtn'
import InputText from '../components/InputText'
import { isRequired } from '../validators'
import { DismissKeyboard } from '../components/DismissKeyboard'
import PaymentOrderForm from './PaymentOrderForm'
import styles from '../styles'

class PaymentOrder extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    numbersArr: [],
    dynamicTotal: ''
  }

  addNum = num => {
    let numbersArr = [...this.state.numbersArr]
    numbersArr.push(num)
    this.setState({ numbersArr })

    new Promise.resolve(numbersArr).then(arr => {
      let total = 0
      arr.map(num => (total += num))
      this.setState({
        dynamicTotal: total
      })
    })
  }

  handleComplete = id => {
    makeFetchRequest(token => {
      const formData = new FormData()
      formData.append('action', 'COMPLETED')
      fetch(`${api.apiRoot}/orders/${id}/process?action=COMPLETE`, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          Authorization: 'Bearer ' + token.access_token
        },
        body: formData
      })
        .then(response => response.json())
        .then(res => {
          if (res) {
            this.props.navigation.navigate('TablesSrc')
            this.props.getfetchOrderInflights()
            this.props.clearOrder(id)
          } else {
            alert(res.message === undefined ? 'pls try again' : res.message)
          }
        })
        .catch(error => {
          console.error(error)
        })
    })
  }

  handleSubmit = values => {
    var cashObj = {
      orderId: this.props.navigation.state.params.order.orderId,
      paymentMethod: 'CASH',
      billType: 'SINGLE',
      cash: values.cash
    }
    makeFetchRequest(token => {
      fetch(api.payment.charge, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token.access_token
        },
        body: JSON.stringify(cashObj)
      })
        .then(response => {
          if (response.status === 200) {
            successMessage('Charged')
            this.props.navigation.navigate('CheckoutComplete', {
              discountTotal: this.props.navigation.state.params.discountTotal,
              onSubmit: this.handleComplete,
              orderId: this.props.navigation.state.params.order.orderId
            })
          } else {
            errorAlert(response)
          }
        })
        .catch(error => {
          console.error(error)
        })
    })
  }

  render() {
    return (
      <PaymentOrderForm
        onSubmit={this.handleSubmit}
        order={this.props.navigation.state.params.order}
        navigation={this.props.navigation}
        discountTotal={this.props.navigation.state.params.discountTotal}
        addNum={this.addNum}
        dynamicTotal={this.state.dynamicTotal}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  getfetchOrderInflights: () => dispatch(getfetchOrderInflights()),
  clearOrder: id => dispatch(clearOrder(id))
})
export default connect(
  null,
  mapDispatchToProps
)(PaymentOrder)

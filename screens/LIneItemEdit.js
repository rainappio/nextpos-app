import React, { Component } from 'react'
import {
  View,
  Text,
  ScrollView,
  AsyncStorage,
  ActivityIndicator
} from 'react-native'
import { connect } from 'react-redux'
import LIneItemForm from './LIneItemForm'
import { getOrder } from '../actions'
import { api, makeFetchRequest } from '../constants/Backend'
import styles from '../styles'

class LIneItemEdit extends Component {
  static navigationOptions = {
    header: null
  }

  componentDidMount() {
    this.props.getOrder()
  }

  // handleEditCancel = () => {
  //   this.props.clearClient()
  //   this.props.getClientUsrs()
  //   this.props.navigation.navigate('StaffsOverview')
  // }

  handleUpdate = values => {
    var lineItemId = this.props.navigation.state.params.lineItemId
    var orderId = this.props.navigation.state.params.orderId
    var updatedLineItemCount = {}
    updatedLineItemCount.quantity = values.quantity
    makeFetchRequest(token => {
      fetch(`${api.apiRoot}/orders/${orderId}/lineitems/${lineItemId}`, {
        method: 'PATCH',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': token.application_client_id,
          Authorization: 'Bearer ' + token.access_token
        },
        body: JSON.stringify(updatedLineItemCount)
      })
        .then(response => {
          if (response.status === 200) {
            this.props.navigation.navigate('OrdersSummary')
            this.props.getOrder()
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
    const {
      navigation,
      clientuser,
      clearProduct,
      haveData,
      haveError,
      isLoading
    } = this.props

    if (isLoading) {
      return (
        <View style={[styles.container]}>
          <ActivityIndicator size="large" color="#ccc" />
        </View>
      )
    } else if (haveData) {
      return (
        <LIneItemForm
          navigation={navigation}
          initialValues={this.props.navigation.state.params.initialValues}
          // handleEditCancel={this.handleEditCancel}
          onSubmit={this.handleUpdate}
        />
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = state => ({
  order: state.order.data,
  haveData: state.order.haveData,
  haveError: state.order.haveError,
  isLoading: state.order.loading
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getOrder: id => dispatch(getOrder(props.navigation.state.params.orderId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LIneItemEdit)

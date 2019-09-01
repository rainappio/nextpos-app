import React, { Component } from 'react'
import { View, Text, ScrollView, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import BackBtn from '../components/BackBtn'
import { DismissKeyboard } from '../components/DismissKeyboard'
import ProductFormScreen from './ProductFormScreen'
import { getLables, getProduct, clearProduct, getProducts } from '../actions'
import styles from '../styles'

class ProductEdit extends Component {
  static navigationOptions = {
    header: null
  }

  state = {
    isEditForm: true,
    isSaving: false,
    saveError: true,
    refreshing: false
  }

  componentDidMount() {
    this.props.getLables()
    this.props.load()
  }

  handleEditCancel = () => {
    this.props.clearProduct()
    this.props.navigation.navigate('ProductsOverview')
  }

  handleUpdate = values => {
    var prdId = this.props.navigation.state.params.productId
    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      fetch(`http://35.234.63.193/products/${prdId}`, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': tokenObj.clientId,
          Authorization: 'Bearer ' + tokenObj.access_token
        },
        body: JSON.stringify(values)
      })
        .then(response => {
          console.log(response)
          if (response.status === 200) {
            this.props.clearProduct(prdId)
            this.props.navigation.navigate('ProductsOverview', {
              productId: prdId
            })

            this.setState({
              isSaving: true,
              saveError: false,
              refreshing: true
            })
            this.props.getProducts() !== undefined &&
              this.props.getProducts().then(() => {
                this.setState({
                  refreshing: false
                })
              })
          } else {
            alert('pls try again')
          }
        })
        .catch(error => {
          this.setState({
            isSaving: false,
            saveError: true
          })
          console.error(error)
        })
    })
  }

  render() {
    const {
      labels,
      navigation,
      product,
      clearProduct,
      haveData,
      haveError,
      loading
    } = this.props
    const { isEditForm, refreshing } = this.state
    product.price != undefined ? (product.price += '') : null

    if (haveData) {
      return (
        <ProductFormScreen
          labels={labels}
          isEditForm={isEditForm}
          navigation={navigation}
          initialValues={product}
          handleEditCancel={this.handleEditCancel}
          onSubmit={this.handleUpdate}
          refreshing={refreshing}
        />
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = state => ({
  gblahs: state,
  labels: state.labels.data.labels,
  product: state.product.data,
  haveData: state.product.haveData,
  haveError: state.product.haveError,
  loading: state.product.loading
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getLables: () => dispatch(getLables()),
  load: () => {
    dispatch(getProduct(props.navigation.state.params.productId))
  },
  clearProduct: () =>
    dispatch(clearProduct(props.navigation.state.params.productId)),
  getProducts: () => dispatch(getProducts())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductEdit)

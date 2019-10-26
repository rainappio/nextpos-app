import React, { Component } from 'react'
import {
  View,
  Text,
  ScrollView,
  AsyncStorage,
  ActivityIndicator
} from 'react-native'
import { connect } from 'react-redux'
import ProductFormScreen from './ProductFormScreen'
import {
  getLables,
  getProduct,
  clearProduct,
  getProducts,
  getProductOptions,
  getWorkingAreas
} from '../actions'
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
    this.props.getProductOptions()
    this.props.getWorkingAreas()
    this.props.getProduct()
  }

  handleEditCancel = () => {
    this.props.clearProduct()
    this.props.getProducts()
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
      isLoading,
      prodctoptions,
      workingareas
    } = this.props
    const { isEditForm, refreshing } = this.state
    product.price != undefined ? (product.price += '') : null

    if (isLoading) {
      return (
        <View style={[styles.container]}>
          <ActivityIndicator size="large" color="#ccc" />
        </View>
      )
    } else if (haveData) {
      return (
        <ProductFormScreen
          labels={labels}
          isEditForm={isEditForm}
          navigation={navigation}
          initialValues={product}
          handleEditCancel={this.handleEditCancel}
          onSubmit={this.handleUpdate}
          refreshing={refreshing}
          workingareas={workingareas}
          prodctoptions={prodctoptions}
        />
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = state => ({
  labels: state.labels.data.labels,
  product: state.product.data,
  haveData: state.product.haveData,
  haveError: state.product.haveError,
  isLoading: state.product.loading,
  prodctoptions: state.prodctsoptions.data.results,
  workingareas: state.workingareas.data.workingAreas
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getLables: () => dispatch(getLables()),
  load: () => {
    dispatch(getProduct(props.navigation.state.params.productId))
  },
  clearProduct: () =>
    dispatch(clearProduct(props.navigation.state.params.productId)),
  getProducts: () => dispatch(getProducts()),
  getWorkingAreas: () => dispatch(getWorkingAreas()),
  getProductOptions: () => dispatch(getProductOptions()),
  getProduct: () =>
    dispatch(getProduct(props.navigation.state.params.productId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductEdit)

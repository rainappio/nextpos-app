import React, { Component } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { connect } from 'react-redux'
import ProductFormScreen from './ProductFormScreen'
import {
  clearProduct,
  getLables,
  getProduct,
  getProductOptions,
  getProducts,
  getWorkingAreas
} from '../actions'
import styles from '../styles'
import {
  api, dispatchFetchRequest,
  errorAlert,
  makeFetchRequest,
  successMessage
} from '../constants/Backend'
import LoadingScreen from "./LoadingScreen";

class ProductEdit extends Component {
  static navigationOptions = {
    header: null
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
    let prdId = this.props.navigation.state.params.productId

    dispatchFetchRequest(api.product.update(prdId), {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    }, response => {
      this.props.clearProduct(prdId)
      this.props.navigation.navigate('ProductsOverview')
      this.props.getProducts()
    }).then()
  }

  handleDelete = () => {
    let productId = this.props.navigation.state.params.productId

    dispatchFetchRequest(api.product.delete(productId), {
      method: 'DELETE',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }, response => {
      this.props.navigation.navigate('ProductsOverview')
      this.props.getProducts()
    }).then()
  }

  handlepinToggle = productId => {
    dispatchFetchRequest(
      api.product.togglePin(productId),
      {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      response => {
        successMessage('Toggled')
        this.props.navigation.navigate('ProductsOverview')
        this.props.getProducts()
      }
    ).then()
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
    product.price !== undefined ? (product.price += '') : null

    if (isLoading) {
      return (
        <LoadingScreen />
      )
    } else if (haveData) {
      return (
        <ProductFormScreen
          labels={labels}
          isEditForm={true}
          navigation={navigation}
          initialValues={product}
          handleEditCancel={this.handleEditCancel}
          handleDeleteProduct={this.handleDelete}
          onSubmit={this.handleUpdate}
          workingareas={workingareas}
          prodctoptions={prodctoptions}
          isPinned={this.props.navigation.state.params.isPinned}
          productId={this.props.navigation.state.params.productId}
          handlepinToggle={this.handlepinToggle}
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
  getProductOptions: () => {
    const labelId = props.navigation.state.params.labelId

    if (labelId !== undefined && labelId != null && labelId !== '0') {
      dispatch(getProductOptions(props.navigation.state.params.labelId))
    }
  },
  getProduct: () =>
    dispatch(getProduct(props.navigation.state.params.productId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductEdit)

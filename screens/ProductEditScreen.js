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
import { api, makeFetchRequest } from '../constants/Backend'

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
    let prdId = this.props.navigation.state.params.productId

    makeFetchRequest(token => {
      fetch(api.product.update(prdId), {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token.access_token
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

  handleDelete = () => {
    let productId = this.props.navigation.state.params.productId

    makeFetchRequest(token => {
      fetch(api.product.delete(productId), {
        method: 'DELETE',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token.access_token
        }
      })
        .then(response => {
          if (response.status === 204) {
            this.props.navigation.navigate('ProductsOverview')
            this.setState({ refreshing: true })
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
          handleDeleteProduct={this.handleDelete}
          onSubmit={this.handleUpdate}
          refreshing={refreshing}
          workingareas={workingareas}
          prodctoptions={prodctoptions}
          screenProps={this.props.screenProps}
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
  getProductOptions: () =>
    dispatch(getProductOptions(props.navigation.state.params.labelId)),
  getProduct: () =>
    dispatch(getProduct(props.navigation.state.params.productId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductEdit)

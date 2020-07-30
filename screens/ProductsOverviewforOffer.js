import React from 'react'
import {connect} from 'react-redux'
import {getLables, getProducts} from '../actions'
import LoadingScreen from "./LoadingScreen";
import ProductRowforOffer from './ProductRowforOffer'
import BackendErrorScreen from "./BackendErrorScreen";

class ProductsOverviewforOffer extends React.Component {
  static navigationOptions = {
    header: null
  }

  componentDidMount() {
    this.props.getProducts()
    this.props.getLables()
  }

  render() {
    const {
      products = [],
      navigation,
      haveData,
      haveError,
      isLoading,
      labels = []
    } = this.props

    if (isLoading) {
      return (
        <LoadingScreen />
      )
    } else
      if (haveError) {
        return (
          <BackendErrorScreen />
        )
      }
    return (
      <ProductRowforOffer
        products={products}
        navigation={navigation}
        labels={labels}
        isEditForm={this.props.navigation.state.params !== undefined && this.props.navigation.state.params.isEditForm}
        updatedProducts={this.props.navigation.state.params !== undefined && this.props.navigation.state.params.updatedselectedProducts}
      />
    )
  }
}

const mapStateToProps = state => ({
  products: state.products.data.results,
  haveData: state.labels.haveData,
  haveError: state.labels.haveError,
  isLoading: state.labels.loading,
  labels: state.labels.data.labels
})

const mapDispatchToProps = dispatch => ({
  getProducts: () => dispatch(getProducts()),
  getLables: () => dispatch(getLables())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductsOverviewforOffer)

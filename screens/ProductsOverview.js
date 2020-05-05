import React from 'react'
import { connect } from 'react-redux'
import { getProducts, getLables } from '../actions'
import LoadingScreen from "./LoadingScreen";
import ProductRow from './ProductRow'

class ProductsOverview extends React.Component {
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
      <ProductRow
        products={products}
        navigation={navigation}
        getProduct={this.props.getProduct}
        labels={labels}
        isLoading={isLoading}
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
)(ProductsOverview)

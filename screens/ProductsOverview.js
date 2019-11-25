import React from 'react'
import { connect } from 'react-redux'
import { getProducts, getLables } from '../actions'
import ProductListScreen from './ProductListScreen'

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
      labels
    } = this.props

    return (
      <ProductListScreen
        products={products}
        navigation={navigation}
        haveData={haveData}
        haveError={haveError}
        isLoading={isLoading}
        labels={labels}
      />
    )
  }
}

const mapStateToProps = state => ({
  products: state.products.data.results,
  haveData: state.products.haveData,
  haveError: state.products.haveError,
  isLoading: state.products.loading,
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

import React from 'react'
import {connect} from 'react-redux'
import {getLables, getProducts} from '../actions'
import LoadingScreen from "./LoadingScreen";
import ProductRow from './ProductRow'
import BackendErrorScreen from "./BackendErrorScreen";
import {View} from "react-native";

class ProductsOverview extends React.Component {
  static navigationOptions = {
    header: null
  }

  componentDidMount() {
    this._geInitialValue = this.props.navigation.addListener('focus', () => {
      this.props.getProducts()
      this.props.getLables()
    })
  }
  componentWillUnmount() {
    this._geInitialValue()
  }

  render() {
    const {
      products = [],
      navigation,
      route,
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
      <View style={{flex: 1}}>
        <ProductRow
          products={products}
          labels={labels}
          navigation={navigation}
          route={route}
        />
      </View>
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

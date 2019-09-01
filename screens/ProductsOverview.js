import React from 'react'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlight,
  TextInput,
  AsyncStorage
} from 'react-native'
import { connect } from 'react-redux'
import { getProducts } from '../actions'
import ProductListScreen from './ProductListScreen'

class ProductsOverview extends React.Component {
  static navigationOptions = {
    header: null
  }

  componentDidMount() {
    this.props.getProducts()
  }

  render() {
    const {
      products = [],
      navigation,
      haveData,
      haveError,
      isLoading
    } = this.props

    return (
      <ProductListScreen
        products={products}
        navigation={navigation}
        haveData={haveData}
        haveError={haveError}
        isLoading={isLoading}
      />
    )
  }
}

const mapStateToProps = state => ({
  gs: state,
  products: state.products.data.results,
  haveData: state.products.haveData,
  haveError: state.products.haveError,
  isLoading: state.products.loading
})

const mapDispatchToProps = dispatch => ({
  getProducts: () => dispatch(getProducts())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductsOverview)

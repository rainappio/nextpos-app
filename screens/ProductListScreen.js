import React from 'react'
import {Text, View} from 'react-native'
import {connect} from 'react-redux'
import ProductRow from './ProductRow'
import styles from '../styles'
import LoadingScreen from "./LoadingScreen";
import BackendErrorScreen from "./BackendErrorScreen";

export const ProductListScreen = ({
  isLoading,
  haveError,
  products,
  navigation,
  route,
  getProduct,
  dispatch,
  labels
}) => {
  if (isLoading) {
    return (
      <LoadingScreen />
    )
  } else if (haveError) {
    return (
      <BackendErrorScreen />
    )
  } else if (products !== undefined && products.length === 0) {
    return (
      <View style={[styles.container]}>
        <Text>no products ...</Text>
      </View>
    )
  }
  return (
    <ProductRow
      products={products}
      navigation={navigation}
      route={route}
      getProduct={getProduct}
      labels={labels}
    />
  )
}

const mapDispatchToProps = dispatch => ({
  dispatch,
  doLogout: () => {
    dispatch(doLogout())
  }
})

export default connect(
  null,
  mapDispatchToProps
)(ProductListScreen)

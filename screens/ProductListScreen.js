import React from 'react'
import { Text, View, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import ProductRow from './ProductRow'
import styles from '../styles'

export const ProductListScreen = ({
  isLoading,
  haveError,
  products,
  navigation,
  getProduct,
  dispatch,
  labels
}) => {
  if (isLoading) {
    return (
      <View style={[styles.container]}>
        <ActivityIndicator size="large" color="#ccc" />
      </View>
    )
  } else if (haveError) {
    return (
      <View style={[styles.container]}>
        <Text>Err during loading, check internet conn...</Text>
      </View>
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

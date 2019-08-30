import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  TouchableHighlight,
  TextInput,
  RefreshControl,
  AsyncStorage
} from 'react-native'
import { connect } from 'react-redux'
import ProductRow from './ProductRow'
import styles from '../styles'

export const ProductListScreen = ({
  isLoading,
  haveError,
  products,
  navigation,
  getProduct,
  dispatch
}) => {
  if (isLoading) {
    return (
      <View style={[styles.container]}>
        <Text>loading data....</Text>
      </View>
    )
  } else if (haveError) {
    return (
      <View style={[styles.container]}>
        <Text>Err during loading, check internet conn...</Text>
      </View>
    )
  } else if (products.length === 0) {
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

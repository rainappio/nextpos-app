import React from 'react'
import { Text, View, ActivityIndicator } from 'react-native'
import OrdersSummaryRow from './OrdersSummaryRow'
import styles from '../styles'

export const OrdersSummaryRowOverView = ({
  isLoading,
  haveError,
  order,
  navigation,
  initialValues
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
  } else if (order !== undefined && order.length === 0) {
    return (
      <View style={[styles.container]}>
        <Text>no order ...</Text>
      </View>
    )
  }
  return (
    <OrdersSummaryRow
      order={order}
      navigation={navigation}
      initialValues={initialValues}
    />
  )
}

export default OrdersSummaryRowOverView

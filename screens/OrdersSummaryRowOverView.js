import React from 'react'
import { Text, View, ActivityIndicator } from 'react-native'
import OrdersSummaryRow from './OrdersSummaryRow'
import styles from '../styles'
import LoadingScreen from "./LoadingScreen";
import BackendErrorScreen from "./BackendErrorScreen";

export const OrdersSummaryRowOverView = ({
  isLoading,
  haveError,
  order,
  navigation,
  initialValues,
  haveData
}) => {
  if (isLoading) {
    return (
      <LoadingScreen/>
    )
  } else if (haveError) {
    return (
      <BackendErrorScreen/>
    )
  } else if (haveData) {
    return (
      <OrdersSummaryRow
        order={order}
        navigation={navigation}
        initialValues={initialValues}
      />
    )
  } else {
    return null
  }
}

export default OrdersSummaryRowOverView

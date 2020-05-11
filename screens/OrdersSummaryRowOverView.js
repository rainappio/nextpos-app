import React from 'react'
import OrdersSummaryRow from './OrdersSummaryRow'

export const OrdersSummaryRowOverView = (
  {
    order,
    navigation
  }) => {

  return (
    <OrdersSummaryRow
      order={order}
      navigation={navigation}
      initialValues={order}
    />
  )
}

export default OrdersSummaryRowOverView

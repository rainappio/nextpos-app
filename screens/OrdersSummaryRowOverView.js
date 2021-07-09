import React from 'react'
import OrdersSummaryRow from './OrdersSummaryRow'

export const OrdersSummaryRowOverView = (
  {
    order,
    navigation,
    route
  }) => {

  return (
    <OrdersSummaryRow
      order={order}
      navigation={navigation}
      route={route}
      initialValues={order}
    />
  )
}

export default OrdersSummaryRowOverView

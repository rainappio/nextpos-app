import React from 'react'
import ProductRow from './ProductRow'

export const ProductListScreen = ({
  products,
  navigation,
  getProduct,
  labels
}) => (
    <ProductRow
      products={products}
      navigation={navigation}
      getProduct={getProduct}
      labels={labels}
    />
  )

export default ProductListScreen

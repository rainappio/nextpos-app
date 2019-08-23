import React, { Component } from 'react'
import { View, Text, ScrollView } from 'react-native'
import styles from '../styles'

class ProductEditScreen extends Component {
  static navigationOptions = {
    header: null
  }

  state = {
    isEditForm: true
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Product Edit Component</Text>
      </View>
    )
  }
}

export default ProductEditScreen

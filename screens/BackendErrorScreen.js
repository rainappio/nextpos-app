import styles from '../styles'
import { Text, View } from 'react-native'
import React from 'react'

// todo: use this on all screens that need to show backend error.
export default class BackendErrorScreen extends React.Component {
  render() {
    return (
      <View style={[styles.container]}>
        <Text>
          There is a temporary issue. Please try again momentarily or consult
          your service provider.
        </Text>
      </View>
    )
  }
}

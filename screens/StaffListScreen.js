import React from 'react'
import { Text, View, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import StaffRow from './StaffRow'
import styles from '../styles'

export const StaffListScreen = ({
  isLoading,
  haveError,
  clientusers,
  navigation
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
  } else if (clientusers.length === 0) {
    return (
      <View style={[styles.container]}>
        <Text>no clientusers ...</Text>
      </View>
    )
  }
  return <StaffRow clientusers={clientusers} navigation={navigation} />
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
)(StaffListScreen)

import React, { Component } from 'react'
import { View, Switch, StyleSheet } from 'react-native'

export default RNSwitch = props => {
  const {
    input: { onChange, value, ...otherInput },
    meta,
    ...rest
  } = props
  return (
    <View>
      <Switch
        onValueChange={onChange}
        value={value}
        {...otherInput}
        {...rest}
      />
    </View>
  )
}

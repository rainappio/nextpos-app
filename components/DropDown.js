import React, { Component } from 'react'
import { StyleSheet, View, Text, Picker, Platform } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import styles from '../styles'

export default class DropDown extends Component {
  render() {
    const {
      input: { onChange, value, ...inputProps },
      children,
      meta: { error, touched, valid },
      options,
      placeholder,
      forFilter
    } = this.props

    return (
      <View>
        <View
          style={{
            paddingTop: Platform.OS === 'ios' ? 12 : 4,
            paddingBottom: Platform.OS === 'ios' ? 12 : 4,
            paddingLeft: 0
          }}
        >
          <RNPickerSelect
            placeholder={placeholder}
            items={options}
            onValueChange={value => onChange(value)}
            value={value}
            {...inputProps}
          />
        </View>
        {!valid && touched && <Text style={styles.rootError}>{error}</Text>}
      </View>
    )
  }
}

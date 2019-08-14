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
      options
    } = this.props

    return (
      <View>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#f1f1f1',
            paddingTop: Platform.OS === 'ios' ? 30 : 4,
            paddingBottom: Platform.OS === 'ios' ? 12 : 4,
            paddingLeft: Platform.OS === 'ios' ? 9 : 4,
            marginBottom: 8
          }}
        >
          <RNPickerSelect
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

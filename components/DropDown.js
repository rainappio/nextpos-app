import React, { Component } from 'react'
import { StyleSheet, View, Text, Picker, Platform } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import styles, {mainThemeColor} from '../styles'

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
      <View style={{flex: 1}}>
        <View
          style={{
            borderWidth: 1,
            borderColor: mainThemeColor,
            paddingTop: Platform.OS === 'ios' ? 12 : 4,
            paddingBottom: Platform.OS === 'ios' ? 12 : 4,
            paddingHorizontal: 8,
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

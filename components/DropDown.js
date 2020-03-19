import React, { Component } from 'react'
import { StyleSheet, View, Text, Picker, Platform } from 'react-native'
import { Chevron } from 'react-native-shapes'
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

          <RNPickerSelect
            placeholder={placeholder}
            items={options}
            onValueChange={value => onChange(value)}
            value={value}
            {...inputProps}
            useNativeAndroidPickerStyle={false}
            style={pickerSelectStyles}
            Icon={() => {
              return <Chevron size={1.5} color="gray" />;
            }}
          />
      
        {!valid && touched && <Text style={styles.rootError}>{error}</Text>}
      </View>
    )
  }
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#f1f1f1',
    borderRadius: 4,
    color: 'black'
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black'
  },
  iconContainer: {
    top: Platform.OS === 'ios' ? 18 : 16,
    right: 15,
  }
});

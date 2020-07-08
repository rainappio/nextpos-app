import React, { Component } from 'react'
import { StyleSheet, View, Text, Picker, Platform } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import { Chevron } from 'react-native-shapes'
import Icon from 'react-native-vector-icons/Ionicons'
import styles, { mainThemeColor } from '../styles'

export default class DropDown extends Component {
  render() {
    const {
      input: { onChange, value, ...inputProps },
      children,
      meta: { error, touched, valid },
      options,
      placeholder
    } = this.props

    return (
      <View style={{flex: 1}}>
        <RNPickerSelect
          placeholder={placeholder}
          items={options}
          onValueChange={value => onChange(value)}
          value={value}
          {...inputProps}
          useNativeAndroidPickerStyle={false}
          style={pickerSelectStyles}
          Icon={() => {
            return (
              <Icon name='md-arrow-dropdown' size={30} style={{ position: 'absolute', top: -9, right: 0, borderWidth: 0 }} />
            )
            //return <Chevron size={1.5} color="gray" />;
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
    borderColor: '#ddd',
    borderRadius: 4,
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
    top: 18,
    right: 15,
  }
});

import React, {Component} from 'react'
import {StyleSheet, Text, View} from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import Icon from 'react-native-vector-icons/Ionicons'
import styles from '../styles'
import {withContext} from "../helpers/contextHelper";

class DropDown extends Component {

  componentDidMount() {
    !!this.props?.defaultValue && this.props?.input?.onChange(this.props?.defaultValue?.value)
  }
  render() {
    const {
      input: {onChange, value, ...inputProps},
      children,
      meta: {error, touched, valid},
      options,
      placeholder,
      themeStyle,
      defaultValue,
      disabled,
    } = this.props

    const color = themeStyle.color

    return (
      <View style={{flex: 1}}>
        {<RNPickerSelect
          disabled={disabled ?? false}
          placeholder={placeholder ?? {}}
          items={options}
          onValueChange={value => onChange(value)}
          value={value}
          useNativeAndroidPickerStyle={false}
          style={pickerSelectStyles(color)}
          Icon={() => {
            return (
              <Icon name='caret-down' size={24} color={color} style={{position: 'absolute', top: -9, right: 0, borderWidth: 0}} />
            )
          }}
        />}
        {!valid && touched && <Text style={styles.rootError}>{error}</Text>}
      </View>
    )
  }
}

const pickerSelectStyles = (color) => {
  return StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: '#ddd',
      //borderRadius: 4,
      color: color
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: '#ddd',
      borderRadius: 8,
      color: color
    },
    iconContainer: {
      top: 18,
      right: 15,
    }
  });
}

export default withContext(DropDown)

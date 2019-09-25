import React, { Component } from 'react'
import { StyleSheet, View, Text, Picker, Platform } from 'react-native'
import SmoothPinCodeInput from 'react-native-smooth-pincode-input'
import styles from '../styles'

export default class PinCodeInput extends Component {
  render() {
    const {
      input: { onChange, onBlur, value, ...inputProps },
      children,
      meta: { error, touched, valid },
      options,
      customHeight,
      ...rest
    } = this.props

    return (
      <View>
        <View style={[styles.jc_alignIem_center]}>
          <SmoothPinCodeInput
            placeholder={
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 25,
                  // opacity: 0.3,
                  backgroundColor: '#000'
                }}
              ></View>
            }
            mask={
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 25,
                  backgroundColor: '#ddd'
                }}
              ></View>
            }
            maskDelay={1000}
            password={true}
            cellStyle={{
              borderWidth: 1,
              borderRadius: 2,
              borderColor: 'orange',
              // backgroundColor: 'transparent',
              height: customHeight,
              marginRight: 8
            }}
            cellStyleFocused={null}
            value={value}
            onTextChange={value => onChange(value)}
            {...inputProps}
          />
        </View>
        {!valid && touched && <Text style={styles.rootError}>{error}</Text>}
      </View>
    )
  }
}

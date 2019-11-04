import React, { Component } from 'react'
import { StyleSheet, View, Text, Picker, Platform } from 'react-native'
import SmoothPinCodeInput from 'react-native-smooth-pincode-input'
import styles from '../styles'

/**
 * Reference: https://www.npmjs.com/package/react-native-smooth-pincode-input
 */
export default class PinCodeInput extends Component {
  constructor(props) {
    super(props)

    this.state = {
      passwordValue: ''
    }
  }

  render() {
    const {
      input: { onChange, onBlur, value, ...inputProps },
      children,
      meta: { error, touched, valid },
      options,
      customHeight,
      editable,
      ...rest
    } = this.props

    return (
      <View>
        <View style={[styles.jc_alignIem_center]}>
          <SmoothPinCodeInput
            placeholder=""
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
            autoFocus={true}
            cellStyle={{
              borderWidth: 1,
              borderRadius: 2,
              borderColor: 'orange',
              // backgroundColor: 'transparent',
              height: customHeight,
              marginRight: 8
            }}
            cellStyleFocused={null}
            editable={editable}
            value={this.state.passwordValue}
            onTextChange={value => this.setState({ passwordValue: value })}
            onFulfill={value => onChange(value)}
            {...inputProps}
          />
        </View>
        {!valid && touched && <Text style={styles.rootError}>{error}</Text>}
      </View>
    )
  }
}

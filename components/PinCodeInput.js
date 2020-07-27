import React, {Component} from 'react'
import {Text, View} from 'react-native'
import SmoothPinCodeInput from 'react-native-smooth-pincode-input'
import styles, {mainThemeColor} from '../styles'

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
            cellStyle={{
              borderWidth: 1,
              borderRadius: 2,
              borderColor: mainThemeColor,
              height: customHeight,
              marginHorizontal: 4
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

import React, {Component} from 'react'
import {Text, View} from 'react-native'
import SmoothPinCodeInput from 'react-native-smooth-pincode-input'
import styles from '../styles'
import {withContext} from "../helpers/contextHelper";

/**
 * Reference: https://www.npmjs.com/package/react-native-smooth-pincode-input
 */
class PinCodeInput extends Component {
  constructor(props) {
    super(props)

    this.state = {
      passwordValue: ''
    }
  }

  render() {
    const {
      input: {onChange, onBlur, value, ...inputProps},
      children,
      meta: {error, touched, valid},
      options,
      customHeight,
      editable,
      locale: {customMainThemeColor},
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
              borderColor: customMainThemeColor,
              height: customHeight,
              marginHorizontal: 4
            }}
            cellStyleFocused={null}
            editable={editable}
            value={this.state.passwordValue}
            onTextChange={value => {this.setState({passwordValue: value}); onChange(value)}}
            onFulfill={value => onChange(value)}
            keyboardType='number-pad'
            {...inputProps}
          />
        </View>
        {!valid && touched && <Text style={styles.rootError}>{error}</Text>}
      </View>
    )
  }
}

export default withContext(PinCodeInput)

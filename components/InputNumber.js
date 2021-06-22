import React from 'react'
import {Text, View} from 'react-native'
import NumericInput from 'react-native-numeric-input'
import styles from '../styles'
import {withContext} from "../helpers/contextHelper";

const InputNumber = ({
  input: {
    onChange,
    onSubmitEditing,
    onFocus,
    value,
    minValue
  },
  meta: {error, touched, valid},
  themeStyle,
  locale: {customMainThemeColor, customBackgroundColor, customBorderColor},
  ...rest
}) => {
  return (
    <View>
      <NumericInput
        onChange={onChange}
        onSubmitEditing={() => onSubmitEditing}
        onFocus={onFocus}
        value={parseInt(value, 10)}
        initValue={value}
        minValue={minValue}
        inputStyle={{
          color: customMainThemeColor
        }}
        upDownButtonsBackgroundColor={customBackgroundColor}
        iconStyle={{color: customMainThemeColor}}
        borderColor={customBorderColor}
        {...rest}
      />
      {!valid && touched && <Text style={styles.rootError}>{error}</Text>}
    </View>
  )
}
export default withContext(InputNumber)

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

  const parsedNumber = parseInt(value, 10)

  return (
    <View>
      <NumericInput
        onChange={onChange}
        onSubmitEditing={() => onSubmitEditing}
        onFocus={onFocus}
        value={parsedNumber}
        initValue={parsedNumber}
        minValue={minValue}
        inputStyle={{
          color: customMainThemeColor
        }}
        // upDownButtonsBackgroundColor={customBackgroundColor}
        iconStyle={{color: '#fff'}}
        borderColor={customMainThemeColor}
        leftButtonBackgroundColor={customMainThemeColor}
        rightButtonBackgroundColor={customMainThemeColor}
        {...rest}
      />
      {!valid && touched && <Text style={styles.rootError}>{error}</Text>}
    </View>
  )
}
export default withContext(InputNumber)

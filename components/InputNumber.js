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
  customVal,
  meta: {error, touched, valid},
  themeStyle,
  locale: {customMainThemeColor, customBackgroundColor, customBorderColor},
  ...rest
}) => (
    <View>
      <NumericInput
        onChange={onChange}
        onSubmitEditing={onSubmitEditing}
        onFocus={onFocus}
        value={parseInt(value)}
        initValue={customVal}
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
export default withContext(InputNumber)

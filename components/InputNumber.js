import React from 'react'
import PropTypes from 'prop-types'
import {
  TextInput,
  Text,
  View,
  Keyboard,
  InputAccessoryView,
  TouchableOpacity,
  Platform
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import NumericInput from 'react-native-numeric-input'
import styles from '../styles'

const InputNumber = ({
  input: {
    onChange,
    onSubmitEditing,
    onFocus,
    value,
    minValue
  },
  customVal,
  meta: { error, touched, valid },
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
      upDownButtonsBackgroundColor={'#f1f1f1'}
      {...rest}
    />
    {!valid && touched && <Text style={styles.rootError}>{error}</Text>}
  </View>
)
export default InputNumber

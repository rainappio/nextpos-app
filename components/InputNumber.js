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
  meta: { error, touched, valid },
  themeStyle,
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
        color: themeStyle.color
      }}
      {...rest}
    />
    {!valid && touched && <Text style={styles.rootError}>{error}</Text>}
  </View>
)
export default withContext(InputNumber)

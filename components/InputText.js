import React from 'react'
import PropTypes from 'prop-types'
import { TextInput, Text, View, StyleSheet } from 'react-native'
import styles from '../styles'

const InputText = ({
  input: { onBlur, onChange, onFocus, value, placeholder, secureTextEntry },
  meta: { error, touched, valid },
  ...rest
}) => (
  <View>
    <TextInput
      onBlur={onBlur}
      onChangeText={onChange}
      onFocus={onFocus}
      secureTextEntry={secureTextEntry}
      {...rest}
      style={[
        styles.rootInput,
        { borderColor: !valid && touched ? 'red' : 'gray' }
      ]}
    />
    {!valid && touched && <Text style={styles.rootError}>{error}</Text>}
  </View>
)

InputText.propTypes = {
  input: PropTypes.shape({
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired
  }).isRequired,
  meta: PropTypes.shape({
    error: PropTypes.string,
    touched: PropTypes.bool.isRequired,
    valid: PropTypes.bool.isRequired
  }).isRequired
}

export default InputText

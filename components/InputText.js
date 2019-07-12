import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, Text, View, StyleSheet } from 'react-native';

const InputText = ({ input: { onBlur, onChange, onFocus, value, placeholder }, meta: { error, touched, valid }, ...rest}) => (
	<View>
		<TextInput
			onBlur={onBlur}
			onChangeText={onChange}
			onFocus={onFocus}
			{...rest}
			style={[styles.rootInput, {borderColor: !valid && touched ? 'red' : 'gray'}]}
		/>
		{!valid && touched && <Text style={styles.rootError}>{error}</Text>}
	</View>
);

InputText.propTypes = {
  input: PropTypes.shape({
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  meta: PropTypes.shape({
    error: PropTypes.string,
    touched: PropTypes.bool.isRequired,
    valid: PropTypes.bool.isRequired,
  }).isRequired,
}

const styles = StyleSheet.create({
  rootInput: {
    borderWidth: 1,
    height: 40,
    padding: 10,
  },
  rootError: {
    color: 'red',
  },
});

export default InputText;
import React from 'react'
import PropTypes from 'prop-types'
import {InputAccessoryView, Keyboard, Platform, Text, TextInput, TouchableOpacity, View} from 'react-native'
import styles from '../styles'
import {withContext} from "../helpers/contextHelper";

const InputText = ({
  input: {
    name,
    onBlur,
    onChange,
    onSubmitEditing,
    onFocus,
    value,
    secureTextEntry,
    keyboardType,
    editable,
    onPress,
    autoCapitalize,
  },
  meta: {error, touched, valid},
  height, alignLeft, extraStyle, defaultValue,
  themeStyle, complexTheme,
  ...rest
}) => (
    <View style={[styles.flex(1)]}>
      <TextInput
        onBlur={onBlur}
        onChangeText={onChange}
        onSubmitEditing={onSubmitEditing}
        onFocus={onFocus}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        value={typeof (value) == 'number' ? value.toString() : value}
        editable={editable}
        autoCapitalize={autoCapitalize}
        placeholder={defaultValue ?? null}
        placeholderTextColor={complexTheme.invalid.color}
        inputAccessoryViewID={name}
        {...rest}
        style={[
          themeStyle,

          {height: height},
          (alignLeft && {textAlign: 'left'}),
          styles?.rootInput(rest?.locale),
          styles?.withBorder(rest?.locale),
          extraStyle,
        ]}
      />
      {Platform.OS === 'ios' && (
        <InputAccessoryView nativeID={name}>
          <TouchableOpacity
            onPress={() => Keyboard.dismiss()}
            style={[{flex: 1, flexDirection: 'row-reverse'}, styles.grayBg]}
          >
            <Text
              style={[
                styles.margin_15,
                {fontSize: 16, fontWeight: 'bold', color: rest?.locale?.customMainThemeColor}
              ]}
            >
              Done
          </Text>
          </TouchableOpacity>
        </InputAccessoryView>
      )}
      {!valid && touched && <Text style={[styles.rootError]}>{error}</Text>}
    </View>
  )

InputText.propTypes = {
  input: PropTypes.shape({
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired
  }).isRequired,
  meta: PropTypes.shape({
    error: PropTypes.string,
    touched: PropTypes.bool.isRequired,
    valid: PropTypes.bool.isRequired
  }).isRequired
}

export default withContext(InputText)

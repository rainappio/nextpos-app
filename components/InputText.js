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
import styles,{ mainThemeColor } from '../styles'
import { ThemeContext } from '../mode_switcher/themeContext'

const InputText = ({
  input: {
    name,
    onBlur,
    onChange,
    onSubmitEditing,
    onFocus,
    value,
    placeholder,
    secureTextEntry,
    keyboardType,
    editable,
    onPress,
    autoCapitalize
  },
  meta: { error, touched, valid },
  height, alignLeft, extraStyle,
  ...rest
}) => (
    <ThemeContext.Consumer>
      {({ theme }) => (
        <View>
          <TextInput
            onBlur={onBlur}
            onChangeText={onChange}
            onSubmitEditing={onSubmitEditing}
            onFocus={onFocus}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            value={value}
            editable={editable}
            autoCapitalize={autoCapitalize}
            inputAccessoryViewID={name}
            placeholderTextColor={theme.color}
            {...rest}
            style={[
              styles.rootInput,
              { borderColor: !valid && touched ? 'red' : 'gray' },
              { height: height },
              (alignLeft && { textAlign: 'left' }),
              extraStyle
            ]}
          />
          {Platform.OS === 'ios' && (
            <InputAccessoryView nativeID={name}>
              <TouchableOpacity
                onPress={() => Keyboard.dismiss()}
                style={[{ flex: 1, flexDirection: 'row-reverse' }, styles.grayBg]}
              >
                <Text
                  style={[
                    styles.margin_15,
                    { fontSize: 16, fontWeight: 'bold', color: mainThemeColor }
                  ]}
                >
                  Done
                </Text>
              </TouchableOpacity>
            </InputAccessoryView>
          )}
          {!valid && touched && <Text style={styles.rootError}>{error}</Text>}
        </View>
      )}
    </ThemeContext.Consumer>
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

export default InputText

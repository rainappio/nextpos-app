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
import styles from '../styles'

const InputText = ({
  input: {
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
  isgrayBg,
  iscustomizeCate,
  height,
  fontSize,
  ...rest
}) => (
  <View>
    {isgrayBg ? (
      <Icon
        name="md-search"
        size={30}
        color="#f18d1a"
        style={{ position: 'absolute', zIndex: 2, left: 8, top: 8 }}
      />
    ) : (
      <Text>{''}</Text>
    )}
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
      inputAccessoryViewID="stateless"
      {...rest}
      style={[
        styles.rootInput,
        { borderColor: !valid && touched ? 'red' : 'gray' },
        isgrayBg ? styles.grayBg : '',
        isgrayBg ? styles.leftpadd32 : styles.nopaddingLeft,
        iscustomizeCate ? styles.centerText : '',
        iscustomizeCate ? styles.textBig : '',
        { height: height },
        { fontSize: fontSize }
      ]}
    />
    {Platform.OS === 'ios' && (
      <InputAccessoryView nativeID="stateless">
        <TouchableOpacity
          onPress={() => Keyboard.dismiss()}
          style={[{ flex: 1, flexDirection: 'row-reverse' }, styles.grayBg]}
        >
          <Text
            style={[
              styles.margin_15,
              { fontSize: 16, fontWeight: 'bold', color: '#F39F86' }
            ]}
          >
            Done
          </Text>
        </TouchableOpacity>
      </InputAccessoryView>
    )}
    {!valid && touched && <Text style={styles.rootError}>{error}</Text>}
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

export default InputText

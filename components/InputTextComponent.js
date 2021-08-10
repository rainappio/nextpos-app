import React from 'react'
import {InputAccessoryView, Keyboard, Platform, Text, TextInput, TouchableOpacity, View} from 'react-native'
import styles from '../styles'
import {withContext} from "../helpers/contextHelper";


class InputTextComponent extends React.Component {

    // refer: https://codesandbox.io/s/rlx390xn6m?file=/SimpleForm.js
    render() {
        const {
            input: {
                name,
                onBlur,
                onChange,
                onSubmitEditing,
                onEndEditing,
                onFocus,
                value,
                secureTextEntry,
                keyboardType,
                editable,
                onPress,
                autoCapitalize,
            },
            setFieldToBeFocused = () => {},
            meta: {error, touched, valid},
            height, alignLeft, extraStyle, defaultValue,
            themeStyle, complexTheme,
            ...rest
        } = this.props

        return (
            <View style={[styles.flex(1)]}>
                <TextInput
                    ref={input => setFieldToBeFocused(input)}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    onSubmitEditing={onSubmitEditing}
                    onEndEditing={onEndEditing}
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
    }
}

export default withContext(InputTextComponent)

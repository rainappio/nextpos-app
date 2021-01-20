import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {InputAccessoryView, Keyboard, Platform, Text, TextInput, TouchableOpacity, View} from 'react-native'
import styles, {mainThemeColor} from '../styles'
import {withContext} from "../helpers/contextHelper";
import DropDownPicker from 'react-native-dropdown-picker';
import IonIcon from 'react-native-vector-icons/Ionicons'

const DropDownInputText = ({
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
    themeStyle, complexTheme, pickerLabels,
    ...rest
}) => {

    const [shift, setShift] = useState(pickerLabels?.[0]?.value ?? null);
    const handlePickerChange = (data) => {
        console.log('handlePickerChange', data)
        onChange(data?.label)
    }
    useEffect(() => {
        !!defaultValue && onChange(defaultValue)
    }, [])
    return (
        <View style={{flexDirection: 'row'}}>
            <DropDownPicker
                items={pickerLabels}
                showArrow={true}
                defaultValue={pickerLabels?.[0]?.value ?? null}
                containerStyle={{flex: 1, minWidth: 50, marginRight: 10}}
                style={{...themeStyle, justifyContent: 'flex-start'}}
                itemStyle={{
                    ...themeStyle, justifyContent: 'flex-start'
                }}
                labelStyle={[themeStyle, {textAlign: 'left'}]}
                dropDownMaxHeight={250}
                dropDownStyle={{...themeStyle, }}
                arrowColor={themeStyle.color}
                selectedLabelStyle={{
                    padding: 0, margin: 0
                }}
                onChangeItem={item => handlePickerChange(item)}
            />
            <View style={[styles.flex(3)]}>
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
                        styles.rootInput,

                        {height: height},
                        (alignLeft && {textAlign: 'right'}),
                        themeStyle,
                        styles.withBorder,
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
                                    {fontSize: 16, fontWeight: 'bold', color: mainThemeColor}
                                ]}
                            >
                                Done
          </Text>
                        </TouchableOpacity>
                    </InputAccessoryView>
                )}
                {!valid && touched && <Text style={[styles.rootError]}>{error}</Text>}
            </View>
        </View>
    )
}

DropDownInputText.propTypes = {
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

export default withContext(DropDownInputText)

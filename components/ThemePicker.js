import React, {useState, useContext, useEffect} from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native'
import {StyledText} from "./StyledText";
import styles from '../styles'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button} from 'react-native-elements';
import {api, dispatchFetchRequestWithOption} from '../constants/Backend'
import {LocaleContext} from '../locales/LocaleContext'


export const ThemePicker = (props) => {

    const {customMainThemeColor, theme} = useContext(LocaleContext)
    const [selectColor, setSelectColor] = useState(customMainThemeColor)

    const handleSelectColor = (color) => {
        props?.handleSelectColor && props?.handleSelectColor(color)
        setSelectColor(color)
    }

    const isSelected = (color) => {
        if (theme === 'light') {
            if (color === customMainThemeColor) {
                return true
            } else {
                return false
            }
        } else {
            if (color === '#000') {
                return true
            } else {
                return false
            }
        }
    }
    return (
        <View style={[styles.tableCellView, {justifyContent: 'space-between'}, props?.style]}>
            {props?.colors && props?.colors.map((color) => {
                return (
                    <TouchableOpacity
                        onPress={() => handleSelectColor(color)}
                        style={[{backgroundColor: color}, isSelected(color) ? {width: 40, height: 40, borderRadius: 40, borderColor: color, borderWidth: 3} : {width: 30, height: 30, borderRadius: 30, borderColor: color, borderWidth: 1}]} ></TouchableOpacity>
                )
            })}
        </View>
    )
}
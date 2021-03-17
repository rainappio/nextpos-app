import React, {useState, useContext, useEffect} from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native'
import {StyledText} from "./StyledText";
import styles from '../styles'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button} from 'react-native-elements';
import {api, dispatchFetchRequestWithOption} from '../constants/Backend'
import {LocaleContext} from '../locales/LocaleContext'

/*
   Date   : 2020-10-05
   Author : GGGODLIN
   Content: props
                onPress={()=>{}}
                title={string}
                style={{}}
                

*/
export const BottomMainActionButton = (props) => {
    const {customMainThemeColor} = useContext(LocaleContext)
    return (
        <TouchableOpacity
            onPress={props?.onPress ?? (() => console.warn('no onPress'))}
        >
            <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor), props?.style]}>
                {props?.title ?? 'Submit'}
            </Text>
        </TouchableOpacity>
    )
}

export const MainActionButton = (props) => {
    const {customMainThemeColor} = useContext(LocaleContext)
    return (
        <TouchableOpacity
            onPress={props?.onPress ?? (() => console.warn('no onPress'))}
        >
            <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor), {padding: 10, marginBottom: 0, }, props?.style]}>
                {props?.title ?? 'Submit'}
            </Text>
        </TouchableOpacity>
    )
}

export const SecondActionButton = (props) => {
    const {customMainThemeColor} = useContext(LocaleContext)
    return (
        <TouchableOpacity
            onPress={props?.onPress ?? (() => console.warn('no onPress'))}
            style={props?.containerStyle}
        >
            <Text style={props?.style ?? [styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(useContext(LocaleContext))]}>
                {props?.title ?? 'Submit'}
            </Text>
        </TouchableOpacity>
    )
}

export const MainActionFlexButton = (props) => {
    const {customMainThemeColor} = useContext(LocaleContext)

    return (
        <TouchableOpacity
            onPress={props?.onPress ?? (() => console.warn('no onPress'))}
            style={styles?.flexButton(customMainThemeColor)}
        >
            <Text style={styles.flexButtonText}>
                {props?.title ?? 'Submit'}
            </Text>
        </TouchableOpacity>
    )
}

export const DeleteFlexButton = (props) => {
    const {customMainThemeColor} = useContext(LocaleContext)
    return (
        <TouchableOpacity
            onPress={props?.onPress ?? (() => console.warn('no onPress'))}
            style={[styles?.flexButton(customMainThemeColor), {
                borderColor: '#f75336',
                color: '#fff',
                backgroundColor: '#f75336'
            }]}
        >
            <Text style={styles.flexButtonText}>
                {props?.title ?? 'Submit'}
            </Text>
        </TouchableOpacity>
    )
}


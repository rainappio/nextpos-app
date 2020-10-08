import React, {useState, useContext, useEffect} from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native'
import {StyledText} from "./StyledText";
import styles from '../styles'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {mainThemeColor} from '../styles';
import {Button} from 'react-native-elements';
import {api, dispatchFetchRequestWithOption} from '../constants/Backend'

/*
   Date   : 2020-10-05
   Author : GGGODLIN
   Content: props
                onPress={()=>{}}
                title={string}
                style={{}}
                

*/
export const BottomMainActionButton = (props) => {

    return (
        <TouchableOpacity
            onPress={props?.onPress ?? (() => console.warn('no onPress'))}
        >
            <Text style={[styles.bottomActionButton, styles.actionButton, props?.style]}>
                {props?.title ?? 'Submit'}
            </Text>
        </TouchableOpacity>
    )
}

export const MainActionButton = (props) => {

    return (
        <TouchableOpacity
            onPress={props?.onPress ?? (() => console.warn('no onPress'))}
        >
            <Text style={[styles.bottomActionButton, styles.actionButton, {padding: 10, marginBottom: 0, }, props?.style]}>
                {props?.title ?? 'Submit'}
            </Text>
        </TouchableOpacity>
    )
}


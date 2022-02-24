import React, {useContext} from 'react';
import {Alert, Text, TouchableOpacity} from 'react-native'
import styles from '../styles'
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
            <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor), {marginBottom: 0}, props?.style]}>
                {props?.title ?? 'Submit'}
            </Text>
        </TouchableOpacity>
    )
}

export const SecondActionButton = (props) => {
  const {customMainThemeColor, t} = useContext(LocaleContext)
  const {confirmPrompt} = props
  const onPress = props?.onPress ?? (() => console.warn('no onPress'))

  const handlePress = () => {

    if (!!confirmPrompt) {
      Alert.alert(
        `${t('action.confirmMessageTitle')}`,
        `${t('action.confirmMessage')}`,
        [
          {
            text: `${t('action.yes')}`,
            onPress: () => onPress()
          },
          {
            text: `${t('action.no')}`,
            onPress: () => console.log('Cancelled'),
            style: 'cancel'
          }
        ]
      )
    } else {
      onPress()
    }
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={props?.containerStyle}
    >
      <Text
        style={props?.style ?? [styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(useContext(LocaleContext))]}>
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


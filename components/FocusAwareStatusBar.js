import React from 'react'
import {View} from 'react-native'
import {useIsFocused} from '@react-navigation/native';
import * as Device from 'expo-device';
import {StatusBar} from 'expo-status-bar';

let customDeviceIds = [
  'iPhone11,8', // iphone XR
  'iPhone12,1', // iphone 11
  'iPhone12,3',
  'iPhone12,5',
  'iPhone13,1', // iphone 12
  'iPhone13,2',
  'iPhone13,3',
  'iPhone13,4',
]
let currDevice = Device.modelId

export let statusHeight = customDeviceIds.includes(currDevice) ? 40 : 20

export const FocusAwareStatusBar = (props) => {

  const isFocused = useIsFocused();
  return isFocused ?
    <View style={[{backgroundColor: '#222'}, Platform.OS === 'ios' && {height: statusHeight}]}>
      <StatusBar {...props} style="light" backgroundColor="#222" />
    </View>
    : null;
}


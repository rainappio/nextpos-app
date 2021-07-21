import React from 'react'
import {View, StatusBar} from 'react-native'
import {useIsFocused} from '@react-navigation/native';
import * as Device from 'expo-device';

export const FocusAwareStatusBar = (props) => {

  // let currDevice = Device.modelName
  let currDevice = Device.modelId

  let customDeviceIds = [
    'iPhone11,8', // iphone XR
    'iPhone12,1', // iphone 11
    'iPhone12,3',
    'iPhone12,5',
    'iPhone12,8',
    'iPhone13,1', // iphone 12
    'iPhone13,2',
    'iPhone13,3',
    'iPhone13,4',
  ]
  let statusHeight = customDeviceIds.includes(currDevice) ? 40 : 20

  const isFocused = useIsFocused();
  return isFocused ?
    <View style={{backgroundColor: '#222', height: statusHeight}}>
      <StatusBar {...props} />
    </View>
    : null;
}

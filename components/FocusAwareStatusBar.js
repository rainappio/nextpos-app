import React from 'react'
import {View, StatusBar} from 'react-native'
import {useIsFocused} from '@react-navigation/native';
import * as Device from 'expo-device';

export const FocusAwareStatusBar = (props) => {

  let currDevice = Device.modelName
  let customDevices = [
    'iPhone 11',
    'iPhone 11 Pro',
    'iPhone 11 Pro Max',
    'iPhone 12 mini',
    'iPhone 12',
    'iPhone 12 Pro',
    'iPhone 12 Pro Max'
  ]
  let statusHeight = customDevices.includes(currDevice) ? 40 : 20
  console.log(currDevice)

  const isFocused = useIsFocused();
  return isFocused ?
    <View style={{backgroundColor: '#222', height: statusHeight}}>
      <StatusBar {...props} />
    </View>
    : null;
}

import React from 'react'
import {View, StatusBar} from 'react-native'
import {useIsFocused} from '@react-navigation/native';

export const FocusAwareStatusBar = (props) => {

  const isFocused = useIsFocused();
  return isFocused ?
    <View style={{backgroundColor: '#222', height: 20}}>
      <StatusBar {...props} />
    </View>
    : null;
}

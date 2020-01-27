import React from 'react'
// import { Icon } from 'expo'
import { Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from '../constants/Colors'

let isTablet = Dimensions.get('window').width >= 900

export default class TabBarIcon extends React.Component {
  render() {
    return (    	
      <Icon
        name={this.props.name}
        size={isTablet ? 50 : 20}
        style={{ marginBottom: -3 }}
        color={
          this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault
        }
        onPress={this.props.onPress}
      />
    )
  }
}

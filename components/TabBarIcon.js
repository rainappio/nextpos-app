import React from 'react'
// import { Icon } from 'expo'
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from '../constants/Colors'
import { isTablet } from '../actions'

export default class TabBarIcon extends React.Component {
  render() {
    return (
      <Icon
        name={this.props.name}
        size={isTablet ? 50 : 25}
        style={{ marginBottom: -3 }}
        color={
          this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault
        }
        onPress={this.props.onPress}
      />
    )
  }
}

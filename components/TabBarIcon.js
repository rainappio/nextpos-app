import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
//import FontAwesomeIcon from 'react-native-vector-icons/FontAwesomeIcon'
import Colors from '../constants/Colors'

export default class TabBarIcon extends React.Component {
  render() {
    return (
      <Icon
        name={this.props.name}
        size={32}
        style={{ marginBottom: -3 }}
        color={
          this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault
        }
        onPress={this.props.onPress}
      />
    )
  }
}

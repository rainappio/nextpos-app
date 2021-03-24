import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
//import FontAwesomeIcon from 'react-native-vector-icons/FontAwesomeIcon'
import Colors from '../constants/Colors'
import {withContext} from "../helpers/contextHelper";
import {MaterialIcons} from '@expo/vector-icons';

class TabBarIcon extends React.Component {
  render() {
    const {locale: {customMainThemeColor, customSecondThemeColor, customBackgroundColor, customTabBarIconColor}, iconLib} = this.props
    const elementProps = {
      name: this.props.name,
      size: 32,
      style: {
        flex: 1,
        textAlign: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
      },
      color: this.props.focused ? customSecondThemeColor : customTabBarIconColor,
      onPress: this.props.onPress
    }
    if (iconLib === 'MaterialIcons') {
      return (
        <MaterialIcons
          {...elementProps}
        />
      )
    }
    return (
      <Icon
        {...elementProps}
      />
    )
  }
}

export default withContext(TabBarIcon)
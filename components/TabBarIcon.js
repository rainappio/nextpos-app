import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
//import FontAwesomeIcon from 'react-native-vector-icons/FontAwesomeIcon'
import Colors from '../constants/Colors'
import {withContext} from "../helpers/contextHelper";

class TabBarIcon extends React.Component {
  render() {
    const {locale: {customMainThemeColor, customSecondThemeColor, customBackgroundColor}} = this.props
    return (
      <Icon
        name={this.props.name}
        size={32}
        style={{flex: 1, textAlign: 'center', justifyContent: 'center', alignSelf: 'center'}}
        color={
          this.props.focused ? customSecondThemeColor : (customMainThemeColor === '#006B35') ? customBackgroundColor : 'gray'
        }
        onPress={this.props.onPress}
      />
    )
  }
}

export default withContext(TabBarIcon)
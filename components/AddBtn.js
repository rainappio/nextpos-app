import React from 'react'
import {TouchableOpacity, View} from 'react-native'
import {withNavigation} from '@react-navigation/compat'
import Icon from 'react-native-vector-icons/Ionicons'
import {withContext} from "../helpers/contextHelper";
import {LocaleContext} from '../locales/LocaleContext'

class AddBtn extends React.Component {
  static contextType = LocaleContext
  render() {
    const {onPress, disabled} = this.props
    const {customMainThemeColor, customSecondThemeColor} = this.context
    return (
      <TouchableOpacity
        hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
        onPress={onPress}
        disabled={disabled}
      >
        <View>
          <Icon name="md-add" size={32} color={customSecondThemeColor} />
        </View>
      </TouchableOpacity>
    )
  }
}

export default withNavigation(withContext(AddBtn))

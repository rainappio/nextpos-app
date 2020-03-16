import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { withNavigation } from 'react-navigation'
import Icon from 'react-native-vector-icons/Ionicons'
import {mainThemeColor} from "../styles";

class AddBtn extends React.Component {
  render() {
    const { onPress, disabled } = this.props

    return (
      <TouchableOpacity
        hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
        onPress={onPress}
        disabled={disabled}
      >
        <View>
          <Icon name="md-add" size={32} color={mainThemeColor} />
        </View>
      </TouchableOpacity>
    )
  }
}

export default withNavigation(AddBtn)

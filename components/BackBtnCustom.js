import React from 'react'
import {TouchableOpacity, View} from 'react-native'
import {withNavigation} from 'react-navigation'
import Icon from 'react-native-vector-icons/Ionicons'

class BackBtnCustom extends React.Component {
  render() {
    const {onPress} = this.props
    return (
      <TouchableOpacity
        hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
        onPress={onPress}
        style={{position: 'absolute', top: -4, zIndex: 2}}
      >
        <View>
          <Icon name="chevron-back" size={26} color="#f18d1a" />
        </View>
      </TouchableOpacity>
    )
  }
}

export default withNavigation(BackBtnCustom)

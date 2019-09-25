import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { withNavigation } from 'react-navigation'
import Icon from 'react-native-vector-icons/Ionicons'

class AddBtn extends React.Component {
  render() {
    const { onPress } = this.props
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{ position: 'absolute', right: 0, top: -8 }}
      >
        <View>
          <Icon name="ios-add" size={35} color="#f18d1a" />
        </View>
      </TouchableOpacity>
    )
  }
}

export default withNavigation(AddBtn)

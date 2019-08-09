import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { withNavigation } from 'react-navigation'
import Icon from 'react-native-vector-icons/Ionicons'

class AddBtn extends React.Component {
  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('Product')
        }}
        style={{ position: 'absolute', right: 0, top: -8 }}
      >
        <View>
          <Icon name="ios-add" size={40} color="#f18d1a" />
        </View>
      </TouchableOpacity>
    )
  }
}

export default withNavigation(AddBtn)

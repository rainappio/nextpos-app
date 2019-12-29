import React from 'react'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlight,
  TextInput,
  AsyncStorage
} from 'react-native'
import { CheckBox } from 'react-native-elements'
import images from '../../assets/images'

class RenderPureCheckBox extends React.Component {
  state = {
    checked: true
  }

  render() {
    const {
      input: { onBlur, onChange, onFocus, value },
      customValue,
      optionName,
      total,
      getPercent,
      meta: { error, toched, valid },
      ...rest
    } = this.props

    return (
      <View>
        <CheckBox
          title={optionName}
          checkedIcon={
            <Image
              source={images.checkicon}
              style={{ width: 35, height: 35 }}
            />
          }
          uncheckedIcon={
            <Image
              source={images.checkiconOutline}
              style={{ width: 35, height: 35 }}
            />
          }
          checked={value === customValue}
          onPress={() => onChange(customValue)}
        />
      </View>
    )
  }
}
export default RenderPureCheckBox

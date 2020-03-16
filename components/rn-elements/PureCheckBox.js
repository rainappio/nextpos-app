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
import IonIcon from 'react-native-vector-icons/Ionicons'
import images from '../../assets/images'
import {mainThemeColor} from "../../styles";

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
      meta: { error, toched, valid },
      ...rest
    } = this.props

    return (
      <View>
        <CheckBox
          title={
            <IonIcon
              name={customValue}
              size={26}
              color={mainThemeColor}
              style={{ marginLeft: 22 }}
            />
          }
          checkedIcon={
            <Image
              source={images.checkicon}
              style={{ width: 20, height: 20 }}
            />
          }
          uncheckedIcon={
            <Image
              source={images.checkiconOutline}
              style={{ width: 20, height: 20 }}
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

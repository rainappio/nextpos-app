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

class RenderCheckBox extends React.Component {
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
          title={
            typeof customValue.discount === 'string' ? (
              <TextInput
                style={{
                  height: 40,
                  width: '80%',
                  borderBottomColor: '#ddd',
                  borderBottomWidth: 1,
                  paddingLeft: 15
                }}
                onChangeText={val => {
                  onChange({ discount: val, orderDiscount: 'ENTER_DISCOUNT' })
                  getPercent(val)
                }}
                keyboardType={'numeric'}
                placeholder="Enter Discount"
              />
            ) : (
              optionName
            )
          }
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
          checked={
            typeof value.discount !== 'string'
              ? value.discount === customValue.discount
              : typeof value.discount == typeof customValue.discount
          }
          onPress={() => {
            onChange(customValue)
            getPercent(customValue.discount)
          }}
        />
      </View>
    )
  }
}
export default RenderCheckBox

import React from 'react'
import {Image, Text, View} from 'react-native'
import {CheckBox} from 'react-native-elements'
import images from "../assets/images";

export default class CustomCheckBox extends React.Component {
  render() {
    const {
      input: {onChange, value},
      customValue,
      optionName,
      ...rest
    } = this.props

    return (
      <CheckBox
        title={optionName}
        checkedIcon={
          <Image
            source={images.checkicon}
            style={{width: 35, height: 35}}
          />
        }
        uncheckedIcon={
          <Image
            source={images.checkiconOutline}
            style={{width: 35, height: 35}}
          />
        }
        checked={value === customValue}
        onPress={() => {
          onChange(customValue)
        }}
      />
    )
  }
}

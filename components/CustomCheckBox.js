import React from 'react'
import {Image, Text, View} from 'react-native'
import {CheckBox} from 'react-native-elements'
import images from "../assets/images";
import {StyledText} from "./StyledText";
import {withContext} from "../helpers/contextHelper";

class CustomCheckBox extends React.Component {
  render() {
    const {
      input: {onChange, value},
      customValue,
      optionName,
      checkboxType,
      themeStyle,
      ...rest
    } = this.props

    return (
      <CheckBox
        title={
          <StyledText>{optionName}</StyledText>
        }
        checkedIcon={'check-circle'}
        uncheckedIcon={'circle'}
        checked={ value === customValue }
        onPress={() => {
          if (checkboxType === 'checkbox') {
            onChange(!value)
          } else {
            // imply radio option
            onChange(customValue)
          }
        }}
        containerStyle={{backgroundColor: themeStyle.backgroundColor}}
      />
    )
  }
}

export default withContext(CustomCheckBox)

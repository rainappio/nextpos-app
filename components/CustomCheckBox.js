import React from 'react'
import {CheckBox} from 'react-native-elements'
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
      customBackgroundThemeColor,
      ...rest
    } = this.props

    return (
      <CheckBox
        title={
          <StyledText>{optionName}</StyledText>
        }
        checkedIcon={'check-circle'}
        uncheckedIcon={'circle'}
        checked={value === customValue}
        onPress={() => {
          if (checkboxType === 'checkbox') {
            onChange(!value)
          } else {
            // imply radio option
            onChange(customValue)
          }
        }}
        containerStyle={{backgroundColor: customBackgroundThemeColor}}
      />
    )
  }
}

export default withContext(CustomCheckBox)

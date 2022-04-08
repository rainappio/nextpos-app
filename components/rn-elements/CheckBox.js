import React from 'react'
import {InputAccessoryView, Keyboard, Platform, Text, TextInput, TouchableOpacity, View} from 'react-native'
import {CheckBox} from 'react-native-elements'
import styles from '../../styles'
import {withContext} from "../../helpers/contextHelper";
import {StyledText} from "../StyledText";

class RenderCheckBox extends React.Component {
  state = {
    checked: true
  }

  render() {
    const {
      input: {onBlur, onChange, onFocus, value},
      customValue,
      optionName,
      defaultValueDisplay,
      meta: {error, touched, valid},
      themeStyle,
      ...rest
    } = this.props

    return (
      <View>
        <CheckBox
          containerStyle={{borderColor: themeStyle.borderColor, backgroundColor: this.context.customBackgroundColor}}
          title={
            <View style={[styles.tableRowContainer]}>
              <View style={[styles.tableCellView, styles.flex(1)]}>
                <StyledText style={styles.tableCellText}>{optionName}</StyledText>
              </View>
              {customValue.discount === 0 && (
                <View style={[styles.tableCellView, styles.flex(2)]}>
                  <TextInput
                    style={[themeStyle, styles?.rootInput(this.props?.locale), styles.flex(0.6), styles?.withBorder(this.props?.locale), {textAlign: 'left'}]}
                    value={defaultValueDisplay(customValue, value)}
                    clearTextOnFocus={true}
                    selectTextOnFocus={true}
                    onChangeText={val => {
                      const valueToChange = {...customValue}
                      valueToChange.discount = val
                      onChange(valueToChange)
                    }}
                    keyboardType={'numeric'}
                    inputAccessoryViewID={optionName}
                  />
                  {Platform.OS === 'ios' && (
                    <InputAccessoryView nativeID={optionName}>
                      <TouchableOpacity
                        onPress={() => Keyboard.dismiss()}
                        style={[{flex: 1, flexDirection: 'row-reverse'}, styles.grayBg]}
                      >
                        <Text
                          style={[
                            styles.margin_15,
                            {fontSize: 16, fontWeight: 'bold', color: rest?.locale?.customMainThemeColor}
                          ]}
                        >
                          Done
                        </Text>
                      </TouchableOpacity>
                    </InputAccessoryView>
                  )}
                </View>
              )}
            </View>
          }
          checkedIcon={'check-circle'}
          uncheckedIcon={'circle'}
          checked={
            value.offerId === customValue.offerId
          }
          onPress={() => {
            onChange(customValue)
          }}
        />
      </View>
    )
  }
}

export default withContext(RenderCheckBox)

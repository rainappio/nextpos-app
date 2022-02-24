import React from 'react'
import {Text, View, TouchableOpacity} from 'react-native'
import {LocaleContext} from "../locales/LocaleContext";
import {Stepper} from '@ant-design/react-native'
import styles from '../styles'
import {StyledText} from "./StyledText";
import {withContext} from "../helpers/contextHelper";
import NumericInput from "react-native-numeric-input";

class RenderStepper extends React.Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
    this.state = {
      isTablet: context?.isTablet,
    }

  }

  render() {
    const {
      input: {onBlur, onChange, onFocus, value},
      customValue,
      optionName,
      meta: {error, touched, valid},
      themeStyle,
      locale: {customMainThemeColor},
      totalWidth,
      showNumber,
      ...rest
    } = this.props

    const numberValue = Number(value)

    return (
      <View style={{flex: 1}}>
        <View style={[styles.flex(5), styles.flexRow, {alignItems: 'center'}]}>
          <View style={{flex: 1.5, flexDirection: 'row', alignItems: 'center'}}>
            <StyledText style={{flex: 1}}>{optionName}</StyledText>
            {(showNumber ?? true) && (
            <View style={{flex: 4, flexDirection: 'row', justifyContent: 'space-evenly'}}>
              {[1, 2, 3, 4, 5].map(num => {
                return (
                  <TouchableOpacity
                    key={`qty-${num}`}
                    onPress={() => {
                      this.props.input.onChange(num)
                    }}
                    style={{
                      width: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                      aspectRatio: 1,
                      borderColor: customMainThemeColor,
                      borderWidth: (value === num ? 1 : 0),
                      borderRadius: 100
                    }}>
                    <StyledText>{num}</StyledText>
                  </TouchableOpacity>
                )
              })}
            </View>
            )}
          </View>

          <View style={{flex: 1, flexDirection: 'column', alignItems: 'flex-end'}}>
            <NumericInput value={numberValue}
                          initValue={numberValue}
                          onChange={onChange}
                          step={1}
                          rounded={false}
                          leftButtonBackgroundColor={customMainThemeColor}
                          rightButtonBackgroundColor={customMainThemeColor}
                          borderColor={customMainThemeColor}
                          iconStyle={{color: '#fff'}}
                          totalWidth={totalWidth ?? 120}
                          {...rest}
            />

          </View>
        </View>
        <View style={{marginTop: 8}}>
          {!valid &&
            touched &&
            (error && <Text style={styles.rootError}>{error}</Text>)}
        </View>
      </View>
    )
  }
}

export default withContext(RenderStepper)

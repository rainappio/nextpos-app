import React from 'react'
import {Text, View, TouchableOpacity} from 'react-native'
import {LocaleContext} from "../locales/LocaleContext";
import {Stepper} from '@ant-design/react-native'
import styles, {mainThemeColor} from '../styles'
import {StyledText} from "./StyledText";
import {withContext} from "../helpers/contextHelper";

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
      ...rest
    } = this.props

    if (this.state.isTablet) {
      return (
        <View>
          <View style={[styles.flex_dir_row, {alignItems: 'center'}]}>
            <View style={{width: '60%', flexDirection: 'row', alignItems: 'center'}}>
              <StyledText style={{width: '15%'}}>{optionName}</StyledText>
              <View style={{marginLeft: 30, flexDirection: 'row', justifyContent: 'space-around', flex: 1}}>
                <TouchableOpacity
                  onPress={() => {this.props.input.onChange(1)}}
                  style={{width: 30, alignItems: 'center', justifyContent: 'center', aspectRatio: 1, borderColor: mainThemeColor, borderWidth: (value === 1 ? 1 : 0), borderRadius: 100}}>
                  <StyledText>1</StyledText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {this.props.input.onChange(2)}}
                  style={{width: 30, alignItems: 'center', justifyContent: 'center', aspectRatio: 1, borderColor: mainThemeColor, borderWidth: (value === 2 ? 1 : 0), borderRadius: 100}}>
                  <StyledText>2</StyledText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {this.props.input.onChange(3)}}
                  style={{width: 30, alignItems: 'center', justifyContent: 'center', aspectRatio: 1, borderColor: mainThemeColor, borderWidth: (value === 3 ? 1 : 0), borderRadius: 100}}>
                  <StyledText>3</StyledText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {this.props.input.onChange(4)}}
                  style={{width: 30, alignItems: 'center', justifyContent: 'center', aspectRatio: 1, borderColor: mainThemeColor, borderWidth: (value === 4 ? 1 : 0), borderRadius: 100}}>
                  <StyledText>4</StyledText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {this.props.input.onChange(5)}}
                  style={{width: 30, alignItems: 'center', justifyContent: 'center', aspectRatio: 1, borderColor: mainThemeColor, borderWidth: (value === 5 ? 1 : 0), borderRadius: 100}}>
                  <StyledText>5</StyledText>
                </TouchableOpacity>
              </View>

            </View>

            <View style={{width: '40%'}}>
              <Stepper
                key={1}
                clear
                error
                onChange={onChange}
                max={100}
                min={0}
                readOnly={false}
                value={value}
                showNumber
                inputStyle={themeStyle}
              />
            </View>
          </View>
          <View style={{width: '100%', marginTop: 8}}>
            {!valid &&
              touched &&
              (error && <Text style={styles.rootError}>{error}</Text>)}
          </View>
        </View>
      )
    } else {
      return (
        <View>
          <View style={[styles.flex_dir_row, {alignItems: 'center'}]}>
            <View style={{width: '60%'}}>
              <StyledText>{optionName}</StyledText>
            </View>

            <View style={{width: '40%'}}>
              <Stepper
                key={1}
                clear
                error
                onChange={onChange}
                max={20}
                min={0}
                readOnly={false}
                value={value}
                showNumber
                inputStyle={themeStyle}
              />
            </View>
          </View>
          <View style={{width: '100%', marginTop: 8}}>
            {!valid &&
              touched &&
              (error && <Text style={styles.rootError}>{error}</Text>)}
          </View>
        </View>
      )
    }

  }
}

export default withContext(RenderStepper)

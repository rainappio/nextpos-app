import React from 'react'
import {View} from 'react-native'
import {Radio} from '@ant-design/react-native'
import styles from '../styles'
import {StyledText} from "./StyledText";

export default class RenderRadioBtn extends React.Component {
  render() {
    const {
      input: {onBlur, onChange, onFocus, value},
      customValue,
      optionName,
      meta: {error, toched, valid},
      ...rest
    } = this.props

    return (
      <View style={styles.flex(1)}>
        <Radio
          key={customValue}
          onChange={() => onChange(customValue)}
          checked={value === customValue}
          style={{position: 'absolute', right: 0}}
        >
          <StyledText style={styles.textBold}>{optionName}</StyledText>
        </Radio>
      </View>
    )
  }
}

export class RenderRadioBtnMulti extends React.Component {
  render() {
    const {
      input: {onBlur, onChange, onFocus, value},
      customValue,
      optionName,
      meta: {error, toched, valid},
      ...rest
    } = this.props
    console.log('customValue', customValue, value)
    const checked = Array.isArray(value) && value?.some((item) => item === customValue)

    return (
      <View style={styles.flex(1)}>
        <Radio
          key={customValue}
          onChange={() => {
            if (checked) {
              let typeSet = new Set(value)
              typeSet.delete(customValue)
              onChange([...typeSet])
            } else {
              let typeSet = new Set(value)
              typeSet.add(customValue)
              onChange([...typeSet])
            }
          }}
          checked={checked}
          style={{position: 'absolute', right: 0}}
        >
          <StyledText style={styles.textBold}>{optionName}</StyledText>
        </Radio>
      </View>
    )
  }
}

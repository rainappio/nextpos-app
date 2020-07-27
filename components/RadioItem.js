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

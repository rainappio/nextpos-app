import React from 'react'
import {Text, View} from 'react-native'
import {Radio, List} from '@ant-design/react-native'
import styles from '../styles'

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
          <Text style={styles.textBold}>{optionName}</Text>
        </Radio>
      </View>
    )
  }
}

import React from 'react'
import { Text, View } from 'react-native'
import { Stepper, List } from '@ant-design/react-native'
import styles from '../styles'

export default class RenderStepper extends React.Component {
  render() {
    const {
      input: { onBlur, onChange, onFocus, value },
      customValue,
      optionName,
      startPt,
      meta: { error, toched, valid },
      ...rest
    } = this.props

    return (
      <View style={styles.flex_dir_row}>
        <View style={{ width: '60%' }}>
          <Text>{optionName}</Text>
        </View>

        <View style={{ width: '40%' }}>
          <Stepper
            key={1}
            clear
            error
            onChange={onChange}
            max={10}
            min={!startPt ? 0 : startPt}
            readOnly={false}
            defaultValue={!startPt ? 0 : startPt}
            styles={{ backgroundColor: 'pink' }}
          />
        </View>
      </View>
    )
  }
}

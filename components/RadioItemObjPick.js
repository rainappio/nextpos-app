import React from 'react'
import { Text, View } from 'react-native'
import { Radio, List } from '@ant-design/react-native'
import styles from '../styles'

export default class RadioItemObjPick extends React.Component {
  render() {
    const {
      input: { onBlur, onChange, onFocus, value },
      customValueOrder,
      optionName,
      meta: { error, touched, valid },
      ...rest
    } = this.props
    return (
      <View>
        <Radio
          key={customValueOrder}
          clear
          error
          onChange={() => onChange(customValueOrder)}
          checked={
            customValueOrder !== undefined &&
            value.optionValue === customValueOrder.optionValue
          }
          style={{position: 'absolute', right: 0}}
        >
        <Text>
          {optionName}
        </Text>
      </Radio>
        {!valid && touched && <Text style={styles.rootError}>{error}</Text>}
      </View>
    )
  }
}

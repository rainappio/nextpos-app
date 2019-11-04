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
        <Radio.RadioItem
          key={customValueOrder}
          clear
          error
          onChange={() => onChange(customValueOrder)}
          checked={
            customValueOrder !== undefined &&
            value.optionValue === customValueOrder.optionValue
          }
          style={[
            styles.myradio,
            {
              backgroundColor:
                customValueOrder !== undefined &&
                value.optionValue === customValueOrder.optionValue
                  ? '#f18d1a'
                  : '#fff'
            } //for order
          ]}
        />
        <Text style={{ position: 'absolute', left: 40, top: 6 }}>
          {optionName}
        </Text>
        {!valid && touched && <Text style={styles.rootError}>{error}</Text>}
      </View>
    )
  }
}

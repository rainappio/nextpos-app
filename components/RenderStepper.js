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
      meta: { error, touched, valid },
      ...rest
    } = this.props

    return (
    	<View>
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
            min={0}
            readOnly={false}
            defaultValue={0}
          />
        </View>              
      </View>
      <View style={{ width: '100%' }}>
        	 {!valid && touched && <Text style={styles.rootError}>Please choose at least 1 item to create order</Text>}
        </View> 
      </View>
    )
  }
}

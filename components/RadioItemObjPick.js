import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Radio, List, RadioItem } from '@ant-design/react-native'
import styles from '../styles'
import {StyledText} from "./StyledText";

export default class RadioItemObjPick extends React.Component {
  render() {
    const {
      input: { onBlur, onChange, onFocus, value },
      customValueOrder,
      optionName,
      onCheck,
      meta: { error, touched, valid },
      ...rest
    } = this.props
    return (
      <View style={[styles.tableRowContainerWithBorder]}>
        <View style={[styles.tableCellView, {flex: 1}]}>
          <StyledText>{optionName}</StyledText>
        </View>
        <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end', borderWidth: 0}]}>
          <Radio
            key={customValueOrder}
            onChange={() => onChange(customValueOrder)}
            checked={onCheck(value, customValueOrder)}
            style={{ position: 'absolute', right: 10 }}
          >
            {/*this empty text exists to increase the radio button hit slop as the radio button reacts to the touch of the text.*/}
            <Text style={{borderWidth: 0, paddingVertical: 10, paddingHorizontal: 100 }}/>
            {!valid && touched && <Text style={styles.rootError}>{error}</Text>}
          </Radio>
        </View>
      </View>
    )
  }
}

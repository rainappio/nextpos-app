import React from 'react'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlight,
  TextInput,
  AsyncStorage
} from 'react-native'
import { CheckBox } from 'react-native-elements'
import images from '../../assets/images'
import styles from '../../styles'

class RenderCheckBox extends React.Component {
  state = {
    checked: true
  }

  render() {
    const {
      input: { onBlur, onChange, onFocus, value },
      customValue,
      optionName,
      total,
      getPercent,
      orderTotal,
      grandTotal,
      meta: { error, toched, valid },
      ...rest
    } = this.props

    return (
      <View>
        <CheckBox
          title={
            customValue.discount === 0 ? (
              <View style={[styles.tableRowContainer]}>
                <View style={styles.tableCellView}>
                <Text style={styles.tableCellText}>{optionName}</Text>
                </View>
                <TextInput
                  style={[styles.tableCellView, {
                    height: 40,
                    width: '60%',
                    borderBottomColor: '#ddd',
                    borderBottomWidth: 1,
                    paddingLeft: 15
                  }]}
                  value={String(customValue.orderDiscount === value.orderDiscount ? value.discount : 0)}
                  onChangeText={val => {
                    onChange({discount: val, orderDiscount: customValue.orderDiscount})
                    getPercent(val)
                  }}
                  keyboardType={'numeric'}
                  //placeholder={optionName}
                />
              </View>
            ) : (
              optionName
            )
          }
          checkedIcon={
            <Image
              source={images.checkicon}
              style={{ width: 35, height: 35 }}
            />
          }
          uncheckedIcon={
            <Image
              source={images.checkiconOutline}
              style={{ width: 35, height: 35 }}
            />
          }
          checked={
            value.orderDiscount === customValue.orderDiscount
          }
          onPress={() => {
            onChange(customValue)
            //getPercent(customValue.discount)
          }}
        />
      </View>
    )
  }
}
export default RenderCheckBox

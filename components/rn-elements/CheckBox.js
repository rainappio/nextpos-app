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
import { RFPercentage } from "react-native-responsive-fontsize";
import images from '../../assets/images'
import { isTablet } from '../../actions'
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
    var isnoDiscount = optionName === 'No Discount' && orderTotal === grandTotal
    return (
      <View>
        <CheckBox
          title={
            customValue.discount === 0 ? (
              <TextInput
                style={{
                  height: 40,
                  width: '80%',
                  borderBottomColor: '#ddd',
                  borderBottomWidth: 1,
                  paddingLeft: 15,
                  fontSize: RFPercentage(2.4)	 
                }}
                onChangeText={val => {
                  onChange({ discount: val, orderDiscount: 'ENTER_DISCOUNT' })
                  getPercent(val)
                }}
                keyboardType={'numeric'}
                placeholder="Enter Discount"
              />
            ) : (
              <Text style={styles.defaultfontSize}>{optionName}</Text>
            )
          }
          checkedIcon={
            <Image
              source={images.checkicon}
               style={isTablet ? { width: 50, height: 50, marginRight: 8 } : { width: 35, height: 35, marginRight: 8 }}
            />
          }
          uncheckedIcon={
            <Image
              source={images.checkiconOutline}
              style={isTablet ? { width: 50, height: 50, marginRight: 8 } : { width: 35, height: 35, marginRight: 8 }}
            />
          }
          checked={
            isnoDiscount || value.orderDiscount === customValue.orderDiscount
          }
          onPress={() => {
            onChange(customValue)
            getPercent(customValue.discount)
          }}
        />
      </View>
    )
  }
}
export default RenderCheckBox

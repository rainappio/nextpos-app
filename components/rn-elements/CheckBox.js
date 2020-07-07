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
      defaultValueDisplay,
      total,
      getPercent,
      orderTotal,
      grandTotal,
      meta: { error, toched, valid },
      theme,
      ...rest
    } = this.props

    return (
      <View>
        <CheckBox
          title={
            customValue.discount === 0 ? (
              <View style={styles.tableRowContainer}>
                <View style={styles.tableCellView}>
                <Text style={[styles.tableCellText,theme]}>{optionName}</Text>
                </View>
                <TextInput
                  style={[styles.tableCellView, {
                    height: 40,
                    width: '60%',
                    borderBottomColor: '#ddd',
                    borderBottomWidth: 1,
                    paddingLeft: 15
                  },theme]}
                  value={defaultValueDisplay(customValue, value)}
                  clearTextOnFocus={true}
                  selectTextOnFocus={true}
                  onChangeText={val => {
                    const valueToChange = {...customValue}
                    valueToChange.discount = val
                    onChange(valueToChange)
                    //getPercent(val)
                  }}
                  keyboardType={'numeric'}
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
            value.offerId === customValue.offerId
          }
          onPress={() => {
            onChange(customValue)
            //getPercent(customValue.discount)
          }}
          containerStyle={theme}
        />
      </View>
    )
  }
}
export default RenderCheckBox

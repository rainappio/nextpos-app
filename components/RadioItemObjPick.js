import React from 'react'
import {Text, View, Dimensions} from 'react-native'
import {Radio} from '@ant-design/react-native'
import styles from '../styles'
import {StyledText} from "./StyledText";
import {CheckBox} from 'react-native-elements'
import {LocaleContext} from '../locales/LocaleContext'


export default class RadioItemObjPick extends React.Component {
  render() {
    const {
      input: {onBlur, onChange, onFocus, value},
      customValueOrder,
      optionName,
      onCheck,
      meta: {error, touched, valid},
      ...rest
    } = this.props
    return (
      <View style={[styles.tableRowContainerWithBorder]}>
        <View style={[styles.tableCellView, {flex: 1}]}>
          <StyledText>{optionName}</StyledText>
        </View>
        <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end', borderWidth: 0}]}>
          <CheckBox
            containerStyle={{margin: 0, padding: 0}}
            onChange={() => onChange(customValueOrder)}
            checkedIcon={'check-circle'}
            uncheckedIcon={'circle'}
            checked={onCheck(value, customValueOrder)}
            onPress={() => {
              onChange(customValueOrder)
            }}
          >
          </CheckBox>

          {!valid && touched && <Text style={styles.rootError}>{error}</Text>}

        </View>
      </View >
    )
  }
}

export class RadioLineItemObjPick extends React.Component {
  render() {
    const {
      input: {onBlur, onChange, onFocus, value},
      customValueOrder,
      optionName,
      onCheck,
      meta: {error, touched, valid},
      ...rest
    } = this.props
    return (
      <View style={[styles.tableRowContainerWithBorder]}>
        {/* <View style={[styles.tableCellView, {flex: 1}]}>
          <StyledText>{optionName}</StyledText>
        </View> */}
        <View style={[styles.flex(1)]}>
          <Radio
            onChange={() => onChange(customValueOrder)}
            onPress={() => {
              onChange(customValueOrder)
            }}
            checked={onCheck(value, customValueOrder)}
            style={{position: 'absolute', right: 0, opacity: 0}}
          >
            <StyledText>{optionName}</StyledText>

            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end', borderWidth: 0}]}>
              <CheckBox
                containerStyle={{margin: 0, padding: 0}}
                onChange={() => onChange(customValueOrder)}
                checkedIcon={'check-circle'}
                uncheckedIcon={'circle'}
                checked={onCheck(value, customValueOrder)}
                onPress={() => {
                  onChange(customValueOrder)
                }}
              >
              </CheckBox>
            </View>
          </Radio>

          {!valid && touched && <Text style={styles.rootError}>{error}</Text>}

        </View>
      </View >
    )
  }
}

export class RadioReservationTimePick extends React.Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }
  render() {
    const {
      input: {onBlur, onChange, onFocus, value},
      customValueOrder,
      optionName,
      onCheck,
      meta: {error, touched, valid},
      ...rest
    } = this.props
    const {isTablet, customMainThemeColor, customBackgroundColor} = this.context

    const selectedColor = (customValueOrder == value) ? customBackgroundColor : customMainThemeColor
    const optionWidth = !isTablet ? (Dimensions.get('window').width) / 4 - 16
      : (Dimensions.get('window').width) / (3 * 4) - 28

    return (
      <View style={[styles.jc_alignIem_center, (customValueOrder == value) && {backgroundColor: customMainThemeColor}, {borderWidth: 1, borderColor: customMainThemeColor, justifyContent: 'center', marginHorizontal: 8, marginVertical: 8, padding: 4, width: optionWidth}]}>
        <Radio
          onChange={() => {
            onChange(customValueOrder)
          }}
          onPress={() => {
            onChange(customValueOrder)

          }}
          checked={onCheck(value, customValueOrder)}
          style={[{position: 'absolute', opacity: 0, flex: 1, justifyContent: 'center'},]}
        >
          <View style={[styles.tableCellView, {flex: 1, justifyContent: 'center'}]}>
            <StyledText style={[{color: selectedColor}]}>{optionName}</StyledText>
          </View>

        </Radio>

        {!valid && touched && <Text style={styles.rootError}>{error}</Text>}


      </View >
    )
  }
}
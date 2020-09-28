import React from 'react'
import {Text, View} from 'react-native'
import {Checkbox} from '@ant-design/react-native'
import styles from '../styles'
import {StyledText} from "./StyledText";
import {CheckBox} from 'react-native-elements'
import {withContext} from "../helpers/contextHelper";

class CheckBoxGroupObjPick extends React.Component {
  render() {
    const {
      input: {onBlur, onChange, onFocus, value},
      customValue,
      optionName,
      customarr,
      meta: {error, touched, valid},
      themeStyle,
      ...rest
    } = this.props
    const arr = [...this.props.input.value]


    const checkBoxes =
      customarr !== undefined &&
      customarr.map(ca => {
        const arrFind = [...this.props.input.value]

        const onChange = (checked) => {
          const arr = [...this.props.input.value]
          if (checked) {
            arr.push(ca)
          } else {
            arr.splice(arr.map((item) => item.optionValue).indexOf(ca.optionValue), 1)
          }
          return this.props.input.onChange(arr)
        }

        return (
          <View
            style={[styles.tableRowContainerWithBorder]}
            key={ca.id}
          >
            <View style={[styles.tableCellView, {flex: 2}]}>
              <StyledText>{ca.name === undefined ? ca.optionValue : ca.name}</StyledText>
            </View>

            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
              <CheckBox
                containerStyle={{borderColor: themeStyle.borderColor, backgroundColor: themeStyle.backgroundColor}}
                onChange={e => onChange(e.target.checked)}
                checkedIcon={'check-circle'}
                uncheckedIcon={'circle'}
                checked={!!arrFind.find(item => item?.optionValue === ca.optionValue)}
                onPress={() => {
                  onChange(!arrFind.find(item => item?.optionValue === ca.optionValue))
                }}
              >
              </CheckBox>
            </View>
            {!valid && touched && <Text style={styles.rootError}>{error}</Text>}
          </View>
        )
      })

    return <View>{checkBoxes}</View>
  }
}

export default withContext(CheckBoxGroupObjPick)
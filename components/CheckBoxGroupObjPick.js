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
      customarr.map((ca, index) => {
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
              <Checkbox
                key={ca.optionValue}
                onChange={e => onChange(e.target.checked)}
                checked={!!arrFind.find(item => item?.optionValue === ca.optionValue)}
                onPress={() => {
                  onChange(!arrFind.find(item => item?.optionValue === ca.optionValue))
                }}
                style={{position: 'absolute', right: 0, opacity: 0}}
              >
                <StyledText>{ca.name === undefined ? ca.optionValue : ca.name}</StyledText>


                <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                  <CheckBox
                    containerStyle={{margin: 0, padding: 0}}
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
              </Checkbox>
            </View>
          </View>
        )
      })

    return <View>{checkBoxes}</View>
  }
}

export default withContext(CheckBoxGroupObjPick)
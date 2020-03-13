import React from 'react'
import { Text, View } from 'react-native'
import { Checkbox } from '@ant-design/react-native'
import PropTypes from 'prop-types'
import styles from '../styles'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

export default class RenderCheckboxGroup extends React.Component {
  render() {
    const {
      input: { onBlur, onChange, onFocus, value },
      customValue,
      optionName,
      customarr,
      customRoute,
      meta: { error, toched, valid },
      ...rest
    } = this.props
    const arr = [...this.props.input.value]

    const checkBoxes =
      customarr !== undefined &&
      customarr.map(ca => {
        const onChange = checked => {
          const arr = [...this.props.input.value]

          if (checked) {
            arr.push(ca.id)
          } else {
            arr.splice(arr.indexOf(ca.id), 1)
          }
          return this.props.input.onChange(arr)
        }

        return (
          <View key={ca.id}>
            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <Text>{ca.name}</Text>
              </View>
              <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                <Checkbox
                  clear
                  arr
                  onChange={e => onChange(e.target.checked)}
                  checked={value.length !== 0 && value.includes(ca.id)}
                  style={{marginRight: 8}}
                >
                </Checkbox>
                <AntDesignIcon
                  name="ellipsis1"
                  size={25}
                  color="black"
                  onPress={() => {
                    this.props.navigation.navigate(customRoute, {
                      //productOptionId: ca.id,
                      customId: ca.id,
                      customRoute: this.props.navigation.state.routeName
                    })
                  }}
                />
              </View>
            </View>
          </View>
        )
      })

    return <View>{checkBoxes}</View>
  }
}

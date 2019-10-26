import React from 'react'
import { Text, View } from 'react-native'
import { Checkbox } from '@ant-design/react-native'
import PropTypes from 'prop-types'
import styles from '../styles'

export default class RenderCheckboxGroup extends React.Component {
  render() {
    const {
      input: { onBlur, onChange, onFocus, value },
      customValue,
      optionName,
      customarr,
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
          <View
            style={[styles.borderBottomLine, styles.paddingTopBtn20]}
            key={ca.id}
          >
            <Checkbox
              clear
              arr
              onChange={e => onChange(e.target.checked)}
              checked={value.length !== 0 && value.includes(ca.id)}
              style={{ position: 'absolute', right: 0 }}
            >
              <Text>{ca.name}</Text>
            </Checkbox>
          </View>
        )
      })

    return <View>{checkBoxes}</View>
  }
}

import React from 'react'
import { Text, View } from 'react-native'
import { Radio } from '@ant-design/react-native'
import PropTypes from 'prop-types'
import styles from '../styles'

export default class RenderRadioGroup extends React.Component {
  render() {
    const {
      input: { onBlur, onChange, onFocus, value },
      customValue,
      customarr,
      meta: { error, toched, valid },
      ...rest
    } = this.props

    console.log(this.props)
    const arr = [...this.props.input.value]

    const radioItems =
      customarr !== undefined &&
      customarr.map(ca => {
        const onChange = checked => {
          const arr = [...this.props.input.value]

          if (checked) {
            arr.push(ca.id)
          } else {
            arr.splice(arr.indexOf(ca.id), 1)
          }
          console.log(arr)
          return this.props.input.onChange(arr)
        }

        return (
          <View
            style={[styles.borderBottomLine, styles.paddingTopBtn20]}
            key={ca.id}
          >
            <Radio
              clear
              error
              //onChange={(e) => onChange(e.target.checked ? arr.push(customValue) : arr.splice(arr.indexOf(customValue),1))}
              onChange={e => onChange(e.target.checked)}
              checked={value}
              style={{ position: 'absolute', right: 0 }}
            >
              <Text>{ca.name}</Text>
            </Radio>
          </View>
        )
      })

    return <View>{radioItems}</View>
  }
}

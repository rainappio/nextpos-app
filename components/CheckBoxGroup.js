import React from 'react'
import { Text, View } from 'react-native'
import { Checkbox } from '@ant-design/react-native'
import PropTypes from 'prop-types'
import styles from '../styles'
import AntDesignIcon from "react-native-vector-icons/AntDesign";

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
          <View
            style={[styles.borderBottomLine, styles.paddingTopBtn20]}
            key={ca.id}
          >
            <Checkbox
              clear
              arr
              onChange={e => onChange(e.target.checked)}
              checked={value.length !== 0 && value.includes(ca.id)}
              style={{ position: 'absolute', right: 45 }}
            >
              <Text>{ca.name}</Text>
            </Checkbox>
            <AntDesignIcon
              name="ellipsis1"
              size={25}
              color="black"
              style={{ position: 'absolute', right: 0, top: 15 }}
              onPress={() => {
                this.props.navigation.navigate(customRoute, {
                  //productOptionId: ca.id,
                  customId: ca.id,
                  customRoute: this.props.navigation.state.routeName
                })
              }}
            />
          </View>
        )
      })

    return <View>{checkBoxes}</View>
  }
}

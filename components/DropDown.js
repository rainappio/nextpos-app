import React, { Component } from 'react'
import { StyleSheet, View, Text, Picker } from 'react-native'
import styles from '../styles'

export default class DropDown extends Component {
  state = {
    choosenIndex: 0
  }

  render() {
    const {
      input: { onChange, value, ...inputProps },
      children,
      meta,
      options,
      ...pickerProps
    } = this.props

    return (
      <View style={[styles.pickerStyle, styles.rootInput]}>
        <Picker
          selectedValue={value}
          onValueChange={value => onChange(value)}
          {...inputProps}
          {...pickerProps}
        >
          <Picker.Item label="Choose Label" value="" color="#ccc" />
          {options.map(opts => (
            <Picker.Item key={opts.id} label={opts.label} value={opts.id} />
          ))}
        </Picker>
        {!meta.valid && meta.touched && (
          <Text style={styles.rootError}>{meta.error}</Text>
        )}
      </View>
    )
  }
}

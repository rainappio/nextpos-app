import React, {Component} from 'react'
import {View} from 'react-native'
import MultiSelect from 'react-native-multiple-select'

export default class MultiDropDown extends Component {
  render() {
    const {
      input: { onChange, value, ...inputProps },
      children,
      meta: { error, touched, valid },
      items
    } = this.props

    return (
      <View>
        <View>
          <MultiSelect
            items={items}
            uniqueKey="id"
            onSelectedItemsChange={value => onChange(value)}
            selectedItems={[...value]}
            //selectText='Pick User Roles'
            searchInputPlaceholderText="Search Items..."
            // onChangeInput={(text) => console.warn(text)}
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="name"
            searchInputStyle={{ color: '#CCC' }}
            submitButtonColor="#CCC"
            submitButtonText="Submit"
            removeSelected
            {...inputProps}
          />
        </View>
      </View>
    )
  }
}

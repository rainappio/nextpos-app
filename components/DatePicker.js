import React, { Component } from 'react'
import DatePicker from 'react-native-datepicker'
import moment from 'moment'

export default class RenderDatePicker extends Component {
  render(){
  	const {
      input: { onBlur, onChange, onFocus, value },
      placeholder,
      meta: { error, toched, vali5d },
      ...rest
    } = this.props

    return (
      <DatePicker
        style={{width: '100%'}}
        date={value}
        mode="date"
        placeholder={placeholder}
        format="YYYY-MM-DD"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0
          },
          datePicker: {
          	alignItems: 'stretch'
          },
          dateInput: {
            paddingLeft: 26
          }
          //datePickerCon: { backgroundColor: 'black', }
          // ... You can check the source to find the other keys.
        }}
        onDateChange={onChange}
      />
    )
  }
}
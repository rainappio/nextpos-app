import React, {useState} from 'react'
import {withContext} from "../helpers/contextHelper";
import DropDownPicker from 'react-native-dropdown-picker';


function CustomDropDown(props) {
  const {
    input: {onChange, value},
    meta: {error, touched, valid},
    options,
    placeholder,
    themeStyle,
    defaultValue,
    disabled,
  } = props

  const [open, setOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(null)

  return (
    <DropDownPicker
      items={options}
      open={open}
      setOpen={setOpen}
      value={value}
      setValue={onChange}
      dropDownDirection={'BOTTOM'}
      listMode='MODAL'
      placeholder={placeholder}
    />
  )
}


export default withContext(CustomDropDown)

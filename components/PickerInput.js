import React from 'react'
import {Picker, Text, View} from 'react-native'
import styles from "../styles";

const PickerInput = props => {
  const {
    input: {onChange},
    meta: {error, touched, valid},
    values,
    selectedValue,
    theme,
    ...rest
  } = props

  const pickerItems = []
  Object.keys(values).map(key => {
    pickerItems.push(<Picker.Item key={key} label={`--- ${key} ---`}/>)

    values[key].map(table => {
      pickerItems.push(<Picker.Item key={table.tableId} label={table.tableName} value={table.tableId}/>)
    })
  })

  return (
    <View>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onChange}
        style={[{width: '100%'}, theme]}
        itemStyle={[{height: 100}, theme]}
      >
        {pickerItems}
      </Picker>
      {!valid && touched && <Text style={styles.rootError}>{error}</Text>}
    </View>
  )
}

export default PickerInput

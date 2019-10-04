import React from 'react'
import { Text, View } from 'react-native'
import { Checkbox } from '@ant-design/react-native'
 
export default class RenderCheckbox extends React.Component {
	render(){
		const { input: {
		onBlur,
    onChange,
    onFocus,
    value },
    customValue,
    optionName,
    meta: {error, toched, valid},
    ...rest} = this.props

		return(
			<Checkbox
				key={customValue}
        clear
        error      
        onChange={(e) => onChange(console.log(e))}
        checked={value === customValue}
        style={{position: 'absolute',right: 0}}
      >
      	<Text>{optionName}</Text>
      </Checkbox>
		)
	}
}

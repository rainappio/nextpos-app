import React from 'react';
import { Text, View } from 'react-native';
import { Radio, List } from '@ant-design/react-native';

export default class RenderRadioBtns extends React.Component {
	render(){
		const { input: {
		onBlur,
    onChange,
    onFocus,
    value=[] },
    customValue,
    optionName,
    meta: {error, toched, valid},
    ...rest} = this.props

		return(
			<Radio
				key={customValue}
        clear
        error      
        onChange={() => onChange([customValue])}
        checked={value===customValue}
        style={{position: 'absolute',right: 0}}
      >
      	<Text>{optionName}</Text>
      </Radio>
		)
	}
}

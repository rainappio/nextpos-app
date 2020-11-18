import React from 'react'
import {View} from 'react-native'
import {Checkbox} from '@ant-design/react-native'
import styles from '../styles'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import {StyledText} from "./StyledText";
import {withContext} from "../helpers/contextHelper";
import {CheckBox} from 'react-native-elements'

class TableRenderCheckboxGroup extends React.Component {
    render() {
        const {
            input: {onBlur, onChange, onFocus, value},
            customValue,
            optionName,
            customarr,
            themeStyle,
            meta: {error, toched, valid},
            ...rest
        } = this.props
        const arr = [...this.props.input.value]

        const checkBoxes =
            customarr !== undefined &&
            customarr.map(ca => {
                const onChange = checked => {
                    const arr = [...this.props.input.value]

                    if (checked) {
                        arr.push(ca.tableId)
                    } else {
                        arr.splice(arr.indexOf(ca.tableId), 1)
                    }
                    return this.props.input.onChange(arr)
                }

                return (
                    <View key={ca.tableId}>
                        <View style={[styles.tableRowContainerWithBorder, {paddingHorizontal: 0}]}>
                            <View style={[styles.tableCellView, {flex: 1}]}>
                                <StyledText>{ca.tableName}</StyledText>
                            </View>
                            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                                <View>
                                    <CheckBox
                                        onChange={e => onChange(e.target.checked)}
                                        checkedIcon={'check-circle'}
                                        uncheckedIcon={'circle'}
                                        checked={value.length !== 0 && value.includes(ca.tableId)}
                                        containerStyle={{margin: 0, padding: 0, minWidth: 0}}
                                        onPress={() => {
                                            onChange(!(value.length !== 0 && value.includes(ca.tableId)))
                                        }}
                                    >
                                    </CheckBox>
                                </View>

                            </View>
                        </View>
                    </View>
                )
            })

        return <View>{checkBoxes}</View>
    }
}

export default withContext(TableRenderCheckboxGroup)

import React from 'react'
import {View} from 'react-native'
import {Radio} from '@ant-design/react-native'

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
            limitOne,
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

                    if (limitOne) {
                        // arr= [ca.tableId,ca.tableName]
                        arr.length = 0
                        if (checked) {
                            arr.push(ca.tableId, {tableId: ca.tableId, tableName: ca.tableName})
                            // arr.push(ca.tableName)
                        } else {
                            arr.pop()
                        }
                    } else {
                        if (checked) {
                            arr.push(ca.tableId)
                        } else {
                            arr.splice(arr.indexOf(ca.tableId), 1)
                        }
                    }
                    return this.props.input.onChange(arr)
                }

                return (
                    <View key={ca.tableId}>
                        <Radio
                            onChange={() =>
                                onChange(!(value.length !== 0 && value.includes(ca.tableId)))
                            }
                            onPress={() => {
                                onChange(!(value.length !== 0 && value.includes(ca.tableId)))
                            }}
                            checked={value.length !== 0 && value.includes(ca.tableId)}
                            style={{position: 'absolute', right: 0, opacity: 0}}
                        >
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
                        </Radio>
                    </View>
                )
            })

        return <View>{checkBoxes}</View>
    }
}

export default withContext(TableRenderCheckboxGroup)

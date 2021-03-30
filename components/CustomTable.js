import React from 'react'
import {ScrollView, View, Text, TouchableOpacity} from 'react-native'
import {Col, Table, TableWrapper} from 'react-native-table-component'
import styles from '../styles'
import {formatCurrency} from "../actions";
import {withContext} from "../helpers/contextHelper";
import {StyledText} from "../components/StyledText";
import {MaterialIcons} from '@expo/vector-icons';
import {FontAwesome} from '@expo/vector-icons';

/*
   Date   : 2021-03-18
   Author : GGGODLIN
   Content: props
                tableData=[{},{}]
                tableTopBar=[]
                tableContent=[]
                occupy=[]
                itemOnPress={()=>{}}
                moreActions=[]
                

*/

const CustomTableBase = (props) => {

    const t = props?.locale?.t
    const customMainThemeColor = props?.locale?.customMainThemeColor
    const customBackgroundColor = props?.locale?.customBackgroundColor



    return (
        <View style={{flexWrap: 'wrap', flex: 1, borderColor: customMainThemeColor, borderWidth: 1}}>
            <View style={[styles.sectionBar, {borderColor: customMainThemeColor}]}>
                {props?.tableTopBar.map((title, index) => {
                    return (
                        <View style={[styles.tableCellView, {flex: props?.occupy?.[index] ?? 1}, (index > 0 && {justifyContent: 'flex-end'})]}>
                            <Text style={[styles?.sectionBarTextSmall(customMainThemeColor)]}>{props?.tableTopBar?.[index] ?? 'ERR'}</Text>
                        </View>
                    )
                })}
                {!!props?.moreActions &&
                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                        <Text style={[styles?.sectionBarTextSmall(customMainThemeColor)]}>{t('moreAction')}</Text>
                    </View>}
            </View>
            <ScrollView style={{flex: 1}} nestedScrollEnabled>
                {props?.tableData?.map((data, index) => {
                    return (
                        <TouchableOpacity style={{flexDirection: 'row', padding: 8, }}
                            onPress={() => {
                                props?.itemOnPress && props?.itemOnPress(data, index)
                            }}
                        >
                            {props?.tableContent?.map((content, contentIndex) => {
                                return (
                                    <View style={[styles.tableCellView, {flex: props?.occupy?.[contentIndex] ?? 1}, (contentIndex > 0 && {justifyContent: 'flex-end'})]}>
                                        <Text style={[styles?.sectionBarTextSmall(customMainThemeColor)]}>{props?.tableData?.[index]?.[`${content}`] ?? 'ERR'}</Text>
                                    </View>
                                )
                            })
                            }
                            {!!props?.moreActions &&
                                <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            props?.moreActions?.[0] && props?.moreActions?.[0](data, index)
                                        }}
                                        style={{backgroundColor: customMainThemeColor, padding: 4, borderRadius: 4, marginRight: 8}}>
                                        <FontAwesome name="edit" size={20} color={customBackgroundColor} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            props?.moreActions?.[1] && props?.moreActions?.[1](data, index)
                                        }}
                                        style={{backgroundColor: '#f75336', padding: 4, borderRadius: 4}}>
                                        <MaterialIcons name="delete-forever" size={20} color={customBackgroundColor} />
                                    </TouchableOpacity>
                                </View>}
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </View>
    )



}

export const CustomTable = withContext(CustomTableBase)

import React, {useState, useContext, useEffect} from 'react';
import {Text, TouchableOpacity, View, StyleSheet, ScrollView} from 'react-native'
import {StyledText} from "./StyledText";
import styles from '../styles'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button} from 'react-native-elements';
import {api, dispatchFetchRequestWithOption} from '../constants/Backend'
import {LocaleContext} from '../locales/LocaleContext'
import {getTableDisplayName} from "../helpers/orderActions";
import Modal from 'react-native-modal';
import {normalizeTimeString} from '../actions'
import {ThemeScrollView} from "../components/ThemeScrollView";
import {Octicons} from '@expo/vector-icons';

/*
   Date   : 2020-10-05
   Author : GGGODLIN
   Content: props
                
                

*/
export const InProcessOrderCard = (props) => {
    const {t, themeStyle, isTablet, customMainThemeColor, customBackgroundColor, customBorderColor} = useContext(LocaleContext);
    const [isShow, setIsShow] = useState(false);

    return (
        <View
            style={[styles.boxShadow, themeStyle, {flex: 1, margin: 10, borderRadius: 10, flexDirection: 'row', backgroundColor: customBackgroundColor, borderColor: customBorderColor},]}
        >
            <Modal
                isVisible={isShow}
                useNativeDriver
                hideModalContentWhileAnimating
                animationIn='fadeIn'
                animationOut='fadeOut'
                onBackdropPress={() => setIsShow(false)}
                style={{
                    margin: 0, flex: 1, flexDirection: 'row'
                }}
            >
                <View style={{maxWidth: 640, flex: 1, borderWidth: 1, borderColor: customMainThemeColor, marginHorizontal: 10, marginVertical: '15%'}}>

                    <ThemeScrollView >
                        {props?.data?.orderLineItems?.map((item) => {
                            return (
                                <TouchableOpacity style={[styles.sectionContainerWithBorder, {flexDirection: 'row', marginBottom: 5, paddingHorizontal: 10, alignItems: 'center'}]}
                                >

                                    <View style={{flex: 4}}>
                                        <View style={styles.tableCellView}>
                                            <View style={[styles.tableCellView, styles.flex(2)]}>
                                                <StyledText style={{fontSize: 20}}>{item.displayName}</StyledText>
                                            </View>

                                        </View>
                                    </View>

                                    <View style={{flex: 1}}>
                                        <View style={[styles.tableCellView, styles.flex(1)]}>
                                            <StyledText style={[{fontSize: 24, fontWeight: 'bold', color: item.quantity > 1 ? '#f75336' : undefined}]}>{item.quantity}</StyledText>
                                        </View>
                                    </View>

                                    <View style={{flex: 7}}>

                                        <View style={styles.tableCellView}>

                                            <View style={[styles.tableCellView, styles.flex(3)]}>
                                                <StyledText>{item.options}</StyledText>
                                            </View>
                                            <View>
                                                <View style={{marginBottom: 5, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                                                    <View style={{width: 16, height: 16, borderRadius: 16, marginRight: 8, backgroundColor: (new Date() - new Date(item?.modifiedDate ?? new Date())) > 1800000 ? '#f75336' : '#86bf20'}}></View>
                                                    <StyledText>{normalizeTimeString(item?.modifiedDate ?? new Date(), 'HH:mm:ss')}</StyledText>
                                                </View>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        props?.prepareLineItem(item.orderId, item.lineItemId)
                                                        setIsShow(false)
                                                    }}
                                                >
                                                    <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>{t('action.prepare')}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </ThemeScrollView>
                </View>

            </Modal>
            <View style={{position: 'absolute', top: 12, right: 12}}>
                <View style={[styles.tableCellView]}>

                    <View style={{flex: 1, flexDirection: 'row', }}>
                        <StyledText>{props?.data?.serialId} </StyledText>

                    </View>

                </View>
            </View>
            <View style={{minWidth: 28, flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text numberOfLines={1}
                    style={{fontSize: 28, fontWeight: 'bold', color: '#f75336', paddingRight: 5}}>{props?.data?.tables?.length > 0 ? props?.data?.tables?.map((table) => table?.displayName)?.join(',') : t('order.takeOut')}</Text>
            </View>
            <View style={{flex: 7}}>

                <TouchableOpacity onLongPress={props?.onLongPress} onPress={() => setIsShow(true)}>
                    <View style={{height: 32}}>
                        {!!props?.data?.orderLineItems?.[0] &&
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                <Text numberOfLines={1} style={[themeStyle, {width: isTablet ? 130 : 70}]}>{props?.data?.orderLineItems?.[0]?.displayName}</Text>
                                <Text style={[themeStyle, {paddingHorizontal: 10, fontWeight: 'bold', color: props?.data?.orderLineItems?.[0]?.quantity > 1 ? '#f75336' : themeStyle?.color}]}>{props?.data?.orderLineItems?.[0]?.quantity}</Text>
                                <Text numberOfLines={1} style={[themeStyle, {flex: 1}]}>{props?.data?.orderLineItems?.[0]?.options}</Text>
                            </View>}
                    </View>
                    <View style={{height: 32}}>
                        {!!props?.data?.orderLineItems?.[1] &&
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                <Text numberOfLines={1} style={[themeStyle, {width: isTablet ? 130 : 70}]}>{props?.data?.orderLineItems?.[1]?.displayName}</Text>
                                <Text style={[themeStyle, {paddingHorizontal: 10, fontWeight: 'bold', color: props?.data?.orderLineItems?.[1]?.quantity > 1 ? '#f75336' : themeStyle?.color}]}>{props?.data?.orderLineItems?.[1]?.quantity}</Text>
                                <Text numberOfLines={1} style={[themeStyle, {flex: 1}]}>{props?.data?.orderLineItems?.[1]?.options}</Text>
                            </View>}
                    </View>
                    <View style={{height: 32}}>
                        {!!props?.data?.orderLineItems?.[2] &&
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                <Text numberOfLines={1} style={[themeStyle, {width: isTablet ? 130 : 70}]}>{props?.data?.orderLineItems?.[2]?.displayName}</Text>
                                <Text style={[themeStyle, {paddingHorizontal: 10, fontWeight: 'bold', color: props?.data?.orderLineItems?.[2]?.quantity > 1 ? '#f75336' : themeStyle?.color}]}>{props?.data?.orderLineItems?.[2]?.quantity}</Text>
                                <Text numberOfLines={1} style={[themeStyle, {flex: 1}]}>{props?.data?.orderLineItems?.[2]?.options}</Text>
                            </View>}
                    </View>
                    <View style={{height: 32}}>
                        {!!props?.data?.orderLineItems?.[3] &&
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                <Text numberOfLines={1} style={[themeStyle, {width: isTablet ? 130 : 70}]}>{props?.data?.orderLineItems?.[3]?.displayName}</Text>
                                <Text style={[themeStyle, {paddingHorizontal: 10, fontWeight: 'bold', color: props?.data?.orderLineItems?.[3]?.quantity > 1 ? '#f75336' : themeStyle?.color}]}>{props?.data?.orderLineItems?.[3]?.quantity}</Text>
                                <Text numberOfLines={1} style={[themeStyle, {flex: 1}]}>{props?.data?.orderLineItems?.[3]?.options}</Text>
                            </View>}
                    </View>
                    <View style={{height: 32}}>
                        {!!props?.data?.orderLineItems?.[4] &&
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                <Octicons name="kebab-horizontal" size={24} color={customMainThemeColor} />
                            </View>}
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{justifyContent: 'center'}}>
                <TouchableOpacity
                    onPress={() => {
                        props?.handleDeliverOrder(props?.data?.orderId)
                    }}
                >
                    <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>{t('action.prepare')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
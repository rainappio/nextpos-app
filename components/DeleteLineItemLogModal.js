import React, {useContext, useEffect} from 'react';
import {ScrollView, Text, View} from 'react-native'
import {LocaleContext} from '../locales/LocaleContext'
import styles from '../styles'
import {StyledText} from "../components/StyledText";
import Modal from 'react-native-modal';
import {formatCurrency, normalizeTimeString} from "../actions";


export const DeleteLineItemLogModal = (props) => {
    const localeContext = useContext(LocaleContext);
    const {customMainThemeColor} = localeContext

    useEffect(() => {

    }, [])


    return (
        <Modal
            isVisible={props?.isShow}
            useNativeDriver
            hideModalContentWhileAnimating
            animationIn='fadeIn'
            animationOut='fadeOut'
            onBackdropPress={() => props?.closeModal()}
            style={{
                margin: 0, flex: 1,
            }}
        ><ScrollView style={[localeContext?.themeStyle, {padding: 10, borderRadius: 20, maxHeight: '50%', marginHorizontal: 10}]}>
                <View style={styles.sectionBar}>
                    <View style={[{flex: 1}, styles.tableCellView]}>
                        <Text style={[styles?.sectionBarTextSmall(customMainThemeColor)]}>{localeContext?.t('order.product')}</Text>
                    </View>

                    <View style={[{flex: 0.5}, styles.tableCellView, {justifyContent: 'flex-end'}]}
                    >
                        <Text style={styles?.sectionBarTextSmall(customMainThemeColor)}>{localeContext?.t('order.quantity')}</Text>
                    </View>

                    <View style={[{flex: 2}, styles.tableCellView, {justifyContent: 'flex-end'}]}>
                        <Text style={styles?.sectionBarTextSmall(customMainThemeColor)}>{localeContext?.t('order.total')}</Text>
                    </View>

                    <View style={[{flex: 2}, styles.tableCellView, {justifyContent: 'flex-end'}]}>
                        <Text style={styles?.sectionBarTextSmall(customMainThemeColor)}>{localeContext?.t('order.date')}</Text>
                    </View>
                    <View style={[{flex: 1}, styles.tableCellView, {justifyContent: 'flex-end'}]}>
                        <Text style={styles?.sectionBarTextSmall(customMainThemeColor)}>{localeContext?.t('deletedBy')}</Text>
                    </View>
                </View>
                {props?.data?.deletedLineItems?.map((item) => {
                    return (
                        <View key={item.lineItemId} style={styles.tableRowContainerWithBorder}>
                            <View style={[{flex: 1, flexWrap: 'wrap'}, styles.tableCellView]}>
                                <StyledText style={[styles.tableCellView]}>{item?.productName} </StyledText>
                                <StyledText style={[styles.tableCellView]}>{item?.total === 0 && `(${localeContext?.t('order.freeLineitem')})`}</StyledText>
                            </View>

                            <View style={[{flex: 0.5}, styles.tableCellView, {justifyContent: 'flex-end'}]}
                            >
                                <StyledText style={[styles.tableCellView]}>{item?.quantity}</StyledText>
                            </View>

                            <View style={[{flex: 2}, styles.tableCellView, {justifyContent: 'flex-end'}]}>
                                <StyledText style={[styles.tableCellView]}>{formatCurrency(item?.total ?? 0)}</StyledText>
                            </View>

                            <View style={[{flex: 2}, styles.tableCellView, {justifyContent: 'flex-end'}]}>
                                <StyledText style={[styles.tableCellView]}>{normalizeTimeString(item?.deletedDate, 'YYYY-MM-DD HH:mm')}</StyledText>
                            </View>

                            <View style={[{flex: 1}, styles.tableCellView, {justifyContent: 'flex-end'}]}>
                                <StyledText style={[styles.tableCellView]}>{item?.deletedBy}</StyledText>
                            </View>
                        </View>

                    )
                })}
            </ScrollView>

        </Modal>
    );
}

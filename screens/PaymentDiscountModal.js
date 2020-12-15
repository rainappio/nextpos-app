import React, {useState, useEffect, Component} from "react";
import {connect} from 'react-redux'
import {Field, reduxForm} from 'redux-form'
import {Text, TouchableOpacity, View} from 'react-native'
import {formatCurrency, getfetchglobalOrderOffers, getOrder} from '../actions'
import RenderCheckBox from '../components/rn-elements/CheckBox'
import styles, {mainThemeColor} from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import CustomCheckBox from "../components/CustomCheckBox";
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";
import {StyledText} from "../components/StyledText";
import {api, dispatchFetchRequestWithOption} from '../constants/Backend'


import Modal from 'react-native-modal';



const PaymentDiscountModal = (props) => {

    const [modalVisible, setModalVisible] = useState(props?.modalVisible ?? false);
    const [order, setorder] = useState(props?.data ?? {});
    const [initialDiscount, setinitialDiscount] = useState({
        offerId: 'NO_DISCOUNT',
        orderDiscount: 'NO_DISCOUNT',
        discount: -1,
    });

    useEffect(() => {
        let _initialDiscount = {
            offerId: 'NO_DISCOUNT',
            orderDiscount: 'NO_DISCOUNT',
            discount: -1,
        };
        if (props?.data.appliedOfferInfo != null) {
            let overrideDiscount = props?.data.appliedOfferInfo.overrideDiscount

            if (props?.data.appliedOfferInfo.discountDetails.discountType === 'PERCENT_OFF') {
                overrideDiscount = overrideDiscount * 100
            }

            _initialDiscount.offerId = props?.data.appliedOfferInfo.offerId
            _initialDiscount.orderDiscount = props?.data.appliedOfferInfo.offerId
            _initialDiscount.discount = overrideDiscount
        }
        setinitialDiscount(_initialDiscount);

    }, [props?.data]);


    useEffect(() => {
        setModalVisible(props?.modalVisible ?? false);

    }, [props?.modalVisible]);

    const handlePayment = async values => {
        const orderId = order.orderId
        console.log('handlePayment', values)

        const waiveServiceCharge = async () => {
            const waiveServiceCharge = values.waiveServiceCharge === true

            await dispatchFetchRequestWithOption(api.order.waiveServiceCharge(orderId, waiveServiceCharge), {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            }, {
                defaultMessage: false
            }, response => {
            }).then()

        }

        const applyDiscount = async () => {
            const url = values.discount.offerId === 'NO_DISCOUNT' ? api.order.removeDiscount(orderId) : api.order.applyDiscount(orderId)

            await dispatchFetchRequestWithOption(url, {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values.discount)

            }, {
                defaultMessage: false
            }, response => {
            }).then()

        }

        const goToPaymentOrder = async () => {
            getOrder(order.orderId);
            props.closeModal()
            props.handleSubmit()
        }

        await [waiveServiceCharge, applyDiscount, goToPaymentOrder].reduce(async (previousPromise, nextAsyncFunction) => {
            await previousPromise;
            const result = await nextAsyncFunction();
        }, Promise.resolve());

    }
    return (

        <Modal
            isVisible={modalVisible}
            backdropOpacity={0.7}
            onBackdropPress={() => props.closeModal()}
            useNativeDriver
            hideModalContentWhileAnimating
        >

            <View style={{
                borderRadius: 10,
                width: '80%',
                height: '90%',
                borderWidth: 5,
                borderColor: mainThemeColor,
                marginTop: 53,
                justifyContent: 'center',
                marginBottom: 53,
                alignSelf: 'center',
            }}>

                <PaymentForm
                    onSubmit={handlePayment}
                    navigation={props.navigation}
                    prdId={props.prdId}
                    initialValues={{
                        waiveServiceCharge: props?.data.serviceCharge === 0,
                        discount: initialDiscount
                    }}
                    goBack={props.closeModal}
                    isEditLineItem={props?.isEditLineItem ?? false}
                    order={props?.data}
                    globalorderoffers={props?.globalorderoffers}
                />



            </View>

        </Modal>



    );
};

class PaymentFormScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    static contextType = LocaleContext

    constructor(props, context) {
        super(props, context)

        context.localize({
            en: {
                paymentTitle: 'Payment',
                orderOptions: 'Order Options',
                waiveServiceCharge: 'Waive Service Charge',
                resetAllOffers: 'Reset All Offers',
                payOrder: 'Pay'
            },
            zh: {
                paymentTitle: '付款',
                orderOptions: '訂單選項',
                waiveServiceCharge: '折抵服務費',
                resetAllOffers: '取消訂單優惠',
                payOrder: '付帳'
            }
        })
    }

    render() {
        const {order, navigation, handleSubmit, globalorderoffers} = this.props
        const {t} = this.context
        console.log('globalorderoffers render order', globalorderoffers, order)

        return (
            <ThemeKeyboardAwareScrollView>

                <ScreenHeader backNavigation={true}
                    parentFullScreen={true}
                    title={t('paymentTitle')}
                    backAction={() => {this.props.goBack()}}
                />

                <View style={[styles.tableRowContainerWithBorder, styles.verticalPadding]}>
                    <View style={[styles.tableCellView, {flex: 1}]}>
                        <StyledText>{t('order.subtotal')}</StyledText>
                    </View>

                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                        <StyledText style={styles.tableCellText}>
                            {formatCurrency(order.total.amountWithTax)}
                        </StyledText>
                    </View>
                </View>

                <View style={[styles.tableRowContainerWithBorder, styles.verticalPadding]}>
                    <View style={[styles.tableCellView, {flex: 1}]}>
                        <StyledText>{t('order.discount')}</StyledText>
                    </View>

                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                        <StyledText style={styles.tableCellText}>
                            {formatCurrency(order.discount)}
                        </StyledText>
                    </View>
                </View>

                <View style={[styles.tableRowContainerWithBorder, styles.verticalPadding]}>
                    <View style={[styles.tableCellView, {flex: 1}]}>
                        <StyledText>{t('order.serviceCharge')}</StyledText>
                    </View>

                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                        <StyledText style={styles.tableCellText}>
                            {formatCurrency(order.serviceCharge)}
                        </StyledText>
                    </View>
                </View>

                <View style={[styles.tableRowContainerWithBorder, styles.verticalPadding]}>
                    <View style={[styles.tableCellView, {flex: 1}]}>
                        <StyledText>{t('order.total')}</StyledText>
                    </View>

                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                        <StyledText style={styles.tableCellText}>
                            {formatCurrency(order.orderTotal)}
                        </StyledText>
                    </View>
                </View>

                <View style={[styles.sectionContainer]}>
                    <View style={[styles.sectionTitleContainer]}>
                        <StyledText style={styles.sectionTitleText}>{t('orderOptions')}</StyledText>
                    </View>
                    <View>
                        <Field
                            name="waiveServiceCharge"
                            component={CustomCheckBox}
                            customValue={true}
                            checkboxType='checkbox'
                            optionName={t('waiveServiceCharge')}
                        />
                    </View>
                </View>

                <View style={[styles.sectionContainer]}>
                    <View style={[styles.sectionTitleContainer]}>
                        <StyledText style={styles.sectionTitleText}>{t('order.discount')}</StyledText>
                    </View>

                    {globalorderoffers != null && globalorderoffers.map((offer, ix) => (
                        <View
                            style={[]}
                            key={ix}
                        >
                            <Field
                                name="discount"
                                component={RenderCheckBox}
                                customValue={{
                                    offerId: offer.offerId,
                                    orderDiscount: offer.offerId,
                                    discount: offer.discountValue
                                }}
                                optionName={offer.offerName}
                                defaultValueDisplay={(customValue, value) => String(customValue.orderDiscount === value.orderDiscount ? value.discount : 0)}
                            />
                        </View>
                    ))}
                </View>

                <View style={[styles.bottom, styles.horizontalMargin]}>
                    <TouchableOpacity onPress={() => handleSubmit()}>
                        <Text style={[styles.bottomActionButton, styles.actionButton]}>
                            {t('payOrder')}
                        </Text>
                    </TouchableOpacity>

                    <View>
                        <TouchableOpacity
                            onPress={() => this.props.goBack()}
                        >
                            <Text
                                style={[styles.bottomActionButton, styles.cancelButton]}
                            >
                                {t('action.cancel')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ThemeKeyboardAwareScrollView>
        )
    }
}

const mapStateToProps = (state, props) => ({

})

const mapDispatchToProps = dispatch => ({
    getOrder: id => dispatch(getOrder(id)),
    getfetchglobalOrderOffers: () => dispatch(getfetchglobalOrderOffers())
})

const PaymentForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(
    reduxForm({
        form: 'paymentForm',
        enableReinitialize: true
    })(PaymentFormScreen)
)


export default PaymentDiscountModal;
import React, {useState, useEffect, Component} from "react";
import {Field, reduxForm} from 'redux-form'
import {connect} from 'react-redux'
import {Alert, StyleSheet, Text, TouchableHighlight, View, TouchableOpacity, KeyboardAvoidingView} from "react-native";
import {Accordion, List} from '@ant-design/react-native'
import RenderStepper from '../components/RenderStepper'
import {isCountZero, isRequired} from '../validators'
import styles, {mainThemeColor} from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import PickerInput from "../components/PickerInput";
import SegmentedControl from "../components/SegmentedControl";
import ScreenHeader from "../components/ScreenHeader";
import {StyledText} from "../components/StyledText";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {api, dispatchFetchRequest} from '../constants/Backend'
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";
import {getGlobalProductOffers, getOrder, getProduct} from '../actions';
import LoadingScreen from "./LoadingScreen";
import BackendErrorScreen from "./BackendErrorScreen";

import CheckBoxGroupObjPick from '../components/CheckBoxGroupObjPick'
import RadioItemObjPick from '../components/RadioItemObjPick'
import InputText from "../components/InputText";
import RenderCheckBox from "../components/rn-elements/CheckBox";
import Modal from 'react-native-modal';



const OrderItemDetailEditModal = (props) => {

    const [modalVisible, setModalVisible] = useState(props?.modalVisible ?? false);

    useEffect(() => {
        setModalVisible(props?.modalVisible ?? false);
    }, [props?.modalVisible]);

    const handleSubmit = values => {
        const createOrder = {}
        createOrder.orderType = 'IN_STORE'
        createOrder.tableId = props?.data?.table?.tableId
        createOrder.demographicData = {
            male: values.male,
            female: values.female,
            kid: values.kid,
            ageGroup: values.ageGroup,
            visitFrequency: values.visitFrequency
        }

        dispatchFetchRequest(api.order.new, {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(createOrder)
        },
            response => {
                response.json().then(data => {
                    props?.submitOrder(data.orderId)
                })
            }).then()
    }
    return (

        <Modal
            isVisible={modalVisible}
            backdropOpacity={0.7}
            onBackdropPress={() => props.closeModal()}
            useNativeDriver
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
                <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={80}>
                    <ConnectedOrderItemOptions
                        onSubmit={handleSubmit}
                        navigation={props.navigation}
                        prdId={props.prdId}
                        initialValues={{
                            male: 0,
                            female: 0,
                            kid: 0,
                            data: props.data
                        }}
                        goBack={props.closeModal}
                        isEditLineItem={props?.isEditLineItem ?? false}
                        modalData={props?.data}
                    />
                </KeyboardAvoidingView>


            </View>

        </Modal>



    );
};

class ConnectedOrderItemOptionsBase extends React.Component {
    static navigationOptions = {
        header: null
    }
    static contextType = LocaleContext

    constructor(props, context) {
        super(props, context)

    }

    componentDidMount() {

        this.props.getProduct()
        this.props.getOrder(this.props.navigation.state.params.orderId)
        this.props.getGlobalProductOffers()
    }

    handleSubmit = values => {
        const orderId = this.props.navigation.state.params.orderId

        const updatedOptions = []
        !!values?.productOptions && values.productOptions.map(option => {
            if (Array.isArray(option)) {
                if (option.length > 0) {

                    const optionValues = option.map(o => {
                        return o.optionValue
                    })

                    updatedOptions.push({
                        optionName: option[0].optionName,
                        optionValue: optionValues.join()
                    })
                }
            } else {
                updatedOptions.push(option)
            }
        })

        const lineItemRequest = {
            productId: this.props.prdId,
            quantity: values.quantity,
            overridePrice: values.overridePrice,
            productOptions: updatedOptions,
            productDiscount: values.lineItemDiscount.productDiscount,
            discountValue: values.lineItemDiscount.discount
        }

        dispatchFetchRequest(
            api.order.newLineItem(orderId),
            {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(lineItemRequest)
            },
            response => {
                this.props.navigation.navigate('OrderFormII', {
                    orderId: orderId
                })
                this.props.getOrder(orderId)
                this.props.goBack()
            }
        ).then()
    }

    handleUpdate = values => {

        const orderId = this.props?.navigation?.state?.params?.orderId
        const lineItemId = values.lineItemId

        const updatedOptions = []
        !!values?.productOptions && values.productOptions.map(option => {
            if (Array.isArray(option)) {
                if (option.length > 0) {

                    const optionValues = option.map(o => {
                        return o.optionValue
                    })

                    updatedOptions.push({
                        optionName: option[0].optionName,
                        optionValue: optionValues.join()
                    })
                }
            } else {
                updatedOptions.push(option)
            }
        })

        const lineItemRequest = {
            quantity: values.quantity,
            productOptions: updatedOptions,
            overridePrice: values.overridePrice,
            productDiscount: values.lineItemDiscount.productDiscount,
            discountValue: values.lineItemDiscount.discount
        }

        dispatchFetchRequest(api.order.updateLineItem(orderId, lineItemId), {
            method: 'PATCH',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(lineItemRequest)
        }, response => {
            this.props.navigation.navigate('OrderFormII', {
                orderId: orderId
            })
            this.props.getOrder(orderId)
            this.props.goBack()

        }).then()
    }

    render() {
        const {product, globalProductOffers, haveError, isLoading} = this.props

        const isEditLineItem = !!this.props?.isEditLineItem
        const lineItemDiscount = {
            offerId: 'NO_DISCOUNT',
            productDiscount: 'NO_DISCOUNT',
            discount: -1
        }

        const initialValues = {
            ...this.props?.modalData,
            lineItemDiscount: lineItemDiscount
        }

        if (initialValues.appliedOfferInfo != null) {
            let overrideDiscount = initialValues.appliedOfferInfo.overrideDiscount

            if (initialValues.appliedOfferInfo.discountDetails.discountType === 'PERCENT_OFF') {
                overrideDiscount = overrideDiscount * 100
            }

            initialValues.lineItemDiscount = {
                offerId: initialValues.appliedOfferInfo.offerId,
                productDiscount: initialValues.appliedOfferInfo.offerId,
                discount: overrideDiscount
            }
        }

        if (isLoading) {
            return (
                <LoadingScreen />
            )
        } else if (haveError) {
            return (
                <BackendErrorScreen />
            )
        }
        return (
            <>
                {isEditLineItem ? (
                    <OrderItemOptions
                        onSubmit={this.handleUpdate}
                        product={product}
                        initialValues={initialValues}
                        globalProductOffers={globalProductOffers}
                        goBack={this.props.goBack}
                    />
                ) : (
                        <OrderItemOptions
                            onSubmit={this.handleSubmit}
                            product={product}
                            initialValues={{lineItemDiscount: lineItemDiscount, quantity: 1}}
                            globalProductOffers={globalProductOffers}
                            goBack={this.props.goBack}
                        />
                    )}
            </>
        )
    }
}

const mapStateToProps = state => ({
    globalProductOffers: state.globalProductOffers.data.results,
    product: state.product.data,
    haveData: state.product.haveData,
    haveError: state.product.haveError,
    isLoading: state.product.loading,
})

const mapDispatchToProps = (dispatch, props) => ({
    dispatch,
    getProduct: () => dispatch(getProduct(props.prdId)),
    getOrder: () => dispatch(getOrder(props.navigation.state.params.orderId)),
    getGlobalProductOffers: () => dispatch(getGlobalProductOffers())
})

const ConnectedOrderItemOptions = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedOrderItemOptionsBase)

class OrderItemOptions extends React.Component {
    static navigationOptions = {
        header: null
    }
    static contextType = LocaleContext

    constructor(props, context) {
        super(props, context)

        context.localize({
            en: {
                productOptions: 'Select Product Option(s)',
                quantity: 'Quantity',
                freeTextProductOption: 'Note',
                overridePrice: 'Custom Price',
                lineItemDiscount: 'Line Item Discount'
            },
            zh: {
                productOptions: '選擇產品註記',
                quantity: '數量',
                freeTextProductOption: '註記',
                overridePrice: '自訂價格',
                lineItemDiscount: '品項折扣'
            }
        })
        this.state = {
            optionActiveSections: [],
            generalActiveSections: []
        }
    }

    // keep for future reference
    // invalidCallBack = (index) => {
    //     let oldActiveSectionsArr = [...this.state.activeSections]
    //     let oldActiveSectionsSet = new Set(oldActiveSectionsArr)
    //     oldActiveSectionsSet.add(index)
    //     let newActiveSectionsArr = Array.from(oldActiveSectionsSet)
    //     this.setState({activeSections: newActiveSectionsArr})
    // }

    componentDidMount() {
        if (!!this.props?.product?.productOptions) {
            let activeSectionsArr = this.props?.product?.productOptions?.map((prdOption, optionIndex) => {
                if (prdOption?.required)
                    return optionIndex
            })?.filter((item) => {return !!item})
            this.setState({optionActiveSections: activeSectionsArr})
        }
    }

    render() {
        const {product, globalProductOffers} = this.props
        const {t, themeStyle} = this.context

        const hasProductOptions = product.productOptions != null && product.productOptions.length > 0
        const lastOptionIndex = product.productOptions != null ? product.productOptions.length : 0

        return (
            <View style={[themeStyle, {height: '100%'}]}>
                <ScreenHeader backNavigation={true}
                    parentFullScreen={true}
                    title={`${product.name} ($${product.price})`}
                    backAction={() => {this.props.goBack()}}
                />
                <View style={{flex: 9}}>
                    <ThemeScrollView >
                        <View >


                            {hasProductOptions && (
                                <View style={[styles.sectionTitleContainer]}>
                                    <StyledText style={styles.sectionTitleText}>
                                        {t('productOptions')}
                                    </StyledText>
                                </View>
                            )}

                            {product.productOptions !== undefined &&
                                <Accordion
                                    onChange={(activeSections) => this.setState({optionActiveSections: activeSections})}
                                    expandMultiple={true}
                                    activeSections={this.state.optionActiveSections}
                                >
                                    {product.productOptions.map((prdOption, optionIndex) => {
                                        const requiredOption = prdOption.required

                                        var arrForTrueState = []
                                        prdOption.optionValues.map((optVal, x) => {
                                            arrForTrueState.push({
                                                optionName: prdOption.optionName,
                                                optionValue: optVal.value,
                                                optionPrice: optVal.price,
                                                id: prdOption.versionId + x
                                            })
                                        })

                                        return (
                                            <Accordion.Panel
                                                header={<View style={styles.listPanel}>
                                                    <StyledText style={styles.listPanelText}>{prdOption.optionName}</StyledText>
                                                </View>}
                                            >
                                                <View
                                                    key={prdOption.versionId}
                                                    style={styles.sectionContainer}
                                                >


                                                    {prdOption.multipleChoice === false ? (
                                                        <View>
                                                            {prdOption.optionValues.map((optVal, ix) => {
                                                                let optionObj = {}
                                                                optionObj['optionName'] = prdOption.optionName
                                                                optionObj['optionValue'] = optVal.value
                                                                optionObj['optionPrice'] = optVal.price
                                                                optionObj['id'] = prdOption.id

                                                                return (
                                                                    <View key={prdOption.id + ix}>
                                                                        <Field
                                                                            name={`productOptions[${optionIndex}]`}
                                                                            component={RadioItemObjPick}
                                                                            customValueOrder={optionObj}
                                                                            optionName={optVal.value}
                                                                            onCheck={(currentVal, fieldVal) => {
                                                                                return fieldVal !== undefined && currentVal.optionValue === fieldVal.optionValue
                                                                            }}
                                                                            validate={requiredOption ? isRequired : null}
                                                                        />
                                                                    </View>
                                                                )
                                                            })}
                                                        </View>
                                                    ) : (
                                                            <View>
                                                                <Field
                                                                    name={`productOptions[${optionIndex}]`}
                                                                    component={CheckBoxGroupObjPick}
                                                                    customarr={arrForTrueState}
                                                                    validate={requiredOption ? isRequired : null}
                                                                />
                                                            </View>
                                                        )}
                                                </View>
                                            </Accordion.Panel>
                                        )
                                    })}</Accordion>}
                            <Accordion
                                onChange={(activeSections) => this.setState({generalActiveSections: activeSections})}
                                expandMultiple={true}
                                activeSections={this.state.generalActiveSections}
                            >
                                <Accordion.Panel
                                    header={<View style={[styles.sectionTitleContainer, {flex: 1}]}>
                                        <StyledText style={[styles.sectionTitleText]}>
                                            {t('freeTextProductOption')}
                                        </StyledText>
                                    </View>}
                                >
                                    <View>
                                        <View style={[styles.tableRowContainerWithBorder]}>
                                            <View style={[{flex: 1}]}>
                                                <Field
                                                    name={`productOptions[${lastOptionIndex}]`}
                                                    component={InputText}
                                                    placeholder={t('freeTextProductOption')}
                                                    alignLeft={true}
                                                    format={(value, name) => {
                                                        return value != null ? String(value.optionValue) : ''
                                                    }}
                                                    normalize={value => {
                                                        return {
                                                            optionName: t('freeTextProductOption'),
                                                            optionValue: value
                                                        }
                                                    }}
                                                />
                                            </View>
                                        </View>
                                        <View style={[styles.tableRowContainerWithBorder]}>
                                            <View style={[{flex: 1}]}>
                                                <Field
                                                    name={`overridePrice`}
                                                    component={InputText}
                                                    placeholder={t('overridePrice')}
                                                    keyboardType='numeric'
                                                    alignLeft={true}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </Accordion.Panel>

                                <Accordion.Panel
                                    header={<View style={[styles.sectionTitleContainer, {flex: 1}]}>
                                        <StyledText style={[styles.sectionTitleText]}>
                                            {t('lineItemDiscount')}
                                        </StyledText>
                                    </View>}
                                >
                                    <View>
                                        <View style={styles.sectionContainer}>
                                            {globalProductOffers != null && globalProductOffers.map(offer => (
                                                <View key={offer.offerId}>
                                                    <Field
                                                        name="lineItemDiscount"
                                                        component={RenderCheckBox}
                                                        customValue={{
                                                            offerId: offer.offerId,
                                                            productDiscount: offer.offerId,
                                                            discount: offer.discountValue
                                                        }}
                                                        optionName={offer.offerName}
                                                        defaultValueDisplay={(customValue, value) => String(customValue.productDiscount === value.productDiscount ? value.discount : 0)}
                                                    />
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                </Accordion.Panel>

                            </Accordion>

                            <View style={styles.tableRowContainerWithBorder}>
                                <Field
                                    name="quantity"
                                    component={RenderStepper}
                                    optionName={t('quantity')}
                                    validate={[isRequired, isCountZero]}
                                />
                            </View>


                        </View>
                    </ThemeScrollView>
                </View>
                <View style={[styles.bottom, styles.dynamicVerticalPadding(20), styles.horizontalMargin, {flexDirection: 'row', alignSelf: 'flex-end', flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end'}]}>
                    <View style={{flex: 1, marginHorizontal: 5}}>
                        <TouchableOpacity
                            onPress={(value) => {
                                console.log("goBack", value)
                                this.props.goBack()
                            }}
                        >
                            <Text style={[styles.bottomActionButton, styles.cancelButton]}>{t('action.cancel')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1, marginHorizontal: 5}}>
                        <TouchableOpacity
                            onPress={this.props.handleSubmit}
                        >
                            <Text style={[[styles.bottomActionButton, styles.actionButton]]}>
                                {t('action.save')}
                            </Text>
                        </TouchableOpacity>
                    </View>


                </View>
            </View>
        )
    }
}

OrderItemOptions = reduxForm({
    form: 'OrderItemOptions'
})(OrderItemOptions)


export default OrderItemDetailEditModal;
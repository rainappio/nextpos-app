import React, {useState, useEffect, Component, useContext} from "react";
import {Field, reduxForm, formValueSelector} from 'redux-form'
import {connect} from 'react-redux'
import {Alert, StyleSheet, Text, TouchableHighlight, View, TouchableOpacity, KeyboardAvoidingView, FlatList, Dimensions} from "react-native";
import {Accordion, List} from '@ant-design/react-native'
import {Ionicons} from '@expo/vector-icons'
import RenderStepper from '../components/RenderStepper'
import {isCountZero, isRequired} from '../validators'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import PickerInput from "../components/PickerInput";
import SegmentedControl from "../components/SegmentedControl";
import ScreenHeader from "../components/ScreenHeader";
import {StyledText} from "../components/StyledText";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {api, dispatchFetchRequest, successMessage} from '../constants/Backend'
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";
import {getGlobalProductOffers, getOrder, getProduct} from '../actions';
import LoadingScreen from "./LoadingScreen";
import BackendErrorScreen from "./BackendErrorScreen";
import CheckBoxGroupObjPick from '../components/CheckBoxGroupObjPick'
import RadioItemObjPick, {RadioLineItemObjPick} from '../components/RadioItemObjPick'
import InputText from "../components/InputText";
import InputNumber from "../components/InputNumber"
import RenderCheckBox from "../components/rn-elements/CheckBox";
import Modal from 'react-native-modal';



const OrderItemDetailEditModal = (props) => {
    const {customMainThemeColor} = useContext(LocaleContext);
    const [modalVisible, setModalVisible] = useState(props?.modalVisible ?? false);

    useEffect(() => {
        setModalVisible(props?.modalVisible ?? false);
    }, [props?.modalVisible]);


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
                borderColor: customMainThemeColor,
                marginTop: 53,
                justifyContent: 'center',
                marginBottom: 53,
                alignSelf: 'center',
            }}>
                <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={0}>
                    <ConnectedOrderItemOptions
                        navigation={props.navigation}
                        route={props.route}
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
                        productsDetail={props?.productsDetail}
                        labels={props?.labels}
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
        this.props.getOrder(this.props.route.params.orderId)
        this.props.getGlobalProductOffers()
    }

    handleSubmit = values => {
        const orderId = this.props.route.params.orderId

        const updatedOptions = []
        !!values?.productOptions && values.productOptions.map(option => {
            if (!option.optionName) {
                option.optionName = this.context.t('freeTextProductOption')
            }
            if (Array.isArray(option)) {

                updatedOptions.push(...option)
            } else {
                updatedOptions.push(option)
            }
        })
        const updatechildLineItems = []
        !!values?.childLineItems && values.childLineItems.map(product => {
            product.map((item) => {
                if (item !== undefined) {
                    let newOptions = []
                    !!item.productOptions && item.productOptions.map((option) => {
                        if (Array.isArray(option)) {
                            newOptions.push(...option)
                        }
                    })
                    updatechildLineItems.push({...item, productOptions: newOptions, quantity: values.quantity})
                }
            })
        })

        if (this.props.product?.productType !== 'PRODUCT_COMBO') {
            const lineItemRequest = {
                productId: this.props.prdId,
                quantity: values.quantity,
                sku: values.sku,
                overridePrice: values.overridePrice,
                productOptions: updatedOptions,
                productDiscount: values.lineItemDiscount.productDiscount,
                discountValue: values.lineItemDiscount.discount,
            }
            console.log("submit lineItemRequest= ", lineItemRequest)

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
                    successMessage(this.context.t('orderForm.addItemSuccess', {quantity: values.quantity, product: this.props?.product.name}))
                    this.props.getOrder(orderId)
                    this.props.goBack()
                }
            ).then()

        } else {
            const lineItemRequest = {
                productId: this.props.prdId,
                quantity: values.quantity,
                sku: values.sku,
                overridePrice: values.overridePrice,
                productOptions: updatedOptions,
                productDiscount: values.lineItemDiscount.productDiscount,
                discountValue: values.lineItemDiscount.discount,
                childLineItems: updatechildLineItems
            }
            console.log("submit lineItemRequest= ", lineItemRequest)
            let checkAllRequired = values.checkChildProduct.every(value => value === true)
            if (checkAllRequired) {
                dispatchFetchRequest(
                    api.order.newComboLineItem(orderId),
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
                        successMessage(this.context.t('orderForm.addItemSuccess', {quantity: values.quantity, product: this.props?.product.name}))
                        this.props.getOrder(orderId)
                        this.props.goBack()
                    }
                ).then()
            }
        }
    }

    handleUpdate = values => {

        const orderId = this.props?.route?.params?.orderId
        const lineItemId = values.lineItemId

        const updatedOptions = []

        !!values?.productOptions && values.productOptions.map(option => {
            if (!option.optionName) {
                option.optionName = this.context.t('freeTextProductOption')
            }
            if (Array.isArray(option)) {

                updatedOptions.push(...option)
            } else {
                updatedOptions.push(option)
            }
        })

        const lineItemRequest = {
            quantity: values.quantity,
            sku: values.sku,
            productOptions: updatedOptions,
            overridePrice: values.overridePrice,
            productDiscount: values.lineItemDiscount.productDiscount,
            discountValue: values.lineItemDiscount.discount,
        }

        console.log("update lineItemRequest= ", lineItemRequest)

        dispatchFetchRequest(api.order.updateLineItem(orderId, lineItemId), {
            method: 'PATCH',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(lineItemRequest)
        }, response => {
            successMessage(this.context.t('orderForm.addItemSuccess', {quantity: values.quantity, product: this.props?.product.name}))
            this.props.getOrder(orderId)
            this.props.goBack()

        }).then()
    }

    render() {
        const {product, productsDetail, globalProductOffers, haveError, isLoading, labels = []} = this.props


        const isEditLineItem = !!this.props?.isEditLineItem
        const lineItemDiscount = {
            offerId: 'NO_DISCOUNT',
            productDiscount: 'NO_DISCOUNT',
            discount: -1
        }

        const initialValues = {
            ...this.props?.modalData,
            lineItemDiscount: lineItemDiscount,
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
                        productsDetail={productsDetail}
                        labels={labels}
                        initialValues={initialValues}
                        globalProductOffers={globalProductOffers}
                        goBack={this.props.goBack}
                    />
                ) : (
                        <OrderItemOptions
                            onSubmit={this.handleSubmit}
                            product={product}
                            productsDetail={productsDetail}
                            labels={labels}
                            initialValues={{lineItemDiscount: lineItemDiscount, quantity: 1, sku: null}}
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
    getOrder: () => dispatch(getOrder(props.route.params.orderId)),
    getGlobalProductOffers: () => dispatch(getGlobalProductOffers()),
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
                lineItemDiscount: 'Line Item Discount',
                singleChoice: 'Single',
                multipleChoice: 'Multiple',
                requiredChoice: 'Required',
            },
            zh: {
                productOptions: '選擇產品註記',
                quantity: '數量',
                freeTextProductOption: '註記',
                overridePrice: '自訂價格',
                lineItemDiscount: '品項折扣',
                singleChoice: '單選',
                multipleChoice: '複選',
                requiredChoice: '必選',
            }
        })
        this.state = {
            optionActiveSections: [],
            comboActiveSections: [],
            generalActiveSections: [],
            highlightSkuIndex: null,
            selectedSkuQuantity: 1,
            selectedSku: '',
            inventoryId: null,
            comboLabels: [],
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
            })?.filter((item) => {return item !== undefined})
            this.setState({optionActiveSections: activeSectionsArr})
        }

        if (!!this.props?.product?.productComboLabels) {

            let comboLabelList = this.props.product.productComboLabels
            let requiredArr = []
            comboLabelList.map((prdComboLabel, labelIndex) => {
                const productsList = new Map(Object.entries(this.props?.productsDetail))
                if (prdComboLabel.required == true) {
                    requiredArr.push(false)
                } else {
                    requiredArr.push(true)
                }
                this.props?.labels.find((label) => {
                    if (label.id == prdComboLabel.id) {
                        let prds = productsList.get(label.label)
                        prdComboLabel.products = prds
                        prdComboLabel.products.map((product) => product.isSelected = false)
                    }
                })
            })
            let activeSectionsArr = this.props?.product?.productComboLabels?.map((label, labelIndex) => {
                return labelIndex
            })?.filter((item) => {return item !== undefined})
            this.setState({comboActiveSections: activeSectionsArr, comboLabels: comboLabelList})
            this.props.change(`checkChildProduct`, requiredArr)

        }
        if (this.props?.initialValues.sku) {
            this.setState({selectedSku: this.props?.initialValues.sku})
        }
        if (this.props?.initialValues.quantity) {
            this.setState({selectedSkuQuantity: this.props?.initialValues.quantity})
        }
    }


    getComboProduct = (comboPrd, prdIndex, labelIndex) => {

        if (this.props?.childLineItems !== undefined && this.props?.childLineItems[labelIndex] !== undefined && this.props?.childLineItems[labelIndex][prdIndex] !== undefined) {

            let newChild = this.props?.childLineItems[labelIndex].splice(prdIndex, 1, undefined)
            this.props.change(`childLineItems[${labelIndex}]`, newChild)
            this.state.comboLabels[labelIndex].products[prdIndex].isSelected = false
            this.setState({comboLabels: this.state.comboLabels})
            this.props.change(`childLineItems`, this.props?.childLineItems) // renew immediately

        } else {

            this.state.comboLabels[labelIndex].products[prdIndex].isLoading = true
            this.setState({comboLabels: this.state.comboLabels})
            dispatchFetchRequest(api.product.getById(comboPrd.id), {
                method: 'GET',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            }, response => {
                response.json().then(product => {
                    if (comboPrd.hasOptions) {
                        let optionsInfo = []
                        let optionsArr = []
                        product.productOptions.map((prdOption, optionIndex) => {

                            optionsInfo.push({
                                optionName: prdOption.optionName,
                                multipleChoice: prdOption.multipleChoice,
                                required: prdOption.required,
                            })
                            optionsArr[optionIndex] = []
                            prdOption.optionValues.map((optVal, x) => {
                                optionsArr[optionIndex].push({
                                    optionName: prdOption.optionName,
                                    optionValue: optVal.value,
                                    optionPrice: optVal.price,
                                    id: prdOption.versionId + x
                                })
                            })
                        })

                        this.state.comboLabels[labelIndex].products[prdIndex].optionsInfo = optionsInfo
                        this.state.comboLabels[labelIndex].products[prdIndex].productOptions = optionsArr
                        this.state.comboLabels[labelIndex].products[prdIndex].isLoading = false
                        this.state.comboLabels[labelIndex].products[prdIndex].isSelected = true
                        this.setState({comboLabels: this.state.comboLabels})

                    } else {
                        this.state.comboLabels[labelIndex].products[prdIndex].productOptions = null
                        this.state.comboLabels[labelIndex].products[prdIndex].optionsInfo = [{optionName: null, multipleChoice: false, required: false}]
                        this.state.comboLabels[labelIndex].products[prdIndex].isLoading = false
                        this.state.comboLabels[labelIndex].products[prdIndex].isSelected = true
                        this.setState({comboLabels: this.state.comboLabels})
                    }

                    this.props.change(`childLineItems[${labelIndex}][${prdIndex}].productId`, product.id)
                    this.props.change(`childLineItems[${labelIndex}][${prdIndex}].quantity`, 1)
                })
            }
            ).then()
        }
    }

    InventoryItem = (item) => {

        let isSelected = this.state.selectedSku == item.item.sku
            || this.state.highlightSkuIndex == item.index

        return (
            <View style={[{flex: 1, marginHorizontal: 20}]}>
                <TouchableHighlight
                    style={{flexDirection: 'row', justifyContent: 'space-between', color: this.contetx?.customMainThemeColor}}
                    onPress={() => {
                        this.props.change(`sku`, item?.item.sku)
                        this.setState({highlightSkuIndex: item.index, selectedSku: item?.item.sku})

                        if (!!isSelected) {
                            this.props.change(`quantity`, this.state.selectedSkuQuantity + 1)
                            this.setState({selectedSkuQuantity: (this.state.selectedSkuQuantity + 1)})
                        }
                        console.log(this.state.selectedSku, this.props.sku)
                    }}
                >
                    <View style={[styles.flexButton(isSelected ? this.context?.customMainThemeColor : '#fff8c9')]}>

                        <View style={{color: isSelected ? '#fff' : '#555'}}>
                            <StyledText style={{color: isSelected ? '#fff' : '#555', paddingTop: 8, paddingBottom: 4, fontWeight: 'bold', fontSize: 16}}>{item?.item.sku}</StyledText>
                        </View>
                        <View>
                            <StyledText style={{color: isSelected ? '#fff' : '#555', paddingBottom: 8}}>{item?.item.name}</StyledText>
                        </View>
                        <View style={{borderTopWidth: 1, borderColor: isSelected ? '#fff' : '#ccc', backgroundColor: isSelected ? this.context?.customMainThemeColor : '#fff8c9', width: '100%', justifyContent: 'center', alignItems: 'center', paddingVertical: 4}}>
                            <StyledText style={{color: isSelected ? '#fff' : '#555'}}>{item?.item.quantity}</StyledText>
                        </View>
                    </View>

                </TouchableHighlight>
            </View >
        );
    }

    render() {
        const {product, productsDetail, globalProductOffers, labels = []} = this.props
        const {t, themeStyle, customMainThemeColor, customBackgroundColor} = this.context

        const hasProductComboLabels = product.productComboLabels != null && product.productComboLabels.length > 0
        const hasProductOptions = product.productOptions != null && product.productOptions.length > 0
        const lastOptionIndex = product.productOptions != null ? product.productOptions.length : 0
        const hasInventory = product.inventory != null
        const inventoryData = product.inventory ? Object.values(product.inventory.inventoryQuantities) : null



        return (
            <View style={[themeStyle, {height: '100%', borderRadius: 10, backgroundColor: customBackgroundColor}]}>
                <ScreenHeader backNavigation={true}
                    parentFullScreen={true}
                    style={{paddingTop: 20}}
                    title={`${product.name} ($${product.price})`}
                    backAction={() => {this.props.goBack()}}
                />
                <View style={{flex: 9}}>
                    <ThemeScrollView >
                        <View >


                            {hasProductComboLabels && (
                                <View style={[styles.sectionTitleContainer]}>
                                    <StyledText style={styles.sectionTitleText}>
                                        {t('product.childLabels')}
                                    </StyledText>
                                </View>
                            )}
                            {hasProductComboLabels && product.productComboLabels !== undefined &&
                                <Accordion
                                    onChange={(activeSections) => this.setState({comboActiveSections: activeSections})}
                                    expandMultiple={true}
                                    activeSections={this.state.comboActiveSections}
                                >
                                    {this.state.comboLabels !== null && this.state.comboLabels.map((prdComboLabel, labelIndex) => {
                                        let isMultipleLabel = prdComboLabel.multipleSelection
                                        let isChildPrdRequired = prdComboLabel.required
                                        let childPrdCheck = (this.props?.childLineItems !== undefined && this.props?.childLineItems[labelIndex] !== undefined) ? this.props?.childLineItems[labelIndex].every((value) => value === undefined) : true

                                        return (
                                            <Accordion.Panel
                                                key={labelIndex}
                                                header={<View style={styles.listPanel}>
                                                    <StyledText style={styles.listPanelText}>{prdComboLabel.name}</StyledText>
                                                    <StyledText style={[{fontSize: 12, color: customMainThemeColor, padding: 4}]}>{isMultipleLabel ? t('multipleChoice') : t('singleChoice')}</StyledText>
                                                    <StyledText style={[styles.rootError, {padding: 4}]}>{(isChildPrdRequired && childPrdCheck) && t('requiredChoice')}
                                                    </StyledText>
                                                </View>}
                                            >
                                                <View
                                                    key={prdComboLabel.id}
                                                    style={styles.sectionContainer}
                                                >
                                                    <View>
                                                        {prdComboLabel.products.map((product, prdIndex) => {
                                                            return (
                                                                <View key={prdIndex}>
                                                                    <TouchableOpacity style={[styles.listPanel, styles.dynamicHorizontalPadding(16)]} onPress={() => {

                                                                        if (this.state.comboLabels[labelIndex].products[prdIndex]) {
                                                                            if (!isMultipleLabel) {
                                                                                this.state.comboLabels[labelIndex].products?.map((product) => product.isSelected = false)
                                                                                this.setState({comboLabels: this.state.comboLabels})
                                                                                this.props.change(`childLineItems[${labelIndex}]`, undefined)

                                                                            }
                                                                            if (isChildPrdRequired) {
                                                                                let checkValidate = isChildPrdRequired && childPrdCheck
                                                                                this.props.change(`checkChildProduct[${labelIndex}]`, checkValidate)
                                                                            }
                                                                            this.getComboProduct(product, prdIndex, labelIndex)
                                                                        }
                                                                    }
                                                                    }>
                                                                        <View style={[styles.tableRowContainer, styles.flex(1), {justifyContent: 'space-between'}]}>
                                                                            <View style={[styles.tableCellView]}>
                                                                                <StyledText style={[styles.listPanelText]}>
                                                                                    {product.name}
                                                                                </StyledText>

                                                                            </View>
                                                                            {(this.state.comboLabels[labelIndex].products[prdIndex].isSelected) && <View style={[styles.tableCellView]}>
                                                                                <StyledText>
                                                                                    <Ionicons name="checkbox" size={28} color={customMainThemeColor} />
                                                                                </StyledText>
                                                                            </View>}

                                                                        </View>
                                                                    </TouchableOpacity>
                                                                    {this.state.comboLabels[labelIndex].products[prdIndex].isLoading && <LoadingScreen />}
                                                                    {
                                                                        (!!this.state.comboLabels[labelIndex].products[prdIndex].productOptions) && (this.state.comboLabels[labelIndex].products[prdIndex].isSelected) &&
                                                                        <View style={[{paddingLeft: 20}]}>
                                                                            {product.optionsInfo.map((option, optionIndex) => {
                                                                                return (
                                                                                    <View key={optionIndex}>
                                                                                        <View style={[styles.jc_alignIem_center, styles.sectionTitleText]}>
                                                                                            <StyledText style={[{paddingTop: 8, color: customMainThemeColor}]}>{option.optionName}</StyledText>
                                                                                        </View>

                                                                                        <Field
                                                                                            name={`childLineItems[${labelIndex}][${prdIndex}].productOptions[${optionIndex}]`}
                                                                                            component={CheckBoxGroupObjPick}
                                                                                            customarr={this.state.comboLabels[labelIndex].products[prdIndex].productOptions[optionIndex]}
                                                                                            limitOne={option.multipleChoice === true ? false : true}
                                                                                            validate={option.required ? isRequired : null}
                                                                                        />
                                                                                    </View>
                                                                                )
                                                                            })}

                                                                        </View>}
                                                                </View>
                                                            )

                                                        })

                                                        }
                                                    </View>

                                                </View>
                                            </Accordion.Panel>
                                        )
                                    })}</Accordion>
                            }


                            {hasInventory && (
                                <View style={[styles.sectionTitleContainer]}>
                                    <StyledText style={styles.sectionTitleText}>
                                        {t('inventory.skuName')}
                                    </StyledText>
                                </View>
                            )}
                            {hasInventory && inventoryData && (

                                <FlatList
                                    style={[styles.mgrbtn20], {
                                        maxHeight: 350, paddingBottom: 20, maxWidth: Dimensions.get('window').width / 3
                                    }}
                                    numColumns={4}
                                    data={inventoryData}
                                    renderItem={(item) => this.InventoryItem(item)}
                                    keyExtractor={(item) => item.name}
                                    extraData={this.state.highlightSkuIndex}
                                />
                            )}


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
                                                key={optionIndex}
                                                header={<View style={styles.listPanel}>
                                                    <StyledText style={styles.listPanelText}>{prdOption.optionName}</StyledText>
                                                </View>}
                                            >
                                                <View
                                                    key={prdOption.versionId}
                                                    style={styles.sectionContainer}
                                                >
                                                    <View>
                                                        <Field
                                                            name={`productOptions[${optionIndex}]`}
                                                            component={CheckBoxGroupObjPick}
                                                            customarr={arrForTrueState}
                                                            limitOne={prdOption.multipleChoice === false ? true : false}
                                                            validate={requiredOption ? isRequired : null}
                                                        />
                                                    </View>
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
                                            <Field
                                                name={`productOptions[${lastOptionIndex}].optionValue`}
                                                component={InputText}
                                                placeholder={t('freeTextProductOption')}
                                                alignLeft={true}
                                                format={(value, name) => {
                                                    return value != null ? String(value) : ''
                                                }}
                                            />
                                        </View>
                                        <View style={[styles.tableRowContainerWithBorder]}>
                                            <Field
                                                name={`overridePrice`}
                                                component={InputText}
                                                placeholder={t('overridePrice')}
                                                keyboardType='numeric'
                                                alignLeft={true}
                                            />
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

                        </View>
                    </ThemeScrollView>
                </View>
                <View style={styles.tableRowContainerWithBorder}>
                    <View style={{paddingHorizontal: 10}}>
                        <Field
                            name="quantity"
                            component={RenderStepper}
                            optionName={t('quantity')}
                            validate={[isRequired, isCountZero]}
                        />
                    </View>
                </View>
                <View style={[styles.bottom, styles.dynamicVerticalPadding(20), styles.horizontalMargin, {flexDirection: 'row', alignSelf: 'flex-end', flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end'}]}>
                    <View style={{flex: 1, marginHorizontal: 5}}>
                        <TouchableOpacity
                            onPress={(value) => {
                                this.props.goBack()
                            }}
                        >
                            <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>{t('action.cancel')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1, marginHorizontal: 5}}>
                        <TouchableOpacity
                            onPress={this.props.handleSubmit}
                        >
                            <Text style={[[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]]}>
                                {t('action.addQty', {quantity: this.props?.quantity})}
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

const selector = formValueSelector('OrderItemOptions')

OrderItemOptions = connect(
    state => {
        const quantity = selector(state, 'quantity')
        const childLineItems = selector(state, 'childLineItems')
        return {
            quantity,
            childLineItems,
        }
    }
)(OrderItemOptions)


export default OrderItemDetailEditModal;
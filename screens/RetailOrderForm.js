import React from 'react'
import {reduxForm, Field} from 'redux-form'
import {Alert, ScrollView, Text, TouchableOpacity, View, StyleSheet, Dimensions, PixelRatio, Platform} from 'react-native'
import {connect} from 'react-redux'
import {Accordion, List} from '@ant-design/react-native'
import {getLables, getProducts, clearOrder, getfetchOrderInflights, getOrder, getOrdersByDateRange, getTimeDifference} from '../actions'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import LoadingScreen from "./LoadingScreen";
import BackendErrorScreen from "./BackendErrorScreen";
import {api, dispatchFetchRequest, dispatchFetchRequestWithOption, successMessage, warningMessage, apiRoot} from '../constants/Backend'
import {ThemeContainer} from "../components/ThemeContainer";
import {StyledText} from "../components/StyledText";
import {ListItem} from "react-native-elements";
import {withContext} from "../helpers/contextHelper";
import {compose} from "redux";
import OrderItemDetailEditModal from './OrderItemDetailEditModal';
import OrderTopInfo from "./OrderTopInfo";
import DeleteBtn from '../components/DeleteBtn'
import NavigationService from "../navigation/NavigationService";
import {handleDelete, handleOrderSubmit, handleRetailCheckout, revertSplitOrder, handlePrintWorkingOrder, handlePrintOrderDetails, handleOrderAction, getTableDisplayName} from "../helpers/orderActions";
import {SwipeRow} from 'react-native-swipe-list-view'
import ScreenHeader from "../components/ScreenHeader";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {SecondActionButton} from "../components/ActionButtons";
import {printMessage} from "../helpers/printerActions";
import DropDown from "../components/DropDown";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import {SplitBillPopUp} from '../components/PopUp'
import {OfferTooltip} from "../components/OfferTooltip";
import {RealTimeOrderUpdate} from '../components/RealTimeOrderUpdate'

class RetailOrderForm extends React.Component {
    static navigationOptions = {
        header: null
    }
    static contextType = LocaleContext

    constructor(props, context) {
        super(props, context)
        this.myRef = React.createRef();

        this.state = {
            activeSections: [0],
            selectedProducts: [],
            status: '',
            labelId: null,
            cc: null,
            orderInfo: null,
            isTablet: context?.isTablet,
            selectedLabel: 'pinned',
            modalVisible: false,
            modalData: {},
            orderLineItems: {},
            quickCheckoutPrint: true,
            otherActionOptions: [
                {label: context.t('printWorkingOrder'), value: 'printWorkingOrder'},
                {label: context.t('printOrderDetails'), value: 'printOrderDetails'},
            ],
            otherAction: null,
            splitBillModalVisible: false
        }
        this.onChange = activeSections => {
            this.setState({activeSections: activeSections})
        }
    }

    componentDidMount() {
        this.props.getLables()
        this.props.getProducts()
        this.props.route.params.orderId !== undefined &&
            this.props.getOrder(this.props.route.params.orderId)
        this._getOrder = this.props.navigation.addListener('focus', () => {
            this.props.getOrder(this.props.route.params.orderId)
        })
    }
    componentWillUnmount() {
        this._getOrder()
    }

    PanelHeader = (labelName, labelId, isSelected = false) => {
        return (
            <View style={styles.listPanel}>
                <StyledText style={{...styles.listPanelText, color: isSelected ? '#fff' : undefined}}>{labelName}</StyledText>
            </View>
        )
    }

    addItemToOrder = productId => {
        dispatchFetchRequest(api.product.getById(productId), {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        }, response => {
            response.json().then(product => {
                if (product.productOptions == null || product.productOptions.length === 0 && product.inventory == null) {
                    const orderId = this.props.route.params.orderId
                    let lineItemRequest = {}

                    lineItemRequest['productId'] = productId
                    lineItemRequest['quantity'] = 1

                    dispatchFetchRequestWithOption(
                        api.order.newLineItem(orderId),
                        {
                            method: 'POST',
                            withCredentials: true,
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(lineItemRequest)
                        }, {defaultMessage: false},
                        response => {
                            successMessage(this.context.t('orderForm.addItemSuccess', {quantity: 1, product: product.name}))
                            this.props.getOrder(orderId)
                        }
                    ).then()
                } else {
                    if (this.state?.isTablet) {
                        this.setState({
                            modalVisible: true,
                            prdId: productId,
                            isEditLineItem: false
                        })
                    } else {
                        this.props.navigation.navigate('RetailOrderFormIII', {
                            prdId: productId,
                            orderId: this.props.route.params.orderId
                        })
                    }
                }
            })
        }).then()
    }

    handleComplete = id => {
        const formData = new FormData()
        formData.append('action', 'COMPLETE')

        dispatchFetchRequestWithOption(api.order.process(id), {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {},
            body: formData
        }, {
            defaultMessage: false
        }, response => {
            this.props.navigation.navigate('LoginSuccess')
        }).then()
    }

    editItem = (productId, data) => {
        dispatchFetchRequest(api.product.getById(productId), {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        }, response => {
            response.json().then(product => {
                if (product.productOptions == null || product.productOptions.length === 0 && product.inventory == null) {
                    const orderId = this.props.route.params.orderId
                    let lineItemRequest = {}

                    lineItemRequest['productId'] = productId
                    lineItemRequest['quantity'] = 1
                    this.setState({
                        modalVisible: true,
                        prdId: productId,
                        isEditLineItem: true,
                        modalData: data
                    })

                } else {
                    if (this.state?.isTablet) {
                        this.setState({
                            modalVisible: true,
                            prdId: productId,
                            isEditLineItem: true,
                            modalData: data
                        })
                    } else {
                        this.props.navigation.navigate('RetailOrderFormIII', {
                            prdId: productId,
                            orderId: this.props.route.params.orderId
                        })
                    }
                }
            })
        }).then()
    }

    toggleOrderLineItem = (lineItemId) => {
        const lineItem = this.state?.orderLineItems?.hasOwnProperty(lineItemId) ? this.state.orderLineItems[lineItemId] : {
            checked: false,
            value: lineItemId
        }
        lineItem.checked = !lineItem.checked

        const lineItems = this.state.orderLineItems
        lineItems[lineItemId] = lineItem

        this.setState({orderLineItems: lineItems})
    }


    handleDeleteLineItem = (orderId, lineItemId) => {
        dispatchFetchRequest(api.order.deleteLineItem(orderId, lineItemId), {
            method: 'DELETE',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        }, response => {
            this.props.navigation.navigate('RetailOrderForm')
            this.props.getOrder(orderId)
        }).then()
    }

    handleFreeLineitem = (orderId, lineitemId, isFree) => {
        const formData = new FormData()
        formData.append('free', isFree)
        dispatchFetchRequestWithOption(
            api.order.updateLineItemPrice(orderId, lineitemId),
            {
                method: 'PATCH',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: formData
            }, {
            defaultMessage: false
        }, response => {
            response.json().then(data => {
                const message = isFree ? 'order.free' : 'order.cancelFree'
                successMessage(this.context.t(message))
                this.props.navigation.navigate('RetailOrderForm')
                this.props.getOrder(orderId)
            })
        }).then()
    }



    handleItemOutOfStock = (lineItemId, outOfStock) => {
        Alert.alert(
            `${this.context.t(outOfStock ? `order.toggleUnmarkOutOfStockMsg` : `order.toggleOutOfStockMsg`)}`,
            ``,
            [
                {
                    text: `${this.context.t('action.yes')}`,
                    onPress: () => {
                        dispatchFetchRequest(api.product.toggleOutOfStock(lineItemId), {
                            method: 'POST',
                            withCredentials: true,
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        }, response => {
                            this.props.navigation.navigate('RetailOrderForm')
                            this.props.getProducts()
                        }).then()
                    }
                },
                {
                    text: `${this.context.t('action.no')}`,
                    onPress: () => console.log('Cancelled'),
                    style: 'cancel'
                }
            ]
        )

    }

    normalize = (size) => {
        const {
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
        } = Dimensions.get('window');
        const scale = SCREEN_WIDTH / 320;
        const newSize = size * scale
        if (Platform.OS === 'ios') {
            return Math.round(PixelRatio.roundToNearestPixel(newSize))
        } else {
            return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
        }
    }
    handleOnMessage = (data, id) => {
        if (data === `${id}.order.orderChanged`) {
            this.props.getOrder(this.props.route.params.orderId)
        }
    }


    render() {
        const {
            products = [],
            labels = [],
            haveError,
            isLoading,
            order,
            themeStyle,
            orderIsLoading,
            productsData
        } = this.props

        const {reverseThemeStyle, t, splitParentOrderId, customMainThemeColor} = this.context
        const map = new Map(Object.entries(products))

        let totalQuantity = 0

        order.lineItems !== undefined && order.lineItems.map(lineItem => {
            totalQuantity += lineItem.quantity
        })

        TimeAgo.addLocale(en)
        const timeAgo = new TimeAgo()

        if (isLoading) {
            return (
                <LoadingScreen />
            )
        } else if (haveError) {
            return (
                <BackendErrorScreen />
            )
        } else if (products !== undefined && products.length === 0) {
            return (
                <View style={[styles.container]}>
                    <Text>no products ...</Text>
                </View>
            )
        } else {
            /*tablet render*/
            if (this?.state?.isTablet) {
                return (
                    <ThemeContainer>
                        <View style={{...styles.fullWidthScreen, marginBottom: 0}}>
                            <RealTimeOrderUpdate
                                topics={`/topic/order/${this.props.route.params.orderId}`}
                                handleOnMessage={this.handleOnMessage}
                                id={this.props.route.params.orderId}
                            />
                            <ScreenHeader backNavigation={true}
                                backAction={() => this.props.navigation.navigate('LoginSuccess')}
                                parentFullScreen={true}
                                title={t('orderForm.newOrderTitle')}
                            />
                            <OrderTopInfo order={order} />
                            <OrderItemDetailEditModal
                                modalVisible={this.state.modalVisible}
                                submitOrder={(orderId) => {
                                    this.setState({modalVisible: false});
                                    this.props.navigation.navigate('RetailOrderForm', {
                                        orderId: orderId
                                    })
                                }}
                                closeModal={() => {this.setState({modalVisible: false})}}
                                data={this.state.modalData}
                                navigation={this.props.navigation}
                                prdId={this.state?.prdId}
                                isEditLineItem={this.state?.isEditLineItem ?? false} />

                            <SplitBillPopUp
                                navigation={this.props.navigation}
                                toRoute={['SpiltBillScreen', 'SplitBillByHeadScreen']}
                                textForRoute={[t('order.splitByItem'), t('order.splitByHeadCount')]}
                                title={t('order.splitBillPopUpTitle')}
                                params={[{order: order}, {order: order}]}
                                isVisible={this.state?.splitBillModalVisible}
                                toggleModal={(visible) => this.setState({splitBillModalVisible: visible})}
                                orderId={order?.orderId}
                            />


                            <View style={{flexDirection: 'row', flex: 1}}>
                                {/* left list */}
                                <View style={[themeStyle, styles.orderItemSideBar, {borderColor: customMainThemeColor, borderTopWidth: 1, paddingTop: 5}, styles?.customBorderAndBackgroundColor(this.context)]}>
                                    <ScrollView style={{flex: 1}}>
                                        <View style={[styles.tableRowContainer, styles.tableCellView, styles.flex(1), themeStyle, styles?.customBorderAndBackgroundColor(this.context)]}>
                                            <TouchableOpacity style={[(this.state.selectedLabel === 'pinned' ? styles?.selectedLabel(customMainThemeColor) : null), {flex: 1}]} onPress={() => {this.setState({selectedLabel: 'pinned'})}}>
                                                {this.PanelHeader(t('orderForm.pinned'), '0', this.state.selectedLabel === 'pinned')}
                                            </TouchableOpacity>
                                        </View>

                                        {labels.map((lbl, index) => (
                                            <View key={index} style={[styles.tableRowContainer, styles.tableCellView, styles.flex(1), themeStyle, styles?.customBorderAndBackgroundColor(this.context)]}>
                                                <TouchableOpacity style={[(this.state.selectedLabel === lbl.label ? styles?.selectedLabel(customMainThemeColor) : null), {flex: 1}]} onPress={() => {this.setState({selectedLabel: lbl.label})}}>
                                                    {this.PanelHeader(lbl.label, '0', this.state.selectedLabel === lbl.label)}
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                        <View style={[styles.tableRowContainer, styles.tableCellView, styles.flex(1), themeStyle, styles?.customBorderAndBackgroundColor(this.context)]}>
                                            <TouchableOpacity style={[(this.state.selectedLabel === 'ungrouped' ? styles?.selectedLabel(customMainThemeColor) : null), {flex: 1}]} onPress={() => {this.setState({selectedLabel: 'ungrouped'})}}>
                                                {this.PanelHeader(t('product.ungrouped'), '0', this.state.selectedLabel === 'ungrouped')}
                                            </TouchableOpacity>
                                        </View>
                                    </ScrollView>
                                </View>
                                {/* item box */}
                                <View style={[styles.orderItemBox, {borderRightWidth: 1, borderLeftWidth: 1, borderColor: customMainThemeColor, borderTopWidth: 1, paddingTop: 5}]}>
                                    <View style={{flex: 4}}>
                                        <ScrollView style={{flex: 1}}>

                                            {(this.state?.selectedLabel === 'pinned' && map.get('pinned') !== undefined && map.get('pinned')?.length > 0) ?
                                                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>{map.get('pinned').map(prd => {
                                                    return (

                                                        <TouchableOpacity style={[{width: '22%', marginLeft: '2%', marginBottom: '2%', borderRadius: 10}, {backgroundColor: '#d6d6d6'}, (prd?.outOfStock && {backgroundColor: 'gray'})]}
                                                            onPress={() => prd?.outOfStock ? this.handleItemOutOfStock(prd.id, prd?.outOfStock) : this.addItemToOrder(prd.id)}
                                                            onLongPress={() => this.handleItemOutOfStock(prd.id, prd?.outOfStock)}>
                                                            <View style={{aspectRatio: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                                                                {prd?.outOfStock && <View style={{position: 'absolute', alignSelf: 'center'}} >
                                                                    <Icon name='cancel' color='white' style={[{fontSize: this.normalize(32), padding: 0, margin: 0}]} />
                                                                </View>}
                                                                <View style={{alignItems: 'center'}}>
                                                                    <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, {fontSize: 16, fontWeight: 'bold'}, (prd?.outOfStock && {backgroundColor: 'rgba(128, 128, 128, 0)'})]}>{prd.name}</StyledText>
                                                                    {prd?.childProducts?.length > 0 && <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (prd?.outOfStock && {backgroundColor: 'rgba(128, 128, 128, 0)'})]}>- {prd.childProducts?.map((childProduct) => childProduct?.name).join(',')}</StyledText>}
                                                                </View>
                                                                <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (prd?.outOfStock && {backgroundColor: 'rgba(128, 128, 128, 0)'})]}>{prd.description}</StyledText>
                                                                <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (prd?.outOfStock && {backgroundColor: 'rgba(128, 128, 128, 0)'})]}>${prd.price}</StyledText>
                                                            </View>
                                                        </TouchableOpacity>
                                                    )
                                                })}</View> : this.state?.selectedLabel === 'pinned' ? <StyledText style={{alignSelf: 'center'}}>{t('orderForm.nothing')}</StyledText> : null}

                                            {(this.state?.selectedLabel === 'ungrouped' && map.get('ungrouped') !== undefined && map.get('ungrouped')?.length > 0) ?
                                                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>{map.get('ungrouped').map(prd => (

                                                    <TouchableOpacity style={[{width: '22%', marginLeft: '2%', marginBottom: '2%', borderRadius: 10}, {backgroundColor: '#d6d6d6'}, (prd?.outOfStock && {backgroundColor: 'gray'})]}
                                                        onPress={() => prd?.outOfStock ? this.handleItemOutOfStock(prd.id, prd?.outOfStock) : this.addItemToOrder(prd.id)}
                                                        onLongPress={() => this.handleItemOutOfStock(prd.id, prd?.outOfStock)}>
                                                        <View style={{aspectRatio: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                                                            {prd?.outOfStock && <View style={{position: 'absolute', alignSelf: 'center'}} >
                                                                <Icon name='cancel' color='white' style={[{fontSize: this.normalize(32), padding: 0, margin: 0}]} />
                                                            </View>}
                                                            <View style={{alignItems: 'center'}}>
                                                                <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, {fontSize: 16, fontWeight: 'bold'}, (prd?.outOfStock && {backgroundColor: 'rgba(128, 128, 128, 0)'})]}>{prd.name}</StyledText>
                                                                {prd?.childProducts?.length > 0 && <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (prd?.outOfStock && {backgroundColor: 'rgba(128, 128, 128, 0)'})]}>- {prd.childProducts?.map((childProduct) => childProduct?.name).join(',')}</StyledText>}
                                                            </View>
                                                            <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (prd?.outOfStock && {backgroundColor: 'rgba(128, 128, 128, 0)'})]}>{prd.description}</StyledText>
                                                            <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (prd?.outOfStock && {backgroundColor: 'rgba(128, 128, 128, 0)'})]}>${prd.price}</StyledText>
                                                        </View>
                                                    </TouchableOpacity>
                                                ))}</View> : this.state?.selectedLabel === 'ungrouped' ? <StyledText style={{alignSelf: 'center'}}>{t('orderForm.nothing')}</StyledText> : null}

                                            {labels.map(lbl => {
                                                if (this.state?.selectedLabel === lbl.label) {
                                                    return (
                                                        <>
                                                            {(map.get(lbl.label) !== undefined && map.get(lbl.label)?.length > 0) ?
                                                                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>{map.get(lbl.label).map(prd => {
                                                                    return (
                                                                        <TouchableOpacity style={[{width: '22%', marginLeft: '2%', marginBottom: '2%', borderRadius: 10}, {backgroundColor: '#d6d6d6'}, (prd?.outOfStock && {backgroundColor: 'gray'})]}
                                                                            onPress={() => prd?.outOfStock ? this.handleItemOutOfStock(prd.id, prd?.outOfStock) : this.addItemToOrder(prd.id)}
                                                                            onLongPress={() => this.handleItemOutOfStock(prd.id, prd?.outOfStock)}
                                                                        >

                                                                            <View style={{aspectRatio: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                                                                                {prd?.outOfStock && <View style={{position: 'absolute', alignSelf: 'center'}} >
                                                                                    <Icon name='cancel' color='white' style={[{fontSize: this.normalize(32), padding: 0, margin: 0}]} />
                                                                                </View>}
                                                                                <View style={{alignItems: 'center'}}>
                                                                                    <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, {fontSize: 16, fontWeight: 'bold'}, (prd?.outOfStock && {backgroundColor: 'rgba(128, 128, 128, 0)'})]}>{prd.name}</StyledText>
                                                                                    {prd?.childProducts?.length > 0 && <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (prd?.outOfStock && {backgroundColor: 'rgba(128, 128, 128, 0)'})]}>- {prd.childProducts?.map((childProduct) => childProduct?.name).join(',')}</StyledText>}
                                                                                </View>
                                                                                <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (prd?.outOfStock && {backgroundColor: 'rgba(128, 128, 128, 0)'})]}>{prd.description}</StyledText>
                                                                                <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (prd?.outOfStock && {backgroundColor: 'rgba(128, 128, 128, 0)'})]}>${prd.price}</StyledText>
                                                                            </View>
                                                                        </TouchableOpacity>
                                                                    )
                                                                })}</View> : <StyledText style={{alignSelf: 'center'}}>{t('orderForm.nothing')}</StyledText>}
                                                        </>

                                                    )
                                                }
                                            })}

                                        </ScrollView>
                                    </View>
                                    <View style={{flexDirection: 'row', flex: 1, padding: '3%'}}>
                                        <>
                                            <View style={{flex: 1, marginHorizontal: 0, flexDirection: 'row'}}>
                                                <DeleteBtn
                                                    containerStyle={{
                                                        flex: 1,
                                                        alignItems: 'center',
                                                        borderRadius: 4,
                                                        borderWidth: 1,
                                                        borderColor: '#f75336',
                                                        justifyContent: 'center',
                                                        backgroundColor: '#f75336',
                                                    }}
                                                    textStyle={{
                                                        textAlign: 'center',
                                                        fontSize: 16,
                                                        color: '#fff',
                                                    }}
                                                    handleDeleteAction={() => handleDelete(order.orderId, () => this.props.navigation.navigate('Home', {screen: 'LoginSuccess'}))}
                                                />

                                            </View>
                                            <View style={{flex: 1, marginHorizontal: 5}}>
                                                <View style={{flex: 1}}>
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            order.lineItems.length === 0
                                                                ? warningMessage(t('orderForm.lineItemCountCheck'))
                                                                : handleRetailCheckout(order, false)
                                                        }
                                                        style={styles?.flexButton(customMainThemeColor)}
                                                    >
                                                        <Text style={styles.flexButtonText}>
                                                            {t('orderForm.payOrder')}
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </>

                                    </View>
                                </View>

                                <View style={[styles.orderItemRightList, {borderColor: customMainThemeColor, borderTopWidth: 1, paddingTop: 5}]}>
                                    {orderIsLoading ? <View style={{flex: 5, borderBottomWidth: 1, borderColor: customMainThemeColor, paddingLeft: 10}}><LoadingScreen /></View>
                                        : <View style={{flex: 5, borderBottomWidth: 1, borderColor: customMainThemeColor, paddingLeft: 10}}>
                                            <ScrollView style={{flex: 1}}>
                                                {order?.lineItems?.length > 0 ?
                                                    order?.lineItems?.map((item, index) => {
                                                        return (
                                                            <SwipeRow
                                                                leftOpenValue={50}
                                                                rightOpenValue={-50}
                                                                disableLeftSwipe={!!item?.associatedLineItemId}
                                                                disableRightSwipe={!!item?.associatedLineItemId}
                                                                ref={(e) => this[`ref_${index}`] = e}
                                                            >
                                                                <View style={{flex: 1, marginBottom: '3%', borderRadius: 10, width: '100%', flexDirection: 'row'}}>
                                                                    <View style={{flex: 1, borderRadius: 10}} >
                                                                        <TouchableOpacity
                                                                            onPress={() => {
                                                                                this[`ref_${index}`]?.closeRow()
                                                                                if (item.price === 0) {
                                                                                    this.handleFreeLineitem(order.orderId, item.lineItemId, false)
                                                                                } else {
                                                                                    this.handleFreeLineitem(order.orderId, item.lineItemId, true)
                                                                                }
                                                                            }}
                                                                            style={{flex: 1, backgroundColor: customMainThemeColor, borderRadius: 10, paddingLeft: 5, alignItems: 'flex-start', justifyContent: 'center'}}>
                                                                            <StyledText style={{width: 40}}>{item.price === 0 ? t('order.cancelFreeLineitem') : t('order.freeLineitem')}</StyledText>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                    <View style={{...styles.delIcon, flex: 1, borderRadius: 10}} >
                                                                        <DeleteBtn
                                                                            handleDeleteAction={() => {
                                                                                this[`ref_${index}`]?.closeRow()
                                                                                this.handleDeleteLineItem(
                                                                                    order.orderId,
                                                                                    item.lineItemId
                                                                                );
                                                                            }}
                                                                            islineItemDelete={true}
                                                                            containerStyle={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'flex-end'}}
                                                                        />
                                                                    </View>
                                                                </View>

                                                                <TouchableOpacity
                                                                    disabled={!!item?.associatedLineItemId}
                                                                    style={[{backgroundColor: '#d6d6d6'}, {marginBottom: '3%', borderRadius: 8, }, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: customMainThemeColor})]}
                                                                    activeOpacity={0.8}
                                                                    onPress={() => {
                                                                        this.editItem(item.productId, item)
                                                                    }}>
                                                                    <View style={{aspectRatio: 2, alignItems: 'flex-start', flexDirection: 'row'}}>
                                                                        <View style={{flex: 2.5, flexDirection: 'column', paddingLeft: '3%', paddingTop: '3%'}}>
                                                                            <StyledText style={[{...{backgroundColor: '#d6d6d6', color: '#000'}, fontSize: 16, fontWeight: 'bold'}, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: customMainThemeColor})]}>{item.productName} ${item.price}</StyledText>
                                                                            {!!item?.childProducts?.length > 0 && <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: customMainThemeColor})]}> - {item.childProducts.map((childProduct) => childProduct?.productName).join(',')}</StyledText>}
                                                                            {!!item?.options && <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: customMainThemeColor})]}>{item.options}</StyledText>}
                                                                            {!!item?.sku && <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: customMainThemeColor})]}>{item.sku}</StyledText>}
                                                                            {!!item?.appliedOfferInfo && <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: customMainThemeColor})]}>{` ${item?.appliedOfferInfo?.offerName}(${item?.appliedOfferInfo?.overrideDiscount})`}</StyledText>}
                                                                        </View>
                                                                        <View style={{position: 'absolute', bottom: '3%', left: '3%', flexDirection: 'row'}}>
                                                                            <View style={{marginRight: 5}}>
                                                                                {item?.state === 'OPEN' && <StyledText style={[{backgroundColor: '#d6d6d6', color: '#808080'}, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: customMainThemeColor})]}>{t('orderForm.stateTip.open.display')}</StyledText>}
                                                                                {['IN_PROCESS', 'ALREADY_IN_PROCESS'].includes(item?.state) && (
                                                                                    <StyledText style={[{backgroundColor: '#d6d6d6', color: '#808080'}, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: customMainThemeColor})]}>{t('orderForm.stateTip.inProcess.display')}</StyledText>
                                                                                )}
                                                                                {item?.state === 'PREPARED' && <StyledText style={[{backgroundColor: '#d6d6d6', color: '#808080'}, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: customMainThemeColor})]}>{t('orderForm.stateTip.prepared.display')}</StyledText>}
                                                                                {item?.state === 'DELIVERED' && (
                                                                                    <StyledText style={[{backgroundColor: '#d6d6d6', color: '#808080'}, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: customMainThemeColor})]}>{t('orderForm.stateTip.delivered.display')}</StyledText>
                                                                                )}
                                                                                {item?.state === 'SETTLED' && <StyledText style={[{backgroundColor: '#d6d6d6', color: '#808080'}, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: customMainThemeColor})]}>{t('orderForm.stateTip.settled.display')}</StyledText>}
                                                                            </View>
                                                                            <StyledText style={[{backgroundColor: '#d6d6d6', color: '#808080'}, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: customMainThemeColor})]}>
                                                                                {timeAgo.format(Date.now() - getTimeDifference(item?.createdDate), {flavour: 'narrow'})}
                                                                            </StyledText>
                                                                        </View>
                                                                        <View style={{flexDirection: 'column', flex: 1, padding: '3%', justifyContent: 'space-between', height: '100%', alignItems: 'flex-end', borderLeftWidth: 1}} >

                                                                            <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between'}}>
                                                                                <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: customMainThemeColor})]}>{`${item.quantity}`}</StyledText>
                                                                                <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: customMainThemeColor})]}>${item.lineItemSubTotal}</StyledText>
                                                                            </View>

                                                                            {['IN_PROCESS', 'ALREADY_IN_PROCESS'].includes(item?.state) && <TouchableOpacity
                                                                                onPress={() => {
                                                                                    this.setState({
                                                                                        choosenItem: {...this.state?.choosenItem, [item.lineItemId]: !this.state?.choosenItem?.[item.lineItemId] ?? false}
                                                                                    });
                                                                                    this.toggleOrderLineItem(item.lineItemId);
                                                                                }}
                                                                                style={{width: '100%', }}
                                                                            >
                                                                                <StyledText style={{...{backgroundColor: '#d6d6d6', color: '#fff'}, padding: 5, backgroundColor: '#808080', shadowColor: '#000', shadowOffset: {width: 1, height: 1}, shadowOpacity: 1, width: '100%', textAlign: 'center'}}>{t('orderForm.choose')}</StyledText>
                                                                            </TouchableOpacity>}
                                                                        </View>
                                                                    </View>
                                                                </TouchableOpacity>
                                                            </SwipeRow>
                                                        )
                                                    })
                                                    : <StyledText style={{alignSelf: 'center'}}>{t('orderForm.nothing')}</StyledText>}
                                            </ScrollView>
                                        </View>}
                                    <View style={{flex: 1, marginVertical: 5, justifyContent: 'space-between', paddingLeft: 10}}>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                            <StyledText >{t('order.subtotal')}</StyledText>
                                            <StyledText >${order?.total?.amountWithTax}</StyledText>
                                        </View>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                            <StyledText >{t('order.discount')}</StyledText>
                                            <OfferTooltip
                                                offer={order?.appliedOfferInfo}
                                                discount={order?.discount}
                                                t={t}
                                            />
                                        </View>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                            <StyledText >{t('order.serviceCharge')}</StyledText>
                                            <StyledText >${order?.serviceCharge}</StyledText>
                                        </View>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                            <StyledText >{t('order.total')}</StyledText>
                                            <StyledText >${order?.orderTotal}</StyledText>
                                        </View>

                                    </View>
                                </View>
                            </View>
                        </View>



                    </ThemeContainer >
                )
            }
            else {
                /*phone render */
                return (
                    <ThemeContainer>
                        <ScrollView style={{flex: 1, marginBottom: 45}}>
                            <View style={styles.container}>
                                <Text style={styles?.screenTitle(customMainThemeColor)}>
                                    {t('orderForm.newOrderTitle')}
                                </Text>
                            </View>
                            <View style={styles.childContainer}>
                                <Accordion
                                    onChange={this.onChange}
                                    expandMultiple={true}
                                    activeSections={this.state.activeSections}
                                    containerStyle={[styles.inverseBackground(this.context)]}
                                >
                                    <Accordion.Panel
                                        header={this.PanelHeader(t('orderForm.pinned'), '0', true)}
                                        key="pinned"
                                    >
                                        <List>
                                            {map.get('pinned') !== undefined &&
                                                map.get('pinned').map(prd => (
                                                    <ListItem
                                                        key={prd.id}
                                                        title={
                                                            <View style={[styles.tableRowContainer]}>
                                                                <View style={[styles.tableCellView, styles.flex(1)]}>
                                                                    <StyledText>{prd.name}</StyledText>
                                                                    {!!prd?.description && <StyledText>  ({prd?.description})</StyledText>}
                                                                </View>
                                                                <View style={[styles.tableCellView, styles.flex(1), styles.justifyRight]}>
                                                                    <StyledText>${prd.price}</StyledText>
                                                                </View>
                                                            </View>
                                                        }
                                                        onPress={() => this.addItemToOrder(prd.id)}
                                                        bottomDivider
                                                        containerStyle={[styles.dynamicVerticalPadding(10), styles.customBorderAndBackgroundColor(this.context)]}
                                                    />
                                                ))}
                                            {map.get('pinned') !== undefined &&
                                                map.get('pinned').length === 0 && (
                                                    <ListItem
                                                        title={
                                                            <View style={[styles.tableRowContainer]}>
                                                                <View style={[styles.tableCellView, styles.flex(1)]}>
                                                                    <StyledText>({t('empty')})</StyledText>

                                                                </View>

                                                            </View>
                                                        }
                                                        bottomDivider
                                                        containerStyle={[styles.dynamicVerticalPadding(10), styles.customBorderAndBackgroundColor(this.context)]}
                                                    />
                                                )}
                                        </List>
                                    </Accordion.Panel>

                                    {labels.map(lbl => (
                                        <Accordion.Panel
                                            header={this.PanelHeader(lbl.label, lbl.id, true)}
                                            key={lbl.id}
                                        >
                                            <List>
                                                {map.get(lbl.label).map(prd => (
                                                    <ListItem
                                                        key={prd.id}
                                                        title={
                                                            <View style={[styles.tableRowContainer]}>
                                                                <View style={[styles.tableCellView, styles.flex(1)]}>
                                                                    <StyledText>{prd.name}</StyledText>
                                                                    {!!prd?.description && <StyledText>  ({prd?.description})</StyledText>}
                                                                </View>
                                                                <View style={[styles.tableCellView, styles.flex(1), styles.justifyRight]}>
                                                                    <StyledText>${prd.price}</StyledText>
                                                                </View>
                                                            </View>
                                                        }
                                                        onPress={() => this.addItemToOrder(prd.id)}
                                                        bottomDivider
                                                        containerStyle={[styles.dynamicVerticalPadding(10), styles.customBorderAndBackgroundColor(this.context)]}
                                                    />
                                                ))}
                                                {map.get(lbl.label) !== undefined &&
                                                    map.get(lbl.label).length === 0 && (
                                                        <ListItem
                                                            title={
                                                                <View style={[styles.tableRowContainer]}>
                                                                    <View style={[styles.tableCellView, styles.flex(1)]}>
                                                                        <StyledText>({t('empty')})</StyledText>

                                                                    </View>

                                                                </View>
                                                            }
                                                            bottomDivider
                                                            containerStyle={[styles.dynamicVerticalPadding(10), styles.customBorderAndBackgroundColor(this.context)]}
                                                        />
                                                    )}
                                            </List>
                                        </Accordion.Panel>
                                    ))}
                                    <Accordion.Panel
                                        header={this.PanelHeader(t('product.ungrouped'), '0', true)}
                                        key="ungrouped"
                                    >
                                        <List>
                                            {map.get('ungrouped') !== undefined &&
                                                map.get('ungrouped').map(prd => (
                                                    <ListItem
                                                        key={prd.id}
                                                        title={
                                                            <View style={[styles.tableRowContainer]}>
                                                                <View style={[styles.tableCellView, styles.flex(1)]}>
                                                                    <StyledText>{prd.name}</StyledText>
                                                                    {!!prd?.description && <StyledText>  ({prd?.description})</StyledText>}
                                                                </View>
                                                                <View style={[styles.tableCellView, styles.flex(1), styles.justifyRight]}>
                                                                    <StyledText>${prd.price}</StyledText>
                                                                </View>
                                                            </View>
                                                        }
                                                        onPress={() => this.addItemToOrder(prd.id)}
                                                        bottomDivider
                                                        containerStyle={[styles.dynamicVerticalPadding(10), styles.customBorderAndBackgroundColor(this.context)]}
                                                    />
                                                ))}
                                            {(map.get('ungrouped') === undefined || map.get('ungrouped').length === 0) && (
                                                <ListItem
                                                    title={
                                                        <View style={[styles.tableRowContainer]}>
                                                            <View style={[styles.tableCellView, styles.flex(1)]}>
                                                                <StyledText>({t('empty')})</StyledText>

                                                            </View>

                                                        </View>
                                                    }
                                                    bottomDivider
                                                    containerStyle={[styles.dynamicVerticalPadding(10), {backgroundColor: themeStyle.backgroundColor}]}
                                                />
                                            )}
                                        </List>
                                    </Accordion.Panel>
                                </Accordion>
                            </View>
                        </ScrollView>

                        <View style={[styles?.shoppingBar(customMainThemeColor)]}>
                            <View style={[styles.tableCellView, styles.half_width]}>
                                <Text style={[styles?.primaryText(customMainThemeColor), styles.whiteColor]} numberOfLines={1}>
                                    {getTableDisplayName(order)}
                                </Text>
                            </View>

                            <View style={[styles.tableCellView, styles.quarter_width]}>
                                <FontAwesomeIcon
                                    name="user"
                                    size={30}
                                    color="#fff"
                                    style={{marginRight: 5}}
                                />
                                <Text style={[styles?.primaryText(customMainThemeColor), styles.whiteColor]}>
                                    &nbsp;{order.demographicData != null ? order.demographicData.customerCount : 0}
                                </Text>
                            </View>

                            <View style={[styles.tableCellView, styles.quarter_width, styles.justifyRight]}>
                                <TouchableOpacity
                                    onPress={() =>
                                        this.props.navigation.navigate('RetailOrdersSummary', {
                                            orderId: this.props.route.params.orderId,
                                            onSubmit: this.props.route.params.onSubmit,
                                            handleDelete: this.props.route.params.handleDelete
                                        })
                                    }
                                >
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <FontAwesomeIcon
                                            name="shopping-cart"
                                            size={30}
                                            color="#fff"
                                            style={{marginRight: 5}}
                                        />
                                        <View style={styles?.itemCountContainer(customMainThemeColor)}>
                                            <Text style={styles.itemCountText}>
                                                {totalQuantity}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ThemeContainer>
                )
            }
        }


    }
}

const mapStateToProps = state => ({
    labels: state.labels.data.labels,
    subproducts: state.label.data.subLabels,
    products: state.products.data.results,
    haveData: state.products.haveData,
    haveError: state.products.haveError,
    isLoading: state.products.loading,
    order: state.order.data,
    orderIsLoading: state.order.loading,
    productsData: state.products
})

const mapDispatchToProps = (dispatch, props) => ({
    dispatch,
    getLables: () => dispatch(getLables()),
    getProducts: () => dispatch(getProducts()),
    getOrder: () => dispatch(getOrder(props.route.params.orderId)),
    getfetchOrderInflights: () => dispatch(getfetchOrderInflights()),
    getOrdersByDateRange: () => dispatch(getOrdersByDateRange()),
    clearOrder: () => dispatch(clearOrder(props.route.params.orderId)),
})

RetailOrderForm = reduxForm({
    form: 'orderformII'
})(RetailOrderForm)

const enhance = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withContext
)
export default enhance(RetailOrderForm)

import React from 'react'
import {reduxForm} from 'redux-form'
import {Alert, ScrollView, Text, TouchableOpacity, View, TouchableWithoutFeedback} from 'react-native'
import {connect} from 'react-redux'
import {Accordion, List} from '@ant-design/react-native'
import {getLables, getProducts, clearOrder, getfetchOrderInflights, getOrder, getOrdersByDateRange} from '../actions'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import styles, {mainThemeColor} from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import LoadingScreen from "./LoadingScreen";
import BackendErrorScreen from "./BackendErrorScreen";
import {api, dispatchFetchRequest, dispatchFetchRequestWithOption, successMessage, warningMessage} from '../constants/Backend'
import {ThemeContainer} from "../components/ThemeContainer";
import {StyledText} from "../components/StyledText";
import {ListItem} from "react-native-elements";
import {withContext} from "../helpers/contextHelper";
import {compose} from "redux";
import OrderItemDetailEditModal from './OrderItemDetailEditModal';
import OrderTopInfo from "./OrderTopInfo";
import DeleteBtn from '../components/DeleteBtn'
import NavigationService from "../navigation/NavigationService";
import {handleDelete, handleOrderSubmit, renderChildProducts, renderOptionsAndOffer, revertSplitOrder} from "../helpers/orderActions";
import {SwipeRow} from 'react-native-swipe-list-view'
import ScreenHeader from "../components/ScreenHeader";
import Icon from 'react-native-vector-icons/FontAwesome'
import {MainActionButton, MainActionFlexButton} from "../components/ActionButtons";
import {NavigationEvents} from 'react-navigation'
import {ThemeScrollView} from "../components/ThemeScrollView";
import {SwipeListView} from 'react-native-swipe-list-view'
import {CheckBox, Tooltip} from 'react-native-elements'



class SpiltBillScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    static contextType = LocaleContext

    constructor(props, context) {
        super(props, context)


        this.state = {
            splitOrderId: context?.splitOrderId ?? null,
            splitOrderData: null,
        }


    }

    componentDidMount() {
        console.log('SpiltBillScreen', this.props.order)
        this.refreshScreen()
    }

    refreshScreen = () => {
        if (!!this.context?.splitOrderId) {
            this.getSplitOrder(this.state.splitOrderId)
        } else {
            this.setState({splitOrderData: null, splitOrderId: null})
        }
        this.context?.saveSplitParentOrderId(this.props.order.orderId)
        this.props.getOrder()
    }

    addItem = async (item) => {
        let url = !!this.state.splitOrderId ? api.splitOrder.moveItem(this.state.splitOrderId) : api.splitOrder.new
        console.log('url', url)
        await dispatchFetchRequestWithOption(url, {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sourceOrderId: this.props.navigation.state.params?.order?.orderId,
                sourceLineItemId: item?.lineItemId
            })
        }, {
            defaultMessage: false
        }, response => {

            response?.json().then(data => {
                this.props.getOrder()
                this.context?.saveSplitOrderId(data?.orderId)
                this.getSplitOrder(data?.orderId)
                console.log('Back data', data)
            })
        }).then()
    }

    deleteItem = async (item) => {
        let url = api.splitOrder.moveItem(this.props.navigation.state.params?.order?.orderId)
        await dispatchFetchRequestWithOption(url, {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sourceOrderId: this.state.splitOrderId,
                sourceLineItemId: item?.lineItemId
            })
        }, {
            defaultMessage: false
        }, response => {

            response?.json().then(data => {
                this.props.getOrder()
                this.context?.saveSplitOrderId(this.state.splitOrderId)
                this.getSplitOrder(this.state.splitOrderId)
                console.log('Back data', data)
            })
        }).then()
    }

    revertSplitOrder = async (sourceOrderId, splitOrderId) => {
        await revertSplitOrder(sourceOrderId, splitOrderId)
        this.props.getOrder()
        this.context?.saveSplitOrderId(null)
        this.context?.saveSplitParentOrderId(null)
        this.setState({splitOrderData: null, splitOrderId: null})
    }

    cleanSplitContext = () => {
        this.context?.saveSplitOrderId(null)
        this.context?.saveSplitParentOrderId(null)
        this.setState({splitOrderData: null, splitOrderId: null})
    }

    getSplitOrder = async (id) => {
        await dispatchFetchRequest(
            api.order.getById(id),
            {
                method: 'GET',
                withCredentials: true,
                credentials: 'include',
                headers: {}
            },
            response => {
                response.json().then(data => {
                    this.setState({splitOrderData: data, splitOrderId: data?.orderId})
                    console.log('getSplitOrder', data)
                })
            },
            response => {
                this.setState({splitOrderData: null, splitOrderId: null})
            }
        ).then()
    }

    render() {
        const {
            products = [],
            labels = [],
            haveError,
            isLoading,
            order,
            themeStyle,
            productsData
        } = this.props
        const {reverseThemeStyle, t, splitParentOrderId, complexTheme, } = this.context

        if (this.context.isTablet) {
            return (
                <ThemeContainer>
                    <View style={[styles.container]}>
                        <ScreenHeader backNavigation={true}
                            backAction={() => {
                                Alert.alert(
                                    `${t('splitBill.ConfirmCancelMessage')}`,
                                    ``,
                                    [
                                        {
                                            text: `${t('action.yes')}`,
                                            onPress: () => {
                                                this.props.navigation.goBack()
                                                !!this.state?.splitOrderData ? this.revertSplitOrder(this.props.navigation.state.params?.order?.orderId, this.state.splitOrderId) : this.cleanSplitContext()
                                            }
                                        },
                                        {
                                            text: `${t('action.no')}`,
                                            onPress: () => console.log('Cancelled'),
                                            style: 'cancel'
                                        }
                                    ]
                                )
                            }}
                            title={t('splitBill.SpiltBillScreenTitle')} />
                        <NavigationEvents
                            onWillFocus={() => {
                                this.refreshScreen()
                            }}
                        />
                        <View style={{flexDirection: 'row', flex: 1}}>
                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                                marginTop: 8,
                                marginBottom: 5,
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                }}>
                                    <Text style={[styles.sectionBarText]}>
                                        {t('splitBill.parentOrder')}
                                    </Text>
                                    <View style={styles.tableRowContainer}>
                                        <StyledText>Order ID: </StyledText>
                                        <StyledText style={styles.tableCellText}>{order.serialId}</StyledText>
                                        <StyledText> ({order.orderType === 'IN_STORE' ? order.tableDisplayName : t('order.takeOut')})</StyledText>
                                    </View>
                                </View>
                                <View style={{flex: 7}}>
                                    <ScrollView style={{flex: 1}}>
                                        {order?.lineItems?.length > 0 ?
                                            order?.lineItems?.map((item, index) => {
                                                return (
                                                    <TouchableOpacity style={[reverseThemeStyle, {marginBottom: 16, borderRadius: 10}, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}
                                                        activeOpacity={0.8}
                                                        onPress={() => {this.addItem(item)}}>
                                                        <View style={{aspectRatio: 3, alignItems: 'center', flexDirection: 'row'}}>
                                                            <View style={{flex: 2.5, flexDirection: 'column', paddingLeft: '3%'}}>
                                                                <StyledText style={[{...reverseThemeStyle, fontSize: 16, fontWeight: 'bold'}, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}>{item.productName} ${item.price} {`X${item.quantity}`}</StyledText>
                                                                {!!item?.options && <StyledText style={[reverseThemeStyle, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}>{item.options}</StyledText>}
                                                                {!!item?.appliedOfferInfo && <StyledText style={[reverseThemeStyle, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}>{` ${item?.appliedOfferInfo?.offerName}(${item?.appliedOfferInfo?.overrideDiscount})`}</StyledText>}
                                                            </View>
                                                            <View style={{flexDirection: 'column', flex: 1, paddingRight: '3%', justifyContent: 'space-around', height: '100%', alignItems: 'flex-end', borderLeftWidth: 1}} >
                                                                {['IN_PROCESS', 'ALREADY_IN_PROCESS'].includes(item?.state) && <TouchableOpacity
                                                                    onPress={() => {
                                                                        this.setState({
                                                                            choosenItem: {...this.state?.choosenItem, [item.lineItemId]: !this.state?.choosenItem?.[item.lineItemId] ?? false}
                                                                        });
                                                                        this.toggleOrderLineItem(item.lineItemId);
                                                                    }}
                                                                >
                                                                    <StyledText style={{...reverseThemeStyle, padding: 5, backgroundColor: 'gray', shadowColor: '#000', shadowOffset: {width: 1, height: 1}, shadowOpacity: 1}}>{t('choose')}</StyledText>
                                                                </TouchableOpacity>}
                                                                <View>
                                                                    {item?.state === 'OPEN' && <StyledText style={[reverseThemeStyle, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}>{t('stateTip.open.display')}</StyledText>}
                                                                    {['IN_PROCESS', 'ALREADY_IN_PROCESS'].includes(item?.state) && (
                                                                        <StyledText style={[reverseThemeStyle, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}>{t('stateTip.inProcess.display')}</StyledText>
                                                                    )}
                                                                    {item?.state === 'PREPARED' && <StyledText style={[reverseThemeStyle, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}>{t('stateTip.prepared.display')}</StyledText>}
                                                                    {item?.state === 'DELIVERED' && (
                                                                        <StyledText style={[reverseThemeStyle, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}>{t('stateTip.delivered.display')}</StyledText>
                                                                    )}
                                                                    {item?.state === 'SETTLED' && <StyledText style={[reverseThemeStyle, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}>{t('stateTip.settled.display')}</StyledText>}
                                                                </View>
                                                                <StyledText style={[reverseThemeStyle, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}>{item.lineItemSubTotal}</StyledText>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>

                                                )
                                            })
                                            : <StyledText style={{alignSelf: 'center'}}>{t('splitBill.nothing')}</StyledText>}
                                    </ScrollView>
                                </View>
                                <View style={{flex: 1, marginVertical: 5, justifyContent: 'space-between'}}>


                                    <StyledText style={{textAlign: 'left'}}>{t('order.discount')} ${order.discount}</StyledText>
                                    <StyledText style={{textAlign: 'left'}}>{t('order.serviceCharge')} ${order.serviceCharge}</StyledText>

                                    <StyledText style={{textAlign: 'left'}}>{t('order.total')} ${order.orderTotal}</StyledText>


                                </View>
                            </View>
                            <View style={{
                                flex: 2,
                                justifyContent: 'center',
                                marginTop: 8,
                                marginBottom: 5,
                                marginLeft: 32
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                }}>
                                    <Text style={[styles.sectionBarText, styles.tableRowContainer, {paddingLeft: 0}]}>
                                        {t('splitBill.splitOrder')}
                                    </Text>
                                    {!!this.state?.splitOrderData && <View style={styles.tableRowContainer}>
                                        <StyledText>Order ID: </StyledText>
                                        <StyledText style={styles.tableCellText}>{this.state?.splitOrderData?.serialId}</StyledText>
                                        <StyledText> ({this.state?.splitOrderData?.orderType === 'IN_STORE' ? this.state?.splitOrderData?.tableDisplayName : t('order.takeOut')})</StyledText>
                                    </View>}
                                </View>
                                <View style={{flex: 1}}>
                                    {!!this.state.splitOrderData && !!this.state.splitOrderId &&
                                        <>
                                            <View style={{flex: 7}}>
                                                <ScrollView style={{flex: 1}}>
                                                    {this.state.splitOrderData?.lineItems?.length > 0 ?
                                                        this.state.splitOrderData?.lineItems?.map((item, index) => {
                                                            return (



                                                                <TouchableOpacity style={[reverseThemeStyle, {marginBottom: 16, borderRadius: 10}, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}
                                                                    activeOpacity={0.8}
                                                                    onPress={() => {this.deleteItem(item)}}>
                                                                    <View style={{aspectRatio: 6, alignItems: 'center', flexDirection: 'row'}}>
                                                                        <View style={{flex: 2.5, flexDirection: 'column', paddingLeft: '3%'}}>
                                                                            <StyledText style={[{...reverseThemeStyle, fontSize: 16, fontWeight: 'bold'}, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}>{item.productName} ${item.price} {`X${item.quantity}`}</StyledText>
                                                                            {!!item?.options && <StyledText style={[reverseThemeStyle, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}>{item.options}</StyledText>}
                                                                            {!!item?.appliedOfferInfo && <StyledText style={[reverseThemeStyle, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}>{` ${item?.appliedOfferInfo?.offerName}(${item?.appliedOfferInfo?.overrideDiscount})`}</StyledText>}
                                                                        </View>
                                                                        <View style={{flexDirection: 'column', flex: 1, paddingRight: '3%', justifyContent: 'space-around', height: '100%', alignItems: 'flex-end', borderLeftWidth: 1}} >
                                                                            {['IN_PROCESS', 'ALREADY_IN_PROCESS'].includes(item?.state) && <TouchableOpacity
                                                                                onPress={() => {
                                                                                    this.setState({
                                                                                        choosenItem: {...this.state?.choosenItem, [item.lineItemId]: !this.state?.choosenItem?.[item.lineItemId] ?? false}
                                                                                    });
                                                                                    this.toggleOrderLineItem(item.lineItemId);
                                                                                }}
                                                                            >
                                                                                <StyledText style={{...reverseThemeStyle, padding: 5, backgroundColor: 'gray', shadowColor: '#000', shadowOffset: {width: 1, height: 1}, shadowOpacity: 1}}>{t('choose')}</StyledText>
                                                                            </TouchableOpacity>}
                                                                            <View>
                                                                                {item?.state === 'OPEN' && <StyledText style={[reverseThemeStyle, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}>{t('stateTip.open.display')}</StyledText>}
                                                                                {['IN_PROCESS', 'ALREADY_IN_PROCESS'].includes(item?.state) && (
                                                                                    <StyledText style={[reverseThemeStyle, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}>{t('stateTip.inProcess.display')}</StyledText>
                                                                                )}
                                                                                {item?.state === 'PREPARED' && <StyledText style={[reverseThemeStyle, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}>{t('stateTip.prepared.display')}</StyledText>}
                                                                                {item?.state === 'DELIVERED' && (
                                                                                    <StyledText style={[reverseThemeStyle, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}>{t('stateTip.delivered.display')}</StyledText>
                                                                                )}
                                                                                {item?.state === 'SETTLED' && <StyledText style={[reverseThemeStyle, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}>{t('stateTip.settled.display')}</StyledText>}
                                                                            </View>

                                                                            <StyledText style={[reverseThemeStyle, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}>{item.lineItemSubTotal}</StyledText>
                                                                        </View>
                                                                    </View>
                                                                </TouchableOpacity>
                                                            )
                                                        })
                                                        : <StyledText style={{alignSelf: 'center'}}>{t('splitBill.nothing')}</StyledText>}
                                                </ScrollView>
                                            </View>
                                            <View style={{flex: 1, marginVertical: 5, flexDirection: 'row'}}>
                                                <View style={{flex: 1, justifyContent: 'space-between'}}>


                                                    <StyledText style={{textAlign: 'left'}}>{t('order.discount')} ${this.state.splitOrderData.discount}</StyledText>
                                                    <StyledText style={{textAlign: 'left'}}>{t('order.serviceCharge')} ${this.state.splitOrderData.serviceCharge}</StyledText>

                                                    <StyledText style={{textAlign: 'left'}}>{t('order.total')} ${this.state.splitOrderData.orderTotal}</StyledText>


                                                </View>
                                                <View style={{flex: 3, justifyContent: 'space-between', flexDirection: 'row'}}>

                                                    <DeleteBtn
                                                        text={t('action.cancel')}
                                                        alertTitle={t('splitBill.ConfirmCancelMessage')}
                                                        alertMessage={''}
                                                        containerStyle={{
                                                            flex: 1,
                                                            alignItems: 'center',
                                                            borderRadius: 4,
                                                            borderWidth: 1,
                                                            borderColor: mainThemeColor,
                                                            justifyContent: 'center',
                                                            backgroundColor: '#fff',
                                                        }}
                                                        textStyle={{
                                                            textAlign: 'center',
                                                            fontSize: 16,
                                                            color: mainThemeColor,
                                                        }}
                                                        handleDeleteAction={() => {
                                                            this.props.navigation.goBack()
                                                            !!this.state?.splitOrderData && this.revertSplitOrder(this.props.navigation.state.params?.order?.orderId, this.state.splitOrderId)
                                                        }}
                                                    />
                                                    <View style={{flex: 2, marginLeft: 16}}>
                                                        <MainActionFlexButton
                                                            title={t('payOrder')}
                                                            onPress={() => {
                                                                if (!!this.state?.splitOrderData && this.state?.splitOrderData?.lineItems?.length > 0) {
                                                                    console.log('onPress', order)
                                                                    this.props.navigation.navigate('Payment', {
                                                                        order: this.state.splitOrderData,
                                                                        isSplitting: true,
                                                                        parentOrder: order,
                                                                    })
                                                                }
                                                                else {
                                                                    warningMessage(t('lineItemCountCheck'))
                                                                }
                                                            }} />
                                                    </View>


                                                </View>
                                            </View></>}
                                </View>
                            </View>
                        </View>
                    </View>
                </ThemeContainer>
            )
        }
        else {
            return (
                <ThemeContainer>
                    <View style={[styles.container, {
                        marginLeft: 0,
                        marginRight: 0,
                    }]}>
                        <View style={{
                            marginLeft: 15,
                            marginRight: 15,
                        }}>
                            <ScreenHeader backNavigation={true}
                                title={t('splitBill.SpiltBillScreenTitle')}
                                backAction={() => {
                                    Alert.alert(
                                        `${t('splitBill.ConfirmCancelMessage')}`,
                                        ``,
                                        [
                                            {
                                                text: `${t('action.yes')}`,
                                                onPress: () => {
                                                    this.props.navigation.goBack()
                                                    !!this.state?.splitOrderData ? this.revertSplitOrder(this.props.navigation.state.params?.order?.orderId, this.state.splitOrderId) : this.cleanSplitContext()
                                                }
                                            },
                                            {
                                                text: `${t('action.no')}`,
                                                onPress: () => console.log('Cancelled'),
                                                style: 'cancel'
                                            }
                                        ]
                                    )
                                }} />
                        </View>
                        <NavigationEvents
                            onWillFocus={() => {
                                this.refreshScreen()
                            }}
                        />
                        <View style={{flex: 1}}>
                            <View style={{flex: 9, paddingBottom: 8}}>
                                <View style={{marginBottom: 5}}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                    }}>
                                        <Text style={[styles.sectionBarText, {paddingLeft: 10}]}>
                                            {t('splitBill.parentOrder')}
                                        </Text>
                                        <View style={styles.tableRowContainer}>
                                            <StyledText>Order ID: </StyledText>
                                            <StyledText style={styles.tableCellText}>{order.serialId}</StyledText>
                                            <StyledText> ({order.orderType === 'IN_STORE' ? order.tableDisplayName : t('order.takeOut')})</StyledText>
                                        </View>
                                    </View>
                                    <View style={[styles.sectionBar]}>
                                        <View style={[styles.tableCellView, {flex: 8}]}>
                                            <TouchableOpacity>
                                                <Text style={styles.sectionBarTextSmall}>
                                                    {t('order.product')}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={[styles.tableCellView, {flex: 2}]}>
                                            <TouchableOpacity>
                                                <Text style={styles.sectionBarTextSmall}>
                                                    {t('order.quantity')}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={[styles.tableCellView, {flex: 3}]}>
                                            <TouchableOpacity>
                                                <Text style={styles.sectionBarTextSmall}>{t('order.unitPrice')}</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={[styles.tableCellView, {flex: 3}]}>
                                            <TouchableOpacity>
                                                <Text style={styles.sectionBarTextSmall}>{t('order.subtotal')}</Text>
                                            </TouchableOpacity>
                                        </View>


                                    </View>
                                </View>
                                <View style={{flex: 8}}>
                                    <ScrollView style={{flex: 1}}>
                                        {order?.lineItems?.length > 0 ?
                                            order?.lineItems?.map((item, index) => {
                                                return (
                                                    <TouchableOpacity style={[styles.rowFront, themeStyle]} onPress={() => {this.addItem(item)}}>
                                                        <View style={{marginBottom: 0}}>
                                                            <View style={[styles.tableRowContainer, {paddingBottom: 0}]}>
                                                                <View style={[styles.tableCellView, {flex: 8}]}>

                                                                    <View style={{flex: 5}}>
                                                                        <StyledText style={{textAlign: 'left'}}>
                                                                            {item.productName}
                                                                        </StyledText>
                                                                    </View>
                                                                </View>

                                                                <View style={[styles.tableCellView, {flex: 2, alignItems: 'center', justifyContent: "center"}]}>
                                                                    <StyledText>{item.quantity}</StyledText>
                                                                </View>

                                                                <View style={[styles.tableCellView, {flex: 3}]}>
                                                                    <StyledText>${item.price}</StyledText>
                                                                </View>

                                                                <View style={[styles.tableCellView, {flex: 3}]}>
                                                                    <StyledText>${item.lineItemSubTotal}</StyledText>
                                                                </View>

                                                            </View>
                                                            <View>
                                                                <View style={{marginLeft: 15}}>
                                                                    {renderChildProducts(item)}
                                                                </View>
                                                                <View style={{marginLeft: 15}}>
                                                                    {renderOptionsAndOffer(item)}
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>




                                                )
                                            })
                                            : <StyledText style={{alignSelf: 'center'}}>{t('splitBill.nothing')}</StyledText>}
                                    </ScrollView>
                                </View>
                                <View style={[complexTheme.shade, {marginTop: 5, paddingVertical: 5, paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between'}]}>


                                    <StyledText style={{textAlign: 'left'}}>{t('order.discount')} ${order.discount}</StyledText>
                                    <StyledText style={{textAlign: 'left'}}>{t('order.serviceCharge')} ${order.serviceCharge}</StyledText>

                                    <StyledText style={{textAlign: 'left'}}>{t('order.total')} ${order.orderTotal}</StyledText>


                                </View>
                            </View>
                            <View style={{flex: 9, paddingBottom: 8, borderColor: mainThemeColor, borderTopWidth: 1, paddingTop: 8}}>
                                <View style={{marginBottom: 5}}>

                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                    }}>
                                        <Text style={[styles.sectionBarText, {paddingLeft: 10}]}>
                                            {t('splitBill.splitOrder')}
                                        </Text>
                                        {!!this.state?.splitOrderData && <View style={styles.tableRowContainer}>
                                            <StyledText>Order ID: </StyledText>
                                            <StyledText style={styles.tableCellText}>{this.state?.splitOrderData?.serialId}</StyledText>
                                            <StyledText> ({this.state?.splitOrderData?.orderType === 'IN_STORE' ? this.state?.splitOrderData?.tableDisplayName : t('order.takeOut')})</StyledText>
                                        </View>}
                                    </View>

                                    <View style={[styles.sectionBar]}>
                                        <View style={[styles.tableCellView, {flex: 8}]}>
                                            <TouchableOpacity>
                                                <Text style={styles.sectionBarTextSmall}>
                                                    {t('order.product')}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={[styles.tableCellView, {flex: 2}]}>
                                            <TouchableOpacity>
                                                <Text style={styles.sectionBarTextSmall}>
                                                    {t('order.quantity')}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={[styles.tableCellView, {flex: 3}]}>
                                            <TouchableOpacity>
                                                <Text style={styles.sectionBarTextSmall}>{t('order.unitPrice')}</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={[styles.tableCellView, {flex: 3}]}>
                                            <TouchableOpacity>
                                                <Text style={styles.sectionBarTextSmall}>{t('order.subtotal')}</Text>
                                            </TouchableOpacity>
                                        </View>


                                    </View>
                                </View>
                                <View style={{flex: 8}}>
                                    <ScrollView style={{flex: 1}}>
                                        {this.state.splitOrderData?.lineItems?.length > 0 ?
                                            this.state.splitOrderData?.lineItems?.map((item, index) => {
                                                return (
                                                    <TouchableOpacity style={[styles.rowFront, themeStyle]} onPress={() => {this.deleteItem(item)}}>
                                                        <View style={{marginBottom: 0}}>
                                                            <View style={[styles.tableRowContainer, {paddingBottom: 0}]}>
                                                                <View style={[styles.tableCellView, {flex: 8}]}>

                                                                    <View style={{flex: 5}}>
                                                                        <StyledText style={{textAlign: 'left'}}>
                                                                            {item.productName}
                                                                        </StyledText>
                                                                    </View>
                                                                </View>

                                                                <View style={[styles.tableCellView, {flex: 2, alignItems: 'center', justifyContent: "center"}]}>
                                                                    <StyledText>{item.quantity}</StyledText>
                                                                </View>

                                                                <View style={[styles.tableCellView, {flex: 3}]}>
                                                                    <StyledText>${item.price}</StyledText>
                                                                </View>

                                                                <View style={[styles.tableCellView, {flex: 3}]}>
                                                                    <StyledText>${item.lineItemSubTotal}</StyledText>
                                                                </View>

                                                            </View>
                                                            <View>
                                                                <View style={{marginLeft: 15}}>
                                                                    {renderChildProducts(item)}
                                                                </View>
                                                                <View style={{marginLeft: 15}}>
                                                                    {renderOptionsAndOffer(item)}
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>




                                                )
                                            })
                                            : <StyledText style={{alignSelf: 'center'}}>{t('splitBill.nothing')}</StyledText>}
                                    </ScrollView>
                                </View>
                                <View style={[complexTheme.shade, {marginTop: 5, paddingVertical: 5, paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>


                                    <StyledText style={{textAlign: 'left'}}>{t('order.discount')} ${this.state?.splitOrderData?.discount ?? '0'}</StyledText>
                                    <StyledText style={{textAlign: 'left'}}>{t('order.serviceCharge')} ${this.state?.splitOrderData?.serviceCharge ?? '0'}</StyledText>

                                    <StyledText style={{textAlign: 'left'}}>{t('order.total')} ${this.state?.splitOrderData?.orderTotal ?? '0'}</StyledText>


                                </View>
                            </View>
                            <View style={{
                                flex: 1.5, flexDirection: 'row', marginLeft: 15,
                                marginRight: 15,
                            }}>
                                <DeleteBtn
                                    text={t('action.cancel')}
                                    alertTitle={t('splitBill.ConfirmCancelMessage')}
                                    alertMessage={''}
                                    containerStyle={{
                                        flex: 1,
                                        alignItems: 'center',
                                        borderRadius: 4,
                                        borderWidth: 1,
                                        borderColor: mainThemeColor,
                                        justifyContent: 'center',
                                        backgroundColor: '#fff',
                                    }}
                                    textStyle={{
                                        textAlign: 'center',
                                        fontSize: 16,
                                        color: mainThemeColor,
                                    }}
                                    handleDeleteAction={() => {
                                        this.props.navigation.goBack()
                                        !!this.state?.splitOrderData && this.revertSplitOrder(this.props.navigation.state.params?.order?.orderId, this.state.splitOrderId)
                                    }}
                                />
                                <View style={{flex: 1, marginLeft: 16}}>
                                    <MainActionFlexButton
                                        title={t('payOrder')}
                                        onPress={() => {
                                            if (!!this.state?.splitOrderData && this.state?.splitOrderData?.lineItems?.length > 0) {
                                                console.log('onPress', order)
                                                this.props.navigation.navigate('Payment', {
                                                    order: this.state.splitOrderData,
                                                    isSplitting: true,
                                                    parentOrder: order,
                                                })
                                            }
                                            else {
                                                warningMessage(t('lineItemCountCheck'))
                                            }
                                        }} />
                                </View>
                            </View>
                        </View>


                    </View>
                </ThemeContainer>
            )
        }

    }
}

const mapStateToProps = (state, props) => ({
    labels: state.labels.data.labels,
    subproducts: state.label.data.subLabels,
    products: state.products.data.results,
    haveData: state.products.haveData,
    haveError: state.products.haveError,
    isLoading: state.products.loading,
    order: state.order.data,
    productsData: state.products
})
const mapDispatchToProps = (dispatch, props) => ({
    dispatch,
    getLables: () => dispatch(getLables()),
    getProducts: () => dispatch(getProducts()),
    getOrder: () => dispatch(getOrder(props.navigation.state.params?.order?.orderId)),
    getfetchOrderInflights: () => dispatch(getfetchOrderInflights()),
    getOrdersByDateRange: () => dispatch(getOrdersByDateRange()),
    clearOrder: () => dispatch(clearOrder(props.navigation.state.params.orderId)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SpiltBillScreen)

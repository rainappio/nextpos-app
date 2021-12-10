import React from 'react'
import {reduxForm} from 'redux-form'
import {Alert, ScrollView, Text, TouchableOpacity, View, TouchableWithoutFeedback} from 'react-native'
import {connect} from 'react-redux'
import {Accordion, List} from '@ant-design/react-native'
import {getLables, getProducts, clearOrder, getOrder} from '../actions'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import styles from '../styles'
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
import {handleDelete, handleOrderSubmit, renderChildProducts, renderOptionsAndOffer, handleOrderAction, getTableDisplayName} from "../helpers/orderActions";
import {SwipeRow} from 'react-native-swipe-list-view'
import ScreenHeader from "../components/ScreenHeader";
import Icon from 'react-native-vector-icons/FontAwesome'
import {MainActionButton, MainActionFlexButton} from "../components/ActionButtons";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {SwipeListView} from 'react-native-swipe-list-view'
import {CheckBox, Tooltip} from 'react-native-elements'



class SplitBillByHeadScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    static contextType = LocaleContext

    constructor(props, context) {
        super(props, context)
        this.state = {
            splitOrderId: context?.splitOrderId ?? null,
            splitOrderData: null,
            isLastOne: false
        }


    }
    componentDidMount() {
        this._refreshScreen = this.props.navigation.addListener('focus', () => {
            this.refreshScreen()
        })
    }
    componentWillUnmount() {
        this._refreshScreen()
    }


    refreshScreen = () => {

        this.getSplitOrder(this.props.route.params?.order?.orderId)
    }








    getSplitOrder = (id) => {
        if (!!this.props.route.params?.headCount) {
            dispatchFetchRequestWithOption(
                api.splitOrder.splitByHead(id),
                {
                    method: 'POST',
                    withCredentials: true,
                    credentials: 'include',
                    headers: {'Content-Type': 'application/json', },
                    body: JSON.stringify({
                        headCount: this.props.route.params?.headCount
                    })
                }, {
                defaultMessage: false
            },
                response => {
                    response.json().then(data => {
                        let isLastOne = data?.splitAmounts?.filter((item) => !item?.paid)?.length <= 1
                        this.setState({splitOrderData: data, isLastOne: isLastOne})
                    })
                },
                response => {
                    this.setState({splitOrderData: null, splitOrderId: null})
                }
            ).then()
        } else {
            dispatchFetchRequestWithOption(
                api.splitOrder.splitByHead(id),
                {
                    method: 'GET',
                    withCredentials: true,
                    credentials: 'include',
                    headers: {'Content-Type': 'application/json', },

                }, {
                defaultMessage: false
            },
                response => {
                    response.json().then(data => {
                        let isLastOne = data?.splitAmounts?.filter((item) => !item?.paid)?.length <= 1
                        this.setState({splitOrderData: data, isLastOne: isLastOne})
                    })
                },
                response => {
                }
            ).then()
        }

    }

    deleteSplitBillByHeadCount = (id) => {
        dispatchFetchRequestWithOption(
            api.splitOrder.splitByHead(id),
            {
                method: 'DELETE',
                withCredentials: true,
                credentials: 'include',
                headers: {'Content-Type': 'application/json', },

            }, {
            defaultMessage: false
        },
            response => {
            },
        ).then()
    }

    handlePayLeftAmount = (id, splitAmounts) => {
        let newHeadCount = splitAmounts?.filter((item) => item?.paid)?.length + 1
        dispatchFetchRequestWithOption(
            api.splitOrder.splitByHead(id),
            {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {'Content-Type': 'application/json', },
                body: JSON.stringify({
                    headCount: newHeadCount
                })
            }, {
            defaultMessage: false
        },
            response => {
                response.json().then(data => {
                    this.context?.isTablet ?
                        this.props.navigation.navigate('Payment', {
                            order: this.props?.order,
                            isSplitting: true,
                            parentOrder: this.props?.order,
                            isSplitByHeadCount: true,
                            splitAmount: data?.splitAmounts?.find((item) => !item?.paid)?.splitAmount,
                            isLastOne: true
                        }) :
                        this.props.navigation.navigate('PaymentOrder', {
                            orderId: this.props?.order?.orderId,
                            navigation: this.props.navigation,
                            isSplitting: true,
                            parentOrder: this.props?.order,
                            isSplitByHeadCount: true,
                            splitAmount: data?.splitAmounts?.find((item) => !item?.paid)?.splitAmount,
                            isLastOne: true
                        })
                    this.setState({splitOrderData: data, isLastOne: true})
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
            productsData
        } = this.props
        const {reverseThemeStyle, t, splitParentOrderId, complexTheme, themeStyle, customMainThemeColor, customBackgroundColor} = this.context

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
                                                handleOrderAction(order?.orderId, 'EXIT_PAYMENT', () => this.props.navigation.goBack())

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
                                    <Text style={[styles?.sectionBarText(customMainThemeColor)]}>
                                        {t('splitBill.parentOrder')}
                                    </Text>
                                    <View style={styles.tableRowContainer}>
                                        <StyledText>Order ID: </StyledText>
                                        <StyledText style={styles.tableCellText}>{order.serialId}</StyledText>

                                    </View>
                                    <View style={{flex: 1}}>
                                        <Text numberOfLines={1} style={{backgroundColor: customBackgroundColor}} > ({getTableDisplayName(order)})</Text>
                                    </View>
                                </View>
                                <View style={{flex: 7, paddingRight: 16}}>
                                    <ScrollView style={{flex: 1}}>
                                        {order?.lineItems?.length > 0 ?
                                            order?.lineItems?.map((item, index) => {
                                                return (
                                                    <TouchableOpacity key={index} style={[{backgroundColor: '#d6d6d6'}, {marginBottom: 16, borderRadius: 10}, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: customMainThemeColor})]}
                                                        activeOpacity={0.8}
                                                        onPress={() => {}}>
                                                        <View style={{aspectRatio: 3, alignItems: 'center', flexDirection: 'row'}}>
                                                            <View style={{flex: 2.5, flexDirection: 'column', paddingLeft: '3%'}}>
                                                                <StyledText style={[{...{backgroundColor: '#d6d6d6', color: '#000'}, fontSize: 16, fontWeight: 'bold'}, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: customMainThemeColor})]}>{item.productName} ${item.price} {`X${item.quantity}`}</StyledText>
                                                                {!!item?.options && <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: customMainThemeColor})]}>{item.options}</StyledText>}
                                                                {!!item?.appliedOfferInfo && <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: customMainThemeColor})]}>{` ${item?.appliedOfferInfo?.offerName}(${item?.appliedOfferInfo?.overrideDiscount})`}</StyledText>}
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
                                                                    <StyledText style={{...{backgroundColor: '#d6d6d6', color: '#000'}, padding: 5, backgroundColor: 'gray', shadowColor: '#000', shadowOffset: {width: 1, height: 1}, shadowOpacity: 1}}>{t('orderForm.choose')}</StyledText>
                                                                </TouchableOpacity>}
                                                                <View>
                                                                    {item?.state === 'OPEN' && <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: customMainThemeColor})]}>{t('orderForm.stateTip.open.display')}</StyledText>}
                                                                    {['IN_PROCESS', 'ALREADY_IN_PROCESS'].includes(item?.state) && (
                                                                        <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: customMainThemeColor})]}>{t('orderForm.stateTip.inProcess.display')}</StyledText>
                                                                    )}
                                                                    {item?.state === 'PREPARED' && <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: customMainThemeColor})]}>{t('orderForm.stateTip.prepared.display')}</StyledText>}
                                                                    {item?.state === 'DELIVERED' && (
                                                                        <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: customMainThemeColor})]}>{t('orderForm.stateTip.delivered.display')}</StyledText>
                                                                    )}
                                                                    {item?.state === 'SETTLED' && <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: customMainThemeColor})]}>{t('orderForm.stateTip.settled.display')}</StyledText>}
                                                                </View>
                                                                <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: customMainThemeColor})]}>{item.lineItemSubTotal}</StyledText>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>

                                                )
                                            })
                                            : <StyledText style={{alignSelf: 'center'}}>{t('splitBill.nothing')}</StyledText>}
                                    </ScrollView>
                                </View>
                                <View style={{flex: 1, marginVertical: 5, justifyContent: 'space-between', paddingRight: 16, borderTopWidth: 1, borderColor: customMainThemeColor, paddingTop: 8}}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <StyledText >{t('order.subtotal')}</StyledText>
                                        <StyledText >${order?.total?.amountWithTax}</StyledText>
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <StyledText >{t('order.discount')}</StyledText>
                                        <StyledText >${order?.discount}</StyledText>
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

                            <View style={{
                                flex: 2,
                                justifyContent: 'center',
                                marginTop: 8,
                                marginBottom: 5,
                                borderLeftWidth: 1,
                                borderColor: customMainThemeColor
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    paddingLeft: 16
                                }}>
                                    <Text style={[styles?.sectionBarText(customMainThemeColor), styles.tableRowContainer, {paddingLeft: 0}]}>
                                        {t('splitBill.splitOrder')}
                                    </Text>

                                </View>
                                <View style={{flex: 1}}>
                                    {!!this.state.splitOrderData &&
                                        <>
                                            <View style={{flex: 7, paddingLeft: 16}}>
                                                <ScrollView style={{flex: 1}}>
                                                    {this.state.splitOrderData?.splitAmounts?.length > 0 ?
                                                        this.state.splitOrderData?.splitAmounts?.map((item, index) => {
                                                            return (



                                                                <TouchableOpacity key={index} style={[{backgroundColor: '#d6d6d6', color: '#000'}, {marginBottom: 16, borderRadius: 10}, (!!item?.paid && {backgroundColor: 'gray'})]}
                                                                    activeOpacity={0.8}
                                                                    disabled={item?.paid}
                                                                    onPress={() => {}}>
                                                                    <View style={{aspectRatio: 6, alignItems: 'center', flexDirection: 'row'}}>
                                                                        <View style={{flex: 2.5, flexDirection: 'column', paddingLeft: '3%'}}>
                                                                            <StyledText style={[{...{backgroundColor: '#d6d6d6', color: '#000'}, fontSize: 16, fontWeight: 'bold'}, (!!item?.paid && {backgroundColor: 'gray'})]}>${item?.splitAmount}</StyledText>
                                                                        </View>

                                                                        {item?.paid ?
                                                                            <View style={{flex: 1, margin: 16, alignItems: 'center'}}>
                                                                                <StyledText style={[{...{backgroundColor: '#d6d6d6', color: '#000'}, fontSize: 16, fontWeight: 'bold'}, (!!item?.paid && {backgroundColor: 'gray'})]}>{t('orderState.SETTLED')}</StyledText>
                                                                            </View>
                                                                            : <View style={{flex: 1, margin: 16}}>
                                                                                <MainActionFlexButton
                                                                                    title={t('orderForm.payOrder')}
                                                                                    onPress={() => {
                                                                                        this.props.navigation.navigate('Payment', {
                                                                                            order: order,
                                                                                            isSplitting: true,
                                                                                            parentOrder: order,
                                                                                            isSplitByHeadCount: true,
                                                                                            splitAmount: item?.splitAmount,
                                                                                            isLastOne: this.state?.isLastOne
                                                                                        })

                                                                                    }} />
                                                                            </View>}

                                                                    </View>
                                                                </TouchableOpacity>
                                                            )
                                                        })
                                                        : <StyledText style={{alignSelf: 'center'}}>{t('splitBill.nothing')}</StyledText>}
                                                </ScrollView>
                                            </View>

                                            <View style={{flex: 1, marginVertical: 5, flexDirection: 'row', paddingLeft: 16, borderTopWidth: 1, borderColor: customMainThemeColor, paddingTop: 8}}>


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
                                                            borderColor: customMainThemeColor,
                                                            justifyContent: 'center',
                                                            backgroundColor: '#fff',
                                                        }}
                                                        textStyle={{
                                                            textAlign: 'center',
                                                            fontSize: 16,
                                                            color: customMainThemeColor,
                                                        }}
                                                        handleDeleteAction={() => {
                                                            handleOrderAction(order?.orderId, 'EXIT_PAYMENT', () => this.props.navigation.goBack())
                                                        }}
                                                    />
                                                    <View style={{flex: 2, marginLeft: 16}}>
                                                        <MainActionFlexButton
                                                            title={t('order.payLeftAmount')}
                                                            onPress={() => {
                                                                Alert.alert(
                                                                    `${t('order.payLeftAmount')}?`,
                                                                    ``,
                                                                    [
                                                                        {
                                                                            text: `${t('action.yes')}`,
                                                                            onPress: () => {
                                                                                this.handlePayLeftAmount(order?.orderId, this.state?.splitOrderData?.splitAmounts)

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


                                                </View>
                                            </View>
                                        </>}
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
                                                handleOrderAction(order?.orderId, 'EXIT_PAYMENT', () => this.props.navigation.goBack())

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
                        <View style={{flex: 1}}>
                            <View style={{flex: 9, paddingBottom: 8}}>
                                <View style={{marginBottom: 5}}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                    }}>
                                        <Text style={[styles?.sectionBarText(customMainThemeColor), {paddingLeft: 10}]}>
                                            {t('splitBill.parentOrder')}
                                        </Text>
                                        <View style={styles.tableRowContainer}>
                                            <StyledText>Order ID: </StyledText>
                                            <StyledText style={styles.tableCellText}>{order.serialId}</StyledText>

                                        </View>
                                        <View style={{flex: 1}}>
                                            <Text numberOfLines={1} style={{backgroundColor: customBackgroundColor}} > ({getTableDisplayName(order)})</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.sectionBar]}>
                                        <View style={[styles.tableCellView, {flex: 8}]}>
                                            <TouchableOpacity>
                                                <Text style={styles?.sectionBarTextSmall(customMainThemeColor)}>
                                                    {t('order.product')}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={[styles.tableCellView, {flex: 2}]}>
                                            <TouchableOpacity>
                                                <Text style={styles?.sectionBarTextSmall(customMainThemeColor)}>
                                                    {t('order.quantity')}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={[styles.tableCellView, {flex: 3}]}>
                                            <TouchableOpacity>
                                                <Text style={styles?.sectionBarTextSmall(customMainThemeColor)}>{t('order.unitPrice')}</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={[styles.tableCellView, {flex: 3}]}>
                                            <TouchableOpacity>
                                                <Text style={styles?.sectionBarTextSmall(customMainThemeColor)}>{t('order.subtotal')}</Text>
                                            </TouchableOpacity>
                                        </View>


                                    </View>
                                </View>

                                <View style={{flex: 8}}>
                                    <ScrollView style={{flex: 1}}>
                                        {order?.lineItems?.length > 0 ?
                                            order?.lineItems?.map((item, index) => {
                                                return (
                                                    <TouchableOpacity key={index} style={[styles.rowFront, themeStyle, {backgroundColor: customBackgroundColor}]} onPress={() => {}}>
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
                            <View style={{flex: 9, paddingBottom: 8, borderColor: customMainThemeColor, borderTopWidth: 1, paddingTop: 8}}>
                                <View style={{marginBottom: 5}}>

                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                    }}>
                                        <Text style={[styles?.sectionBarText(customMainThemeColor), {paddingLeft: 10}]}>
                                            {t('splitBill.splitOrder')}
                                        </Text>

                                    </View>


                                </View>
                                <View style={{flex: 8}}>
                                    <ScrollView style={{flex: 1}}>
                                        {this.state.splitOrderData?.splitAmounts?.length > 0 ?
                                            this.state.splitOrderData?.splitAmounts?.map((item, index) => {
                                                return (
                                                    <TouchableOpacity key={index} style={[{backgroundColor: '#d6d6d6', color: '#000'}, {marginBottom: 8, borderRadius: 10}, (!!item?.paid && {backgroundColor: 'gray'})]}
                                                        disabled={item?.paid}
                                                        activeOpacity={0.8}
                                                        onPress={() => {}}>
                                                        <View>
                                                            <View style={{aspectRatio: 6, alignItems: 'center', flexDirection: 'row'}}>
                                                                <View style={{flex: 2, flexDirection: 'column', paddingLeft: '3%'}}>
                                                                    <StyledText style={[{...{backgroundColor: '#d6d6d6', color: '#000'}, fontSize: 16, fontWeight: 'bold'}, (!!item?.paid && {backgroundColor: 'gray'})]}>${item?.splitAmount}</StyledText>
                                                                </View>

                                                                {item?.paid ?
                                                                    <View style={{flex: 1, margin: 8, alignItems: 'center'}}>
                                                                        <StyledText style={[{...{backgroundColor: '#d6d6d6', color: '#000'}, fontSize: 16, fontWeight: 'bold'}, (!!item?.paid && {backgroundColor: 'gray'})]}>{t('orderState.SETTLED')}</StyledText>
                                                                    </View>
                                                                    : <View style={{flex: 1, margin: 8}}>
                                                                        <MainActionFlexButton
                                                                            title={t('orderForm.payOrder')}
                                                                            onPress={() => {
                                                                                this.props.navigation.navigate('PaymentOrder', {
                                                                                    orderId: order.orderId,
                                                                                    navigation: this.props.navigation,
                                                                                    isSplitting: true,
                                                                                    parentOrder: order,
                                                                                    isSplitByHeadCount: true,
                                                                                    splitAmount: item?.splitAmount,
                                                                                    isLastOne: this.state?.isLastOne,
                                                                                })

                                                                            }} />
                                                                    </View>}

                                                            </View>

                                                        </View>
                                                    </TouchableOpacity>




                                                )
                                            })
                                            : <StyledText style={{alignSelf: 'center'}}>{t('splitBill.nothing')}</StyledText>}
                                    </ScrollView>
                                </View>

                            </View>
                            <View style={{
                                flex: 1.5, flexDirection: 'row'
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
                                        borderColor: customMainThemeColor,
                                        justifyContent: 'center',
                                        backgroundColor: '#fff',
                                    }}
                                    textStyle={{
                                        textAlign: 'center',
                                        fontSize: 16,
                                        color: customMainThemeColor,
                                    }}
                                    handleDeleteAction={() => {
                                        handleOrderAction(order?.orderId, 'EXIT_PAYMENT', () => this.props.navigation.goBack())
                                    }}
                                />
                                <View style={{flex: 1, marginLeft: 16}}>
                                    <MainActionFlexButton
                                        title={t('order.payLeftAmount')}
                                        onPress={() => {
                                            Alert.alert(
                                                `${t('order.payLeftAmount')}?`,
                                                ``,
                                                [
                                                    {
                                                        text: `${t('action.yes')}`,
                                                        onPress: () => {
                                                            this.handlePayLeftAmount(order?.orderId, this.state?.splitOrderData?.splitAmounts)

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
    getOrder: (orderId) => dispatch(getOrder(orderId ?? props.route.params?.order?.orderId)),
    clearOrder: () => dispatch(clearOrder(props.route.params.orderId)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SplitBillByHeadScreen)

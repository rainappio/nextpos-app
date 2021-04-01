import React from 'react'
import {Alert, Text, TouchableOpacity, View, Switch} from 'react-native'
import {SwipeListView} from 'react-native-swipe-list-view'
import {connect} from 'react-redux'
import {clearOrder, getfetchOrderInflights, getOrder, getOrdersByDateRange} from '../actions'
import AddBtn from '../components/AddBtn'
import Icon from 'react-native-vector-icons/Ionicons'
import DeleteBtn from '../components/DeleteBtn'
import {api, dispatchFetchRequest, dispatchFetchRequestWithOption, warningMessage, successMessage, apiRoot} from '../constants/Backend'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import {CheckBox, Tooltip} from 'react-native-elements'
import ScreenHeader from "../components/ScreenHeader";
import OrderTopInfo from "./OrderTopInfo";
import {handleDelete, handleOrderSubmit, renderChildProducts, renderOptionsAndOffer, handleQuickCheckout, revertSplitOrder, handlePrintWorkingOrder, handlePrintOrderDetails, handleOrderAction} from "../helpers/orderActions";
import NavigationService from "../navigation/NavigationService";
import {withContext} from "../helpers/contextHelper";
import {compose} from "redux";
import {StyledText} from "../components/StyledText";
import {SecondActionButton} from "../components/ActionButtons";
import {SplitBillPopUp} from '../components/PopUp'
import SockJsClient from 'react-stomp';
import Colors from "../constants/Colors";

class OrdersSummaryRow extends React.Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        orderSummaryTitle: 'Order Summary',
        stateTip: {
          open: {
            display: 'Open',
            note: 'Order is open'
          },
          inProcess: {
            display: 'Prep',
            note: 'Preparing order'
          },
          prepared: {
            display: 'Prepared',
            note: 'order prepared'
          },
          delivered: {
            display: 'Deliver',
            note: 'Order is delivered'
          },
          settled: {
            display: 'Paid',
            note: 'Order is paid'
          }
        },
        deliverAllLineItems: 'Confirm to deliver all line items',
        lineItemCountCheck: 'At least one item is needed to submit an order.',
        submitOrder: 'Submit',
        not: 'don\'t',
        quickCheckout: 'Quick checkout',
        backToTables: 'Back to Tables',
        deleteOrder: 'Delete',
        selectItemToDeliver: 'Please select a line item to deliver',
        deliverOrder: 'Deliver',
        payOrder: 'Payment',
      },
      zh: {
        orderSummaryTitle: '訂單總覽',
        stateTip: {
          open: {
            display: '開單',
            note: '開啟了訂單'
          },
          inProcess: {
            display: '準備中',
            note: '訂單已送出準備中'
          },
          prepared: {
            display: '準備完成',
            note: '訂單已準備完成'
          },
          delivered: {
            display: '已送餐',
            note: '訂單已送達'
          },
          settled: {
            display: '已結帳',
            note: '訂單已付款完畢'
          }
        },
        deliverAllLineItems: '確認所有品項送餐',
        lineItemCountCheck: '請加一個以上的產品到訂單裡.',
        submitOrder: '送單',
        not: '不',
        quickCheckout: '快速結帳',
        backToTables: '回到座位區',
        deleteOrder: '刪除',
        selectItemToDeliver: '請選擇品項送餐',
        deliverOrder: '送餐完畢',
        payOrder: '付款',
      }
    })

    this.state = {
      orderLineItems: {},
      splitBillModalVisible: false
    }

    console.debug(`order summary order id: ${this.props.order.orderId}`)
  }

  toggleOrderLineItem = (lineItemId) => {
    const lineItem = this.state.orderLineItems.hasOwnProperty(lineItemId) ? this.state.orderLineItems[lineItemId] : {
      checked: false,
      value: lineItemId
    }
    lineItem.checked = !lineItem.checked

    const lineItems = this.state.orderLineItems
    lineItems[lineItemId] = lineItem

    this.setState({orderLineItems: lineItems})
  }

  renderStateToolTip = (state, t) => {
    const tooltip = (
      <View>
        <Text>
          {t('stateTip.open.display')}: {t('stateTip.open.note')}
        </Text>
        <Text>
          {t('stateTip.inProcess.display')}: {t('stateTip.inProcess.note')}
        </Text>
        <Text>
          {t('stateTip.delivered.display')}: {t('stateTip.delivered.note')}
        </Text>
        <Text>
          {t('stateTip.settled.display')}: {t('stateTip.settled.note')}
        </Text>
      </View>
    )

    return (
      <Tooltip popover={tooltip} height={120} width={200} backgroundColor={this.context?.customMainThemeColor}>
        <View>
          {state === 'OPEN' && <StyledText style={{color: `${Colors.orderOpen}`}}>{t('stateTip.open.display')}</StyledText>}
          {['IN_PROCESS', 'ALREADY_IN_PROCESS'].includes(state) && (
            <StyledText style={{color: `${Colors.orderInProcess}`}}>{t('stateTip.inProcess.display')}</StyledText>
          )}
          {state === 'DELIVERED' && (
            <StyledText style={{color: `${Colors.orderDeliver}`}}>{t('stateTip.delivered.display')}</StyledText>
          )}
          {state === 'SETTLED' && <StyledText>{t('stateTip.settled.display')}</StyledText>}
        </View>
      </Tooltip>
    )
  }

  handleCancel = orderId => {
    this.props.clearOrder(orderId)
    this.props.navigation.navigate('TablesSrc')
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
      this.props.navigation.navigate('OrdersSummary')
      this.props.getOrder(this.props.order.orderId)
    }).then()
  }

  handleDeliver = id => {
    const lineItemIds = []

    Object.keys(this.state.orderLineItems).map(id => {
      const orderLineItem = this.state.orderLineItems[id];
      if (orderLineItem.checked) {
        lineItemIds.push(orderLineItem.value)
      }
    })

    if (lineItemIds.length === 0) {
      const formData = new FormData()
      formData.append('action', 'DELIVER')

      Alert.alert(
        `${this.context.t('action.confirmMessageTitle')}`,
        `${this.context.t('deliverAllLineItems')}`,
        [
          {
            text: `${this.context.t('action.yes')}`,
            onPress: () => {
              dispatchFetchRequest(api.order.process(id), {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
                body: formData
              },
                response => {
                  this.props.navigation.navigate('TablesSrc')
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
    } else {
      dispatchFetchRequest(api.order.deliverLineItems(id), {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({lineItemIds: lineItemIds})
      },
        response => {
          this.props.navigation.navigate('TablesSrc')
        }).then()
    }
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
      this.props.navigation.navigate('TablesSrc')
      this.props.getfetchOrderInflights()
      this.props.clearOrder(id)
      this.props.getOrdersByDateRange()
    }).then()
  }

  handleMergeOrder = (setid, orderId) => {
    dispatchFetchRequest(api.order.mergeOrderSet(setid), {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({orderId: orderId})
    }, response => {
      response.json().then(data => {
        this.props.getOrder(this.props.order.orderId)
      })
    }).then(() => handleOrderAction(this.props.order?.orderId, 'ENTER_PAYMENT', () => this.props.navigation.navigate('Payment', {
      order: this.props.order
    })))
  }

  getSplitBillByHeadCount = (id) => {
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

          let isPaid = data?.splitAmounts?.filter((item) => item?.paid)?.length > 0
          if (data?.headCount >= 2 && isPaid) {
            this.setState({splitBillModalVisible: true})
          } else {
            handleOrderAction(this.props.order?.orderId, 'ENTER_PAYMENT', () => this.props.navigation.navigate('Payment', {
              order: this.props.order
            }))
          }

        })
      },
      response => {

      }
    ).then()
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
        },
        body: formData
      }, {
      defaultMessage: false
    }, response => {
      response.json().then(data => {
        const message = isFree ? 'order.free' : 'order.cancelFree'
        successMessage(this.context.t(message))
        this.props.getOrder(this.props.order.orderId)
      })
    }).then()
  }

  render() {
    const {
      products = [],
      labels = [],
      navigation,
      haveData,
      haveError,
      isLoading,
      label,
      order,
      initialValues,
      themeStyle
    } = this.props

    const {t, splitParentOrderId, customMainThemeColor} = this.context

    return (
      <View style={styles.fullWidthScreen}>
        <View style={{flex: 1}}>
          <ScreenHeader backNavigation={true}
            parentFullScreen={true}
            backAction={() => this.handleCancel(order.orderId)}
            title={t('orderSummaryTitle')}
            rightComponent={
              order.state !== 'SETTLED' && (
                <AddBtn
                  onPress={() =>
                    this.props.navigation.navigate('OrderFormII', {
                      orderId: order.orderId
                    })
                  }
                />
              )
            }
          />
          <SockJsClient url={`${apiRoot}/ws`} topics={[`/dest/order/${order?.orderId}`]}
            onMessage={(data) => {
              if (data === `${order?.orderId}.order.orderChanged`) {
                this.props.getOrder(order?.orderId)
              }
            }}
            ref={(client) => {
              this.orderFormRef = client
            }}
            onConnect={() => {
              this.orderFormRef.sendMessage(`/async/order/${order?.orderId}`)
              console.log('onConnect')
            }}
            onDisconnect={() => {
              console.log('onDisconnect')
            }}
            debug={false}
          />
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

          <OrderTopInfo order={order} />

          <View style={[styles.sectionBar]}>
            <View style={[styles.tableCellView, {flex: 6}]}>
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

            <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-end'}]}>
              <TouchableOpacity>
                <Text style={styles?.sectionBarTextSmall(customMainThemeColor)}>{t('order.lineState')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>

            <SwipeListView
              data={
                order.lineItems?.map((item) => {
                  return {...item, disableRightSwipe: !!item?.associatedLineItemId, disableLeftSwipe: !!item?.associatedLineItemId}
                }).sort((a, b) => {
                  let sort = ["OPEN", "IN_PROCESS", "ALREADY_IN_PROCESS", "DELIVERED", "SETTLED"];
                  return sort.indexOf(a.state) - sort.indexOf(b.state);
                })
              }

              renderItem={(data, rowMap) => (
                <View style={[styles.rowFront, themeStyle]}>
                  <View key={rowMap} style={{marginBottom: 15}}>
                    <View style={styles.tableRowContainer}>
                      <View style={[styles.tableCellView, {flex: 6}]}>
                        {['IN_PROCESS', 'ALREADY_IN_PROCESS'].includes(data.item.state) && (
                          <CheckBox
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            center={true}
                            size={20}
                            containerStyle={{borderWidth: 0, flex: 1, padding: 0, margin: 0}}
                            checked={this.state.orderLineItems[data.item.lineItemId] !== undefined && this.state.orderLineItems[data.item.lineItemId].checked}
                            onIconPress={() => this.toggleOrderLineItem(data.item.lineItemId)}
                          />
                        )}
                        <View style={{flex: 5}}>
                          <StyledText style={{textAlign: 'left'}}>
                            {data.item.productName}
                          </StyledText>
                        </View>
                      </View>

                      <View style={[styles.tableCellView, {flex: 2}]}>
                        <StyledText>{data.item.quantity}</StyledText>
                      </View>

                      <View style={[styles.tableCellView, {flex: 3}]}>
                        <StyledText>${data.item.price}</StyledText>
                      </View>

                      <View style={[styles.tableCellView, {flex: 3}]}>
                        <StyledText>${data.item.lineItemSubTotal}</StyledText>
                      </View>
                      <View style={[styles.tableCellView, styles.justifyRight, {flex: 2}]}>
                        {this.renderStateToolTip(data.item.state, t)}
                      </View>
                    </View>
                    <View>
                      <View style={{marginLeft: 15}}>
                        {renderChildProducts(data.item)}
                      </View>
                      <View style={{marginLeft: 15}}>
                        {renderOptionsAndOffer(data.item)}
                      </View>
                    </View>
                  </View>
                </View>
              )}
              keyExtractor={(data, rowMap) => rowMap.toString()}
              renderHiddenItem={(data, rowMap) => {
                return (
                  <View style={[styles.rowBack, themeStyle]} key={rowMap}>
                    <View style={styles?.editIcon(customMainThemeColor)}>
                      <TouchableOpacity
                        onPress={() => {
                          if (data.item.price === 0) {
                            this.handleFreeLineitem(order.orderId, data.item.lineItemId, false)
                          } else {
                            this.handleFreeLineitem(order.orderId, data.item.lineItemId, true)
                          }
                        }
                        }>
                        <StyledText style={{width: 40}}>{data.item.price === 0 ? t('order.cancelFreeLineitem') : t('order.freeLineitem')}</StyledText>
                      </TouchableOpacity>
                    </View>
                    <View style={{width: '40%'}}>

                    </View>
                    <View style={styles?.editIcon(customMainThemeColor)}>
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate('OrderFormIII', {
                            prdId: data.item.productId,
                            orderId: this.props.navigation.state.params.orderId,
                            lineItem: data.item
                          })
                        }>
                        <Icon
                          name="md-create"
                          size={30}
                          color="#fff"

                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.delIcon}>
                      <DeleteBtn
                        handleDeleteAction={(orderId, lineItemId) =>
                          this.handleDeleteLineItem(
                            order.orderId,
                            data.item.lineItemId
                          )
                        }
                        islineItemDelete={true}
                      />
                    </View>
                  </View>
                )
              }}
              leftOpenValue={75}
              rightOpenValue={-150}
            />
          </View>

          <View>
            <View style={[styles.tableRowContainerWithBorder]}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <StyledText>{t('order.subtotal')}</StyledText>
              </View>
              <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                <StyledText>
                  ${order?.total?.amountWithTax}
                </StyledText>
              </View>
            </View>
            <View style={[styles.tableRowContainerWithBorder]}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <StyledText>{t('order.discount')}</StyledText>
              </View>
              <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                <StyledText>
                  ${order.discount}
                </StyledText>
              </View>
            </View>

            <View style={[styles.tableRowContainerWithBorder]}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <StyledText>{t('order.serviceCharge')}</StyledText>
              </View>
              <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                <StyledText>
                  ${order.serviceCharge}
                </StyledText>
              </View>
            </View>

            <View style={[styles.tableRowContainerWithBorder]}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <StyledText>{t('order.total')}</StyledText>
              </View>
              <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                <StyledText>
                  ${order.orderTotal}
                </StyledText>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.bottom, styles.horizontalMargin]}>
          {['OPEN', 'IN_PROCESS', 'DELIVERED'].includes(order.state) && (
            <TouchableOpacity
              onPress={() =>
                order.lineItems.length === 0
                  ? warningMessage(t('lineItemCountCheck'))
                  : handleOrderSubmit(order.orderId)
              }
            >
              <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                {t('submitOrder')}
              </Text>
            </TouchableOpacity>
          )}

          {order.state === 'OPEN' && (
            <SecondActionButton
              onPress={() =>
                order.lineItems.length === 0
                  ? warningMessage(t('lineItemCountCheck'))
                  : Alert.alert(
                    `${t('quickCheckoutPrint')}`,
                    ``,
                    [
                      {
                        text: `${this.context.t('action.yes')}`,
                        onPress: async () => {
                          await handleQuickCheckout(order, true)
                        }
                      },
                      {
                        text: `${this.context.t('action.no')}`,
                        onPress: async () => await handleQuickCheckout(order, false),
                        style: 'cancel'
                      }
                    ]
                  )
              }
              title={t('quickCheckout')}
            />
          )}
          {order.state === 'IN_PROCESS' && (
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, marginRight: 10}}>
                <SecondActionButton
                  onPress={() =>
                    order.lineItems.length === 0
                      ? warningMessage(t('lineItemCountCheck'))
                      : Alert.alert(
                        `${t('quickCheckoutPrint')}`,
                        ``,
                        [
                          {
                            text: `${this.context.t('action.yes')}`,
                            onPress: async () => {
                              await handleQuickCheckout(order, true)
                            }
                          },
                          {
                            text: `${this.context.t('action.no')}`,
                            onPress: async () => await handleQuickCheckout(order, false),
                            style: 'cancel'
                          }
                        ]
                      )
                  }
                  title={t('quickCheckout')}
                /></View>
              <View style={{flex: 1}}>
                <SecondActionButton
                  onPress={() => {
                    this.handleDeliver(order.orderId)
                  }}
                  title={t('deliverOrder')}
                /></View>
            </View>

          )}


          {order.state === 'DELIVERED' && (
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, marginRight: 10}}>
                <SecondActionButton
                  onPress={() => {
                    if (splitParentOrderId === null || splitParentOrderId === order?.orderId) {

                      this.setState({splitBillModalVisible: true})
                    }
                    else {
                      Alert.alert(
                        `${t('splittingCheck')}`,
                        ``,
                        [
                          {
                            text: `${this.context.t('action.yes')}`,
                            onPress: async () => {
                              await revertSplitOrder(this.context?.splitParentOrderId, this.context?.splitOrderId)
                              await this.context?.saveSplitOrderId(null)
                              await this.context?.saveSplitParentOrderId(null)

                              this.setState({splitBillModalVisible: true})
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
                  }
                  }
                  title={t('splitBill.SpiltBillScreenTitle')}
                /></View>
              <View style={{flex: 1}}>
                <TouchableOpacity
                  onPress={() =>
                    order.lineItems.length === 0
                      ? warningMessage(t('lineItemCountCheck'))
                      : (!!this.props.navigation.state.params?.orderSetData && this.props.navigation.state.params?.orderSetData?.status !== 'MERGED')
                        ? Alert.alert(
                          `${this.context.t('order.mergeOrderTitle')}`,
                          `${this.context.t('order.mergeOrderMsg')}`,
                          [
                            {
                              text: `${this.context.t('action.yes')}`,
                              onPress: () => {
                                this.handleMergeOrder(this.props.navigation.state.params?.orderSetData?.id, order.orderId)
                              }
                            },
                            {
                              text: `${this.context.t('action.no')}`,
                              onPress: () => console.log('Cancelled'),
                              style: 'cancel'
                            }
                          ]
                        )
                        : this.getSplitBillByHeadCount(order?.orderId)
                  }
                >
                  <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>{t('payOrder')}</Text>
                </TouchableOpacity></View>
            </View>

          )}
          {!['OPEN'].includes(order.state) && (
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, marginRight: 10}}>
                <SecondActionButton
                  onPress={() =>
                    order.lineItems.length === 0
                      ? warningMessage(t('lineItemCountCheck'))
                      : handlePrintWorkingOrder(order.orderId)
                  }
                  title={t('printWorkingOrder')}
                /></View>
              <View style={{flex: 1}}>
                <SecondActionButton
                  onPress={() =>
                    order.lineItems.length === 0
                      ? warningMessage(t('lineItemCountCheck'))
                      : handlePrintOrderDetails(order.orderId)
                  }
                  title={t('printOrderDetails')}
                />
              </View>
            </View>

          )}

          {order.state === 'SETTLED' && (
            <TouchableOpacity
              onPress={() => this.handleComplete(order.orderId)}
            >
              <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>{t('order.completeOrder')}</Text>
            </TouchableOpacity>
          )}
          {!['SETTLED', 'REFUNDED'].includes(order.state) && (
            <DeleteBtn
              handleDeleteAction={() => handleDelete(order.orderId, () => NavigationService.navigate('TablesSrc'))}
            />
          )}
        </View>
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  clearOrder: () => dispatch(clearOrder(props.order.orderId)),
  getOrder: id => dispatch(getOrder(id)),
  getfetchOrderInflights: () => dispatch(getfetchOrderInflights()),
  getOrdersByDateRange: () => dispatch(getOrdersByDateRange())
})

const enhance = compose(
  connect(null, mapDispatchToProps),
  withContext
)
export default enhance(OrdersSummaryRow)

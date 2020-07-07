import React from 'react'
import {ScrollView, Text, View, TouchableOpacity, Dimensions, Alert} from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'
import { connect } from 'react-redux'
import {
  clearOrder,
  getOrder,
  getfetchOrderInflights,
  formatDate,
  getOrdersByDateRange
} from '../actions'
import BackBtn from '../components/BackBtn'
import AddBtn from '../components/AddBtn'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import Icon from 'react-native-vector-icons/Ionicons'
import DeleteBtn from '../components/DeleteBtn'
import {
  api,
  makeFetchRequest,
  errorAlert,
  successMessage,
  warningMessage, dispatchFetchRequest, dispatchFetchRequestWithOption
} from '../constants/Backend'
import styles, {mainThemeColor} from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import {CheckBox, Tooltip} from 'react-native-elements'
import BackBtnCustom from "../components/BackBtnCustom";
import ScreenHeader from "../components/ScreenHeader";
import OrderTopInfo from "./OrderTopInfo";
import {handleDelete, handleOrderSubmit, renderOptionsAndOffer} from "../helpers/orderActions";
import NavigationService from "../navigation/NavigationService";

class OrdersSummaryRow extends React.Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        orderSummaryTitle: 'Order Summary',
        staff: 'Staff',
        product: 'Product',
        quantity: 'Qty',
        unitPrice: 'U/P',
        subTotal: 'Subtotal',
        state: 'Status',
        stateTip: {
          open: {
            display: 'Open',
            note: 'Order is open'
          },
          inProcess: {
            display: 'Prep',
            note: 'Preparing order'
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
        backToTables: 'Back to Tables',
        deleteOrder: 'Delete',
        selectItemToDeliver: 'Please select a line item to deliver',
        deliverOrder: 'Deliver',
        payOrder: 'Payment',
        completeOrder: 'Complete'
      },
      zh: {
        orderSummaryTitle: '訂單總覽',
        staff: '員工',
        product: '產品',
        quantity: '數量',
        unitPrice: '單價',
        subTotal: '小計',
        state: '狀態',
        stateTip: {
          open: {
            display: '開單',
            note: '開啟了訂單'
          },
          inProcess: {
            display: '準備中',
            note: '訂單已送出準備中'
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
        backToTables: '回到座位區',
        deleteOrder: '刪除',
        selectItemToDeliver: '請選擇品項送餐',
        deliverOrder: '送餐完畢',
        payOrder: '付款',
        completeOrder: '結束訂單'
      }
    })

    this.state = {
      orderLineItems: {}
    }

    console.debug(`order summary order id: ${this.props.order.orderId}`)
  }

  toggleOrderLineItem = (lineItemId) => {
    const lineItem = this.state.orderLineItems.hasOwnProperty(lineItemId) ? this.state.orderLineItems[lineItemId] : { checked: false, value: lineItemId }
    lineItem.checked = !lineItem.checked

    const lineItems = this.state.orderLineItems
    lineItems[lineItemId] = lineItem

    this.setState({ orderLineItems: lineItems })
  }

  renderStateToolTip = (state, t, theme) => {
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
      <Tooltip popover={tooltip} height={120} width={200} backgroundColor={mainThemeColor}>
        <View>
          {state === 'OPEN' && <Text style={theme}>{t('stateTip.open.display')}</Text>}
          {['IN_PROCESS', 'ALREADY_IN_PROCESS'].includes(state) && (
            <Text style={theme}>{t('stateTip.inProcess.display')}</Text>
          )}
          {state === 'DELIVERED' && (
            <Text style={theme}>{t('stateTip.delivered.display')}</Text>
          )}
          {state === 'SETTLED' && <Text style={theme}>{t('stateTip.settled.display')}</Text>}
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
                    'Content-Type': 'application/json',
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
      initialValues
    } = this.props

    const { t, theme } = this.context

    return (
      <ScrollView scrollIndicatorInsets={{right: 1}} contentContainerStyle={{flexGrow: 1}}>
        <View style={[styles.fullWidthScreen, theme]}>
          <View style={{flex: 2}}>
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

            <OrderTopInfo order={order}/>

            <View style={[styles.sectionBar, theme]}>
              <View style={[styles.tableCellView, {flex: 6}]}>
                <TouchableOpacity>
                  <Text style={styles.sectionBarTextSmall}>
                    {t('product')}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.tableCellView, {flex: 2}]}>
                <TouchableOpacity>
                  <Text style={styles.sectionBarTextSmall}>
                    {t('quantity')}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.tableCellView, {flex: 3}]}>
                <TouchableOpacity>
                  <Text style={styles.sectionBarTextSmall}>{t('unitPrice')}</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.tableCellView, {flex: 3}]}>
                <TouchableOpacity>
                  <Text style={styles.sectionBarTextSmall}>{t('subTotal')}</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-end'}]}>
                <TouchableOpacity>
                  <Text style={styles.sectionBarTextSmall}>{t('state')}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <SwipeListView
                data={order.lineItems}
                renderItem={(data, rowMap) => (
                  <View style={[styles.rowFront, theme]}>
                    <View key={rowMap} style={{marginBottom: 20}}>
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
                            <Text style={[{textAlign: 'left'}, theme]}>
                              {data.item.productName}
                            </Text>
                          </View>
                        </View>

                        <View style={[styles.tableCellView, {flex: 2}]}>
                          <Text style={theme}>{data.item.quantity}</Text>
                        </View>

                        <View style={[styles.tableCellView, {flex: 3}]}>
                          <Text style={theme}>${data.item.price}</Text>
                        </View>

                        <View style={[styles.tableCellView, {flex: 3}]}>
                          <Text style={theme}>${data.item.lineItemSubTotal}</Text>
                        </View>
                        <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-end'}]}>
                          {this.renderStateToolTip(data.item.state, t, theme)}
                        </View>
                      </View>
                      <View>
                        <Text style={[{textAlign: 'left', marginLeft: 15}, theme]}>
                          {renderOptionsAndOffer(data.item)}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
                keyExtractor={(data, rowMap) => rowMap.toString()}
                renderHiddenItem={(data, rowMap) => {
                  return (
                    <View style={[styles.rowBack]} key={rowMap}>
                      <View style={{width: '60%'}}>

                      </View>
                      <View style={styles.editIcon}>
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
                leftOpenValue={0}
                rightOpenValue={-150}
              />
            </View>

            <View>
              <View style={[styles.tableRowContainerWithBorder]}>
                <View style={[styles.tableCellView, {flex: 1}]}>
                  <Text style={theme}>{t('order.discount')}</Text>
                </View>
                <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                  <Text style={theme}>
                    ${order.discount}
                  </Text>
                </View>
              </View>

              <View style={[styles.tableRowContainerWithBorder]}>
                <View style={[styles.tableCellView, {flex: 1}]}>
                  <Text style={theme}>{t('order.serviceCharge')}</Text>
                </View>
                <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                  <Text style={theme}>
                    ${order.serviceCharge}
                  </Text>
                </View>
              </View>

              <View style={[styles.tableRowContainerWithBorder]}>
                <View style={[styles.tableCellView, {flex: 1}]}>
                  <Text style={theme}>{t('order.total')}</Text>
                </View>
                <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                  <Text style={theme}>
                    ${order.orderTotal}
                  </Text>
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
                <Text style={[styles.bottomActionButton, styles.actionButton]}>
                  {t('submitOrder')}
                </Text>
              </TouchableOpacity>
            )}

            {!['SETTLED', 'REFUNDED'].includes(order.state) && (
              <DeleteBtn
                handleDeleteAction={() => handleDelete(order.orderId, () => NavigationService.navigate('TablesSrc'))}
              />
            )}

            {["IN_PROCESS"].includes(order.state) && (
              <TouchableOpacity
                onPress={() => {
                  this.handleDeliver(order.orderId)
                }}
              >
                <Text style={[styles.bottomActionButton, styles.secondActionButton]}>{t('deliverOrder')}</Text>
              </TouchableOpacity>

            )}

            {order.state === 'DELIVERED' && (
              <TouchableOpacity
                onPress={() =>
                  order.lineItems.length === 0
                    ? warningMessage(t('lineItemCountCheck'))
                    : this.props.navigation.navigate('Payment', {
                      order: order
                    })
                }
              >
                <Text style={[styles.bottomActionButton, styles.secondActionButton]}>{t('payOrder')}</Text>
              </TouchableOpacity>

            )}

            {order.state === 'SETTLED' && (
              <TouchableOpacity
                onPress={() => this.handleComplete(order.orderId)}
              >
                <Text style={[styles.bottomActionButton, styles.secondActionButton]}>{t('completeOrder')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    )
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  clearOrder: () => dispatch(clearOrder(props.order.orderId)),
  getOrder: id => dispatch(getOrder(id)),
  getfetchOrderInflights: () => dispatch(getfetchOrderInflights()),
  getOrdersByDateRange: () => dispatch(getOrdersByDateRange())
})

export default connect(
  null,
  mapDispatchToProps
)(OrdersSummaryRow)

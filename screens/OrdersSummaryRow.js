import React from 'react'
import { ScrollView, Text, View, TouchableOpacity, Dimensions } from 'react-native'
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
  warningMessage, dispatchFetchRequest
} from '../constants/Backend'
import styles, {mainThemeColor} from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import {CheckBox, Tooltip} from 'react-native-elements'
import BackBtnCustom from "../components/BackBtnCustom";
import ScreenHeader from "../components/ScreenHeader";
import OrderTopInfo from "./OrderTopInfo";

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
        total: 'Total',
        serviceCharge: 'Service Charge',
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
        total: '總計',
        serviceCharge: '服務費',
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
      <Tooltip popover={tooltip} height={120} width={200} backgroundColor={mainThemeColor}>
        <View>
          {state === 'OPEN' && <Text>{t('stateTip.open.display')}</Text>}
          {['IN_PROCESS', 'ALREADY_IN_PROCESS'].includes(state) && (
            <Text>{t('stateTip.inProcess.display')}</Text>
          )}
          {state === 'DELIVERED' && (
            <Text>{t('stateTip.delivered.display')}</Text>
          )}
          {state === 'SETTLED' && <Text>{t('stateTip.settled.display')}</Text>}
        </View>
      </Tooltip>
    )
  }

  handleCancel = orderId => {
    this.props.clearOrder(orderId)
    this.props.navigation.navigate('TablesSrc')
  }

  handleDeleteLineItem = (orderId, lineItemId) => {
    makeFetchRequest(token => {
      fetch(`${api.apiRoot}/orders/${orderId}/lineitems/${lineItemId}`, {
        method: 'PATCH',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token.access_token
        },
        body: JSON.stringify({ quantity: 0 })
      })
        .then(response => {
          if (response.status === 200) {
            successMessage('Deleted')
            this.props.navigation.navigate('OrdersSummary')
            this.props.getOrder(this.props.order.orderId)
          } else {
            errorAlert(response)
          }
        })
        .catch(error => {
          console.error(error)
        })
    })
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
      warningMessage(this.context.t('selectItemToDeliver'))
      return
    }

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

  handleComplete = id => {
    const formData = new FormData()
    formData.append('action', 'COMPLETE')

    dispatchFetchRequest(api.order.process(id), {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {},
        body: formData
      },
      response => {
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
      handleDelete,
      initialValues
    } = this.props

    const { t } = this.context

    return (
      <ScrollView scrollIndicatorInsets={{right: 1}} contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.fullWidthScreen}>
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
                                    orderId: order.orderId,
                                    onSubmit: this.props.navigation.state.params.onSubmit,
                                    handleDelete: this.props.navigation.state.params.handleDelete
                                  })
                                }
                              />
                            )
                          }
            />

            <OrderTopInfo order={order}/>

            <View style={[styles.sectionBar]}>
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
                  <View style={styles.rowFront}>
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
                            <Text style={{textAlign: 'left'}}>
                              {data.item.productName}
                            </Text>
                          </View>
                        </View>

                        <View style={[styles.tableCellView, {flex: 2}]}>
                          <Text>{data.item.quantity}</Text>
                        </View>

                        <View style={[styles.tableCellView, {flex: 3}]}>
                          <Text>${data.item.price}</Text>
                        </View>

                        <View style={[styles.tableCellView, {flex: 3}]}>
                          <Text>${data.item.subTotal.amountWithTax}</Text>
                        </View>
                        <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-end'}]}>
                          {this.renderStateToolTip(data.item.state, t)}
                        </View>
                      </View>
                      <View>
                        <Text style={{textAlign: 'left', marginLeft: 15}}>
                          {data.item.options}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
                keyExtractor={(data, rowMap) => rowMap.toString()}
                renderHiddenItem={(data, rowMap) => (
                  <View style={[styles.rowBack, styles.standalone]} key={rowMap}>
                    <View style={styles.editIcon}>
                      <Icon
                        name="md-create"
                        size={25}
                        color="#fff"
                        onPress={() =>
                          this.props.navigation.navigate('LIneItemEdit', {
                            lineItemId: data.item.lineItemId,
                            orderId: order.orderId,
                            initialValues: data.item
                          })
                        }
                      />
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
                )}
                leftOpenValue={0}
                rightOpenValue={-80}
              />
            </View>

            <View>
              <View style={[styles.tableRowContainerWithBorder]}>
                <View style={[styles.tableCellView, {flex: 1}]}>
                  <Text>{t('serviceCharge')}</Text>
                </View>
                <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                  <Text style={{}}>
                    ${order.serviceCharge}
                  </Text>
                </View>
              </View>

              <View style={[styles.tableRowContainerWithBorder]}>
                <View style={[styles.tableCellView, {flex: 1}]}>
                  <Text>{t('total')}</Text>
                </View>
                <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                  <Text>
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
                    : this.props.navigation.state.params.onSubmit(order.orderId)
                }
              >
                <Text style={[styles.bottomActionButton, styles.actionButton]}>
                  {t('submitOrder')}
                </Text>
              </TouchableOpacity>
            )}

            {!['SETTLED', 'REFUNDED'].includes(order.state) && (
              <DeleteBtn
                handleDeleteAction={() => this.props.navigation.state.params.handleDelete(order.orderId)}
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

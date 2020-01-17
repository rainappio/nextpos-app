import React from 'react'
import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
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
  warningMessage
} from '../constants/Backend'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import { Tooltip } from 'react-native-elements'

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
            display: 'PREP',
            note: 'Preparing order'
          },
          delivered: {
            display: 'SENT',
            note: 'Order is delivered'
          },
          settled: {
            display: 'PAID',
            note: 'Order is paid'
          }
        },
        total: 'Total',
        serviceCharge: 'Service Charge',
        submitOrder: 'Submit',
        backToTables: 'Back to Tables',
        deleteOrder: 'Delete',
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
            display: '已送單',
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
        submitOrder: '送單',
        backToTables: '回到座位區',
        deleteOrder: '刪除',
        deliverOrder: '送餐完畢',
        payOrder: '付款',
        completeOrder: '結束訂單'
      }
    })

    this.state = {
      t: context.t
    }

    console.debug(`order summary order id: ${this.props.order.orderId}`)
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
      <Tooltip popover={tooltip} height={120} width={200}>
        <View>
          {state === 'OPEN' && <Text>{t('stateTip.open.display')}</Text>}
          {state === 'IN_PROCESS' ||
            (state === 'ALREADY_IN_PROCESS' && (
              <Text>{t('stateTip.inProcess.display')}</Text>
            ))}
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

  handleComplete = id => {
    makeFetchRequest(token => {
      const formData = new FormData()
      formData.append('action', 'COMPLETED')
      fetch(`${api.apiRoot}/orders/${id}/process?action=COMPLETE`, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          Authorization: 'Bearer ' + token.access_token
        },
        body: formData
      })
        .then(response => response.json())
        .then(res => {
          if (res) {
            this.props.navigation.navigate('TablesSrc')
            this.props.getfetchOrderInflights()
            this.props.clearOrder(id)
            this.props.getOrdersByDateRange()
          } else {
            alert(res.message === undefined ? 'pls try again' : res.message)
          }
        })
        .catch(error => {
          console.error(error)
        })
    })
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

    const { t } = this.state

    return (
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        <View
          style={{
            marginTop: 62,
            marginLeft: 35,
            marginRight: 35,
            marginBottom: 30
          }}
        >
          <BackBtn />
          <Text
            style={[
              styles.welcomeText,
              styles.orange_color,
              styles.textMedium,
              styles.textBold
            ]}
          >
            {t('orderSummaryTitle')}
          </Text>

          <View style={[styles.flex_dir_row, { alignItems: 'center' }]}>
            <View style={[styles.quarter_width]}>
              <View>
                <Text
                  style={[
                    styles.paddingTopBtn8,
                    styles.textBig,
                    styles.orange_color
                  ]}
                >
                  {order.tableInfo != null && order.tableInfo.tableName}
                </Text>
              </View>
            </View>

            <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
              <View>
                <FontAwesomeIcon
                  name="user"
                  size={25}
                  color="#f18d1a"
                  style={[styles.centerText]}
                >
                  <Text style={[styles.textBig, styles.orange_color]}>
                    &nbsp;
                    {!this.props.navigation.state.params.customerCount
                      ? order.demographicData.male +
                        order.demographicData.female +
                        order.demographicData.kid
                      : this.props.navigation.state.params.customerCount}
                  </Text>
                </FontAwesomeIcon>
              </View>
            </View>

            <View style={[styles.fullhalf_width, styles.mgr_20]}>
              <TouchableOpacity>
                <View>
                  <Text style={[styles.toRight, styles.mgr_20]}>
                    {t('staff')} - {order.servedBy}
                  </Text>
                  <Text style={[styles.toRight, styles.mgr_20]}>
                    {formatDate(order.createdDate)}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.orange_bg,
            styles.flex_dir_row,
            styles.shoppingBar,
            styles.paddLeft20,
            styles.paddRight20,
            styles.top40
          ]}
        >
          <View style={[styles.oneFifthWidth, styles.jc_alignIem_center]}>
            <TouchableOpacity>
              <Text style={[styles.paddingTopBtn8, styles.whiteColor]}>
                {t('product')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.oneFifthWidth, styles.jc_alignIem_center]}>
            <TouchableOpacity>
              <Text style={[styles.whiteColor]}>
                &nbsp;&nbsp;{t('quantity')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.oneFifthWidth, styles.jc_alignIem_center]}>
            <TouchableOpacity>
              <Text style={styles.whiteColor}>{t('unitPrice')}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.oneFifthWidth, styles.jc_alignIem_center]}>
            <TouchableOpacity>
              <Text style={styles.whiteColor}>{t('subTotal')}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.oneFifthWidth, styles.jc_alignIem_center]}>
            <TouchableOpacity>
              <Text style={styles.whiteColor}>{t('state')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.container]}>
          <Text style={styles.textBold}>{order.orderId}</Text>
          {order.state !== 'SETTLED' && (
            <AddBtn
              onPress={() =>
                this.props.navigation.navigate('OrderFormII', {
                  orderId: order.orderId,
                  onSubmit: this.props.navigation.state.params.onSubmit,
                  handleDelete: this.props.navigation.state.params.handleDelete
                })
              }
            />
          )}

          <View style={styles.standalone}>
            <SwipeListView
              data={order.lineItems}
              renderItem={(data, rowMap) => (
                <View style={styles.rowFront}>
                  <View key={rowMap}>
                    <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
                      <View style={[styles.oneFifthWidth]}>
                        <Text style={{ textAlign: 'left' }}>
                          {data.item.productName}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.oneFifthWidth,
                          styles.jc_alignIem_center
                        ]}
                      >
                        <Text>&nbsp;&nbsp;{data.item.quantity}</Text>
                      </View>

                      <View
                        style={[
                          styles.oneFifthWidth,
                          styles.jc_alignIem_center
                        ]}
                      >
                        <Text>${data.item.price}</Text>
                      </View>

                      <View
                        style={[
                          styles.oneFifthWidth,
                          styles.jc_alignIem_center
                        ]}
                      >
                        <Text>${data.item.subTotal.amountWithTax}</Text>
                      </View>
                      <View
                        style={[
                          styles.oneFifthWidth,
                          styles.jc_alignIem_center
                        ]}
                      >
                        {this.renderStateToolTip(data.item.state, t)}
                      </View>
                    </View>
                    <View style={[styles.mgrbtn20]}>
                      <Text style={{ textAlign: 'left', marginLeft: 4 }}>
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
                      screenProps={
                        this.props.navigation.state.params.screenProps
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

          <View
            style={[styles.flex_dir_row, styles.grayBg, styles.paddingTopBtn8]}
          >
            <View style={[styles.half_width]}>
              <Text>{t('total')}</Text>
            </View>
            <View style={[styles.half_width]}>
              <Text style={{ textAlign: 'right', marginRight: -26 }}>
                ${order.total.amountWithTax}
              </Text>
            </View>
          </View>

          <View
            style={[styles.flex_dir_row, styles.grayBg, styles.paddingTopBtn8]}
          >
            <View style={[styles.half_width]}>
              <Text>{t('serviceCharge')}</Text>
            </View>
            <View style={[styles.half_width]}>
              <Text style={{ textAlign: 'right', marginRight: -26 }}>
                ${order.serviceCharge}
              </Text>
            </View>
          </View>

          {order.state === 'OPEN' ? (
            <View
              style={{
                width: '100%',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#F39F86',
                backgroundColor: '#F39F86',
                marginRight: '2%',
                marginTop: 22
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  order.lineItems.length === 0
                    ? warningMessage(
                        'At Least One Order Item Need To Proceed..'
                      )
                    : this.props.navigation.state.params.onSubmit(order.orderId)
                }
              >
                <Text style={[styles.signInText, styles.whiteColor]}>
                  {t('submitOrder')}
                </Text>
              </TouchableOpacity>
            </View>
          ) : order.state === 'IN_PROCESS' ? (
            <View
              style={{
                width: '100%',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#F39F86',
                backgroundColor: '#F39F86',
                marginRight: '2%',
                marginTop: 22
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.state.params.onSubmit(order.orderId)
                }
                //onPress={this.props.handleSubmit}
              >
                <Text style={[styles.signInText, styles.whiteColor]}>
                  {t('submitOrder')}
                </Text>
              </TouchableOpacity>
            </View>
          ) : order.state === 'DELIVERED' ? (
            <View
              style={{
                width: '100%',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#F39F86',
                backgroundColor: '#F39F86',
                marginRight: '2%',
                marginTop: 22
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.state.params.onSubmit(order.orderId)
                }
                disabled={true}
              >
                <Text style={[styles.signInText, styles.whiteColor]}>
                  {t('submitOrder')}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <View
            style={{
              width: '100%',
              borderRadius: 4,
              borderWidth: 1,
              borderColor: '#F39F86',
              marginTop: 8
            }}
          >
            <TouchableOpacity onPress={() => this.handleCancel(order.orderId)}>
              <Text style={styles.signInText}>{t('backToTables')}</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: '100%',
              borderRadius: 4,
              borderWidth: 1,
              borderColor: '#F39F86',
              marginTop: 8
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.state.params.handleDelete(order.orderId)
              }}
            >
              <Text style={styles.signInText}>{t('deleteOrder')}</Text>
            </TouchableOpacity>
          </View>

          {order.state !== 'SETTLED' &&
            order.state !== 'DELIVERED' &&
            order.state !== 'OPEN' && (
              <View
                style={{
                  width: '100%',
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: '#F39F86',
                  marginTop: 8
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.state.params.handleDeliver(
                      order.orderId
                    )
                  }}
                >
                  <Text style={styles.signInText}>{t('deliverOrder')}</Text>
                </TouchableOpacity>
              </View>
            )}

          {order.state === 'DELIVERED' && (
            <View
              style={{
                width: '100%',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#F39F86',
                marginTop: 8
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  order.lineItems.length === 0
                    ? warningMessage('At Least One Order Item Need Proceed..')
                    : this.props.navigation.navigate('Payment', {
                        order: order
                      })
                }
              >
                <Text style={styles.signInText}>{t('payOrder')}</Text>
              </TouchableOpacity>
            </View>
          )}

          {order.state === 'SETTLED' && (
            <View
              style={{
                width: '100%',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#F39F86',
                marginTop: 8
              }}
            >
              <TouchableOpacity
                onPress={() => this.handleComplete(order.orderId)}
              >
                <Text style={styles.signInText}>{t('completeOrder')}</Text>
              </TouchableOpacity>
            </View>
          )}
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

import React from 'react'
import {Text, TouchableOpacity, View, Alert} from 'react-native'
import {getTimeDifference} from '../actions'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import styles from '../styles'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import {Tooltip} from "react-native-elements";
import {LocaleContext} from "../locales/LocaleContext";
import {renderOrderState} from "../helpers/orderActions";
import {StyledText} from "../components/StyledText";
import {translate} from 'i18n-js'

class OrderItem extends React.PureComponent {
  static contextType = LocaleContext

  render() {
    const {
      order,
      navigation,
      handleOrderSubmit,
      handleDelete,
      tableTimeLimit,
      isTimeLimit,
      historyOrder
    } = this.props
    const {t, isTablet, customMainThemeColor, customBackgroundColor} = this.context

    const timeDifference = getTimeDifference(order.createdTime)
    const thirtyMinutes = 30 * 60 * 1000
    const costomTimeZone = tableTimeLimit * 60 * 1000


    TimeAgo.addLocale(en)
    const timeAgo = new TimeAgo()
    let timeDisplayColor = '#888'
    let timeLimitBgColor = timeDifference > costomTimeZone ? '#FEE9D7' : customBackgroundColor

    if (customBackgroundColor == '#222222') {
      timeLimitBgColor = timeDifference > costomTimeZone ? '#B85543' : customBackgroundColor
    }

    if (['OPEN', 'IN_PROCESS'].includes(order.state)) {
      timeDisplayColor = timeDifference < thirtyMinutes ? customMainThemeColor : '#f75336'
    }

    if (!!order?.tables && order?.tables?.length > 0) {
      return (
        <>
          {order.tables.map((table, index) => {
            return (
              <View key={index} style={[styles.tableRowContainerWithBorder, isTimeLimit && {backgroundColor: timeLimitBgColor}]}>
                <TouchableOpacity
                  style={[{flexDirection: 'row', flex: 9, marginLeft: 3}]}
                  key={order.orderId}
                  onPress={() => {

                    order.state === 'PAYMENT_IN_PROCESS'
                      ? Alert.alert(
                        `${t('tableVisual.isPayingTitle')}`,
                        `${t('tableVisual.isPayingMsg')}`,
                        [
                          {
                            text: `${t('action.yes')}`,
                            onPress: () => {
                              this.props.navigation.navigate('Payment', {
                                order: order
                              })
                            }
                          },
                          {
                            text: `${t('action.no')}`,
                            onPress: () => console.log('Cancelled'),
                            style: 'cancel'
                          }
                        ]
                      )
                      : isTablet ? navigation.navigate('OrderFormII', {
                        orderId: order.orderId,
                        orderState: order.state
                      }) : navigation.navigate('OrdersSummary', {
                        orderId: order.orderId,
                        onSubmit: handleOrderSubmit,
                        handleDelete: handleDelete,
                        orderState: order.state
                      })



                  }
                  }
                >
                  <View style={[styles.tableCellView, {flex: 5}]}>
                    <StyledText style={historyOrder?.orderId == order?.orderId && {fontWeight: 'bold'}}>{order.orderType === 'IN_STORE' ? table.tableName : t('order.takeOut')} ({order.serialId})</StyledText>
                  </View>

                  <View style={[styles.tableCellView, {flex: 2}]}>
                    <StyledText>
                      ${order.orderTotal}
                    </StyledText>
                  </View>

                  <View style={[styles.tableCellView, {flex: 3}]}>
                    <FontAwesomeIcon name={'clock-o'} color={timeDisplayColor} size={20} />
                    <StyledText style={{marginLeft: 2}}>
                      {timeAgo.format(Date.now() - timeDifference, 'time')}
                    </StyledText>
                  </View>
                </TouchableOpacity>

                <View style={[styles.tableCellView, {justifyContent: 'center', flex: 1}]}>
                  <Tooltip popover={<Text style={{color: customBackgroundColor}}>{this.context.t(`orderState.${order.state}`)}</Text>}
                    backgroundColor={customMainThemeColor}
                  >
                    {renderOrderState(order.state, customMainThemeColor)}
                  </Tooltip>
                </View>
              </View>
            )
          })}
        </>
      )
    } else {
      return (
        <View style={[styles.tableRowContainerWithBorder]}>
          <TouchableOpacity
            style={[{flexDirection: 'row', flex: 9, marginLeft: 3}]}
            key={order.orderId}
            onPress={() => {

              order.state === 'PAYMENT_IN_PROCESS'
                ? Alert.alert(
                  `${t('tableVisual.isPayingTitle')}`,
                  `${t('tableVisual.isPayingMsg')}`,
                  [
                    {
                      text: `${t('action.yes')}`,
                      onPress: () => {
                        this.props.navigation.navigate('Payment', {
                          order: order
                        })
                      }
                    },
                    {
                      text: `${t('action.no')}`,
                      onPress: () => console.log('Cancelled'),
                      style: 'cancel'
                    }
                  ]
                )
                : isTablet ? navigation.navigate('OrderFormII', {
                  orderId: order.orderId,
                  orderState: order.state
                }) : navigation.navigate('OrdersSummary', {
                  orderId: order.orderId,
                  onSubmit: handleOrderSubmit,
                  handleDelete: handleDelete,
                  orderState: order.state
                })



            }
            }
          >
            <View style={[styles.tableCellView, {flex: 5}]}>
              <StyledText>{order.orderType === 'IN_STORE' ? order.tableName : t('order.takeOut')} ({order.serialId})</StyledText>
            </View>

            <View style={[styles.tableCellView, {flex: 2}]}>
              <StyledText>
                ${order.orderTotal}
              </StyledText>
            </View>

            <View style={[styles.tableCellView, {flex: 3}]}>
              <FontAwesomeIcon name={'clock-o'} color={timeDisplayColor} size={20} />
              <StyledText style={{marginLeft: 2}}>
                {timeAgo.format(Date.now() - timeDifference, 'time')}
              </StyledText>
            </View>
          </TouchableOpacity>

          <View style={[styles.tableCellView, {justifyContent: 'center', flex: 1}]}>
            <Tooltip popover={<Text style={{color: customBackgroundColor}}>{this.context.t(`orderState.${order.state}`)}</Text>}
              backgroundColor={customMainThemeColor}
            >
              {renderOrderState(order.state, customMainThemeColor)}
            </Tooltip>
          </View>
        </View>
      )
    }
  }
}

export default OrderItem

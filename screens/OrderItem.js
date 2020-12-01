import React from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import {getTimeDifference} from '../actions'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import styles, {mainThemeColor} from '../styles'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import {Tooltip} from "react-native-elements";
import {LocaleContext} from "../locales/LocaleContext";
import {renderOrderState} from "../helpers/orderActions";
import {StyledText} from "../components/StyledText";

class OrderItem extends React.PureComponent {
  static contextType = LocaleContext

  render() {
    const {
      order,
      navigation,
      handleOrderSubmit,
      handleDelete
    } = this.props
    const {t, isTablet} = this.context

    const timeDifference = getTimeDifference(order.createdTime)
    const thirtyMinutes = 30 * 60 * 1000

    TimeAgo.addLocale(en)
    const timeAgo = new TimeAgo()
    let timeDisplayColor = '#888'

    if (['OPEN', 'IN_PROCESS'].includes(order.state)) {
      timeDisplayColor = timeDifference < thirtyMinutes ? mainThemeColor : 'red'
    }

    if (!!order?.tables && order?.tables?.length > 0) {
      return (
        <>
          {order.tables.map((table) => {
            return (
              <View style={[styles.tableRowContainerWithBorder]}>
                <TouchableOpacity
                  style={[{flexDirection: 'row', flex: 9, marginLeft: 3}]}
                  key={order.orderId}
                  onPress={() => {
                    if (isTablet) {
                      navigation.navigate('OrderFormII', {
                        orderId: order.orderId,
                        orderState: order.state
                      })
                    } else {
                      navigation.navigate('OrdersSummary', {
                        orderId: order.orderId,
                        onSubmit: handleOrderSubmit,
                        handleDelete: handleDelete,
                        orderState: order.state
                      })
                    }

                  }
                  }
                >
                  <View style={[styles.tableCellView, {flex: 5}]}>
                    <StyledText>{order.orderType === 'IN_STORE' ? table.tableName : t('order.takeOut')} ({order.serialId})</StyledText>
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
                  <Tooltip popover={<Text>{this.context.t(`orderState.${order.state}`)}</Text>}
                    backgroundColor={mainThemeColor}
                  >
                    {renderOrderState(order.state)}
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
              if (isTablet) {
                navigation.navigate('OrderFormII', {
                  orderId: order.orderId,
                  orderState: order.state
                })
              } else {
                navigation.navigate('OrdersSummary', {
                  orderId: order.orderId,
                  onSubmit: handleOrderSubmit,
                  handleDelete: handleDelete,
                  orderState: order.state
                })
              }

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
            <Tooltip popover={<Text>{this.context.t(`orderState.${order.state}`)}</Text>}
              backgroundColor={mainThemeColor}
            >
              {renderOrderState(order.state)}
            </Tooltip>
          </View>
        </View>
      )
    }
  }
}

export default OrderItem

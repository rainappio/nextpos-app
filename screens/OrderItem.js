import React from 'react'
import {Image, Text, TouchableOpacity, View} from 'react-native'
import {getTimeDifference} from '../actions'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import Icon from 'react-native-vector-icons/Ionicons'
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import styles, {mainThemeColor} from '../styles'
import images from '../assets/images'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import {Tooltip} from "react-native-elements";
import {LocaleContext} from "../locales/LocaleContext";

class OrderItem extends React.PureComponent {
  static contextType = LocaleContext

  render() {
    const {
      order,
      navigation,
      handleOrderSubmit,
      handleDelete
    } = this.props
    const timeDifference = getTimeDifference(order.createdTime)
    const thirtyMinutes = 30 * 60 * 1000

    TimeAgo.addLocale(en)
    const timeAgo = new TimeAgo()
    let timeDisplayColor = '#888'

    if (['OPEN', 'IN_PROCESS'].includes(order.state)) {
      timeDisplayColor = timeDifference < thirtyMinutes ? '#f18d1a' : 'red'
    }

    return (
      <View style={styles.tableRowContainer}>
        <TouchableOpacity
          style={[{flexDirection: 'row', flex: 9}]}
          key={order.orderId}
          onPress={() =>
            navigation.navigate('OrdersSummary', {
              orderId: order.orderId,
              onSubmit: handleOrderSubmit,
              handleDelete: handleDelete,
              orderState: order.state
            })
          }
        >
          <View style={[styles.tableCellView, {flex: 2}]}>
            <Text>{order.orderType === 'IN_STORE' ? order.tableName : 'Take Out'}</Text>
          </View>

          <View style={[styles.tableCellView, {flex: 1}]}>
            <FontAwesomeIcon name={'user'} color="#ccc" size={20}/>
            <Text style={{marginLeft: 5}}>
              {order.customerCount}
            </Text>
          </View>

          <View style={[styles.tableCellView, {flex: 2}]}>
            <Text>
              ${order.total.amount}
            </Text>
          </View>

          <View style={[styles.tableCellView, {flex: 3}]}>
            <FontAwesomeIcon name={'clock-o'} color={timeDisplayColor} size={20}/>
            <Text style={{marginLeft: 2}}>
              {timeAgo.format(Date.now() - timeDifference, 'time')}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={[styles.tableCellView, {flex: 1}]}>
          <Tooltip popover={<Text>{this.context.t(`orderState.${order.state}`)}</Text>}
                   backgroundColor={mainThemeColor}
          >
            {order.state === 'OPEN' ? (
              <Image source={images.order} style={{width: 15, height: 20}}/>
            ) : order.state === 'IN_PROCESS' ? (
              <Image source={images.process} style={{width: 30, height: 20}}/>
            ) : order.state === 'SETTLED' ? (
              <Icon
                name={'md-checkmark-circle-outline'}
                color="#4cbb17"
                size={25}
                style={{fontWeight: 'bold'}}
              />
            ) : order.state === 'DELIVERED' ? (
              <MCIcon
                name={'truck-delivery'}
                size={25}
                style={{fontWeight: 'bold'}}
                color="#f18d1a"
              />
            ) : (
              order.state === 'COMPLETED' && (
                <Image
                  source={images.completed}
                  style={{width: 28, height: 20}}
                />
              )
            )}
          </Tooltip>
        </View>
      </View>
    )
  }
}

export default OrderItem

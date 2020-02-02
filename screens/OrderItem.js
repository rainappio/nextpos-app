import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import {getTimeDifference, isTablet} from '../actions'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import Icon from 'react-native-vector-icons/Ionicons'
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import styles from '../styles'
import images from '../assets/images'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

class OrderItem extends React.PureComponent {
  render() {
    const {
      order,
      navigation,
      handleOrderSubmit,
      handleDelete,
      handleDeliver
    } = this.props
    const timeDifference = getTimeDifference(order.createdTime)
    const thirtyMinutes = 30 * 60 * 1000

    TimeAgo.addLocale(en)
    const timeAgo = new TimeAgo()

    return (
      <TouchableOpacity
        style={[
          styles.flex_dir_row,
          styles.marginLeftRight35,
          styles.paddingTopBtn8,
          styles.borderBottomLine
        ]}
        key={order.orderId}
        onPress={() =>
          navigation.navigate('OrdersSummary', {
            orderId: order.orderId,
            onSubmit: handleOrderSubmit,
            handleDelete: handleDelete,
            orderState: order.state,
            tableName: order.tableName,
            handleDeliver: handleDeliver
          })
        }
      >
        <View style={{ width: '20%' }}>
          <View>
            <Text style={{ paddingTop: 3 }}>{order.tableName}&nbsp;</Text>
          </View>
        </View>

        <View style={{ width: '15%' }}>
          <View>
            <FontAwesomeIcon name={'user'} color="#ccc" size={isTablet ? 40 : 20}>
              <Text style={[{color: '#000'}, styles.textSmall]}>
                &nbsp;{order.customerCount}
              </Text>
            </FontAwesomeIcon>
          </View>
        </View>

        <View style={{ width: '40%' }}>
          {(order.state === 'OPEN' || order.state === 'IN_PROCESS') &&
            (timeDifference < thirtyMinutes ? (
              <FontAwesomeIcon name={'clock-o'} color="#f18d1a" size={isTablet ? 40 : 20}>
                 <Text style={styles.textSmall}>
                  &nbsp;&nbsp;
                  {timeAgo.format(Date.now() - timeDifference)}
                </Text>
              </FontAwesomeIcon>
            ) : timeDifference >= thirtyMinutes ? (
              <FontAwesomeIcon name={'clock-o'} color="red" size={isTablet ? 40 : 20}>
                 <Text style={styles.textSmall}>
                  &nbsp;&nbsp;
                  {timeAgo.format(Date.now() - timeDifference)}
                </Text>
              </FontAwesomeIcon>
            ) : null)}

          {(order.state === 'SETTLED' || order.state === 'DELIVERED') && (
            <FontAwesomeIcon name={'clock-o'} color="#888" size={isTablet ? 40 : 20}>
               <Text style={styles.textSmall}>
                &nbsp;&nbsp;
                {timeAgo.format(Date.now() - timeDifference)}
              </Text>
            </FontAwesomeIcon>
          )}
        </View>

        <View>
          {order.state === 'OPEN' ? (
            <Image source={images.order} style={styles.openImg} />
          ) : order.state === 'IN_PROCESS' ? (
            <Image source={images.process} style={styles.inProcessImg} />
          ) : order.state === 'SETTLED' ? (
            <Icon
              name={'md-checkmark-circle-outline'}
              color="#4cbb17"
              size={isTablet ? 40 : 25}
              style={{ marginRight: 2, fontWeight: 'bold' }}
            />
          ) : order.state === 'DELIVERED' ? (
            <MCIcon
              name={'truck-delivery'}
              size={isTablet ? 40 : 25}
              style={{ marginRight: 2, fontWeight: 'bold' }}
              color="#f18d1a"
            />
          ) : (
            order.state === 'COMPLETED' && (
              <Image
                source={images.completed}
                style={{ width: 28, height: 20 }}
              />
            )
          )}
        </View>
        <Text
         style={[{
              color: '#000',
              paddingTop: 6,
              fontSize: 12
            }]}
        >
          &nbsp;{order.state}
        </Text>
      </TouchableOpacity>
    )
  }
}

export default OrderItem

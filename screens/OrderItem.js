import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { get_time_diff } from '../actions'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import styles from '../styles'
import images from '../assets/images'

class OrderItem extends React.PureComponent {
  render() {
    const {
      order,
      navigation,
      handleOrderSubmit,
      handleDelete,
      tableId,
      handleDeliver
    } = this.props
    var timeDifference = get_time_diff(order.createdTime)

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
            tableId: tableId,
            orderState: order.state,
            tableName: order.tableName,
            handleDeliver: handleDeliver
          })
        }
      >
        <View style={{ marginRight: 15 }}>
          <View>
            <Text style={{ paddingTop: 3 }}>{order.tableName}</Text>
          </View>
        </View>

        <View style={{ marginRight: 15 }}>
          <View>
            <FontAwesomeIcon name={'user'} color="#ccc" size={20}>
              <Text style={{ color: '#000', fontSize: 12 }}>
                &nbsp;&nbsp;{order.customerCount}
              </Text>
            </FontAwesomeIcon>
          </View>
        </View>

        <View style={{ width: '32%' }}>
          <View>
            {timeDifference < 29 ? (
              <FontAwesomeIcon name={'clock-o'} color="#f18d1a" size={20}>
                <Text style={{ fontSize: 12 }}>
                  &nbsp;&nbsp;{timeDifference + ' min'}
                </Text>
              </FontAwesomeIcon>
            ) : timeDifference < 60 ? (
              <FontAwesomeIcon name={'clock-o'} color="red" size={20}>
                <Text style={{ fontSize: 12 }}>
                  &nbsp;&nbsp;{Math.floor(timeDifference % 60) + ' min'}
                </Text>
              </FontAwesomeIcon>
            ) : timeDifference < 1440 ? (
              <FontAwesomeIcon name={'clock-o'} color="red" size={20}>
                <Text style={{ fontSize: 12 }}>
                  &nbsp;&nbsp;
                  {Math.floor(timeDifference / 60) +
                    'hr ' +
                    Math.floor(timeDifference % 60) +
                    'min'}
                </Text>
              </FontAwesomeIcon>
            ) : (
              timeDifference >= 1440 && (
                <FontAwesomeIcon name={'clock-o'} color="#888" size={20}>
                  <Text style={{ fontSize: 12 }}>
                    &nbsp;&nbsp;
                    {Math.floor(timeDifference / (60 * 24)) +
                      'day ' +
                      Math.floor((timeDifference % (60 * 24)) / 60) +
                      'hr ' +
                      Math.floor(((timeDifference % (60 * 24)) % 60) / 60) +
                      'min '}
                  </Text>
                </FontAwesomeIcon>
              )
            )}
          </View>
        </View>

        <View>
          {order.state === 'OPEN' ? (
            <Image source={images.order} style={{ width: 15, height: 20 }} />
          ) : order.state === 'IN_PROCESS' ? (
            <Image source={images.process} style={{ width: 30, height: 20 }} />
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
          style={{
            color: '#000',
            fontSize: 12,
            paddingTop: 6
          }}
        >
          &nbsp;{order.state}
        </Text>
      </TouchableOpacity>
    )
  }
}

export default OrderItem

import React from 'react'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlight,
  TextInput,
  ActivityIndicator,
  TouchableWithoutFeedback,
  AsyncStorage,
  RefreshControl,
  FlatList
} from 'react-native'
import { get_time_diff } from '../actions'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import styles from '../styles'
import images from '../assets/images'

class OrderItem extends React.PureComponent {
  render() {
    const { order, navigation, handleOrderSubmit, handleDelete } = this.props
    var timeDifference = get_time_diff(order.createdTime)
    return (
      <TouchableOpacity
        style={[
          styles.flex_dir_row,
          styles.marginLeftRight35,
          styles.paddingTopBtn8,
          styles.borderBottomLine
        ]}
        key={order.tableLayoutId}
        onPress={() =>
          navigation.navigate('OrdersSummary', {
            orderId: order.orderId,
            handleOrderSubmit: handleOrderSubmit,
            handleDelete: handleDelete
          })
        }
      >
        <View style={[styles.quarter_width]}>
          <TouchableOpacity>
            <View>
              <Text>
                {/*order.tableName*/}
                {order.orderId}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.quarter_width]}>
          <TouchableOpacity
          //onPress={() => this.props.navigation.navigate('Orders')}
          >
            <View>
              <FontAwesomeIcon name={'user'} color="#ccc" size={25}>
                <Text style={{ color: '#000', fontSize: 12 }}>
                  &nbsp;&nbsp;{order.customerCount}
                </Text>
              </FontAwesomeIcon>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.quarter_width]}>
          <TouchableOpacity
          //onPress={() => this.props.navigation.navigate('Orders')}
          >
            <View>
              {timeDifference < 29 ? (
                <FontAwesomeIcon name={'clock-o'} color="#f18d1a" size={25}>
                  <Text style={{ fontSize: 12 }}>
                    &nbsp;&nbsp;{timeDifference + ' min'}
                  </Text>
                </FontAwesomeIcon>
              ) : timeDifference >= 30 ? (
                <FontAwesomeIcon name={'clock-o'} color="red" size={25}>
                  <Text style={{ fontSize: 12 }}>
                    &nbsp;&nbsp;{timeDifference + ' min'}
                  </Text>
                </FontAwesomeIcon>
              ) : (
                timeDifference > 1440 && (
                  <FontAwesomeIcon name={'clock-o'} color="#f1f1f1" size={25}>
                    <Text style={{ fontSize: 12 }}>
                      &nbsp;&nbsp;{timeDifference + ' min'}
                    </Text>
                  </FontAwesomeIcon>
                )
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.quarter_width, styles.leftpadd20]}>
          <TouchableOpacity
          //onPress={() => this.props.navigation.navigate('Orders')}
          >
            {order.state === 'OPEN' ? (
              <Image source={images.order} />
            ) : order.state === 'IN_PROCESS' ? (
              <Image
                source={images.process}
                style={{ width: 30, height: 20 }}
              />
            ) : (
              order.state === 'COMPLETED' && (
                <Image
                  source={images.completed}
                  style={{ width: 30, height: 20 }}
                />
              )
            )}
          </TouchableOpacity>
        </View>
        <Text
          style={{
            color: '#000',
            fontSize: 12,
            marginLeft: -40
          }}
        >
          &nbsp;{order.state}
        </Text>
      </TouchableOpacity>
    )
  }
}

export default OrderItem

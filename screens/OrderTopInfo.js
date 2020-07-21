import React, {Component} from "react"
import {LocaleContext} from "../locales/LocaleContext";
import styles from "../styles";
import {Text, View, TouchableOpacity} from "react-native";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import {formatDate} from "../actions";
import { withNavigation } from 'react-navigation'

class OrderTopInfo extends Component {
  static contextType = LocaleContext

  render() {
    const {order} = this.props
    const { t } = this.context

    return (
      <View>
        <View style={[styles.tableRowContainer]}>
          <View style={[styles.tableCellView, {width: '35%'}]}>
            <View>
              <Text
                style={[
                  styles.paddingTopBtn8,
                  styles.textBig,
                  styles.orange_color
                ]}
              >
                {order.orderType === 'IN_STORE' ? order.tableDisplayName : t('order.takeOut')}
              </Text>
            </View>
          </View>

          <View style={[styles.tableCellView, {width: '15%'}]}>
            <TouchableOpacity
              onPress={() => {
                const originScreen = this.props.navigation.state.routeName
                const updateOrderRoute = originScreen ==='OrdersSummary' ? 'UpdateOrder' : 'UpdateOrderFromOrderDetail'
                this.props.navigation.navigate(updateOrderRoute, {
                  order: order
                })
              }}
            >
              <View>
                <FontAwesomeIcon
                  name="user"
                  size={25}
                  style={[styles.buttonIconStyle]}
                >
                  <Text style={[styles.textBig, styles.orange_color]}>
                    &nbsp;{order.demographicData != null ? order.demographicData.customerCount : 0}
                  </Text>
                </FontAwesomeIcon>
              </View>
            </TouchableOpacity>
          </View>

          <View style={[styles.tableCellView, { justifyContent: 'flex-end', width: '50%'}]}>
            <View>
              <Text style={{textAlign: 'right'}}>
                {t('order.staff')} - {order.servedBy}
              </Text>
              <Text>
                {formatDate(order.createdDate)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.tableRowContainer}>
          <Text>Order ID: </Text>
          <Text style={styles.tableCellText}>{order.serialId}</Text>
          {order.metadata.hasOwnProperty('copyFromOrderId') && order.metadata.hasOwnProperty('copyFromSerialId') && (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate({
                  routeName: 'OrderDetail',
                  params: {
                    orderId: order.metadata.copyFromOrderId
                  },
                  key: order.metadata.copyFromOrderId
                })
              }}>
              <Text>({t('order.copiedFrom')}: {order.metadata.copyFromSerialId})</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.tableRowContainer}>
          <Text>{t('order.orderStatusLong')}: </Text>
          <Text style={styles.tableCellText}>{t(`orderState.${order.state}`)}</Text>
        </View>

      </View>

    )
  }
}

export default withNavigation(OrderTopInfo)

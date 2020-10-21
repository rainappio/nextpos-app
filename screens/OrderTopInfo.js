import React, {Component} from "react"
import {LocaleContext} from "../locales/LocaleContext";
import styles from "../styles";
import {Text, TouchableOpacity, View} from "react-native";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import {formatDate} from "../actions";
import {withNavigation} from 'react-navigation'
import {StyledText} from "../components/StyledText";

class OrderTopInfo extends Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
    this.state = {
      isTablet: context?.isTablet,
    }

  }

  render() {
    const {order} = this.props
    const {t} = this.context

    if (this.state.isTablet) {
      return (
        <View>
          <View style={[styles.tableRowContainer]}>
            <View style={[styles.tableCellView, {width: '20%'}]}>
              <View>
                <Text style={[styles.primaryText]}>
                  {order.orderType === 'IN_STORE' ? order.tableDisplayName : t('order.takeOut')}
                </Text>
              </View>
            </View>

            <View style={[styles.tableCellView, {width: '20%'}]}>
              <TouchableOpacity>
                <View>
                  <FontAwesomeIcon
                    name="user"
                    size={25}
                    style={[styles.buttonIconStyle]}
                  >
                    <Text style={[styles.primaryText]}>
                      &nbsp;{order.demographicData != null ? order.demographicData.customerCount : 0}
                    </Text>
                  </FontAwesomeIcon>
                </View>
              </TouchableOpacity>
            </View>

            <View style={[styles.tableCellView, styles.justifyRight, {width: '30%'}]}>
              <View>
                <StyledText style={{textAlign: 'right'}}>
                  {t('order.staff')} - {order.servedBy}
                </StyledText>
                <StyledText>
                  {formatDate(order.createdDate)}
                </StyledText>
              </View>
            </View>

            <View style={{
              width: '30%', justifyContent: 'flex-end',
              alignItems: 'flex-end',
            }}>
              <View style={{flexDirection: 'row'}}>
                <StyledText>Order ID: </StyledText>
                <StyledText style={styles.tableCellText}>{order.serialId}</StyledText>
                {order?.metadata?.hasOwnProperty('copyFromOrderId') && order?.metadata?.hasOwnProperty('copyFromSerialId') && (
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
                    <StyledText>({t('order.copiedFrom')}: {order.metadata.copyFromSerialId})</StyledText>
                  </TouchableOpacity>
                )}
              </View>

              <View style={{flexDirection: 'row'}}>
                <StyledText>{t('order.orderStatusLong')}: </StyledText>
                <StyledText style={styles.tableCellText}>{t(`orderState.${order.state}`)}</StyledText>
              </View>
            </View>
          </View>

        </View>

      )
    }
    else {
      return (
        <View>
          <View style={[styles.tableRowContainer]}>
            <View style={[styles.tableCellView, {width: '35%'}]}>
              <View>
                <Text style={[styles.primaryText]}>
                  {order.orderType === 'IN_STORE' ? order.tableDisplayName : t('order.takeOut')}
                </Text>
              </View>
            </View>

            <View style={[styles.tableCellView, {width: '15%'}]}>
              <TouchableOpacity
                onPress={() => {
                  const originScreen = this.props.navigation.state.routeName
                  const updateOrderRoute = originScreen === 'OrdersSummary' ? 'UpdateOrder' : 'UpdateOrderFromOrderDetail'
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
                    <Text style={[styles.primaryText]}>
                      &nbsp;{order.demographicData != null ? order.demographicData.customerCount : 0}
                    </Text>
                  </FontAwesomeIcon>
                </View>
              </TouchableOpacity>
            </View>

            <View style={[styles.tableCellView, styles.justifyRight, {width: '50%'}]}>
              <View>
                <StyledText style={{textAlign: 'right'}}>
                  {t('order.staff')} - {order.servedBy}
                </StyledText>
                <StyledText>
                  {formatDate(order.createdDate)}
                </StyledText>
              </View>
            </View>
          </View>

          <View style={styles.tableRowContainer}>
            <StyledText>Order ID: </StyledText>
            <StyledText style={styles.tableCellText}>{order.serialId}</StyledText>
            {order?.metadata?.hasOwnProperty('copyFromOrderId') && order?.metadata?.hasOwnProperty('copyFromSerialId') && (
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
                <StyledText>({t('order.copiedFrom')}: {order.metadata.copyFromSerialId})</StyledText>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.tableRowContainer}>
            <StyledText>{t('order.orderStatusLong')}: </StyledText>
            <StyledText style={styles.tableCellText}>{t(`orderState.${order.state}`)}</StyledText>
          </View>

        </View>

      )
    }

  }
}

export default withNavigation(OrderTopInfo)

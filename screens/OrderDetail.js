import React from 'react'
import { Field, reduxForm } from 'redux-form'
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
  FlatList,
  ActivityIndicator,
  Modal
} from 'react-native'
import { connect } from 'react-redux'
import InputText from '../components/InputText'
import Icon from 'react-native-vector-icons/Ionicons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import images from '../assets/images'
import { getOrdersByDateRange, getOrder, formatDate } from '../actions'
import styles from '../styles'
import {LocaleContext} from "../locales/LocaleContext";

class OrderDetail extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  componentDidMount() {
    this.props.getOrder(this.props.navigation.state.params.orderId)

    this.context.localize({
      en: {
        serviceCharge: 'Service Charge',
        discount: 'Discount',
        total: 'Total',
        paymentMethod: 'Payment Method',
        orderState: 'Order Status'

      },
      zh: {
        serviceCharge: '服務費',
        discount: '折扣',
        total: '總金額',
        paymentMethod: '付款方式',
        orderState: '訂單狀態'
      }
    })
  }

  render() {
    const { order, isLoading, haveData } = this.props
    const { t } = this.context

    if (isLoading) {
      return (
        <View style={[styles.container]}>
          <ActivityIndicator size="large" color="#ccc" />
        </View>
      )
    } else if (haveData) {
      return (
        <View style={[styles.container, { marginLeft: 8, marginRight: 8 }]}>
          <View style={[styles.whiteBg, styles.boxShadow, styles.popUpLayout]}>
            <Text style={styles.screenTitle}>
              {formatDate(order.createdDate)}
            </Text>

            <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
              <View style={[styles.half_width]}>
                <Text style={styles.orange_color}>{t('serviceCharge')}</Text>
              </View>
              <View style={[styles.half_width]}>
                <Text style={{ textAlign: 'right', marginRight: -26 }}>
                  ${order.serviceCharge}
                </Text>
              </View>
            </View>

            <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
              <View style={[styles.half_width]}>
                <Text style={styles.orange_color}>{t('discount')}</Text>
              </View>
              <View style={[styles.half_width]}>
                <Text style={{ textAlign: 'right', marginRight: -26 }}>
                  ${order.discount}
                </Text>
              </View>
            </View>

            <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
              <View style={[styles.half_width]}>
                <Text style={styles.orange_color}>{t('total')}</Text>
              </View>
              <View style={[styles.half_width]}>
                <Text style={{ textAlign: 'right', marginRight: -26 }}>
                  ${order.total.amount}
                </Text>
              </View>
            </View>

            <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
              <View style={{ width: '90%' }}>
                <Text style={styles.orange_color}>{t('paymentMethod')}</Text>
              </View>
              <View>
                <FontAwesomeIcon name={'credit-card'} size={25} />
              </View>
            </View>

            <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
              <View style={{flex: 1, alignItems: 'flex-start'}}>
                <Text style={styles.orange_color}>{t('orderState')}</Text>
              </View>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                {this.props.navigation.state.params.order.state === 'OPEN' ? (
                  <Image
                    source={images.order}
                    style={{ width: 15, height: 20 }}
                  />
                ) : this.props.navigation.state.params.order.state ===
                  'IN_PROCESS' ? (
                  <Image
                    source={images.process}
                    style={{ width: 30, height: 20 }}
                  />
                ) : this.props.navigation.state.params.order.state ===
                  'SETTLED' ? (
                  <Icon
                    name={'md-checkmark-circle-outline'}
                    color="#4cbb17"
                    size={25}
                    style={{
                      marginLeft: 8,
                      marginRight: 0,
                      fontWeight: 'bold'
                    }}
                  />
                ) : this.props.navigation.state.params.order.state ===
                  'DELIVERED' ? (
                  <MCIcon
                    name={'truck-delivery'}
                    size={25}
                    style={{
                      marginLeft: 8,
                      marginRight: 0,
                      fontWeight: 'bold'
                    }}
                    color="#f18d1a"
                  />
                ) : (
                  this.props.navigation.state.params.order.state ===
                    'COMPLETED' && (
                    <Image
                      source={images.completed}
                      style={{ width: 28, height: 20, flex: 1 }}
                    />
                  )
                )}
              </View>
            </View>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Orders')}
            >
              <Text
                style={[
                  styles.bottomActionButton,
                  styles.cancelButton,
                  styles.mgrtotop20,
                  { alignSelf: 'center', justifyContent: 'center', width: 120 }
                ]}
              >
                {t('action.ok')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = state => ({
  order: state.order.data,
  haveData: state.order.haveData,
  haveError: state.order.haveError,
  isLoading: state.order.loading
})
const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getOrder: () => dispatch(getOrder(props.navigation.state.params.orderId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderDetail)

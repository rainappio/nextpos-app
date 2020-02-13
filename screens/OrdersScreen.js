import React from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { connect } from 'react-redux'
import BackBtnCustom from '../components/BackBtnCustom'
import Icon from 'react-native-vector-icons/Ionicons'
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import images from '../assets/images'
import {formatDate, formatDateObj, getOrdersByDateRange} from '../actions'
import { ListItem } from 'react-native-elements'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import {renderOrderState} from "../helpers/orderActions";

class OrdersScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        ordersTitle: 'Orders',
        fromDate: 'From: ',
        toDate: 'To: ',
        date: 'Date',
        total: 'Total',
        orderStatus: 'Status',
        noOrder: 'No Order'
      },
      zh: {
        ordersTitle: '訂單歷史',
        fromDate: '開始日期: ',
        toDate: '結束日期: ',
        date: '日期',
        total: '總金額',
        orderStatus: '狀態',
        noOrder: '沒有資料'
      }
    })

    this.state = {
      t: context.t,
      scrollPosition: ''
    }
  }

  componentDidMount() {
    this.props.getOrdersByDateRange()
  }

  upButtonHandler = () => {
    //OnCLick of Up button we scrolled the list to top
    this.ListView_Ref.scrollToOffset({ offset: 0, animated: true })
  }

  keyExtractor = (order, index) => index.toString()

  renderItem = ({ item }) => (
    <ListItem
      key={item.orderId}
      subtitle={
        <View style={[styles.flex_dir_row,styles.paddingTopBtn20, styles.grayBg, {marginTop: -25}]}>
          <View style={{ width: '55%'}}>
            <Text style={styles.tableCellView}>{formatDate(item.createdTime)}</Text>
          </View>

          <View style={{ width: '20%'}}>
            <Text style={styles.tableCellView}>${item.total.amount}</Text>
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '25%'
            }}
          >
            {renderOrderState(item.state)}
          </View>
        </View>
      }
      onPress={() =>
        this.props.navigation.navigate('OrderDetail', {
          //order: item,
          orderId: item.orderId
        })
      }
      bottomDivider
      containerStyle={{ paddingLeft: 0, paddingRight: 0, marginBottom: -10, marginTop: -10 }}
     />
  )

  //https://stackoverflow.com/questions/48061234/how-to-keep-scroll-position-using-flatlist-when-navigating-back-in-react-native
  handleScroll = event => {
    this.setState({ scrollPosition: event.nativeEvent.contentOffset.y })
  }

  render() {
    const {getordersByDateRange, reportParameter, isLoading, haveData} = this.props
    const {t} = this.state

    const orders = []
    getordersByDateRange !== undefined && getordersByDateRange.map(order => {
      orders.push(order)
    })

    if (isLoading) {
      return (
        <View style={[styles.container]}>
          <ActivityIndicator size="large" color="#ccc"/>
        </View>
      )
    } else if (haveData) {
      return (
        <View
          style={[
            styles.container,
            styles.nomgrBottom
          ]}
        >
          <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
            <View style={{justifyContent: 'space-between'}}>
              <Text style={styles.screenTitle}>{t('ordersTitle')}</Text>
            </View>
            <View style={{position: 'absolute', right: 0}}>
              <TouchableOpacity
                onPress={() => {
                  console.log('reloading orders')
                  this.props.getOrdersByDateRange()
                }}
              >
                <Icon name="md-refresh" size={30} color="#f18d1a"/>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldTitle}>{t('fromDate')}</Text>
              <Text>{formatDateObj(reportParameter.fromDate)}</Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldTitle}>{t('toDate')}</Text>
              <Text>{formatDateObj(reportParameter.toDate)}</Text>
            </View>
          </View>

          <View style={[styles.flex_dir_row, {paddingTop: 10, paddingBottom: 10}]}>
            <View style={{width: '55%'}}>
              <Text style={[styles.orange_color, styles.centerText]}>{t('date')}</Text>
            </View>

            <View style={{width: '20%'}}>
              <Text style={[styles.orange_color]}>{t('total')}</Text>
            </View>

            <View style={{width: '25%'}}>
              <Text style={[styles.orange_color, styles.centerText]}>{t('orderStatus')}</Text>
            </View>
          </View>
          {orders.length === 0 && (
            <View>
              <Text style={styles.messageBlock}>{t('noOrder')}</Text>
            </View>
          )}

          <FlatList
            keyExtractor={this.keyExtractor}
            data={orders}
            renderItem={this.renderItem}
            ref={ref => {
              this.ListView_Ref = ref
            }}
            onScroll={this.handleScroll}
          />

          {this.state.scrollPosition > 0 ? (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={this.upButtonHandler}
              style={styles.upButton}
            >
              <Icon
                name={'md-arrow-round-up'}
                color="#f18d1a"
                size={25}
                style={{
                  marginLeft: 8,
                  marginRight: 8,
                  fontWeight: 'bold'
                }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = state => ({
  getordersByDateRange: state.ordersbydaterange.data.orders,
  reportParameter: state.ordersbydaterange.data.reportParameter,
  haveData: state.ordersbydaterange.haveData,
  haveError: state.ordersbydaterange.haveError,
  isLoading: state.ordersbydaterange.loading
})
const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getOrdersByDateRange: () => dispatch(getOrdersByDateRange())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrdersScreen)

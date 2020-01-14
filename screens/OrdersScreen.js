import React from 'react'
import {ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View} from 'react-native'
import {connect} from 'react-redux'
import BackBtnCustom from '../components/BackBtnCustom'
import Icon from 'react-native-vector-icons/Ionicons'
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import images from '../assets/images'
import {formatDate, getOrdersByDateRange} from '../actions'
import {ListItem} from 'react-native-elements'
import styles from '../styles'
import {LocaleContext} from "../locales/LocaleContext";

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
        date: 'Date',
        total: 'Total',
        orderStatus: 'Order Status'
      },
      zh: {
        ordersTitle: '訂單歷史',
        date: '日期',
        total: '總金額',
        orderStatus: '狀態'
      }
    })

    this.state = {
      t: context.t,
      isVisible: false,
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
        <View style={[styles.flex_dir_row]}>
          <View style={{ width: '55%', marginLeft: -10 }}>
            <Text>{formatDate(item.createdTime)}</Text>
          </View>

          <View style={{ width: '22%' }}>
            <Text>${item.total.amount}</Text>
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '30%'
            }}
          >
            {item.state === 'OPEN' ? (
              <Image source={images.order} style={{ width: 15, height: 20 }} />
            ) : item.state === 'IN_PROCESS' ? (
              <Image
                source={images.process}
                style={{ width: 30, height: 20 }}
              />
            ) : item.state === 'SETTLED' ? (
              <Icon
                name={'md-checkmark-circle-outline'}
                color="#4cbb17"
                size={25}
                style={{
                  marginLeft: 8,
                  marginRight: 8,
                  fontWeight: 'bold'
                }}
              />
            ) : item.state === 'DELIVERED' ? (
              <MCIcon
                name={'truck-delivery'}
                size={25}
                style={{
                  marginLeft: 8,
                  marginRight: 8,
                  fontWeight: 'bold'
                }}
                color="#f18d1a"
              />
            ) : (
              item.state === 'COMPLETED' && (
                <Image
                  source={images.completed}
                  style={{ width: 28, height: 20, flex: 1 }}
                />
              )
            )}
          </View>
        </View>
      }
      bottomDivider
      onPress={() =>
        this.props.navigation.navigate('OrderDetail', {
          order: item,
          orderId: item.orderId
        })
      }
      containerStyle={{ paddingBottom: 8 }}
    />
  )

  //https://stackoverflow.com/questions/48061234/how-to-keep-scroll-position-using-flatlist-when-navigating-back-in-react-native
  handleScroll = (event) => {
    this.setState({ scrollPosition: event.nativeEvent.contentOffset.y })
  }

  render() {
    const { getordersByDateRange, isLoading } = this.props
    const { t } = this.state

    let keysArr =
      getordersByDateRange !== undefined && Object.keys(getordersByDateRange)
    let orders = []
    keysArr !== false &&
      keysArr.map(key =>
        getordersByDateRange[key].map(order => {
          order.tableLayoutId == key ? orders.push(order) : ''
        })
      )

    if (isLoading) {
      return (
        <View style={[styles.container]}>
          <ActivityIndicator size="large" color="#ccc" />
        </View>
      )
    }
    return (
      <View
        style={[
          styles.container,
          styles.nomgrBottom,
          { marginLeft: 20, marginRight: 20 }
        ]}
      >
        <Text
          style={[
            styles.welcomeText,
            styles.orange_color,
            styles.textMedium,
            styles.textBold
          ]}
        >
          {t('ordersTitle')}
        </Text>

        <View style={[styles.flex_dir_row]}>
          <View style={{ width: '50%' }}>
            <Text style={styles.orange_color}>{t('date')}</Text>
          </View>

          <View style={{ width: '22%' }}>
            <Text style={styles.orange_color}>{t('total')}</Text>
          </View>

          <View>
            <Text style={styles.orange_color}>{t('orderStatus')}</Text>
          </View>
        </View>
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
  }
}

const mapStateToProps = state => ({
  getordersByDateRange: state.ordersbydaterange.data.orders,
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

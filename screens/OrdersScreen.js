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
import styles, {mainThemeColor} from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import {renderOrderState} from "../helpers/orderActions";
import {NavigationEvents} from "react-navigation";
import ScreenHeader from "../components/ScreenHeader";
import buttonLikeRoles from "react-native-web/dist/modules/AccessibilityUtil/buttonLikeRoles";
import OrderFilterForm from './OrderFilterForm'
import {
  api,
  dispatchFetchRequest,
  errorAlert,
  warningMessage
} from '../constants/Backend'
import LoadingScreen from "./LoadingScreen";

class OrdersScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      scrollPosition: '',
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

  handleOrderFilter = values => {
    const fromDate = values.fromDate
    const toDate = values.toDate
    const dateRange = values.dateRange

    this.props.getOrdersByDateRange(dateRange, undefined, fromDate, toDate)
  }

  renderItem = ({ item }) => (
    <ListItem
      key={item.orderId}
      title={
        <View style={[styles.tableRowContainer]}>
          <View style={[styles.tableCellView, { flex: 2}]}>
            <Text>{item.serialId}</Text>
          </View>
          <View style={[styles.tableCellView, { flex: 3}]}>
            <Text>{formatDate(item.createdTime)}</Text>
          </View>
          <View style={[styles.tableCellView, { flex: 1}]}>
            <Text>${item.orderTotal}</Text>
          </View>
          <View style={[styles.tableCellView, {flex: 1, justifyContent: 'center'}]}>
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
      containerStyle={[ styles.dynamicVerticalPadding(12), { padding: 0 }]}
     />
  )

  //https://stackoverflow.com/questions/48061234/how-to-keep-scroll-position-using-flatlist-when-navigating-back-in-react-native
  handleScroll = event => {
    this.setState({ scrollPosition: event.nativeEvent.contentOffset.y })
  }

  render() {
    const {getordersByDateRange, reportParameter, isLoading, haveData} = this.props
    const {t} = this.context

    const orders = []
    getordersByDateRange !== undefined && getordersByDateRange.map(order => {
      orders.push(order)
    })

    if (isLoading) {
      return (
        <LoadingScreen/>
      )
    } else if (haveData) {
      return (
        <View style={[styles.fullWidthScreen]}>
          <NavigationEvents
            onWillFocus={() => {
              const shiftId = this.props.navigation.getParam('shiftId')
              this.props.getOrdersByDateRange('SHIFT', shiftId)
              this.props.navigation.setParams({shiftId: undefined})
            }}
          />
          <ScreenHeader backNavigation={false}
                        parentFullScreen={true}
                        title={t('order.ordersTitle')}
                        rightComponent={
                          <TouchableOpacity
                            onPress={() => {
                              this.props.getOrdersByDateRange()
                            }}
                          >
                            <Icon name="md-refresh" size={32} color={mainThemeColor} />
                          </TouchableOpacity>
                        }
          />

          <View>
            <OrderFilterForm onSubmit={this.handleOrderFilter} />
          </View>

          <View style={{flex: 1}}>
            <View style={[styles.tableRowContainer]}>
              <View style={styles.tableCellView}>
                <Text style={styles.fieldTitle}>{t('order.fromDate')}</Text>
              </View>
              <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-end'}]}>
                <Text>{formatDateObj(reportParameter.fromDate)}</Text>
              </View>
            </View>

            <View style={styles.tableRowContainer}>
              <View style={styles.tableCellView}>
                <Text style={styles.fieldTitle}>{t('order.toDate')}</Text>
              </View>
              <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-end'}]}>
                <Text>{formatDateObj(reportParameter.toDate)}</Text>
              </View>
            </View>
          </View>

          <View style={{flex: 5}}>
            <View style={[styles.sectionBar]}>
              <View style={{flex: 2}}>
                <Text style={styles.sectionBarTextSmall}>{t('order.orderId')}</Text>
              </View>

              <View style={{flex: 3}}>
                <Text style={styles.sectionBarTextSmall}>{t('order.date')}</Text>
              </View>

              <View style={{flex: 1}}>
                <Text style={[styles.sectionBarTextSmall]}>{t('order.total')}</Text>
              </View>

              <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={[styles.sectionBarTextSmall]}>{t('order.orderStatus')}</Text>
              </View>
            </View>
            {orders.length === 0 && (
              <View>
                <Text style={styles.messageBlock}>{t('order.noOrder')}</Text>
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
                  size={32}
                  style={[styles.buttonIconStyle, {marginRight: 10}]}
                />
              </TouchableOpacity>
            ) : null}
          </View>
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
  getOrdersByDateRange: (dateRange, shiftId, fromDate, toDate) => dispatch(getOrdersByDateRange(dateRange, shiftId, fromDate, toDate))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrdersScreen)

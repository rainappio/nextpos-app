import React from 'react'
import {FlatList, Text, TouchableOpacity, View} from 'react-native'
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import {formatDate, getOrdersByDateRange, getOrdersByInvoiceNumber, formatCurrency} from '../actions'
import {ListItem} from 'react-native-elements'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import {renderOrderState} from "../helpers/orderActions";
import {NavigationEvents} from "react-navigation";
import ScreenHeader from "../components/ScreenHeader";
import OrderFilterForm from './OrderFilterForm'
import LoadingScreen from "./LoadingScreen";
import moment from "moment";
import DateTimeFilterControlledForm from './DateTimeFilterControlledForm'
import {ThemeContainer} from "../components/ThemeContainer";
import {compose} from "redux";
import {withContext} from "../helpers/contextHelper";
import {StyledText} from "../components/StyledText";
import BackendErrorScreen from "./BackendErrorScreen";
import {Octicons} from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';


class OrdersScreen extends React.Component {
  handleViewRef = ref => this.view = ref;
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      scrollPosition: 0,
      searchFilter: {
        searchTypeIndex: 0,
        tableName: null,
        dateRange: 0,
        shiftId: null,
        fromDate: new Date(),
        toDate: new Date(),
        invoiceNumber: null,
        showFilter: false
      },
      selectedStatusOptions: new Set(['OPEN', 'IN_PROCESS', 'DELIVERED', 'SETTLED', 'COMPLETED', 'DELETED', 'CANCELLED', 'PAYMENT_IN_PROCESS'])
    }
  }

  componentDidMount() {
    this.props.getOrdersByDateRange()
  }

  upButtonHandler = () => {
    //OnCLick of Up button we scrolled the list to top
    if (this.ListView_Ref != null) {
      this.ListView_Ref?.scrollToOffset({offset: 0, animated: true})
    }
  }

  keyExtractor = (order, index) => index.toString()

  handleOrderSearch = values => {
    const rangeTypeMapping = ['SHIFT', 'TODAY', 'RANGE', 'RANGE', 'RANGE']
    const searchTypeIndex = values?.searchTypeIndex ?? 0
    if (searchTypeIndex === 0) {
      const tableName = values?.tableName ?? null
      const dateRange = (typeof (values?.dateRange) === 'number') ? rangeTypeMapping?.[values.dateRange] : (values.dateRange != null ? values.dateRange : 'SHIFT')
      const shiftId = values.shiftId != null ? values.shiftId : null
      const fromDate = moment(values.fromDate).format("YYYY-MM-DDTHH:mm:ss")
      const toDate = moment(values.toDate).format("YYYY-MM-DDTHH:mm:ss")

      this.setState({
        searchFilter: {
          ...this.state.searchFilter,
          searchTypeIndex: searchTypeIndex,
          tableName: tableName,
          dateRange: values.dateRange,
          shiftId: shiftId,
          fromDate: values.fromDate,
          toDate: values.toDate
        }
      })

      this.props.getOrdersByDateRange(dateRange, shiftId, fromDate, toDate, tableName)
    } else {
      const invoiceNumber = values?.invoiceNumber ?? null
      this.setState({
        searchFilter: {
          ...this.state.searchFilter,
          searchTypeIndex: searchTypeIndex,
          invoiceNumber: invoiceNumber
        }
      })
      this.props.getOrdersByInvoiceNumber(invoiceNumber)
    }
  }

  renderItem = ({item}) => (
    <ListItem
      key={item.orderId}
      title={
        <View style={[styles.tableRowContainer]}>
          <View style={[styles.tableCellView, {flex: 2}]}>
            <StyledText>{item.serialId}</StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 3}]}>
            <StyledText>{formatDate(item.createdTime)}</StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 1}]}>
            <StyledText>${item.orderTotal}</StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 1, justifyContent: 'center'}]}>
            {renderOrderState(item.state, this.context?.customMainThemeColor)}
          </View>
        </View>
      }
      onPress={() =>
        this.props.navigation.navigate('OrderDetail', {
          orderId: item.orderId
        })
      }
      bottomDivider
      containerStyle={[styles.dynamicVerticalPadding(12), {padding: 0, backgroundColor: this.props.themeStyle.backgroundColor}, styles?.customBorderAndBackgroundColor(this.context)]}
    />
  )

  //https://stackoverflow.com/questions/48061234/how-to-keep-scroll-position-using-flatlist-when-navigating-back-in-react-native
  handleScroll = event => {
    if (this.ListView_Ref != null) {
      this.setState({scrollPosition: event.nativeEvent.contentOffset.y})
    }
  }

  bounce = (showFilter) => {
    this.setState({showFilter: true}, () => {
      if (showFilter) {
        this.view.fadeOutUp(100).then(endState => this.setState({showFilter: false}))
      } else {
        this.view.fadeInDown(200).then(endState => this.setState({showFilter: true}))
      }
    })
  }

  render() {
    const {getordersByDateRange, dateRange, isLoading, haveError, haveData, getordersByDateRangeFullData} = this.props
    const {t, customMainThemeColor} = this.context

    const orders = []
    getordersByDateRange !== undefined && getordersByDateRange.forEach(order => {
      if (this.state?.searchTypeIndex === 1) {
        orders.push(order)
      } else if (this.state?.selectedStatusOptions.has(order?.state)) {
        orders.push(order)
      } else {

      }

    })



    if (isLoading) {
      return (
        <LoadingScreen />
      )
    } else if (haveError) {
      return (
        <BackendErrorScreen />
      )
    } else if (haveData) {
      return (
        <ThemeContainer>
          <View style={[styles.fullWidthScreen]}>
            <NavigationEvents
              onWillFocus={() => {
                if (this.state?.searchFilter?.searchTypeIndex === 0) {
                  const shiftId = this.props.navigation.getParam('shiftId')
                  const dateRangeToUse = shiftId != null ? 0 : this.state.searchFilter.dateRange

                  this.handleOrderSearch({
                    dateRange: dateRangeToUse,
                    shiftId: shiftId,
                    fromDate: this.state.searchFilter.fromDate,
                    toDate: this.state.searchFilter.toDate,
                    searchTypeIndex: this.state.searchFilter.searchTypeIndex,
                    tableName: this.state.searchFilter.tableName,
                  })

                  this.props.navigation.setParams({shiftId: undefined})
                } else {
                  this.props.getOrdersByInvoiceNumber(this.state?.searchFilter?.invoiceNumber ?? '')
                }


                // To prevent FlatList scrolls to top automatically,
                // we have to delay scroll to the original position
                const offset = this.state.scrollPosition

                if (this.ListView_Ref != null) {
                  setTimeout(() => {
                    this.ListView_Ref?.scrollToOffset({offset, animated: false})
                  }, 800)
                }
              }}
            />
            <ScreenHeader backNavigation={false}
              parentFullScreen={true}
              title={t('order.ordersTitle')}
              rightComponent={
                <TouchableOpacity
                  onPress={() => this.setState({showFilter: true})}
                >
                  <Octicons name="kebab-horizontal" size={32} color={customMainThemeColor} />
                </TouchableOpacity>
              }
            />

            <View >
              <OrderFilterForm
                onSubmit={this.handleOrderSearch}
                initialValues={{
                  searchTypeIndex: this.state.searchFilter.searchTypeIndex,
                  tableName: this.state.searchFilter.tableName,
                  dateRange: this.state?.searchFilter?.dateRange,
                  fromDate: new Date(dateRange?.zonedFromDate ?? new Date()),
                  toDate: new Date(dateRange?.zonedToDate ?? new Date()),
                  invoiceNumber: this.state.searchFilter?.invoiceNumber,
                  selectedStatusOptions: this.state?.selectedStatusOptions,
                }}
                isShow={this.state?.showFilter}
                closeModal={() => this.setState({showFilter: false})}
                getSelectedStatus={(data) => this.setState({selectedStatusOptions: data})}
              />
            </View>
            <View style={[styles.tableRowContainer, {flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}]}>
              <StyledText style={styles?.screenSubTitle(customMainThemeColor)}>{moment(dateRange?.zonedFromDate).format('YYYY-MM-DD')}</StyledText>
              <StyledText style={[styles?.screenSubTitle(customMainThemeColor), {marginHorizontal: 0}]}>~</StyledText>
              <StyledText style={styles?.screenSubTitle(customMainThemeColor)}>{moment(dateRange?.zonedToDate).format('YYYY-MM-DD')}</StyledText>
            </View>
            <View style={[styles.tableRowContainer, {flexDirection: 'row', justifyContent: 'flex-start'}]}>
              <StyledText style={[styles?.screenSubTitle(customMainThemeColor), {marginHorizontal: 0, marginRight: 20}]}>{t('order.total')}:</StyledText>
              <StyledText style={[styles?.screenSubTitle(customMainThemeColor), {marginHorizontal: 0}]}>{formatCurrency(getordersByDateRangeFullData?.ordersTotal ?? 0)}</StyledText>
            </View>
            <View style={{flex: 3}}>
              <View style={[styles.sectionBar]}>
                <View style={{flex: 2}}>
                  <Text style={styles?.sectionBarTextSmall(customMainThemeColor)}>{t('order.orderId')}</Text>
                </View>

                <View style={{flex: 3}}>
                  <Text style={styles?.sectionBarTextSmall(customMainThemeColor)}>{t('order.date')}</Text>
                </View>

                <View style={{flex: 1}}>
                  <Text style={[styles?.sectionBarTextSmall(customMainThemeColor)]}>{t('order.total')}</Text>
                </View>

                <View style={{flex: 1, alignItems: 'center'}}>
                  <Text style={[styles?.sectionBarTextSmall(customMainThemeColor)]}>{t('order.orderStatus')}</Text>
                </View>
              </View>
              <FlatList
                keyExtractor={this.keyExtractor}
                data={orders}
                renderItem={this.renderItem}
                ListEmptyComponent={
                  <View>
                    <StyledText style={styles.messageBlock}>{t('order.noOrder')}</StyledText>
                  </View>
                }
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
                    name={'arrow-up'}
                    size={32}
                    style={[styles?.buttonIconStyle(customMainThemeColor), {marginRight: 10}]}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </ThemeContainer>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = state => ({
  getordersByDateRange: state.ordersbydaterange.data.orders,
  getordersByDateRangeFullData: state.ordersbydaterange.data,
  dateRange: state.ordersbydaterange.data.dateRange,
  haveData: state.ordersbydaterange.haveData,
  haveError: state.ordersbydaterange.haveError,
  isLoading: state.ordersbydaterange.loading
})
const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getOrdersByDateRange: (dateRange, shiftId, fromDate, toDate, tableName) => dispatch(getOrdersByDateRange(dateRange, shiftId, fromDate, toDate, tableName)),
  getOrdersByInvoiceNumber: (invoiceNumber) => dispatch(getOrdersByInvoiceNumber(invoiceNumber))
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withContext
)
export default enhance(OrdersScreen)

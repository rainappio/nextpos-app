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
  ActivityIndicator,
  TouchableWithoutFeedback,
  AsyncStorage,
  RefreshControl,
  FlatList
} from 'react-native'
import { connect } from 'react-redux'
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtnCustom from '../components/BackBtnCustom'
import AddBtn from '../components/AddBtn'
import Icon from 'react-native-vector-icons/Ionicons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import OrderStart from './OrderStart'
import OrderItem from './OrderItem'
import {
  getTableLayouts,
  getShiftStatus,
  getfetchOrderInflights, getTablesAvailable, getMostRecentShiftStatus,
} from '../actions'
import styles from '../styles'
import {
  api,
  makeFetchRequest,
  errorAlert,
  successMessage,
  dispatchFetchRequest
} from '../constants/Backend'
import { LocaleContext } from '../locales/LocaleContext'
import {handleDelete, handleOrderSubmit} from '../helpers/orderActions'
import {NavigationEvents} from "react-navigation";
import {handleOpenShift} from "../helpers/shiftActions";
import {getCurrentClient} from "../actions/client";
import LoadingScreen from "./LoadingScreen";
import ScreenHeader from "../components/ScreenHeader";

class TablesScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      openBalance: 0,
      refreshing: false
    }
  }

  componentDidMount() {
    this.loadInfo()
    this.loadLocalization()
  }

  loadInfo = () => {
    this.props.getTableLayouts()
    this.props.getShiftStatus()
    this.props.getMostRecentShiftStatus()
    this.props.getfetchOrderInflights()
    this.props.getAvailableTables()
    this.props.getCurrentClient()
  }

  loadLocalization = () => {
    this.context.localize({
      en: {
        noTableLayout:
          'You need to define at least one table layout and one table.',
        noInflightOrders: 'No order on this table layout',
        shiftClosing: 'Please close shift first',
        openShift: {
          title: 'Open shift to start sales',
          openBalance: 'Open Balance',
          enterAmount: 'Enter Amount',
          open: 'Open',
          cancel: 'Cancel'
        },
        otherOrders: 'Other Orders',
        seatingCapacity: 'Seats',
        tableCapacity: 'Tables',
        availableSeats: 'Vacant',
        availableTables: 'Vacant',
      },
      zh: {
        noTableLayout: '需要創建至少一個桌面跟一個桌位.',
        noInflightOrders: '此樓面沒有訂單',
        shiftClosing: '請先完成關帳',
        openShift: {
          title: '請開帳來開始銷售',
          openBalance: '開帳現金',
          enterAmount: '請輸入金額',
          open: '開帳',
          cancel: '取消'
        },
        otherOrders: '其他訂單',
        seatingCapacity: '總座位',
        tableCapacity: '總桌數',
        availableSeats: '空位',
        availableTables: '空桌'
      }
    })
  }

  onRefresh = async () => {
    this.setState({ refreshing: true })

    this.loadInfo()

    this.setState({ refreshing: false }, () => {
      successMessage(this.context.t('refreshed'))
    })
  }

  handleOpenShift = (balance) => {
    handleOpenShift(balance, (response) => {
      this.loadInfo()
      this.setState({openBalance: 0})
    })
  }

  render() {
    const {
      navigation,
      haveData,
      client,
      isLoading,
      tablelayouts,
      shiftStatus,
      recentShift,
      ordersInflight,
      availableTables
    } = this.props
    const { t } = this.context

    if (isLoading) {
      return (
        <LoadingScreen/>
      )
    } else if (tablelayouts === undefined || tablelayouts.length === 0) {
      return (
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          <View style={styles.container}>
            <Text style={styles.messageBlock}>{t('noTableLayout')}</Text>
          </View>
        </ScrollView>
      )
    } else if(recentShift !== undefined && ['CLOSING', 'CONFIRM_CLOSE'].includes(recentShift.data.shiftStatus)) {
      return (
        <View style={[styles.fullWidthScreen]}>
          <ScreenHeader backNavigation={false}
                        parentFullScreen={true}
                        title={t('menu.tables')}
          />
          <View style={[styles.sectionContainer, {flex: 1}]}>
            <Text style={styles.messageBlock}>{t('shiftClosing')}</Text>
          </View>
        </View>
      )

    } else if (shiftStatus === 'INACTIVE') {
      return (
        <View style={styles.modalContainer}>
          <View
            style={[styles.boxShadow, styles.popUpLayout]}
          >
            <Text style={styles.screenSubTitle}>
              {t('openShift.title')}
            </Text>
            <View style={styles.tableRowContainer}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <Text style={[styles.fieldTitle]}>
                  {t('openShift.openBalance')}
                </Text>
              </View>
              <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                <TextInput
                  name="balance"
                  type="text"
                  onChangeText={value =>
                    this.setState({openBalance: value})
                  }
                  placeholder={t('openShift.enterAmount')}
                  keyboardType={`numeric`}
                  style={[styles.rootInput]}
                />
              </View>
            </View>
            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <View style={{width: '45%', marginHorizontal: 5}}>
                <TouchableOpacity onPress={() => this.handleOpenShift(this.state.openBalance)}>
                  <Text style={[styles.bottomActionButton, styles.actionButton]}>
                    {t('openShift.open')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{width: '45%', marginHorizontal: 5}}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('LoginSuccess')
                  }}
                >
                  <Text style={[styles.bottomActionButton, styles.cancelButton]}>
                    {t('openShift.cancel')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )
    } else {
      let tableDisplay = 'SHOW_SEAT'

      if (client.attributes !== undefined && client.attributes.TABLE_AVAILABILITY_DISPLAY !== undefined) {
        tableDisplay = client.attributes.TABLE_AVAILABILITY_DISPLAY
      }

      const floorCapacity = {}

      availableTables && tablelayouts && tablelayouts.forEach((layout, idx) => {

        let seatCount = 0
        let tableCount = 0
        const availableTablesOfLayout = availableTables[layout.id]

        availableTablesOfLayout !== undefined && availableTablesOfLayout.forEach((table, idx2) => {
          seatCount += table.capacity
          tableCount += 1
        })

        floorCapacity[layout.id] = {}
        floorCapacity[layout.id].seatCount = seatCount
        floorCapacity[layout.id].tableCount = tableCount
      })

      return (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          <NavigationEvents
            onWillFocus={() => {
              this.loadInfo()
              this.loadLocalization()
            }}
          />

          <DismissKeyboard>
            <View style={styles.fullWidthScreen}>
              <ScreenHeader backNavigation={false}
                            title={t('menu.tables')}
                            parentFullScreen={true}
                            rightComponent={
                              <AddBtn
                                onPress={() =>
                                  this.props.navigation.navigate('OrderStart')
                                }
                              />
                            }
              />

              {tablelayouts.map((tblLayout, idx) => (
                <View style={{}} key={idx}>
                  <View style={[styles.sectionBar, {flex: 1}]}>
                    <Text
                      style={[styles.sectionBarText, {flex: 4}
                      ]}
                    >
                      {tblLayout.layoutName}
                    </Text>
                    {floorCapacity[tblLayout.id] !== undefined && tableDisplay === 'SHOW_SEAT' && (
                      <Text style={[styles.sectionBarText, {flex: 4, textAlign: 'right', marginRight: 4}]}>
                        {t('seatingCapacity')} {tblLayout.totalCapacity} {t('availableSeats')} {floorCapacity[tblLayout.id].seatCount}
                      </Text>
                    )}
                    {floorCapacity[tblLayout.id] !== undefined && tableDisplay === 'SHOW_TABLE' && (
                      <Text style={[styles.sectionBarText, {flex: 4, textAlign: 'right', marginRight: 4}]}>
                        {t('tableCapacity')} {tblLayout.totalTables} {t('availableTables')} {floorCapacity[tblLayout.id].tableCount}
                      </Text>
                    )}
                  </View>
                  {ordersInflight !== undefined && ordersInflight[tblLayout.id] !== undefined ? (
                    <FlatList
                      data={ordersInflight[tblLayout.id]}
                      renderItem={({item}) => {
                        return (
                          <OrderItem
                            order={item}
                            navigation={navigation}
                            handleOrderSubmit={handleOrderSubmit}
                            handleDelete={handleDelete}
                            key={item.orderId}
                          />
                        )
                      }}
                      keyExtractor={(item, idx) => item.orderId}
                    />
                  ) : (
                    <View>
                      <Text style={styles.messageBlock}>
                        {t('noInflightOrders')}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
              <View style={styles.mgrbtn20} key='noLayout'>
                <View style={[styles.sectionBar, {flex: 1, justifyContent: 'flex-start'}]}>
                  <Text style={[styles.sectionBarText]}>
                    {t('otherOrders')}
                  </Text>
                </View>
                {ordersInflight !== undefined && ordersInflight['NO_LAYOUT'] !== undefined ? (
                  <FlatList
                    data={ordersInflight['NO_LAYOUT']}
                    renderItem={({item}) => {
                      return (
                        <OrderItem
                          order={item}
                          navigation={navigation}
                          handleOrderSubmit={handleOrderSubmit}
                          handleDelete={handleDelete}
                          key={item.orderId}
                        />
                      )
                    }}
                    keyExtractor={(item, idx) => item.orderId}
                  />
                ) : (
                  <View>
                    <Text style={styles.messageBlock}>
                      {t('noInflightOrders')}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </DismissKeyboard>
        </ScrollView>
      )
    }
  }
}

const mapStateToProps = state => ({
  reduxState: state,
  tablelayouts: state.tablelayouts.data.tableLayouts,
  ordersInflight: state.ordersinflight.data.orders,
  haveData: state.ordersinflight.haveData,
  haveError: state.ordersinflight.haveError,
  isLoading: state.ordersinflight.loading,
  shiftStatus: state.shift.data.shiftStatus,
  availableTables: state.tablesavailable.data.availableTables,
  client: state.client.data,
  recentShift: {
    loading: state.mostRecentShift.loading,
    haveData: state.mostRecentShift.haveData,
    data: state.mostRecentShift.data,
  }
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getfetchOrderInflights: () => dispatch(getfetchOrderInflights()),
  getTableLayouts: () => dispatch(getTableLayouts()),
  getShiftStatus: () => dispatch(getShiftStatus()),
  getMostRecentShiftStatus: () => dispatch(getMostRecentShiftStatus()),
  getAvailableTables: () => dispatch(getTablesAvailable()),
  getCurrentClient: () => dispatch(getCurrentClient())
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TablesScreen)

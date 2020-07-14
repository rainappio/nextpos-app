import React from 'react'
import {Field, reduxForm} from 'redux-form'
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
import {connect} from 'react-redux'
import InputText from '../components/InputText'
import {DismissKeyboard} from '../components/DismissKeyboard'
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
import {LocaleContext} from '../locales/LocaleContext'
import {handleDelete, handleOrderSubmit} from '../helpers/orderActions'
import {NavigationEvents} from "react-navigation";
import {handleOpenShift} from "../helpers/shiftActions";
import {getCurrentClient} from "../actions/client";
import LoadingScreen from "./LoadingScreen";
import ScreenHeader from "../components/ScreenHeader";
import {ThemeContainer} from "../components/ThemeContainer";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {StyledText} from "../components/StyledText";
import {withContext} from "../helpers/contextHelper";
import {compose} from "redux";
import StyledTextInput from "../components/StyledTextInput";

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
    this.setState({refreshing: true})

    this.loadInfo()

    this.setState({refreshing: false}, () => {
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
      availableTables,
      themeStyle
    } = this.props
    const {t} = this.context

    if (isLoading) {
      return (
        <LoadingScreen/>
      )
    } else if (tablelayouts === undefined || tablelayouts.length === 0) {
      return (
        <ThemeScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >

          <View style={styles.fullWidthScreen}>
            <ScreenHeader backNavigation={false}
                          parentFullScreen={true}
                          title={t('menu.tables')}
            />
            <StyledText style={styles.messageBlock}>{t('noTableLayout')}</StyledText>
          </View>
        </ThemeScrollView>
      )
    } else if (recentShift !== undefined && ['CLOSING', 'CONFIRM_CLOSE'].includes(recentShift.data.shiftStatus)) {
      return (
        <ThemeContainer>
          <View style={[styles.fullWidthScreen]}>
            <ScreenHeader backNavigation={false}
                          parentFullScreen={true}
                          title={t('menu.tables')}
            />
            <View>
              <StyledText style={styles.messageBlock}>{t('shiftClosing')}</StyledText>
            </View>
            <View style={[styles.bottom, styles.horizontalMargin]}>
              <TouchableOpacity onPress={() => navigation.navigate('ShiftClose')}>
                <Text style={[styles.bottomActionButton, styles.actionButton]}>
                  {t('shift.closeShift')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ThemeContainer>
      )

    } else if (shiftStatus === 'INACTIVE') {
      return (
        <ThemeContainer>
          <View style={styles.modalContainer}>
            <View style={[styles.boxShadow, styles.popUpLayout, themeStyle]}>
              <Text style={styles.screenSubTitle}>
                {t('openShift.title')}
              </Text>
              <View style={styles.tableRowContainer}>
                <View style={[styles.tableCellView, {flex: 1}]}>
                  <StyledText style={[styles.fieldTitle]}>
                    {t('openShift.openBalance')}
                  </StyledText>
                </View>
                <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                  <StyledTextInput
                    name="balance"
                    type="text"
                    onChangeText={value =>
                      this.setState({openBalance: value})
                    }
                    placeholder={t('openShift.enterAmount')}
                    keyboardType={`numeric`}
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
        </ThemeContainer>
      )
    } else if (haveData) {
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
        <ThemeScrollView
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
                  ListEmptyComponent={
                    <View>
                      <StyledText style={styles.messageBlock}>{t('noInflightOrders')}</StyledText>
                    </View>
                  }
                  keyExtractor={(item, idx) => item.orderId}
                />
              </View>
            ))}
            <View style={styles.mgrbtn20} key='noLayout'>
              <View style={[styles.sectionBar, {flex: 1, justifyContent: 'flex-start'}]}>
                <Text style={[styles.sectionBarText]}>
                  {t('otherOrders')}
                </Text>
              </View>
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
                ListEmptyComponent={
                  <View>
                    <StyledText style={styles.messageBlock}>{t('noInflightOrders')}</StyledText>
                  </View>
                }
                keyExtractor={(item, idx) => item.orderId}
              />
            </View>
          </View>
        </ThemeScrollView>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = state => ({
  tablelayouts: state.tablelayouts.data.tableLayouts,
  ordersInflight: state.ordersinflight.data.orders,
  haveData: state.ordersinflight.haveData && state.tablelayouts.haveData,
  haveError: state.ordersinflight.haveError || state.tablelayouts.haveError,
  isLoading: state.ordersinflight.loading ||  state.tablelayouts.loading,
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

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withContext
)
export default enhance(TablesScreen)

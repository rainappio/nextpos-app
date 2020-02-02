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
  getfetchOrderInflights, getTablesAvailable, isTablet
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
    this.props.getTableLayouts()
    this.props.getShiftStatus()
    this.props.getfetchOrderInflights()
    this.props.getAvailableTables()

    this.loadLocalization()
  }

  loadLocalization = () => {
    this.context.localize({
      en: {
        noTableLayout:
          'You need to define at least one table layout and one table.',
        noInflightOrders: 'No order on this table layout',
        openShift: {
          title: 'Open shift to start sales.',
          openBalance: 'Open Balance',
          open: 'Open',
          cancel: 'Cancel'
        },
        seatingCapacity: 'Seats',
        availableSeats: 'Vacant'
      },
      zh: {
        noTableLayout: '需要創建至少一個桌面跟一個桌位.',
        noInflightOrders: '此樓面沒有訂單',
        openShift: {
          title: '請開帳來開始銷售',
          openBalance: '開帳現金',
          open: '開帳',
          cancel: '取消'
        },
        seatingCapacity: '座位',
        availableSeats: '空位'
      }
    })
  }

  onRefresh = async () => {
    this.setState({ refreshing: true })

    this.props.getfetchOrderInflights()
    this.props.getTableLayouts()
    this.props.getShiftStatus()
    this.props.getAvailableTables()

    this.setState({ refreshing: false }, () => {
      successMessage('Refreshed')
    })
  }

  handleOpenShift = () => {
    makeFetchRequest(token => {
      fetch(api.order.openShift, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.access_token}`
        },
        body: JSON.stringify({
          balance: this.state.openBalance
        })
      }).then(response => {
        if (response.status === 200) {
          successMessage('Shift opened')
          this.props.dispatch(getShiftStatus())
          this.setState({ openBalance: 0 })
        }
      })
    })
  }

  handleDeliver = id => {
    makeFetchRequest(token => {
      fetch(`${api.apiRoot}/orders/${id}/process?action=DELIVER`, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.access_token}`
        }
      }).then(response => {
        if (response.status === 200) {
          this.props.navigation.navigate('TablesSrc')
          this.props.getfetchOrderInflights()
          this.props.getTableLayouts()
        } else {
          errorAlert(response)
        }
      })
    })
  }

  render() {
    const {
      navigation,
      haveData,
      haveError,
      isLoading,
      tablelayouts,
      shiftStatus,
      ordersInflight,
      availableTables
    } = this.props
    const { t } = this.context

    const floorCapacity = {}

    availableTables && tablelayouts && tablelayouts.forEach((layout, idx) => {
      let capacityCount = 0
      const availableTablesOfLayout = availableTables[layout.id]

      availableTablesOfLayout !== undefined && availableTablesOfLayout.forEach((table, idx2) => {
        capacityCount += table.capacity
      })

      floorCapacity[layout.id] = capacityCount
    })

    if (isLoading) {
      return (
        <View style={[styles.container]}>
          <ActivityIndicator size="large" color="#ccc" />
        </View>
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
    } else if (shiftStatus === 'INACTIVE') {
      return (
        <View style={styles.container}>
          <ScrollView
            directionalLockEnabled={true}
            contentContainerStyle={styles.modalContainer}
          >
            <TouchableWithoutFeedback>
              <View
                style={[styles.whiteBg, styles.boxShadow, styles.popUpLayout]}
              >
                <Text
                  style={styles.screenTitle}
                >
                  {t('openShift.title')}
                </Text>
                <View style={styles.fieldContainer}>
                  <Text style={[styles.fieldTitle, { flex: 1 }]}>
                    {t('openShift.openBalance')}
                  </Text>
                  <TextInput
                    name="balance"
                    value={String(this.state.openBalance)}
                    type="text"
                    onChangeText={value =>
                      this.setState({ openBalance: value })
                    }
                    placeholder={t('openShift.openBalance')}
                    keyboardType={`numeric`}
                    style={[styles.rootInput, { flex: 2 }]}
                  />
                </View>
                <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
                  <View
                    style={{
                      width: '46%',
                      borderRadius: 4,
                      borderWidth: 1,
                      borderColor: '#F39F86',
                      backgroundColor: '#F39F86',
                      marginRight: '2%'
                    }}
                  >
                    <TouchableOpacity onPress={() => this.handleOpenShift()}>
                      <Text style={[styles.signInText, styles.whiteColor]}>
                        {t('openShift.open')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      width: '46%',
                      borderRadius: 4,
                      borderWidth: 1,
                      borderColor: '#F39F86',
                      marginLeft: '2%'
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate('LoginSuccess')
                      }}
                    >
                      <Text style={styles.signInText}>
                        {t('openShift.cancel')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </View>
      )
    }

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
            this.props.getfetchOrderInflights()
            this.props.getTableLayouts()
            this.loadLocalization()
          }}
        />

        <DismissKeyboard>
          <View>
            <View style={[styles.container, styles.nomgrBottom]}>
              <BackBtnCustom
                onPress={() => this.props.navigation.navigate('LoginSuccess')}
                size={isTablet ? 44 : 24}
              />
              <Text style={styles.screenTitle}>{t('menu.tables')}</Text>
              <AddBtn
                onPress={() =>
                  this.props.navigation.navigate('OrderStart', {
                    handleOrderSubmit: handleOrderSubmit,
                    handleDelete: handleDelete
                  })
                }
                size={isTablet ? 60 : 35}
              />
            </View>

            {tablelayouts.map((tblLayout, idx) => (
              <View style={[styles.mgrbtn20, styles.paddingTopBtn8]} key={idx}>
                <View style={[styles.flex_dir_row, styles.mgrtotop12, styles.orange_bg, {paddingLeft: 25, paddingRight: 25, paddingTop: 15, paddingBottom: 15}]}>
                	<View style={{width: '30%', textAlign :'left'}}>
                  	<Text
                    	style={[styles.sectionBarText]}
                  		>
                    	{tblLayout.layoutName}
                  	</Text>
                  </View>

                  	<View style={{width: '70%'}}>
										<View style={styles.flex_dir_row}>
											<View style={{width: '60%'}}>
                  			<Text style={[styles.sectionBarText, styles.toRight]}>
                    			{t('seatingCapacity')} {tblLayout.totalCapacity}
                  			</Text>
                  		</View>
											
											<View style={{width: '40%'}}>
                  			<Text style={[styles.sectionBarText, styles.toRight]}>
                    			{t('availableSeats')} {floorCapacity[tblLayout.id]}
                  			</Text>
                  		</View>
                  	</View>
                  </View>
                </View>

                {ordersInflight !== undefined && ordersInflight[tblLayout.id] !== undefined ? (
                  <FlatList
                    data={ordersInflight[tblLayout.id]}
                    renderItem={({ item }) => {
                      return (
                        <OrderItem
                          order={item}
                          navigation={navigation}
                          handleOrderSubmit={handleOrderSubmit}
                          handleDelete={handleDelete}
                          key={item.orderId}
                          handleDeliver={this.handleDeliver}
                        />
                      )
                    }}
                    keyExtractor={(item, idx) => item.orderId}
                  />
                ) : (
                  <View>
                    <Text style={[styles.messageBlock, styles.textSmall]}>
                      {t('noInflightOrders')}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </DismissKeyboard>
      </ScrollView>
    )
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
  availableTables: state.tablesavailable.data.availableTables
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getfetchOrderInflights: () => dispatch(getfetchOrderInflights()),
  getTableLayouts: () => dispatch(getTableLayouts()),
  getShiftStatus: () => dispatch(getShiftStatus()),
  getAvailableTables: () => dispatch(getTablesAvailable())
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TablesScreen)

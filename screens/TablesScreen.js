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
  getfetchOrderInflights
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

class TablesScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      t: context.t,
      openBalance: 0,
      refreshing: false
    }
  }

  componentDidMount() {
    this.props.getTableLayouts()
    this.props.getShiftStatus()
    this.props.getfetchOrderInflights()

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
        }
      },
      zh: {
        noTableLayout: '需要創建至少一個桌面跟一個桌位.',
        noInflightOrders: '此樓面沒有訂單',
        openShift: {
          title: '請開帳來開始銷售',
          openBalance: '開帳現金',
          open: '開帳',
          cancel: '取消'
        }
      }
    })
  }

  onRefresh = async () => {
    this.setState({ refreshing: true })

    this.props.getfetchOrderInflights()
    this.props.getTableLayouts()
    this.props.getShiftStatus()

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
        }
      })
    })
  }

  handleOrderSubmit = id => {
    const formData = new FormData()
    formData.append('action', 'SUBMIT')

    dispatchFetchRequest(
      api.order.process(id),
      {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {},
        body: formData
      },
      response => {
        response.json().then(data => {
          if (data.hasOwnProperty('orderId')) {
            successMessage('Order submitted')
            this.props.navigation.navigate('TablesSrc')
            this.props.getfetchOrderInflights()
          }
        })
      }
    ).then()
  }

  handleDelete = id => {
    dispatchFetchRequest(
      api.order.delete(id),
      {
        method: 'DELETE',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      response => {
        successMessage('Deleted')
        this.props.navigation.navigate('TablesSrc')
        this.props.getfetchOrderInflights()
        this.props.getTableLayouts()
      }
    ).then()
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
      ordersInflight
    } = this.props
    const { t } = this.state

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
                  style={[
                    styles.textMedium,
                    styles.orange_color,
                    styles.mgrbtn40,
                    styles.centerText
                  ]}
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
        <DismissKeyboard>
          <View>
            <View style={[styles.container, styles.nomgrBottom]}>
              <BackBtnCustom
                onPress={() => this.props.navigation.navigate('LoginSuccess')}
              />
              <Text style={styles.screenTitle}>{t('menu.tables')}</Text>
              <AddBtn
                onPress={() =>
                  this.props.navigation.navigate('OrderStart', {
                    handleOrderSubmit: this.handleOrderSubmit,
                    handleDelete: this.handleDelete
                  })
                }
              />
            </View>

            {tablelayouts.map((tblLayout, idx) => (
              <View style={styles.mgrbtn20} key={idx}>
                <Text
                  style={[
                    styles.orange_bg,
                    styles.whiteColor,
                    styles.paddingTopBtn8,
                    styles.centerText,
                    styles.textMedium
                  ]}
                >
                  {tblLayout.layoutName}
                </Text>

                {ordersInflight !== undefined &&
                ordersInflight[tblLayout.id] !== undefined ? (
                  <FlatList
                    data={ordersInflight[tblLayout.id]}
                    renderItem={({ item }) => {
                      return (
                        <OrderItem
                          order={item}
                          navigation={navigation}
                          handleOrderSubmit={this.handleOrderSubmit}
                          handleDelete={this.handleDelete}
                          key={item.orderId}
                          handleDeliver={this.handleDeliver}
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
  shiftStatus: state.shift.data.shiftStatus
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getfetchOrderInflights: () => dispatch(getfetchOrderInflights()),
  getTableLayouts: () => dispatch(getTableLayouts()),
  getShiftStatus: () => dispatch(getShiftStatus())
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TablesScreen)

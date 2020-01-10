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
  getfetchOrderInflights,
  get_time_diff,
  clearOrder,
  clearProduct,
  getOrder,
  getTablesAvailable,
  getOrdersByDateRange
} from '../actions'
import styles from '../styles'
import {
  api,
  makeFetchRequest,
  errorAlert,
  successMessage
} from '../constants/Backend'
import { LocaleContext } from '../locales/LocaleContext'

class TablesScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
    this.props.getTableLayouts()
    this.props.getfetchOrderInflights()
    this.props.getShiftStatus()
    this.props.getTablesAvailable()

    context.localize({
      en: {
        openShift: {
          title: 'Open shift to start sales.',
          open: 'Open',
          cancel: 'Cancel'
        }
      },
      zh: {
        openShift: {
          title: '請開帳來開始銷售',
          open: '開帳',
          cancel: '取消'
        }
      }
    })

    this.state = {
      t: context.t
    }
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
          balance: '1000'
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
    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      fetch(`http://35.234.63.193/orders/${id}/process`, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          Authorization: 'Bearer ' + tokenObj.access_token
        },
        body: formData
      })
        .then(response => response.json())
        .then(res => {
          if (res.hasOwnProperty('orderId')) {
            this.props.navigation.navigate('TablesSrc')
            this.props.getfetchOrderInflights()
            this.props.clearOrder(res.orderId)
            this.props.getOrdersByDateRange()
          } else {
            alert(res.message === undefined ? 'pls try again' : res.message)
          }
        })
        .catch(error => {
          console.error(error)
        })
    })
  }

  handleDelete = id => {
    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      fetch(`http://35.234.63.193/orders/${id}`, {
        method: 'DELETE',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + tokenObj.access_token
        }
      })
        .then(response => {
          if (response.status === 200) {
            this.props.navigation.navigate('TablesSrc')
            this.props.getfetchOrderInflights()
            this.props.getTableLayouts()
            this.props.getTablesAvailable()
            this.props.clearOrder(id)
          } else {
            alert('pls try again')
          }
        })
        .catch(error => {
          console.error(error)
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
        },
        body: JSON.stringify({
          balance: '1000'
        })
      }).then(response => {
        if (response.status === 200) {
          this.props.navigation.navigate('TablesSrc')
          this.props.getfetchOrderInflights()
          this.props.getTableLayouts()
          this.props.getTablesAvailable()
          this.props.clearOrder(id)
          this.props.getOrdersByDateRange()
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
      getavailTables
    } = this.props
    const { t } = this.state

    let tables = [],
      tblsArr = []
    var keysArr = getavailTables !== undefined && Object.keys(getavailTables)
    keysArr !== false &&
      keysArr.map(
        key =>
          getavailTables !== undefined &&
          getavailTables[key].map(order => {
            tables.push({
              value: order.id,
              label: order.name
            })
          })
      )

    var keysArr = ordersInflight !== undefined && Object.keys(ordersInflight)
    keysArr !== false &&
      keysArr.map(key =>
        ordersInflight[key].map(order => {
          order.tableLayoutId == key ? tblsArr.push(order) : ''
        })
      )

    function removeDuplicates(array, key) {
      let lookup = new Set()
      return array.filter(obj => !lookup.has(obj[key]) && lookup.add(obj[key]))
    }
    var tblLayouts = removeDuplicates(tblsArr, 'tableLayoutId')

    if (isLoading) {
      return (
        <View style={[styles.container]}>
          <ActivityIndicator size="large" color="#ccc" />
        </View>
      )
    } else if (haveError) {
      return (
        <View style={[styles.container]}>
          <Text>Err during loading, check internet conn...</Text>
        </View>
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
      <ScrollView>
        <DismissKeyboard>
          <View>
            <View style={[styles.container, styles.nomgrBottom]}>
              <BackBtnCustom
                onPress={() => this.props.navigation.navigate('LoginSuccess')}
              />
              <Text
                style={[
                  styles.welcomeText,
                  styles.orange_color,
                  styles.textMedium,
                  styles.textBold
                ]}
              >
                {t('menu.tables')}
              </Text>
              <AddBtn
                onPress={() =>
                  this.props.navigation.navigate('OrderStart', {
                    tables: tables,
                    handleOrderSubmit: this.handleOrderSubmit,
                    handleDelete: this.handleDelete
                  })
                }
              />
            </View>

            {tblLayouts.map((tblLayout, ix) => (
              <View style={styles.mgrbtn20} key={tblLayout.tableLayoutId + ix}>
                <Text
                  style={[
                    styles.orange_bg,
                    styles.whiteColor,
                    styles.paddingTopBtn8,
                    styles.centerText,
                    styles.textMedium
                  ]}
                >
                  {tblLayout.tableLayout}
                </Text>

                {ordersInflight[tblLayout.tableLayoutId] !== undefined && (
                  <FlatList
                    data={ordersInflight[tblLayout.tableLayoutId]}
                    renderItem={({ item }) => {
                      return (
                        <OrderItem
                          order={item}
                          navigation={navigation}
                          handleOrderSubmit={this.handleOrderSubmit}
                          handleDelete={this.handleDelete}
                          key={item.orderId}
                          tableId={tblLayout.tableLayoutId}
                          handleDeliver={this.handleDeliver}
                        />
                      )
                    }}
                    keyExtractor={(item, ix) => item.orderId}
                  />
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
  tablelayouts: state.tablelayouts.data,
  ordersInflight: state.ordersinflight.data.orders,
  haveData: state.ordersinflight.haveData,
  haveError: state.ordersinflight.haveError,
  isLoading: state.ordersinflight.loading,
  shiftStatus: state.shift.data.shiftStatus,
  getavailTables: state.tablesavailable.data.availableTables
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getfetchOrderInflights: () => dispatch(getfetchOrderInflights()),
  getTableLayouts: () => dispatch(getTableLayouts()),
  getShiftStatus: () => dispatch(getShiftStatus()),
  clearOrder: () => dispatch(clearOrder()),
  clearProduct: () => dispatch(clearProduct()),
  getTablesAvailable: () => dispatch(getTablesAvailable()),
  getOrdersByDateRange: () => dispatch(getOrdersByDateRange())
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TablesScreen)

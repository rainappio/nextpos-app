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
  getOrder
} from '../actions'
import styles from '../styles'
import {api, makeFetchRequest} from "../constants/Backend";

let tblsArr = []

class TablesScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    refreshing: false
  }

  constructor(props) {
    super(props)
    this.props.getTableLayouts()
    this.props.getfetchOrderInflights()
    this.props.getShiftStatus()
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
            this.props.navigation.navigate('Tables')
            this.props.getfetchOrderInflights()
            this.props.clearOrder(res.orderId)
            this.setState({
              refreshing: true
            })
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
            this.props.navigation.navigate('Tables')
            this.props.getfetchOrderInflights()
            this.props.getTableLayouts()
            //AsyncStorage.removeItem('orderInfo')
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

    let tables = []
    let tblLength =
      tablelayouts.tableLayouts !== undefined &&
      tablelayouts.tableLayouts.length
    for (var i = 0; i < tblLength; i++) {
      tablelayouts.tableLayouts[i].tables !== undefined &&
        tablelayouts.tableLayouts[i].tables.map(tbl =>
          tables.push({
            value: tbl.tableId,
            label: tbl.tableName
          })
        )
    }
    AsyncStorage.setItem('tables', JSON.stringify(tables))

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
                  Open Shift
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
                        Open
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
                        this.props.navigation.navigate('Tables')
                      }}
                    >
                      <Text style={styles.signInText}>Cancel</Text>
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
      //refreshControl={<RefreshControl refreshing={this.state.refreshing} />}
      >
        <DismissKeyboard>
          <View>
            <View style={styles.container}>
              <BackBtnCustom
                onPress={() => this.props.navigation.navigate('LoginSuccess')}
              />
              <Text
                style={[
                  styles.welcomeText,
                  styles.orange_color,
                  styles.textMedium,
                  styles.textBold,
                  styles.nomgrBottom
                ]}
              >
                Tables
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
              <View style={styles.mgrbtn40} key={tblLayout.tableLayoutId + ix}>
                <Text
                  style={[
                    styles.orange_bg,
                    styles.whiteColor,
                    styles.paddBottom_10,
                    styles.paddingTopBtn8,
                    styles.centerText,
                    styles.mgrbtn20,
                    styles.textBig
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
  checkS: state,
  tablelayouts: state.tablelayouts.data,
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
  getShiftStatus: () => dispatch(getShiftStatus()),
  clearOrder: () => dispatch(clearOrder()),
  clearProduct: () => dispatch(clearProduct())
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TablesScreen)

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
  AsyncStorage
} from 'react-native'
import { connect } from 'react-redux'
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import AddBtn from '../components/AddBtn'
import Icon from 'react-native-vector-icons/Ionicons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import OrderStart from './OrderStart'
import {
  getTableLayouts,
  getTableLayout,
  getShiftStatus,
  getfetchOrderInflights,
  timeConverter
} from '../actions'
import images from '../assets/images'
import styles from '../styles'

let tblsArr = []
let uniqueFloorNames = []

class TablesScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  componentDidMount() {
    this.props.getTableLayouts()
    this.props.getTableLayout()
    this.props.getShiftStatus()
    this.props.getfetchOrderInflights()
  }

  handleOpenShift = () => {
    // console.log("handleOpenShift hit")
    //formData.append('grant_type', 'password')

    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      //console.log(tokenObj)
      const formData = new FormData()
      formData.append('grant_type', 'password')
      formData.append('username', tokenObj.cli_userName)
      formData.append('password', tokenObj.cli_masterPwd)

      var auth =
        'Basic ' + btoa(tokenObj.cli_userName + ':' + tokenObj.cli_masterPwd)

      fetch('http://35.234.63.193/oauth/token', {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          Authorization: auth
        },
        body: formData
      })
        .then(response => response.json())
        .then(res => {
          AsyncStorage.setItem('orderToken', JSON.stringify(res))
          fetch('http://35.234.63.193/shifts/open', {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              // 'x-client-id': tokenObj.clientId,
              Authorization: 'Bearer' + res.access_token
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
    })
  }

  handleOrderSubmit = values => {
    //orderId = this.props.navigation.state.params.orderId;
    console.log(values)
    console.log('submit order hit')
    return
    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      fetch(`http://35.234.63.193/orders/${orderId}`, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': tokenObj.application_client_id,
          Authorization: 'Bearer ' + tokenObj.access_token
        },
        body: JSON.stringify(values)
      })
        .then(response => {
          if (response.status === 200) {
            // AsyncStorage.setItem('orderInfo', JSON.stringify(createOrder))
            this.props.navigation.navigate('Tables')
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
          {/*<ActivityIndicator size="large" color="#ccc" />*/}
          {/*<PopUp 
            	navigation={navigation} 
            	title="" 
            	btn1Txt={'Yes'} 
            	btn2Txt={'No'} 
            	firstRoute={'Category'}
            	secondRoute={'Tables'}/>*/}
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
      <ScrollView>
        <DismissKeyboard>
          <View>
            <View style={styles.container}>
              <BackBtn onPress={() => this.props.navigation.goBack()} />
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
                    tables: tables
                  })
                }
              />
            </View>
            {tblLayouts.map(tblLayout => {
              return (
                <View style={styles.mgrbtn40} key={tblLayout.tableLayoutId}>
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
                  {ordersInflight[tblLayout.tableLayoutId].map(order => {
                    var orderStart = new Date(order.createdTime).getTime()
                    var now = new Date().getTime()
                    var milliSecDiff = Math.abs(orderStart - now)
                    var MinutesDiff = Math.round(milliSecDiff / 60000)
                    var orderTime = timeConverter(MinutesDiff)

                    //order deadline
                    var timespan = 30 * 60 * 1000 // 30 minutes in milliseconds
                    var orderDeadLineMilliSec =
                      new Date(order.createdTime).getTime() + timespan
                    var orderDeadLineMilliSecDiff = Math.abs(
                      orderDeadLineMilliSec - now
                    )
                    var orderDeadLineMinutes = Math.round(
                      orderDeadLineMilliSecDiff / 60000
                    )
                    var orderDeadLineTime = timeConverter(orderDeadLineMinutes)

                    return (
                      <TouchableOpacity
                        style={[
                          styles.jc_alignIem_center,
                          styles.flex_dir_row,
                          styles.marginLeftRight35,
                          styles.paddingTopBtn8,
                          styles.grayBg,
                          styles.mgrb
                        ]}
                        key={order.orderId}
                        onPress={() =>
                          this.props.navigation.navigate('OrdersSummary', {
                            orderId: order.orderId,
                            onSubmit: this.handleOrderSubmit
                          })
                        }
                      >
                        <View style={[styles.quarter_width]}>
                          <TouchableOpacity>
                            <View>
                              <Text style={styles.centerText}>
                                {order.tableName}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>

                        <View style={[styles.quarter_width]}>
                          <TouchableOpacity
                          //onPress={() => this.props.navigation.navigate('Orders')}
                          >
                            <View>
                              <FontAwesomeIcon
                                name={'user'}
                                color="#ccc"
                                size={25}
                              >
                                <Text style={{ color: '#000', fontSize: 12 }}>
                                  &nbsp;&nbsp;{order.customerCount}
                                </Text>
                              </FontAwesomeIcon>
                            </View>
                          </TouchableOpacity>
                        </View>

                        <View style={[styles.quarter_width]}>
                          <TouchableOpacity
                          //onPress={() => this.props.navigation.navigate('Orders')}
                          >
                            <View>
                              {orderTime < orderDeadLineTime ? (
                                <FontAwesomeIcon
                                  name={'clock-o'}
                                  color="#ccc"
                                  size={25}
                                >
                                  <Text style={{ color: '#000', fontSize: 12 }}>
                                    &nbsp;&nbsp;{orderTime}
                                  </Text>
                                </FontAwesomeIcon>
                              ) : (
                                <FontAwesomeIcon
                                  name={'clock-o'}
                                  color="red"
                                  size={25}
                                >
                                  <Text style={{ color: 'red', fontSize: 12 }}>
                                    &nbsp;&nbsp;{orderTime}
                                  </Text>
                                </FontAwesomeIcon>
                              )}
                            </View>
                          </TouchableOpacity>
                        </View>

                        <View style={[styles.quarter_width, styles.leftpadd20]}>
                          <TouchableOpacity
                          //onPress={() => this.props.navigation.navigate('Orders')}
                          >
                            <Image
                              source={images.process}
                              style={{ width: 30, height: 20 }}
                            />
                          </TouchableOpacity>
                        </View>
                        <Text
                          style={{
                            color: '#000',
                            fontSize: 12,
                            marginLeft: -40
                          }}
                        >
                          &nbsp;&nbsp;{tblLayout.state}
                        </Text>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              )
            })}
          </View>
        </DismissKeyboard>
      </ScrollView>
    )
  }
}

const mapStateToProps = state => ({
  checkS: state,
  tablelayouts: state.tablelayouts.data,
  haveData: state.tablelayouts.haveData,
  haveError: state.tablelayouts.haveError,
  isLoading: state.tablelayouts.loading,
  shiftStatus: state.shift.data.shiftStatus,
  ordersInflight: state.ordersinflight.data.orders
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getTableLayouts: () => dispatch(getTableLayouts()),
  getTableLayout: () => dispatch(getTableLayout()),
  getShiftStatus: () => dispatch(getShiftStatus()),
  getfetchOrderInflights: () => dispatch(getfetchOrderInflights())
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TablesScreen)

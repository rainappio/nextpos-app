import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  TouchableHighlight,
  TextInput,
  RefreshControl,
  AsyncStorage,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  FlatList
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import {
  Accordion,
  List,
  SwipeListView,
  SwipeRow,
  SwipeAction
} from '@ant-design/react-native'
import { readableDateFormat } from '../actions'
import BackBtn from '../components/BackBtn'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import styles from '../styles'

class OrdersSummaryRow extends React.Component {
  render() {
    const {
      products = [],
      labels = [],
      navigation,
      haveData,
      haveError,
      isLoading,
      label,
      order,
      handleDelete,
      initialValues
    } = this.props

    return (
      <ScrollView>
        <View
          style={{
            marginTop: 62,
            marginLeft: 35,
            marginRight: 35,
            marginBottom: 30
          }}
        >
          <BackBtn />
          <Text
            style={[
              styles.welcomeText,
              styles.orange_color,
              styles.textMedium,
              styles.textBold
            ]}
          >
            Order Summary
          </Text>

          <View style={[styles.flex_dir_row]}>
            <View style={[styles.quarter_width]}>
              <TouchableOpacity
              //onPress={() => this.props.navigation.navigate('Orders')}
              >
                <View>
                  <Text
                    style={[
                      styles.paddingTopBtn8,
                      styles.textBig,
                      styles.orange_color
                    ]}
                  >
                    {order.tableInfo.tableName}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
              <TouchableOpacity
              //onPress={() => this.props.navigation.navigate('Orders')}
              >
                <View>
                  <FontAwesomeIcon
                    name="user"
                    size={25}
                    color="#f18d1a"
                    style={[styles.centerText]}
                  >
                    <Text style={[styles.textBig, styles.orange_color]}>
                      &nbsp;
                      {order.demographicData.male +
                        order.demographicData.female +
                        order.demographicData.kid}
                    </Text>
                  </FontAwesomeIcon>
                </View>
              </TouchableOpacity>
            </View>

            <View style={[styles.fullhalf_width, styles.mgr_20]}>
              <TouchableOpacity>
                <View>
                  <Text style={[styles.toRight, styles.mgr_20]}>
                    Staff - {order.servedBy}
                  </Text>
                  <Text style={[styles.toRight, styles.mgr_20]}>
                    {readableDateFormat(order.createdDate)}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.orange_bg,
            styles.flex_dir_row,
            styles.shoppingBar,
            styles.paddLeft20,
            styles.paddRight20,
            styles.top40
          ]}
        >
          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <TouchableOpacity
            //onPress={() => this.props.navigation.navigate('Orders')}
            >
              <Text style={[styles.paddingTopBtn8, styles.whiteColor]}>
                Product
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <TouchableOpacity
            //onPress={() => this.props.navigation.navigate('Orders')}
            >
              <Text style={[styles.whiteColor]}>&nbsp;&nbsp;QTY</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('OrdersSummary')}
            >
              <Text style={styles.whiteColor}>U/P</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('OrdersSummary')}
            >
              <Text style={styles.whiteColor}>Subtotal</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.container]}>
          <Text style={styles.textBold}>{order.orderId}</Text>
          {order.lineItems.map(lineItem => (
            <View key={lineItem.lineItemId}>
              <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
                <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
                  <TouchableOpacity
                  //onPress={() => this.props.navigation.navigate('Orders')}
                  >
                    <Text style={{ textAlign: 'left', marginLeft: -28 }}>
                      {lineItem.productName}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
                  <TouchableOpacity
                  //onPress={() => this.props.navigation.navigate('Orders')}
                  >
                    <Text>&nbsp;&nbsp;{lineItem.quantity}</Text>
                  </TouchableOpacity>
                </View>

                <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('OrdersSummary')
                    }
                  >
                    <Text>${lineItem.price}</Text>
                  </TouchableOpacity>
                </View>

                <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('OrdersSummary')
                    }
                  >
                    <Text style={{ marginRight: -24 }}>
                      {lineItem.subTotal.amountWithoutTax} TX
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={[styles.mgrbtn20]}>
                <Text style={{ textAlign: 'left', marginLeft: 4 }}>
                  {lineItem.options}
                </Text>
              </View>
            </View>
          ))}

          <View
            style={[
              styles.flex_dir_row,
              styles.mgrtotop20,
              styles.grayBg,
              styles.paddingTopBtn8
            ]}
          >
            <View style={[styles.half_width]}>
              <Text>Total</Text>
            </View>

            <View style={[styles.half_width]}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('OrdersSummary')}
              >
                <Text style={{ textAlign: 'right', marginRight: -26 }}>
                  {order.orderTotal} TX
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {order.state === 'OPEN' ? (
            <View
              style={{
                width: '100%',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#F39F86',
                backgroundColor: '#F39F86',
                marginRight: '2%',
                marginTop: 22
              }}
            >
              <TouchableOpacity
                onPress={() => this.props.onSubmit(order.orderId)}
                //onPress={this.props.handleSubmit}
              >
                <Text style={[styles.signInText, styles.whiteColor]}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          ) : order.state === 'IN_PROCESS' ? (
            <View
              style={{
                width: '100%',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#F39F86',
                backgroundColor: '#F39F86',
                marginRight: '2%',
                marginTop: 22
              }}
            >
              <TouchableOpacity
                onPress={() => this.props.onSubmit(order.orderId)}
                //onPress={this.props.handleSubmit}
              >
                <Text style={[styles.signInText, styles.whiteColor]}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          ) : order.state === 'DELIVERED' ? (
            <View
              style={{
                width: '100%',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#F39F86',
                backgroundColor: '#F39F86',
                marginRight: '2%',
                marginTop: 22
              }}
            >
              <TouchableOpacity
                onPress={() => this.props.onSubmit(order.orderId)}
                //onPress={this.props.handleSubmit}
              >
                <Text style={[styles.signInText, styles.whiteColor]}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <View
            style={{
              width: '100%',
              borderRadius: 4,
              borderWidth: 1,
              borderColor: '#F39F86',
              marginTop: 8
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack()
              }}
            >
              <Text style={styles.signInText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: '100%',
              borderRadius: 4,
              borderWidth: 1,
              borderColor: '#F39F86',
              marginTop: 8
            }}
          >
            <TouchableOpacity
              onPress={() => {
                //this.props.navigation.goBack()
                this.props.handleDelete(order.orderId)
              }}
            >
              <Text style={styles.signInText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    )
  }
}

export default OrdersSummaryRow

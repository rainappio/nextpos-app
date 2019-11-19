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
  TouchableOpacity
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
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import AddBtn from '../components/AddBtn'
import DropDown from '../components/DropDown'
import {
  getProducts,
  getLables,
  getfetchOrderInflights,
  getOrder
} from '../actions'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import styles from '../styles'

class OrderFormII extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor() {
    super(...arguments)
    this.state = {
      activeSections: [2, 0],
      selectedProducts: [],
      refreshing: false,
      status: '',
      labelId: null,
      tables: null,
      cc: null
    }
    this.onChange = activeSections => {
      this.setState({ activeSections })
    }
  }

  componentDidMount() {
    this.props.getLables()
    this.props.getProducts()
    this.props.getfetchOrderInflights()
    // this.props.getOrder()//get err, just try by Async way

    //By Async Way
    AsyncStorage.getItem('tables')
      .then(value => {
        this.setState({ tables: JSON.parse(value) })
      })
      .done()
  }

  PanelHeader = (labelName, labelId) => {
    return (
      <View
        style={{
          width: '100%',
          marginRight: 8,
          paddingTop: 15,
          paddingBottom: 15
        }}
      >
        <Text style={{ fontSize: 16 }}>{labelName}</Text>
      </View>
    )
  }

  render() {
    const {
      products = [],
      labels = [],
      navigation,
      haveData,
      haveError,
      isLoading,
      label,
      ordersInflight,
      order
    } = this.props
    const { selectedProducts, tables, orderInfo } = this.state
    var map = new Map(Object.entries(products))

    let CC = null
    let orderIdArr = []
    var keysArr = ordersInflight !== undefined && Object.keys(ordersInflight)
    var valsArr = ordersInflight !== undefined && Object.keys(ordersInflight)

    keysArr !== false &&
      keysArr.map(
        key =>
          (orderIdArr = ordersInflight[key].map(order => {
            //return orderIdArr.push(order)
            return order.tableLayoutId === key && order.orderId
          }))
      )

    valsArr !== false &&
      valsArr.map(
        key =>
          (orderIdArr = ordersInflight[key].map(order => {
            //return order.tableLayoutId === key && order.orderId
            return order.orderId
          }))
      )

    //   console.log(ordersInflight)
    //console.log(orderIdArr[orderIdArr.length - 1].orderId)
    console.log(orderIdArr)
    let tableLayout =
      tables !== null &&
      tables
        .filter(tbl => {
          return tbl.value === this.props.navigation.state.params.tableId
        })
        .map(tbl => {
          return tbl.label
        })

    const right = [
      {
        text: (
          <Icon
            name="md-create"
            size={25}
            color="#fff"
            onPress={() =>
              this.props.navigation.navigate('ProductEdit', {
                productId: this.state.labelId
              })
            }
          />
        ),
        onPress: () => console.log('read'),
        style: { backgroundColor: '#f18d1a90' }
      }
    ]

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
    } else if (products !== undefined && products.length === 0) {
      return (
        <View style={[styles.container]}>
          <Text>no products ...</Text>
        </View>
      )
    }

    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          refreshControl={<RefreshControl refreshing={this.state.refreshing} />}
        >
          <View style={styles.container}>
            <BackBtn />
            <Text
              style={[
                styles.welcomeText,
                styles.orange_color,
                styles.textMedium,
                styles.textBold
              ]}
            >
              New Order
            </Text>

            <Accordion
              onChange={this.onChange}
              activeSections={this.state.activeSections}
            >
              {labels.map(lbl => (
                <Accordion.Panel
                  header={this.PanelHeader(lbl.label, lbl.id)}
                  key={lbl.id}
                >
                  <List>
                    {map.get(lbl.label).map(prd => (
                      <List.Item
                        key={prd.id}
                        onPress={() =>
                          this.props.navigation.navigate('OrderFormIII', {
                            prdName: prd.name,
                            // customerCount: customerCount,
                            tableLayout: tableLayout,
                            prdId: prd.id,
                            orderId: orderIdArr[orderIdArr.length - 1],
                            onSubmit: this.props.navigation.state.params
                              .onSubmit,
                            handleDelete: this.props.navigation.state.params
                              .handleDelete
                          })
                        }
                      >
                        {prd.name}
                      </List.Item>
                    ))}
                  </List>
                </Accordion.Panel>
              ))}
            </Accordion>
          </View>
        </ScrollView>

        <View
          style={[styles.orange_bg, styles.flex_dir_row, styles.shoppingBar]}
        >
          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <TouchableOpacity
            //onPress={() => this.props.navigation.navigate('Orders')}
            >
              <View>
                <Text
                  style={[
                    styles.paddingTopBtn8,
                    styles.textBig,
                    styles.whiteColor
                  ]}
                >
                  {tableLayout}
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
                  size={30}
                  color="#fff"
                  style={[styles.centerText]}
                >
                  <Text style={[styles.textBig, styles.whiteColor]}>
                    &nbsp;&nbsp;
                    {this.props.navigation.state.params.customerCount}
                  </Text>
                </FontAwesomeIcon>
              </View>
            </TouchableOpacity>
          </View>

          <View style={[styles.half_width, styles.verticalMiddle]}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('OrdersSummary', {
                  orderId: orderIdArr[orderIdArr.length - 1],
                  handleOrderSubmit: this.props.navigation.state.params
                    .onSubmit,
                  handleDelete: this.props.navigation.state.params.handleDelete
                })
              }
            >
              <View>
                <FontAwesomeIcon
                  name="shopping-cart"
                  size={30}
                  color="#fff"
                  style={[styles.toRight, styles.mgrtotop8, styles.mgr_20]}
                />
                <Text style={styles.itemCount}></Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  labels: state.labels.data.labels,
  subproducts: state.label.data.subLabels,
  products: state.products.data.results,
  haveData: state.products.haveData,
  haveError: state.products.haveError,
  isLoading: state.products.loading,
  ordersInflight: state.ordersinflight.data.orders
  // order: state.order.data
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getLables: () => dispatch(getLables()),
  getProducts: () => dispatch(getProducts()),
  getfetchOrderInflights: () => dispatch(getfetchOrderInflights())
  // getOrder: () => dispatch(getOrder(props.navigation.state.params.orderId))
})

OrderFormII = reduxForm({
  form: 'orderformII'
})(OrderFormII)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderFormII)

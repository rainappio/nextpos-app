import React from 'react'
import { reduxForm } from 'redux-form'
import {
  ScrollView,
  Text,
  View,
  RefreshControl,
  AsyncStorage,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import { Accordion, List } from '@ant-design/react-native'
import BackBtnCustom from '../components/BackBtnCustom'
import {
  getProducts,
  getLables,
  getfetchOrderInflights,
  getOrder,
  getTablesAvailable,
  clearOrder
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
      activeSections: [],
      selectedProducts: [],
      refreshing: false,
      status: '',
      labelId: null,
      tables: null,
      cc: null,
      orderInfo: null
    }
    this.onChange = activeSections => {
      this.setState({ activeSections })
    }
  }

  componentDidMount() {
    this.props.getLables()
    this.props.getProducts()
    this.props.getfetchOrderInflights()
    this.props.navigation.state.params.orderId !== undefined &&
      this.props.getOrder(this.props.navigation.state.params.orderId)

    //By Async Way
    AsyncStorage.getItem('tables')
      .then(value => {
        this.setState({ tables: JSON.parse(value) })
      })
      .done()
  }

  handleBack = recentlyAddedOrderId => {
    console.log(recentlyAddedOrderId)
    this.props.navigation.goBack()
    this.props.getTablesAvailable()
    this.props.clearOrder(recentlyAddedOrderId)
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
    const { selectedProducts, tables } = this.state
    var map = new Map(Object.entries(products))
    let orderIdArr = []
    var recentlyAddedOrderId = null
    var keysArr = ordersInflight !== undefined && Object.keys(ordersInflight)
    var valsArr = ordersInflight !== undefined && Object.values(ordersInflight)

    for (var i = 0; i < keysArr.length; i++) {
      var key = keysArr[i]
      for (var j = 0; j < ordersInflight[key].length; j++) {
        orderIdArr.push({
          createdTime: ordersInflight[key][j].createdTime,
          orderId: ordersInflight[key][j].orderId
        })
      }
    }

    var recentlyAddedOrderId = orderIdArr
      .map(order => {
        var latestTime = orderIdArr
          .map(function(e) {
            return e.createdTime
          })
          .sort()
          .reverse()[0]
        return order.createdTime === latestTime && order.orderId
      })
      .filter(latestorder => {
        return latestorder !== false
      })

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
            {/*<BackBtnCustom onPress={() => this.handleBack(recentlyAddedOrderId[0])}/>*/}
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
                            tableLayout: tableLayout,
                            prdId: prd.id,
                            orderId:
                              this.props.navigation.state.params.orderId !==
                              undefined
                                ? this.props.navigation.state.params.orderId
                                : recentlyAddedOrderId[0],
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
                  {order.hasOwnProperty('tableInfo')
                    ? order.tableInfo.tableName
                    : tableLayout}
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
                    {// Object.keys(order).length !== 0 //not good
                    order.hasOwnProperty('demographicData')
                      ? order.demographicData.male +
                        order.demographicData.female +
                        order.demographicData.kid
                      : this.props.navigation.state.params.customerCount}
                  </Text>
                </FontAwesomeIcon>
              </View>
            </TouchableOpacity>
          </View>

          <View style={[styles.half_width, styles.verticalMiddle]}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('OrdersSummary', {
                  orderId:
                    this.props.navigation.state.params.orderId !== undefined
                      ? this.props.navigation.state.params.orderId
                      : recentlyAddedOrderId[0],
                  onSubmit: this.props.navigation.state.params.onSubmit,
                  handleDelete: this.props.navigation.state.params.handleDelete,
                  tableName: tableLayout,
                  customerCount: this.props.navigation.state.params
                    .customerCount
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
                <Text style={styles.itemCount}>
                  {order.hasOwnProperty('lineItems') && order.lineItems.length}
                </Text>
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
  ordersInflight: state.ordersinflight.data.orders,
  order: state.order.data
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getLables: () => dispatch(getLables()),
  getProducts: () => dispatch(getProducts()),
  getfetchOrderInflights: () => dispatch(getfetchOrderInflights()),
  getOrder: () => dispatch(getOrder(props.navigation.state.params.orderId)),
  getTablesAvailable: () => dispatch(getTablesAvailable()),
  clearOrder: () => dispatch(clearOrder())
})

OrderFormII = reduxForm({
  form: 'orderformII'
})(OrderFormII)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderFormII)

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
import { LocaleContext } from '../locales/LocaleContext'
import LoadingScreen from "./LoadingScreen";
import BackendErrorScreen from "./BackendErrorScreen";
import {api, dispatchFetchRequest, dispatchFetchRequestWithOption, successMessage} from '../constants/Backend'

class OrderFormII extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        newOrderTitle: 'New Order',
        pinned: 'Pinned',
        addItemSuccess: 'Added {{product}}'
      },
      zh: {
        newOrderTitle: '新訂單',
        pinned: '置頂產品',
        addItemSuccess: '新增了 {{product}}'
      }
    })

    this.state = {
      activeSections: [0],
      selectedProducts: [],
      status: '',
      labelId: null,
      cc: null,
      orderInfo: null
    }
    this.onChange = activeSections => {
      this.setState({ activeSections: activeSections } )
    }
  }

  componentDidMount() {
    this.props.getLables()
    this.props.getProducts()
    this.props.navigation.state.params.orderId !== undefined &&
      this.props.getOrder(this.props.navigation.state.params.orderId)
  }

  PanelHeader = (labelName, labelId) => {
    return (
      <View style={styles.listPanel}>
        <Text style={styles.listPanelText}>{labelName}</Text>
      </View>
    )
  }

  addItemToOrder = productId => {
    dispatchFetchRequest(api.product.getById(productId), {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }, response => {
      response.json().then(product => {
        if (product.productOptions == null || product.productOptions.length === 0) {
          const orderId = this.props.navigation.state.params.orderId
          let lineItemRequest = {}

          lineItemRequest['productId'] = productId
          lineItemRequest['quantity'] = 1

          dispatchFetchRequestWithOption(
            api.order.newLineItem(orderId),
            {
              method: 'POST',
              withCredentials: true,
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(lineItemRequest)
            }, { defaultMessage: false },
            response => {
              successMessage(this.context.t('addItemSuccess', {product: product.name}))
              this.props.getOrder(orderId)
            }
          ).then()
        } else {
          this.props.navigation.navigate('OrderFormIII', {
            prdId: productId,
            orderId: this.props.navigation.state.params.orderId
          })
        }
      })
    }).then()
  }


  render() {
    const {
      products = [],
      labels = [],
      haveError,
      isLoading,
      order
    } = this.props
    const { t } = this.context
    const map = new Map(Object.entries(products))

    let totalQuantity = 0

    order.lineItems !== undefined && order.lineItems.map(lineItem => {
      totalQuantity += lineItem.quantity
    })

    if (isLoading) {
      return (
        <LoadingScreen />
      )
    } else if (haveError) {
      return (
        <BackendErrorScreen />
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
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.screenTitle}>
              {t('newOrderTitle')}
            </Text>
          </View>
          <View style={styles.childContainer}>
            <Accordion
              onChange={this.onChange}
              expandMultiple={true}
              activeSections={this.state.activeSections}
            >
              <Accordion.Panel
                header={this.PanelHeader(t('pinned'), '0')}
                key="pinned"
              >
                <List>
                  {map.get('pinned') !== undefined &&
                    map.get('pinned').map(prd => (
                      <List.Item
                        key={prd.id}
                        style={styles.listItemContainer}
                        onPress={() => this.addItemToOrder(prd.id)
                        }
                      >
                        <View style={[styles.jc_alignIem_center, { flex: 1, flexDirection: 'row' }]}>
                          <Text style={{ flex: 3 }}>{prd.name}</Text>
                          <Text style={{ flex: 1, textAlign: 'right' }}>
                            ${prd.price}
                          </Text>
                        </View>
                      </List.Item>
                    ))}
                </List>
              </Accordion.Panel>

              {labels.map(lbl => (
                <Accordion.Panel
                  header={this.PanelHeader(lbl.label, lbl.id)}
                  key={lbl.id}
                >
                  <List>
                    {map.get(lbl.label).map(prd => (
                      <List.Item
                        key={prd.id}
                        style={styles.listItemContainer}
                        onPress={() => this.addItemToOrder(prd.id)
                        }
                      >
                        <View style={[styles.jc_alignIem_center, { flex: 1, flexDirection: 'row' }]}>
                          <Text style={{ flex: 3 }}>{prd.name}</Text>
                          <Text style={{ flex: 1, textAlign: 'right' }}>
                            ${prd.price}
                          </Text>
                        </View>
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
          <View style={[styles.half_width, styles.jc_alignIem_center]}>
            <Text
              style={[
                styles.textBig,
                styles.whiteColor,
                { alignSelf: 'flex-start', paddingHorizontal: 10 }
              ]}
            >
              {order.orderType === 'IN_STORE' ? order.tableDisplayName : t('order.takeOut')}
            </Text>
          </View>

          <View style={[styles.quarter_width, styles.flex_dir_row, styles.jc_alignIem_center]}>
            <FontAwesomeIcon
              name="user"
              size={30}
              color="#fff"
              style={{ marginRight: 5 }}
            />
            <Text style={[styles.textMedium, styles.whiteColor]}>
              &nbsp;{order.demographicData != null ? order.demographicData.male + order.demographicData.female + order.demographicData.kid : 0}
            </Text>
          </View>

          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('OrdersSummary', {
                  orderId: this.props.navigation.state.params.orderId,
                  onSubmit: this.props.navigation.state.params.onSubmit,
                  handleDelete: this.props.navigation.state.params.handleDelete
                })
              }
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesomeIcon
                  name="shopping-cart"
                  size={30}
                  color="#fff"
                  style={{ marginRight: 5 }}
                />
                <View style={styles.itemCountContainer}>
                  <Text style={styles.itemCountText}>
                    {totalQuantity}
                  </Text>
                </View>
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
  order: state.order.data
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getLables: () => dispatch(getLables()),
  getProducts: () => dispatch(getProducts()),
  getOrder: () => dispatch(getOrder(props.navigation.state.params.orderId)),
})

OrderFormII = reduxForm({
  form: 'orderformII'
})(OrderFormII)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderFormII)

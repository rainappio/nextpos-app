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
import {ThemeContainer} from "../components/ThemeContainer";
import {StyledText} from "../components/StyledText";
import {ListItem} from "react-native-elements";
import {withContext} from "../helpers/contextHelper";
import {compose} from "redux";

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
        <StyledText style={styles.listPanelText}>{labelName}</StyledText>
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
      order,
      themeStyle
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
      <ThemeContainer>
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
                      <ListItem
                        key={prd.id}
                        title={
                          <View style={[styles.tableRowContainer]}>
                            <View style={[styles.tableCellView, styles.flex(1)]}>
                              <StyledText>{prd.name}</StyledText>
                            </View>
                            <View style={[styles.tableCellView, styles.flex(1), styles.justifyRight]}>
                              <StyledText>${prd.price}</StyledText>
                            </View>
                          </View>
                        }
                        onPress={() => this.addItemToOrder(prd.id)}
                        bottomDivider
                        containerStyle={[styles.dynamicVerticalPadding(10), {backgroundColor: themeStyle.backgroundColor}]}
                      />
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
                      <ListItem
                        key={prd.id}
                        title={
                          <View style={[styles.tableRowContainer]}>
                            <View style={[styles.tableCellView, styles.flex(1)]}>
                              <StyledText>{prd.name}</StyledText>
                            </View>
                            <View style={[styles.tableCellView, styles.flex(1), styles.justifyRight]}>
                              <StyledText>${prd.price}</StyledText>
                            </View>
                          </View>
                        }
                        onPress={() => this.addItemToOrder(prd.id)}
                        bottomDivider
                        containerStyle={[styles.dynamicVerticalPadding(10), {backgroundColor: themeStyle.backgroundColor}]}
                      />
                    ))}
                  </List>
                </Accordion.Panel>
              ))}
            </Accordion>
          </View>
        </ScrollView>

        <View style={[styles.shoppingBar]}>
          <View style={[styles.tableCellView, styles.half_width]}>
            <Text style={[styles.primaryText, styles.whiteColor]}>
              {order.orderType === 'IN_STORE' ? order.tableDisplayName : t('order.takeOut')}
            </Text>
          </View>

          <View style={[styles.tableCellView, styles.quarter_width]}>
            <FontAwesomeIcon
              name="user"
              size={30}
              color="#fff"
              style={{ marginRight: 5 }}
            />
            <Text style={[styles.primaryText, styles.whiteColor]}>
              &nbsp;{order.demographicData != null ? order.demographicData.customerCount : 0}
            </Text>
          </View>

          <View style={[styles.tableCellView, styles.quarter_width, styles.justifyRight]}>
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
      </ThemeContainer>
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

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withContext
)
export default enhance(OrderFormII)

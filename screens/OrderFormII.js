import React from 'react'
import {reduxForm, Field} from 'redux-form'
import {Alert, ScrollView, Text, TouchableOpacity, View, Switch} from 'react-native'
import {connect} from 'react-redux'
import {Accordion, List} from '@ant-design/react-native'
import {getLables, getProducts, clearOrder, getfetchOrderInflights, getOrder, getOrdersByDateRange} from '../actions'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import styles, {mainThemeColor} from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import LoadingScreen from "./LoadingScreen";
import BackendErrorScreen from "./BackendErrorScreen";
import {api, dispatchFetchRequest, dispatchFetchRequestWithOption, successMessage, warningMessage} from '../constants/Backend'
import {ThemeContainer} from "../components/ThemeContainer";
import {StyledText} from "../components/StyledText";
import {ListItem} from "react-native-elements";
import {withContext} from "../helpers/contextHelper";
import {compose} from "redux";
import OrderItemDetailEditModal from './OrderItemDetailEditModal';
import OrderTopInfo from "./OrderTopInfo";
import DeleteBtn from '../components/DeleteBtn'
import NavigationService from "../navigation/NavigationService";
import {handleDelete, handleOrderSubmit, handleQuickCheckout, revertSplitOrder, handlePrintWorkingOrder, handlePrintOrderDetails} from "../helpers/orderActions";
import {SwipeRow} from 'react-native-swipe-list-view'
import ScreenHeader from "../components/ScreenHeader";
import Icon from 'react-native-vector-icons/FontAwesome'
import {SecondActionButton} from "../components/ActionButtons";
import {printMessage} from "../helpers/printerActions";
import DropDown from "../components/DropDown";

class OrderFormII extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
    this.myRef = React.createRef();
    context.localize({
      en: {
        newOrderTitle: 'New Order',
        pinned: 'Pinned',
        addItemSuccess: 'Added {{product}}',
        nothing: 'Nothing',
        choose: 'Choose',
        deliverAllLineItems: 'Confirm to deliver all line items',
        lineItemCountCheck: 'At least one item is needed to submit an order.',
        submitOrder: 'Submit',
        not: 'No',
        quickCheckout: 'Quick checkout',
        backToTables: 'Back to Tables',
        deleteOrder: 'Delete',
        selectItemToDeliver: 'Please select a line item to deliver',
        deliverOrder: 'Deliver',
        payOrder: 'Payment',
        completeOrder: 'Complete',
        stateTip: {
          open: {
            display: 'Open',
            note: 'Order is open'
          },
          inProcess: {
            display: 'Prep',
            note: 'Preparing order'
          },
          prepared: {
            display: 'Prepared',
            note: 'order prepared'
          },
          delivered: {
            display: 'Deliver',
            note: 'Order is delivered'
          },
          settled: {
            display: 'Paid',
            note: 'Order is paid'
          }
        },
      },
      zh: {
        newOrderTitle: '新訂單',
        pinned: '置頂產品',
        addItemSuccess: '新增了 {{product}}',
        nothing: '尚無產品',
        choose: '選擇',
        deliverAllLineItems: '確認所有品項送餐',
        lineItemCountCheck: '請加一個以上的產品到訂單裡.',
        submitOrder: '送單',
        not: '不',
        quickCheckout: '快速結帳',
        backToTables: '回到座位區',
        deleteOrder: '刪除',
        selectItemToDeliver: '請選擇品項送餐',
        deliverOrder: '送餐完畢',
        payOrder: '付款',
        completeOrder: '結束訂單',
        stateTip: {
          open: {
            display: '開單',
            note: '開啟了訂單'
          },
          inProcess: {
            display: '準備中',
            note: '訂單已送出準備中'
          },
          prepared: {
            display: '準備完成',
            note: '訂單已準備完成'
          },
          delivered: {
            display: '已送餐',
            note: '訂單已送達'
          },
          settled: {
            display: '已結帳',
            note: '訂單已付款完畢'
          }
        },
      }
    })

    this.state = {
      activeSections: [0],
      selectedProducts: [],
      status: '',
      labelId: null,
      cc: null,
      orderInfo: null,
      isTablet: context?.isTablet,
      selectedLabel: 'pinned',
      modalVisible: false,
      modalData: {},
      orderLineItems: {},
      quickCheckoutPrint: true,
      otherActionOptions: [
        {label: context.t('printWorkingOrder'), value: 'printWorkingOrder'},
        {label: context.t('printOrderDetails'), value: 'printOrderDetails'},
      ],
      otherAction: null,
    }
    this.onChange = activeSections => {
      this.setState({activeSections: activeSections})
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
            }, {defaultMessage: false},
            response => {
              successMessage(this.context.t('addItemSuccess', {product: product.name}))
              this.props.getOrder(orderId)
            }
          ).then()
        } else {
          if (this.state?.isTablet) {
            this.setState({
              modalVisible: true,
              prdId: productId,
              isEditLineItem: false
            })
          } else {
            this.props.navigation.navigate('OrderFormIII', {
              prdId: productId,
              orderId: this.props.navigation.state.params.orderId
            })
          }
        }
      })
    }).then()
  }

  handleComplete = id => {
    const formData = new FormData()
    formData.append('action', 'COMPLETE')

    dispatchFetchRequestWithOption(api.order.process(id), {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {},
      body: formData
    }, {
      defaultMessage: false
    }, response => {
      this.props.navigation.navigate('TablesSrc')
    }).then()
  }

  editItem = (productId, data) => {
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
          this.setState({
            modalVisible: true,
            prdId: productId,
            isEditLineItem: true,
            modalData: data
          })

        } else {
          if (this.state?.isTablet) {
            this.setState({
              modalVisible: true,
              prdId: productId,
              isEditLineItem: true,
              modalData: data
            })
          } else {
            this.props.navigation.navigate('OrderFormIII', {
              prdId: productId,
              orderId: this.props.navigation.state.params.orderId
            })
          }
        }
      })
    }).then()
  }

  toggleOrderLineItem = (lineItemId) => {
    const lineItem = this.state?.orderLineItems?.hasOwnProperty(lineItemId) ? this.state.orderLineItems[lineItemId] : {
      checked: false,
      value: lineItemId
    }
    lineItem.checked = !lineItem.checked

    const lineItems = this.state.orderLineItems
    lineItems[lineItemId] = lineItem

    this.setState({orderLineItems: lineItems})
  }
  handleDeliver = id => {
    const lineItemIds = []

    Object.keys(this.state.orderLineItems).map(id => {
      const orderLineItem = this.state.orderLineItems[id];
      if (orderLineItem.checked) {
        lineItemIds.push(orderLineItem.value)
      }
    })

    if (lineItemIds.length === 0) {
      const formData = new FormData()
      formData.append('action', 'DELIVER')

      Alert.alert(
        `${this.context.t('action.confirmMessageTitle')}`,
        `${this.context.t('deliverAllLineItems')}`,
        [
          {
            text: `${this.context.t('action.yes')}`,
            onPress: () => {
              dispatchFetchRequest(api.order.process(id), {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: formData
              },
                response => {
                  this.props.navigation.navigate('TablesSrc')
                }).then()
            }
          },
          {
            text: `${this.context.t('action.no')}`,
            onPress: () => console.log('Cancelled'),
            style: 'cancel'
          }
        ]
      )
    } else {
      dispatchFetchRequest(api.order.deliverLineItems(id), {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({lineItemIds: lineItemIds})
      },
        response => {
          this.props.navigation.navigate('TablesSrc')
        }).then()
    }
  }

  handleDeleteLineItem = (orderId, lineItemId) => {
    dispatchFetchRequest(api.order.deleteLineItem(orderId, lineItemId), {
      method: 'DELETE',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    }, response => {
      this.props.navigation.navigate('OrderFormII')
      this.props.getOrder(this.props.order.orderId)
    }).then()
  }

  handleFreeLineitem = (orderId, lineitemId, isFree) => {
    const formData = new FormData()
    formData.append('free', isFree)
    dispatchFetchRequestWithOption(
      api.order.updateLineItemPrice(orderId, lineitemId),
      {
        method: 'PATCH',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: formData
      }, {
      defaultMessage: false
    }, response => {
      response.json().then(data => {
        const message = isFree ? 'order.free' : 'order.cancelFree'
        successMessage(this.context.t(message))
        this.props.navigation.navigate('OrderFormII')
        this.props.getOrder(this.props.order.orderId)
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
      themeStyle,

      productsData
    } = this.props

    const {reverseThemeStyle, t, splitParentOrderId} = this.context
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
    } else {
      /*tablet render*/
      if (this?.state?.isTablet) {
        return (
          <ThemeContainer>
            <View style={{...styles.fullWidthScreen, marginBottom: 0}}>
              <ScreenHeader backNavigation={true}
                parentFullScreen={true}
                title={t('newOrderTitle')}
              />
              <OrderTopInfo order={order} />
              <OrderItemDetailEditModal
                modalVisible={this.state.modalVisible}
                submitOrder={(orderId) => {
                  this.setState({modalVisible: false});
                  this.props.navigation.navigate('OrderFormII', {
                    orderId: orderId
                  })
                }}
                closeModal={() => {this.setState({modalVisible: false})}}
                data={this.state.modalData}
                navigation={this.props.navigation}
                prdId={this.state?.prdId}
                isEditLineItem={this.state?.isEditLineItem ?? false} />


              <View style={{flexDirection: 'row', flex: 1}}>
                {/* left list */}
                <View style={[themeStyle, styles.orderItemSideBar]}>
                  <ScrollView style={{flex: 1}}>
                    <View style={[styles.tableRowContainer, styles.tableCellView, styles.flex(1), themeStyle,]}>
                      <TouchableOpacity style={[(this.state.selectedLabel === 'pinned' ? styles.selectedLabel : null), {flex: 1}]} onPress={() => {this.setState({selectedLabel: 'pinned'})}}>
                        {this.PanelHeader(t('pinned'), '0')}
                      </TouchableOpacity>
                    </View>

                    {labels.map(lbl => (
                      <View style={[styles.tableRowContainer, styles.tableCellView, styles.flex(1), themeStyle,]}>
                        <TouchableOpacity style={[(this.state.selectedLabel === lbl.label ? styles.selectedLabel : null), {flex: 1}]} onPress={() => {this.setState({selectedLabel: lbl.label})}}>
                          {this.PanelHeader(lbl.label, '0')}
                        </TouchableOpacity>
                      </View>
                    ))}
                    <View style={[styles.tableRowContainer, styles.tableCellView, styles.flex(1), themeStyle,]}>
                      <TouchableOpacity style={[(this.state.selectedLabel === 'ungrouped' ? styles.selectedLabel : null), {flex: 1}]} onPress={() => {this.setState({selectedLabel: 'ungrouped'})}}>
                        {this.PanelHeader(t('product.ungrouped'), '0')}
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </View>
                {/* item box */}
                <View style={styles.orderItemBox}>
                  <View style={{flex: 4}}>
                    <ScrollView style={{flex: 1}}>

                      {(this.state?.selectedLabel === 'pinned' && map.get('pinned') !== undefined && map.get('pinned')?.length > 0) ?
                        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>{map.get('pinned').map(prd => {
                          console.log('prd', prd)
                          return (

                            <TouchableOpacity style={[{width: '22%', backgroundColor: 'green', marginLeft: '3%', marginBottom: '3%', borderRadius: 10}, reverseThemeStyle]}
                              onPress={() => this.addItemToOrder(prd.id)}>
                              <View style={{aspectRatio: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                                <StyledText style={[reverseThemeStyle, {fontWeight: 'bold'}]}>{prd.name}</StyledText>
                                <StyledText style={reverseThemeStyle}>{prd.description}</StyledText>
                                <StyledText style={reverseThemeStyle}>${prd.price}</StyledText>
                              </View>
                            </TouchableOpacity>
                          )
                        })}</View> : this.state?.selectedLabel === 'pinned' ? <StyledText style={{alignSelf: 'center'}}>{t('nothing')}</StyledText> : null}

                      {(this.state?.selectedLabel === 'ungrouped' && map.get('ungrouped') !== undefined && map.get('ungrouped')?.length > 0) ?
                        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>{map.get('ungrouped').map(prd => (

                          <TouchableOpacity style={[{width: '22%', backgroundColor: 'green', marginLeft: '3%', marginBottom: '3%', borderRadius: 10}, reverseThemeStyle]}
                            onPress={() => this.addItemToOrder(prd.id)}>
                            <View style={{aspectRatio: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                              <StyledText style={[reverseThemeStyle, {fontWeight: 'bold'}]}>{prd.name}</StyledText>
                              <StyledText style={reverseThemeStyle}>{prd.description}</StyledText>
                              <StyledText style={reverseThemeStyle}>${prd.price}</StyledText>
                            </View>
                          </TouchableOpacity>
                        ))}</View> : this.state?.selectedLabel === 'ungrouped' ? <StyledText style={{alignSelf: 'center'}}>{t('nothing')}</StyledText> : null}

                      {labels.map(lbl => {
                        if (this.state?.selectedLabel === lbl.label) {
                          return (
                            <>
                              {(map.get(lbl.label) !== undefined && map.get(lbl.label)?.length > 0) ?
                                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>{map.get(lbl.label).map(prd => (

                                  <TouchableOpacity style={[{width: '22%', backgroundColor: 'green', marginLeft: '3%', marginBottom: '3%', borderRadius: 10}, reverseThemeStyle]} onPress={() => this.addItemToOrder(prd.id)}>
                                    <View style={{aspectRatio: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                                      <StyledText style={[reverseThemeStyle, {fontWeight: 'bold'}]}>{prd.name}</StyledText>
                                      <StyledText style={reverseThemeStyle}>{prd.description}</StyledText>
                                      <StyledText style={reverseThemeStyle}>${prd.price}</StyledText>
                                    </View>
                                  </TouchableOpacity>
                                ))}</View> : <StyledText style={{alignSelf: 'center'}}>{t('nothing')}</StyledText>}
                            </>

                          )
                        }
                      })}

                    </ScrollView>
                  </View>
                  <View style={{flexDirection: 'row', flex: 1, padding: '3%'}}>
                    {order.state === 'OPEN' && <>
                      <View style={{flex: 1, marginHorizontal: 0, flexDirection: 'row'}}>
                        <DeleteBtn
                          containerStyle={{
                            flex: 1,
                            alignItems: 'center',
                            borderRadius: 4,
                            borderWidth: 1,
                            borderColor: '#f75336',
                            justifyContent: 'center',
                            backgroundColor: '#f75336',
                          }}
                          textStyle={{
                            textAlign: 'center',
                            fontSize: 16,
                            color: '#fff',
                          }}
                          handleDeleteAction={() => handleDelete(order.orderId, () => NavigationService.navigate('TablesSrc'))}
                        />
                        <View style={{flex: 1, marginHorizontal: 5}}>
                          <TouchableOpacity
                            onPress={() =>
                              order.lineItems.length === 0
                                ? warningMessage(t('lineItemCountCheck'))
                                : Alert.alert(
                                  `${t('quickCheckoutPrint')}`,
                                  ``,
                                  [
                                    {
                                      text: `${this.context.t('action.yes')}`,
                                      onPress: async () => {
                                        await handleQuickCheckout(order, true)
                                      }
                                    },
                                    {
                                      text: `${this.context.t('action.no')}`,
                                      onPress: async () => await handleQuickCheckout(order, false),
                                      style: 'cancel'
                                    }
                                  ]
                                )
                            }
                            style={styles.flexButtonSecondAction}
                          >

                            <Text style={styles.flexButtonSecondActionText}>
                              {t('quickCheckout')}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={{flex: 1, marginHorizontal: 5}}>
                        <View style={{flex: 1}}>
                          <TouchableOpacity
                            onPress={() =>
                              order.lineItems.length === 0
                                ? warningMessage(t('lineItemCountCheck'))
                                : handleOrderSubmit(order.orderId)
                            }
                            style={styles.flexButton}
                          >
                            <Text style={styles.flexButtonText}>
                              {t('submitOrder')}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </>
                    }
                    {order.state === 'IN_PROCESS' && <>
                      <View style={{flex: 1, marginHorizontal: 0, flexDirection: 'row'}}>
                        <DeleteBtn
                          containerStyle={{
                            flex: 1,
                            alignItems: 'center',
                            borderRadius: 4,
                            borderWidth: 1,
                            borderColor: '#f75336',
                            justifyContent: 'center',
                            backgroundColor: '#f75336',
                          }}
                          textStyle={{
                            textAlign: 'center',
                            fontSize: 16,
                            color: '#fff',
                          }}
                          handleDeleteAction={() => handleDelete(order.orderId, () => NavigationService.navigate('TablesSrc'))}
                        />
                        <View style={{flex: 1, marginHorizontal: 5, flexDirection: 'column'}}>
                          <View style={{flex: 1}}>
                            <Field
                              name="otherAction"
                              component={DropDown}
                              options={this.state.otherActionOptions}
                              onChange={(value) => {
                                this.setState({
                                  otherAction: value
                                })
                              }}
                            />
                          </View>
                          <View style={{flex: 1}}>
                            {!!this.state?.otherAction &&
                              <SecondActionButton
                                onPress={() =>
                                  order.lineItems.length === 0
                                    ? warningMessage(t('lineItemCountCheck'))
                                    : this.state?.otherAction === 'printOrderDetails' ? handlePrintOrderDetails(order.orderId) : handlePrintWorkingOrder(order.orderId)
                                }
                                containerStyle={styles.flexButtonSecondAction}
                                style={styles.flexButtonSecondActionText}
                                title={t(this.state?.otherAction)}
                              />
                            }
                          </View>
                        </View>
                      </View>
                      <View style={{flex: 1, marginHorizontal: 5, flexDirection: 'row'}}>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                          <TouchableOpacity
                            onPress={() =>
                              order.lineItems.length === 0
                                ? warningMessage(t('lineItemCountCheck'))
                                : handleOrderSubmit(order.orderId)
                            }
                            style={styles.flexButtonSecondAction}
                          >
                            <Text style={styles.flexButtonSecondActionText}>
                              {t('submitOrder')}
                            </Text>
                          </TouchableOpacity>
                          <SecondActionButton
                            onPress={() =>
                              order.lineItems.length === 0
                                ? warningMessage(t('lineItemCountCheck'))
                                : Alert.alert(
                                  `${t('quickCheckoutPrint')}`,
                                  ``,
                                  [
                                    {
                                      text: `${this.context.t('action.yes')}`,
                                      onPress: async () => {
                                        await handleQuickCheckout(order, true)
                                      }
                                    },
                                    {
                                      text: `${this.context.t('action.no')}`,
                                      onPress: async () => await handleQuickCheckout(order, false),
                                      style: 'cancel'
                                    }
                                  ]
                                )
                            }
                            containerStyle={styles.flexButtonSecondAction}
                            style={styles.flexButtonSecondActionText}
                            title={t('quickCheckout')}
                          />
                        </View>
                        <View style={{flex: 1, marginLeft: 5}}>
                          <TouchableOpacity
                            onPress={() => {
                              this.handleDeliver(order.orderId);
                            }}
                            style={styles.flexButton}
                          >
                            <Text style={styles.flexButtonText}>{t('deliverOrder')}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </>
                    }
                    {order.state === 'DELIVERED' && <>
                      <View style={{flex: 1, marginHorizontal: 0, flexDirection: 'row'}}>
                        <DeleteBtn
                          containerStyle={{
                            flex: 1,
                            alignItems: 'center',
                            borderRadius: 4,
                            borderWidth: 1,
                            borderColor: '#f75336',
                            justifyContent: 'center',
                            backgroundColor: '#f75336',
                          }}
                          textStyle={{
                            textAlign: 'center',
                            fontSize: 16,
                            color: '#fff',
                          }}
                          handleDeleteAction={() => handleDelete(order.orderId, () => NavigationService.navigate('TablesSrc'))}
                        />
                        <View style={{flex: 1, marginHorizontal: 5, flexDirection: 'column'}}>
                          <View style={{flex: 1}}>
                            <Field
                              name="otherAction"
                              component={DropDown}
                              options={this.state.otherActionOptions}
                              onChange={(value) => {
                                this.setState({
                                  otherAction: value
                                })
                              }}
                            />
                          </View>
                          <View style={{flex: 1}}>
                            {!!this.state?.otherAction &&
                              <SecondActionButton
                                onPress={() =>
                                  order.lineItems.length === 0
                                    ? warningMessage(t('lineItemCountCheck'))
                                    : this.state?.otherAction === 'printOrderDetails' ? handlePrintOrderDetails(order.orderId) : handlePrintWorkingOrder(order.orderId)
                                }
                                containerStyle={styles.flexButtonSecondAction}
                                style={styles.flexButtonSecondActionText}
                                title={t(this.state?.otherAction)}
                              />
                            }
                          </View>
                        </View>
                      </View>

                      <View style={{flex: 1, marginHorizontal: 5, flexDirection: 'row'}}>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                          <TouchableOpacity
                            onPress={() =>
                              order.lineItems.length === 0
                                ? warningMessage(t('lineItemCountCheck'))
                                : handleOrderSubmit(order.orderId)
                            }
                            style={styles.flexButtonSecondAction}
                          >
                            <Text style={styles.flexButtonSecondActionText}>
                              {t('submitOrder')}
                            </Text>
                          </TouchableOpacity>
                          <SecondActionButton
                            onPress={() => {
                              if (splitParentOrderId === null || splitParentOrderId === order?.orderId) {
                                this.props.navigation.navigate('SpiltBillScreen', {
                                  order: order
                                })
                              }
                              else {
                                Alert.alert(
                                  `${t('splittingCheck')}`,
                                  ``,
                                  [
                                    {
                                      text: `${this.context.t('action.yes')}`,
                                      onPress: async () => {
                                        await revertSplitOrder(this.context?.splitParentOrderId, this.context?.splitOrderId)
                                        await this.context?.saveSplitOrderId(null)
                                        await this.context?.saveSplitParentOrderId(null)
                                        this.props.navigation.navigate('SpiltBillScreen', {
                                          order: order
                                        })
                                      }
                                    },
                                    {
                                      text: `${this.context.t('action.no')}`,
                                      onPress: () => console.log('Cancelled'),
                                      style: 'cancel'
                                    }
                                  ]
                                )
                              }
                            }
                            }
                            containerStyle={styles.flexButtonSecondAction}
                            style={styles.flexButtonSecondActionText}
                            title={t('splitBill.SpiltBillScreenTitle')}
                          />
                        </View>
                        <View style={{flex: 1, marginLeft: 5}}>
                          <TouchableOpacity
                            onPress={() =>
                              order.lineItems.length === 0
                                ? warningMessage(t('lineItemCountCheck'))
                                : this.props.navigation.navigate('Payment', {
                                  order: order
                                })
                            }
                            style={styles.flexButton}
                          >
                            <Text style={styles.flexButtonText}>{t('payOrder')}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </>
                    }
                    {order.state === 'SETTLED' && <>
                      <View style={{flex: 1, marginHorizontal: 0, flexDirection: 'row'}}>
                        <View style={{flex: 1, marginHorizontal: 5, flexDirection: 'column'}}>
                          <View style={{flex: 1}}>
                            <Field
                              name="otherAction"
                              component={DropDown}
                              options={this.state.otherActionOptions}
                              onChange={(value) => {
                                this.setState({
                                  otherAction: value
                                })
                              }}
                            />
                          </View>
                          <View style={{flex: 1}}>
                            {!!this.state?.otherAction &&
                              <SecondActionButton
                                onPress={() =>
                                  order.lineItems.length === 0
                                    ? warningMessage(t('lineItemCountCheck'))
                                    : this.state?.otherAction === 'printOrderDetails' ? handlePrintOrderDetails(order.orderId) : handlePrintWorkingOrder(order.orderId)
                                }
                                containerStyle={styles.flexButtonSecondAction}
                                style={styles.flexButtonSecondActionText}
                                title={t(this.state?.otherAction)}
                              />
                            }
                          </View>
                        </View>

                      </View>

                      <View style={{flex: 1, marginHorizontal: 5, flexDirection: 'row'}}>

                        <View style={{flex: 1, marginLeft: 5}}>
                          <TouchableOpacity
                            onPress={() => this.handleComplete(order.orderId)}
                            style={styles.flexButtonSecondAction}
                          >
                            <Text style={styles.flexButtonSecondActionText}>{t('completeOrder')}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </>
                    }
                  </View>
                </View>

                <View style={styles.orderItemRightList}>
                  <View style={{flex: 5}}>
                    <ScrollView style={{flex: 1}}>
                      {order?.lineItems?.length > 0 ?
                        order?.lineItems?.map((item, index) => {
                          return (
                            <SwipeRow
                              leftOpenValue={50}
                              rightOpenValue={-50}
                              ref={(e) => this[`ref_${index}`] = e}
                            >
                              <View style={{flex: 1, marginBottom: '3%', borderRadius: 10, width: '100%', flexDirection: 'row'}}>
                                <View style={{flex: 1, borderRadius: 10}} >
                                  <TouchableOpacity
                                    onPress={() => {
                                      this[`ref_${index}`]?.closeRow()
                                      if (item.price === 0) {
                                        this.handleFreeLineitem(order.orderId, item.lineItemId, false)
                                      } else {
                                        this.handleFreeLineitem(order.orderId, item.lineItemId, true)
                                      }
                                    }}
                                    style={{flex: 1, backgroundColor: mainThemeColor, borderRadius: 10, paddingLeft: 5, alignItems: 'flex-start', justifyContent: 'center'}}>
                                    <StyledText style={{width: 40}}>{item.price === 0 ? t('order.cancelFreeLineitem') : t('order.freeLineitem')}</StyledText>
                                  </TouchableOpacity>
                                </View>
                                <View style={{...styles.delIcon, flex: 1, borderRadius: 10}} >
                                  <DeleteBtn
                                    handleDeleteAction={() => {
                                      this[`ref_${index}`]?.closeRow()
                                      this.handleDeleteLineItem(
                                        order.orderId,
                                        item.lineItemId
                                      );
                                    }}
                                    islineItemDelete={true}
                                    containerStyle={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'flex-end'}}
                                  />
                                </View>
                              </View>

                              <TouchableOpacity style={[reverseThemeStyle, {marginBottom: '3%', borderRadius: 10}, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}
                                activeOpacity={0.8}
                                onPress={() => {this.editItem(item.productId, item)}}>
                                <View style={{aspectRatio: 1.5, alignItems: 'center', flexDirection: 'row'}}>
                                  <View style={{flex: 2.5, flexDirection: 'column', paddingLeft: '3%'}}>
                                    <StyledText style={[{...reverseThemeStyle, fontSize: 16, fontWeight: 'bold'}, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}>{item.productName} ${item.price}</StyledText>
                                    {!!item?.options && <StyledText style={[reverseThemeStyle, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}>{item.options}</StyledText>}
                                    {!!item?.appliedOfferInfo && <StyledText style={[reverseThemeStyle, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}>{` ${item?.appliedOfferInfo?.offerName}(${item?.appliedOfferInfo?.overrideDiscount})`}</StyledText>}
                                  </View>
                                  <View style={{flexDirection: 'column', flex: 1, paddingRight: '3%', justifyContent: 'space-around', height: '100%', alignItems: 'flex-end', borderLeftWidth: 1}} >
                                    {['IN_PROCESS', 'ALREADY_IN_PROCESS'].includes(item?.state) && <TouchableOpacity
                                      onPress={() => {
                                        this.setState({
                                          choosenItem: {...this.state?.choosenItem, [item.lineItemId]: !this.state?.choosenItem?.[item.lineItemId] ?? false}
                                        });
                                        this.toggleOrderLineItem(item.lineItemId);
                                      }}
                                    >
                                      <StyledText style={{...reverseThemeStyle, padding: 5, backgroundColor: 'gray', shadowColor: '#000', shadowOffset: {width: 1, height: 1}, shadowOpacity: 1}}>{t('choose')}</StyledText>
                                    </TouchableOpacity>}
                                    <View>
                                      {item?.state === 'OPEN' && <StyledText style={[reverseThemeStyle, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}>{t('stateTip.open.display')}</StyledText>}
                                      {['IN_PROCESS', 'ALREADY_IN_PROCESS'].includes(item?.state) && (
                                        <StyledText style={[reverseThemeStyle, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}>{t('stateTip.inProcess.display')}</StyledText>
                                      )}
                                      {item?.state === 'PREPARED' && <StyledText style={[reverseThemeStyle, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}>{t('stateTip.prepared.display')}</StyledText>}
                                      {item?.state === 'DELIVERED' && (
                                        <StyledText style={[reverseThemeStyle, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}>{t('stateTip.delivered.display')}</StyledText>
                                      )}
                                      {item?.state === 'SETTLED' && <StyledText style={[reverseThemeStyle, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}>{t('stateTip.settled.display')}</StyledText>}
                                    </View>
                                    <StyledText style={[reverseThemeStyle, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}>{`X${item.quantity}`}</StyledText>
                                    <StyledText style={[reverseThemeStyle, (!!this.state?.choosenItem?.[item.lineItemId] && {backgroundColor: mainThemeColor})]}>{item.lineItemSubTotal}</StyledText>
                                  </View>
                                </View>
                              </TouchableOpacity>
                            </SwipeRow>
                          )
                        })
                        : <StyledText style={{alignSelf: 'center'}}>{t('nothing')}</StyledText>}
                    </ScrollView>
                  </View>
                  <View style={{flex: 1, marginVertical: 5, justifyContent: 'space-between'}}>

                    <StyledText style={{textAlign: 'right'}}>{t('order.subtotal')} ${order.total.amountWithTax}</StyledText>
                    <StyledText style={{textAlign: 'right'}}>{t('order.discount')} ${order.discount}</StyledText>
                    <StyledText style={{textAlign: 'right'}}>{t('order.serviceCharge')} ${order.serviceCharge}</StyledText>

                    <StyledText style={{textAlign: 'right'}}>{t('order.total')} ${order.orderTotal}</StyledText>


                  </View>
                </View>
              </View>
            </View>



          </ThemeContainer >
        )
      }
      else {
        /*phone render */
        return (
          <ThemeContainer>
            <ScrollView style={{flex: 1, marginBottom: 45}}>
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
                                  {!!prd?.description && <StyledText>  ({prd?.description})</StyledText>}
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
                                  {!!prd?.description && <StyledText>  ({prd?.description})</StyledText>}
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
                  <Accordion.Panel
                    header={this.PanelHeader(t('product.ungrouped'), '0')}
                    key="ungrouped"
                  >
                    <List>
                      {map.get('ungrouped') !== undefined &&
                        map.get('ungrouped').map(prd => (
                          <ListItem
                            key={prd.id}
                            title={
                              <View style={[styles.tableRowContainer]}>
                                <View style={[styles.tableCellView, styles.flex(1)]}>
                                  <StyledText>{prd.name}</StyledText>
                                  {!!prd?.description && <StyledText>  ({prd?.description})</StyledText>}
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
                  style={{marginRight: 5}}
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
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <FontAwesomeIcon
                      name="shopping-cart"
                      size={30}
                      color="#fff"
                      style={{marginRight: 5}}
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


  }
}

const mapStateToProps = state => ({
  labels: state.labels.data.labels,
  subproducts: state.label.data.subLabels,
  products: state.products.data.results,
  haveData: state.products.haveData,
  haveError: state.products.haveError,
  isLoading: state.products.loading,
  order: state.order.data,
  productsData: state.products
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getLables: () => dispatch(getLables()),
  getProducts: () => dispatch(getProducts()),
  getOrder: () => dispatch(getOrder(props.navigation.state.params.orderId)),
  getfetchOrderInflights: () => dispatch(getfetchOrderInflights()),
  getOrdersByDateRange: () => dispatch(getOrdersByDateRange()),
  clearOrder: () => dispatch(clearOrder(props.navigation.state.params.orderId)),
})

OrderFormII = reduxForm({
  form: 'orderformII'
})(OrderFormII)

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withContext
)
export default enhance(OrderFormII)

import React from 'react'
import {reduxForm, Field} from 'redux-form'
import {Alert, ScrollView, Text, TouchableOpacity, View, StyleSheet, Dimensions, PixelRatio, Platform} from 'react-native'
import {connect} from 'react-redux'
import {Accordion, List} from '@ant-design/react-native'
import {getLables, getProducts, getProductsDetail, clearOrder, getOrder, getTimeDifference, getPrinters} from '../actions'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import LoadingScreen from "./LoadingScreen";
import BackendErrorScreen from "./BackendErrorScreen";
import {api, dispatchFetchRequest, dispatchFetchRequestWithOption, successMessage, warningMessage, apiRoot} from '../constants/Backend'
import {ThemeContainer} from "../components/ThemeContainer";
import {StyledText} from "../components/StyledText";
import {ListItem} from "react-native-elements";
import {withContext} from "../helpers/contextHelper";
import {compose} from "redux";
import OrderItemDetailEditModal from './OrderItemDetailEditModal';
import OrderItemMoveTableModal from './OrderItemMoveTableModal';
import OrderTopInfo from "./OrderTopInfo";
import DeleteBtn from '../components/DeleteBtn'
import {handleDelete, handleOrderSubmit, handleQuickCheckout, revertSplitOrder, handlePrintWorkingOrder, handlePrintOrderDetails, handleOrderAction, getTableDisplayName} from "../helpers/orderActions";
import {SwipeRow} from 'react-native-swipe-list-view'
import ScreenHeader from "../components/ScreenHeader";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {MainActionFlexButton, SecondActionButton} from "../components/ActionButtons";
import {printMessage} from "../helpers/printerActions";
import DropDown from "../components/DropDown";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import {SplitBillPopUp} from '../components/PopUp'
import Colors from "../constants/Colors";
import {OfferTooltip} from "../components/OfferTooltip";
import {RealTimeOrderUpdate} from '../components/RealTimeOrderUpdate'

class OrderFormII extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext
  _isMounted = false
  constructor(props, context) {
    super(props, context)
    this.myRef = React.createRef();

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
      otherAction: null,
      splitBillModalVisible: false,
      moveItemMode: false,
      moveItems: [],
      tableModalVisible: false
    }
    this.onChange = activeSections => {
      this.setState({activeSections: activeSections})
    }
  }

  componentDidMount() {
    this._isMounted = true

    if (this._isMounted) {
      this.props.getLables()
      this.props.getProductsDetail()

      this._getOrder = this.props.navigation.addListener('focus', () => {
        this.props.route.params.orderId !== undefined && this.props.getOrder(this.props.route.params.orderId)
      })

    }
  }
  componentWillUnmount() {
    this._isMounted = false
    this._getOrder()
    this.setState = (state, callback) => {
      return
    }
  }

  PanelHeader = (labelName, labelId, isSelected = false) => {
    return (
      <View style={styles.listPanel}>
        <StyledText style={{...styles.listPanelText, color: isSelected ? '#fff' : undefined}}>{labelName}</StyledText>
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
        console.log("visible option check")
        console.log("inventory check:", product.inventory)
        if (product.productOptions == null || product.productOptions.length === 0 && product.inventory == null && product.productComboLabels == null) {


          const orderId = this.props.route.params.orderId
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
              successMessage(this.context.t('orderForm.addItemSuccess', {quantity: 1, product: product.name}))
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
              orderId: this.props.route.params.orderId
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
      this.props.navigation.navigate('TablesScr')
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
        if (product.productOptions == null || product.productOptions.length === 0 && product.inventory == null && product.productComboLabels == null) {
          const orderId = this.props.route.params.orderId
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
              orderId: this.props.route.params.orderId
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

  handleSelectedItemPrint = (id) => {
    const lineItemIds = []

    Object.keys(this.state.orderLineItems).map(id => {
      const orderLineItem = this.state.orderLineItems[id];
      if (orderLineItem.checked) {
        lineItemIds.push(orderLineItem.value)
      }
    })
    handlePrintWorkingOrder(id, lineItemIds)
  }


  handleSettledDeliver = id => {
    const lineItemIds = []

    Object.keys(this.state.orderLineItems).map(id => {
      const orderLineItem = this.state.orderLineItems[id];
      if (orderLineItem.checked) {
        lineItemIds.push(orderLineItem.value)
      }
    })

    if (lineItemIds.length === 0) {

      Alert.alert(
        `${this.context.t('action.confirmMessageTitle')}`,
        `${this.context.t('orderForm.deliverAllLineItems')}`,
        [
          {
            text: `${this.context.t('action.yes')}`,
            onPress: () => {
              console.log("settled deliver check")
              dispatchFetchRequest(api.order.settledProcess(id), {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                },
              },
                response => {
                  this.props.navigation.navigate('TablesScr')
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
          this.props.navigation.navigate('TablesScr')
        }).then()
    }
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
        `${this.context.t('orderForm.deliverAllLineItems')}`,
        [
          {
            text: `${this.context.t('action.yes')}`,
            onPress: () => {
              dispatchFetchRequest(api.order.process(id), {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {
                  // Andriod return error with wrong type
                  // 'Content-Type': 'application/json',
                },
                body: formData
              },
                response => {
                  this.props.navigation.navigate('TablesScr')
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
          this.props.navigation.navigate('TablesScr')
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
      this.props.getOrder(orderId)
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
          // andriod run error
          // 'Content-Type': 'application/json'
        },
        body: formData
      }, {
      defaultMessage: false
    }, response => {
      response.json().then(data => {
        const message = isFree ? 'order.free' : 'order.cancelFree'
        successMessage(this.context.t(message))
        this.props.navigation.navigate('OrderFormII')
        this.props.getOrder(orderId)
      })
    }).then()
  }

  handleMergeOrder = (setid, orderId) => {
    dispatchFetchRequest(api.order.mergeOrderSet(setid), {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({orderId: orderId})
    }, response => {
      response.json().then(data => {
        this.props.getOrder(orderId)
      })
    }).then(() => handleOrderAction(this.props.order?.orderId, 'ENTER_PAYMENT', () => this.props.navigation.navigate('Payment', {
      order: this.props.order
    })))
  }

  handleItemOutOfStock = (lineItemId, outOfStock) => {
    Alert.alert(
      `${this.context.t(outOfStock ? `order.toggleUnmarkOutOfStockMsg` : `order.toggleOutOfStockMsg`)}`,
      ``,
      [
        {
          text: `${this.context.t('action.yes')}`,
          onPress: () => {
            dispatchFetchRequest(api.product.toggleOutOfStock(lineItemId), {
              method: 'POST',
              withCredentials: true,
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              }
            }, response => {
              this.props.navigation.navigate('OrderFormII')
              this.props.getProductsDetail()
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

  }

  getSplitBillByHeadCount = (id) => {
    dispatchFetchRequestWithOption(
      api.splitOrder.splitByHead(id),
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {'Content-Type': 'application/json', },

      }, {
      defaultMessage: false
    },
      response => {
        response.json().then(data => {

          let isPaid = data?.splitAmounts?.filter((item) => item?.paid)?.length > 0
          if (data?.headCount >= 2 && isPaid) {
            this.setState({splitBillModalVisible: true})
          } else {
            handleOrderAction(this.props.order?.orderId, 'ENTER_PAYMENT', () => this.props.navigation.navigate('Payment', {
              order: this.props.order
            }))
          }

        })
      },
      response => {

      }
    ).then()
  }

  handleToggleTableModal = (flag) => {
    this.setState({tableModalVisible: flag})
  }
  resetTableModal = () => {
    this.setState({moveItemMode: false, moveItems: [], tableModalVisible: false})
  }

  normalize = (size) => {
    const {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    } = Dimensions.get('window');
    const scale = SCREEN_WIDTH / 320;
    const newSize = size * scale
    if (Platform.OS === 'ios') {
      return Math.round(PixelRatio.roundToNearestPixel(newSize))
    } else {
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
    }
  }

  handleOnMessage = (data, id) => {
    if (data === `${id}.order.orderChanged`) {
      console.log("refresh order")
      this.props.getOrder(this.props.route.params.orderId)
    }
  }


  render() {
    const {
      productsDetail = [],
      labels = [],
      haveError,
      isLoading,
      order,
      themeStyle,
      orderIsLoading,
      productsData,
      route,
      printers = [],
    } = this.props

    const {reverseThemeStyle, t, splitParentOrderId, customMainThemeColor, customBackgroundColor} = this.context
    const map = new Map(Object.entries(productsDetail))

    let totalQuantity = 0

    order.lineItems !== undefined && order.lineItems.map(lineItem => {
      totalQuantity += lineItem.quantity
    })

    order.lineItems !== undefined && order.lineItems?.sort((a, b) => {
      let sort = ["OPEN", "IN_PROCESS", "ALREADY_IN_PROCESS", "PREPARED", "DELIVERED", "SETTLED"];
      return sort.indexOf(a.state) - sort.indexOf(b.state);
    });

    let isAllPrepared = false;
    order.lineItems !== undefined && order.lineItems.forEach(lineItem => {
      let stateOpen = ["IN_PROCESS", "ALREADY_IN_PROCESS", "PREPARED"];
      if (stateOpen.includes(lineItem.state)) {
        isAllPrepared = true
      }
    })


    TimeAgo.addLocale(en)
    const timeAgo = new TimeAgo()

    if (isLoading) {
      return (
        <LoadingScreen />
      )
    } else if (haveError) {
      return (
        <BackendErrorScreen />
      )
    } else if (productsDetail !== undefined && productsDetail.length === 0) {
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
              <RealTimeOrderUpdate
                topics={`/topic/order/${this.props.route.params.orderId}`}
                handleOnMessage={this.handleOnMessage}
                id={this.props.route.params.orderId}
              />
              <ScreenHeader backNavigation={true}
                backAction={() => this.props.navigation.navigate('TablesScr')}
                parentFullScreen={true}
                title={t('orderForm.newOrderTitle')}
              />
              <OrderTopInfo order={order} route={route} />
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
                route={this.props.route}
                productsDetail={productsDetail}
                labels={labels}
                prdId={this.state?.prdId}
                isEditLineItem={this.state?.isEditLineItem ?? false} />
              <OrderItemMoveTableModal
                tableModalVisible={this.state.tableModalVisible}
                toggleModal={this.handleToggleTableModal}
                reset={this.resetTableModal}
                data={this.state.moveItems}
                navigation={this.props.navigation}
                route={this.props.route}
              />
              <SplitBillPopUp
                navigation={this.props.navigation}
                toRoute={['SpiltBillScreen', 'SplitBillByHeadScreen', 'SplitBillByAmountScreen']}
                textForRoute={[t('order.splitByItem'), t('order.splitByHeadCount'), t('order.splitByCustomAmount')]}
                title={t('order.splitBillPopUpTitle')}
                params={[{order: order}, {order: order}, {order: order}]}
                isVisible={this.state?.splitBillModalVisible}
                toggleModal={(visible) => this.setState({splitBillModalVisible: visible})}
                orderId={order?.orderId}
              />


              <View style={{flexDirection: 'row', flex: 1}}>
                {/* left list */}
                <View style={[themeStyle, styles.orderItemSideBar, styles?.customBorderAndBackgroundColor(this.context), {borderColor: customMainThemeColor, borderTopWidth: 1, paddingTop: 5}]}>
                  <ScrollView style={{flex: 1}}>
                    <View style={[styles.tableRowContainer, styles.tableCellView, styles.flex(1), themeStyle, styles?.customBorderAndBackgroundColor(this.context)]}>
                      <TouchableOpacity style={[(this.state.selectedLabel === 'pinned' ? styles?.selectedLabel(customMainThemeColor) : null), {flex: 1}]} onPress={() => {this.setState({selectedLabel: 'pinned'})}}>
                        {this.PanelHeader(t('orderForm.pinned'), '0', this.state.selectedLabel === 'pinned')}
                      </TouchableOpacity>
                    </View>

                    {labels.map((lbl, index) => (
                      <View style={[styles.tableRowContainer, styles.tableCellView, styles.flex(1), themeStyle, styles?.customBorderAndBackgroundColor(this.context)]} key={index}>
                        <TouchableOpacity style={[(this.state.selectedLabel === lbl.label ? styles?.selectedLabel(customMainThemeColor) : null), {flex: 1}]} onPress={() => {this.setState({selectedLabel: lbl.label})}}>
                          {this.PanelHeader(lbl.label, '0', this.state.selectedLabel === lbl.label)}
                        </TouchableOpacity>
                      </View>
                    ))}
                    <View style={[styles.tableRowContainer, styles.tableCellView, styles.flex(1), themeStyle, styles?.customBorderAndBackgroundColor(this.context)]}>
                      <TouchableOpacity style={[(this.state.selectedLabel === 'ungrouped' ? styles?.selectedLabel(customMainThemeColor) : null), {flex: 1}]} onPress={() => {this.setState({selectedLabel: 'ungrouped'})}}>
                        {this.PanelHeader(t('product.ungrouped'), '0', this.state.selectedLabel === 'ungrouped')}
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </View>
                {/* item box */}
                <View style={[styles.orderItemBox, {borderRightWidth: 1, borderLeftWidth: 1, borderColor: customMainThemeColor, borderTopWidth: 1, paddingTop: 5}]}>
                  <View style={{flex: 4}}>
                    <ScrollView style={{flex: 1}}>

                      {(this.state?.selectedLabel === 'pinned' && map.get('pinned') !== undefined && map.get('pinned')?.length > 0) ?
                        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>{map.get('pinned').map((prd) => {
                          return (

                            <TouchableOpacity style={[{width: '22%', marginLeft: '2%', marginBottom: '2%', borderRadius: 10}, {backgroundColor: '#d6d6d6'}, (prd?.outOfStock && {backgroundColor: 'gray'})]}
                              key={prd.id}
                              onPress={() => {
                                if (order.state === 'PAYMENT_IN_PROCESS' || order.state === 'COMPLETED') {
                                  warningMessage(t('order.unableEditPayingOrder'))
                                } else {
                                  if (prd?.outOfStock) {
                                    this.handleItemOutOfStock(prd.id, prd?.outOfStock)
                                  } else {
                                    this.addItemToOrder(prd.id)
                                  }
                                }
                              }
                              }
                              onLongPress={() => {
                                if (order.state === 'PAYMENT_IN_PROCESS' || order.state === 'COMPLETED') {
                                  warningMessage(t('order.unableEditPayingOrder'))
                                } else {
                                  this.handleItemOutOfStock(prd.id, prd?.outOfStock)
                                }
                              }}>
                              <View style={{aspectRatio: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                                {prd?.outOfStock && <View style={{position: 'absolute', alignSelf: 'center'}} >
                                  <Icon name='cancel' color='white' style={[{fontSize: this.normalize(32), padding: 0, margin: 0}]} />
                                </View>}
                                <View style={{alignItems: 'center'}}>
                                  <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, {fontSize: 16, fontWeight: 'bold'}, (prd?.outOfStock && {backgroundColor: 'rgba(128, 128, 128, 0)'})]}>{prd.name}</StyledText>
                                  {prd?.childProducts?.length > 0 && <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (prd?.outOfStock && {backgroundColor: 'rgba(128, 128, 128, 0)'})]}>- {prd.childProducts?.map((childProduct) => childProduct?.name).join(',')}</StyledText>}
                                </View>
                                <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (prd?.outOfStock && {backgroundColor: 'rgba(128, 128, 128, 0)'})]}>{prd.description}</StyledText>
                                <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (prd?.outOfStock && {backgroundColor: 'rgba(128, 128, 128, 0)'})]}>${prd.price}</StyledText>
                                {!!prd.hasOptions &&
                                  <View style={[{position: 'absolute', right: 12, bottom: 20}]}>
                                    <StyledText>
                                      <Icon name='more' size={20} color={customMainThemeColor} />
                                    </StyledText>
                                  </View>
                                }
                                {!!prd.comboProduct &&
                                  <View style={[{position: 'absolute', right: 10, bottom: (!!prd.hasOptions ? 40 : 20)},]}>
                                    <StyledText>
                                      <Icon name='basket-unfill' size={24} color={customMainThemeColor} />
                                    </StyledText>
                                  </View>
                                }
                              </View>
                            </TouchableOpacity>
                          )
                        })}</View> : this.state?.selectedLabel === 'pinned' ? <StyledText style={{alignSelf: 'center'}}>{t('orderForm.nothing')}</StyledText> : null}

                      {(this.state?.selectedLabel === 'ungrouped' && map.get('ungrouped') !== undefined && map.get('ungrouped')?.length > 0) ?
                        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>{map.get('ungrouped').map(prd => (

                          <TouchableOpacity style={[{width: '22%', marginLeft: '2%', marginBottom: '2%', borderRadius: 10}, {backgroundColor: '#d6d6d6'}, (prd?.outOfStock && {backgroundColor: 'gray'})]}
                            key={prd?.id}
                            onPress={() => {
                              if (order.state === 'PAYMENT_IN_PROCESS' || order.state === 'COMPLETED') {
                                warningMessage(t('order.unableEditPayingOrder'))
                              } else {
                                if (prd?.outOfStock) {
                                  this.handleItemOutOfStock(prd.id, prd?.outOfStock)
                                } else {
                                  this.addItemToOrder(prd.id)
                                }
                              }
                            }
                            }
                            onLongPress={() => {
                              if (order.state === 'PAYMENT_IN_PROCESS' || order.state === 'COMPLETED') {
                                warningMessage(t('order.unableEditPayingOrder'))
                              } else {
                                this.handleItemOutOfStock(prd.id, prd?.outOfStock)
                              }
                            }}
                          >
                            <View style={{aspectRatio: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                              {prd?.outOfStock && <View style={{position: 'absolute', alignSelf: 'center'}} >
                                <Icon name='cancel' color='white' style={[{fontSize: this.normalize(32), padding: 0, margin: 0}]} />
                              </View>}
                              <View style={{alignItems: 'center'}}>
                                <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, {fontSize: 16, fontWeight: 'bold'}, (prd?.outOfStock && {backgroundColor: 'rgba(128, 128, 128, 0)'})]}>{prd.name}</StyledText>
                                {prd?.childProducts?.length > 0 && <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (prd?.outOfStock && {backgroundColor: 'rgba(128, 128, 128, 0)'})]}>- {prd.childProducts?.map((childProduct) => childProduct?.name).join(',')}</StyledText>}
                              </View>
                              <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (prd?.outOfStock && {backgroundColor: 'rgba(128, 128, 128, 0)'})]}>{prd.description}</StyledText>
                              <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (prd?.outOfStock && {backgroundColor: 'rgba(128, 128, 128, 0)'})]}>${prd.price}</StyledText>
                              {!!prd.hasOptions &&
                                <View style={[{position: 'absolute', right: 12, bottom: 20}]}>
                                  <StyledText>
                                    <Icon name='more' size={20} color={customMainThemeColor} />
                                  </StyledText>
                                </View>
                              }
                              {!!prd.comboProduct &&
                                <View style={[{position: 'absolute', right: 10, bottom: (!!prd.hasOptions ? 40 : 20)}]}>
                                  <StyledText>
                                    <Icon name='basket-unfill' size={24} color={customMainThemeColor} />
                                  </StyledText>
                                </View>
                              }
                            </View>
                          </TouchableOpacity>
                        ))}</View> : this.state?.selectedLabel === 'ungrouped' ? <StyledText style={{alignSelf: 'center'}}>{t('orderForm.nothing')}</StyledText> : null}

                      {labels.map(lbl => {
                        if (this.state?.selectedLabel === lbl.label) {
                          return (
                            <View key={lbl.id}>
                              {(map.get(lbl.label) !== undefined && map.get(lbl.label)?.length > 0) ?
                                <View key={lbl.label} style={{flexDirection: 'row', flexWrap: 'wrap'}}>{map.get(lbl.label).map(prd => {
                                  return (
                                    <TouchableOpacity style={[{width: '22%', marginLeft: '2%', marginBottom: '2%', borderRadius: 10}, {backgroundColor: '#d6d6d6'}, (prd?.outOfStock && {backgroundColor: 'gray'})]}
                                      onPress={() => {
                                        if (order.state === 'PAYMENT_IN_PROCESS' || order.state === 'COMPLETED') {
                                          warningMessage(t('order.unableEditPayingOrder'))
                                        } else {
                                          if (prd?.outOfStock) {
                                            this.handleItemOutOfStock(prd.id, prd?.outOfStock)
                                          } else {
                                            this.addItemToOrder(prd.id)
                                          }
                                        }
                                      }
                                      }
                                      onLongPress={() => {
                                        if (order.state === 'PAYMENT_IN_PROCESS' || order.state === 'COMPLETED') {
                                          warningMessage(t('order.unableEditPayingOrder'))
                                        } else {
                                          this.handleItemOutOfStock(prd.id, prd?.outOfStock)
                                        }
                                      }}
                                      key={prd.id}
                                    >

                                      <View style={{aspectRatio: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                                        {prd?.outOfStock && <View style={{position: 'absolute', alignSelf: 'center'}} >
                                          <Icon name='cancel' color='white' style={[{fontSize: this.normalize(32), padding: 0, margin: 0}]} />
                                        </View>}
                                        <View style={{alignItems: 'center'}}>
                                          <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, {fontSize: 16, fontWeight: 'bold'}, (prd?.outOfStock && {backgroundColor: 'rgba(128, 128, 128, 0)'})]}>{prd.name}</StyledText>
                                          {prd?.childProducts?.length > 0 && <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (prd?.outOfStock && {backgroundColor: 'rgba(128, 128, 128, 0)'})]}>- {prd.childProducts?.map((childProduct) => childProduct?.name).join(',')}</StyledText>}
                                        </View>
                                        <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (prd?.outOfStock && {backgroundColor: 'rgba(128, 128, 128, 0)'})]}>{prd.description}</StyledText>
                                        <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, (prd?.outOfStock && {backgroundColor: 'rgba(128, 128, 128, 0)'})]}>${prd.price}</StyledText>
                                        {!!prd.hasOptions &&
                                          <View style={[{position: 'absolute', right: 12, bottom: 20}]}>
                                            <StyledText>
                                              <Icon name='more' size={20} color={customMainThemeColor} />
                                            </StyledText>
                                          </View>
                                        }
                                        {!!prd.comboProduct &&
                                          <View style={[{position: 'absolute', right: 10, bottom: (!!prd.hasOptions ? 40 : 20)}]}>
                                            <StyledText>
                                              <Icon name='basket-unfill' size={24} color={customMainThemeColor} />
                                            </StyledText>
                                          </View>
                                        }
                                      </View>
                                    </TouchableOpacity>
                                  )
                                })}</View> : <StyledText style={{alignSelf: 'center'}}>{t('orderForm.nothing')}</StyledText>}
                            </View>

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
                          handleDeleteAction={() => handleDelete(order.orderId, () => {
                            if (order.orderType === 'TAKE_OUT') {
                              this.props.navigation.navigate('Home', {screen: 'LoginSuccess'})
                            } else {
                              this.props.navigation.navigate('Tables', {screen: 'TablesScr'})
                            }
                          })}
                        />
                        <View style={{flex: 1, marginHorizontal: 5}}>
                          <TouchableOpacity
                            onPress={() =>

                              order.lineItems.length === 0
                                ? warningMessage(t('orderForm.lineItemCountCheck'))
                                : printers.length === 0 ?
                                  handleQuickCheckout(order, false)
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
                            style={[styles?.flexButtonSecondAction(this.context), (order.orderType === 'TAKE_OUT') && styles?.flexButton(customMainThemeColor)]}
                          >

                            <Text style={[styles?.flexButtonSecondActionText(customMainThemeColor), (order.orderType === 'TAKE_OUT') && styles?.flexButtonText]}>
                              {t('orderForm.quickCheckout')}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      {(order.orderType !== 'TAKE_OUT') &&
                        <View style={{flex: 1, marginHorizontal: 5}}>
                          <View style={{flex: 1}}>
                            <TouchableOpacity
                              onPress={() =>
                                order.lineItems.length === 0
                                  ? warningMessage(t('orderForm.lineItemCountCheck'))
                                  : handleOrderSubmit(order.orderId)
                              }
                              style={styles?.flexButton(customMainThemeColor)}
                            >
                              <Text style={styles.flexButtonText}>
                                {t('orderForm.submitOrder')}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      }
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
                          handleDeleteAction={() => handleDelete(order.orderId, () => {
                            if (order.orderType === 'TAKE_OUT') {
                              this.props.navigation.navigate('Home', {screen: 'LoginSuccess'})
                            } else {
                              this.props.navigation.navigate('Tables', {screen: 'TablesScr'})
                            }
                          })}
                        />
                        <View style={{flex: 1, marginHorizontal: 5, flexDirection: 'row'}}>
                          <View style={{flex: 1, flexDirection: 'column'}}>
                            <SecondActionButton
                              confirmPrompt={true}
                              onPress={() =>
                                order.lineItems.length === 0
                                  ? warningMessage(t('orderForm.lineItemCountCheck'))
                                  : handlePrintOrderDetails(order.orderId)
                              }
                              containerStyle={[styles?.flexButtonSecondAction(this.context), {marginBottom: 3}]}
                              style={[styles?.flexButtonSecondActionText(customMainThemeColor)]}
                              title={t('printOrderDetails')}
                            />
                            <SecondActionButton
                              confirmPrompt={true}
                              onPress={() => {
                                order.lineItems.length === 0
                                  ? warningMessage(t('orderForm.lineItemCountCheck'))
                                  : this.handleSelectedItemPrint(order.orderId)
                              }}
                              containerStyle={styles?.flexButtonSecondAction(this.context)}
                              style={styles?.flexButtonSecondActionText(customMainThemeColor)}
                              title={t('printWorkingOrder')}
                            />
                          </View>
                        </View>
                      </View>
                      <View style={{flex: 1, marginHorizontal: 5, flexDirection: 'row'}}>
                        {order.orderType !== 'TAKE_OUT' &&
                          <View style={{flex: 1, flexDirection: 'column'}}>
                            <TouchableOpacity
                              onPress={() =>
                                order.lineItems.length === 0
                                  ? warningMessage(t('orderForm.lineItemCountCheck'))
                                  : handleOrderSubmit(order.orderId)
                              }
                              style={[styles?.flexButtonSecondAction(this.context), {marginBottom: 3}]}
                            >
                              <Text style={styles?.flexButtonSecondActionText(customMainThemeColor)}>
                                {t('orderForm.submitOrder')}
                              </Text>
                            </TouchableOpacity>
                            <SecondActionButton
                              onPress={() =>
                                order.lineItems.length === 0
                                  ? warningMessage(t('orderForm.lineItemCountCheck'))
                                  : printers.length === 0 ?
                                    handleQuickCheckout(order, false)

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
                              containerStyle={styles?.flexButtonSecondAction(this.context)}
                              style={styles?.flexButtonSecondActionText(customMainThemeColor)}
                              title={t('orderForm.quickCheckout')}
                            />
                          </View>
                        }
                        {order.orderType !== 'TAKE_OUT' ?
                          <View style={{flex: 1, marginLeft: 5}}>
                            <TouchableOpacity
                              onPress={() => {
                                this.handleDeliver(order.orderId);
                              }}
                              style={styles?.flexButton(customMainThemeColor)}
                            >
                              <Text style={styles.flexButtonText}>{t('orderForm.deliverOrder')}</Text>
                            </TouchableOpacity>
                          </View>
                          :
                          <View style={{flex: 1, marginLeft: 0}}>
                            <MainActionFlexButton
                              onPress={() =>
                                order.lineItems.length === 0
                                  ? warningMessage(t('orderForm.lineItemCountCheck'))
                                  : printers.length === 0 ?
                                    handleQuickCheckout(order, false)
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
                              title={t('orderForm.quickCheckout')}
                            />
                          </View>
                        }
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
                          handleDeleteAction={() => handleDelete(order.orderId, () => {
                            if (order.orderType === 'TAKE_OUT') {
                              this.props.navigation.navigate('Home', {screen: 'LoginSuccess'})
                            } else {
                              this.props.navigation.navigate('Tables', {screen: 'TablesScr'})
                            }
                          })}
                        />
                        <View style={{flex: 1, marginHorizontal: 5, flexDirection: 'column'}}>
                          <View style={{flex: 1, flexDirection: 'column'}}>
                            <SecondActionButton
                              confirmPrompt={true}
                              onPress={() =>
                                order.lineItems.length === 0
                                  ? warningMessage(t('orderForm.lineItemCountCheck'))
                                  : handlePrintOrderDetails(order.orderId)
                              }
                              containerStyle={[styles?.flexButtonSecondAction(this.context), {marginBottom: 3}]}
                              style={[styles?.flexButtonSecondActionText(customMainThemeColor)]}
                              title={t('printOrderDetails')}
                            />
                            <SecondActionButton
                              confirmPrompt={true}
                              onPress={() => {
                                order.lineItems.length === 0
                                  ? warningMessage(t('orderForm.lineItemCountCheck'))
                                  : this.handleSelectedItemPrint(order.orderId)
                              }}
                              containerStyle={styles?.flexButtonSecondAction(this.context)}
                              style={styles?.flexButtonSecondActionText(customMainThemeColor)}
                              title={t('printWorkingOrder')}
                            />
                          </View>
                        </View>
                      </View>

                      <View style={{flex: 1, marginHorizontal: 5, flexDirection: 'row'}}>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                          <TouchableOpacity
                            onPress={() =>
                              order.lineItems.length === 0
                                ? warningMessage(t('orderForm.lineItemCountCheck'))
                                : handleOrderSubmit(order.orderId)
                            }
                            style={[styles?.flexButtonSecondAction(this.context), {marginBottom: 3}]}
                          >
                            <Text style={styles?.flexButtonSecondActionText(customMainThemeColor)}>
                              {t('orderForm.submitOrder')}
                            </Text>
                          </TouchableOpacity>
                          <SecondActionButton
                            onPress={() => {
                              if (splitParentOrderId === null || splitParentOrderId === order?.orderId) {

                                this.setState({splitBillModalVisible: true})
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

                                        this.setState({splitBillModalVisible: true})
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
                            containerStyle={styles?.flexButtonSecondAction(this.context)}
                            style={styles?.flexButtonSecondActionText(customMainThemeColor)}
                            title={t('splitBill.SpiltBillScreenTitle')}
                          />
                        </View>
                        <View style={{flex: 1, marginLeft: 5}}>
                          <TouchableOpacity
                            onPress={() =>
                              order.lineItems.length === 0
                                ? warningMessage(t('orderForm.lineItemCountCheck'))
                                : (!!this.props.route.params?.orderSetData && this.props.route.params?.orderSetData?.status !== 'MERGED')
                                  ? Alert.alert(
                                    `${this.context.t('order.mergeOrderTitle')}`,
                                    `${this.context.t('order.mergeOrderMsg')}`,
                                    [
                                      {
                                        text: `${this.context.t('action.yes')}`,
                                        onPress: () => {
                                          this.handleMergeOrder(this.props.route.params?.orderSetData?.id, order.orderId)
                                        }
                                      },
                                      {
                                        text: `${this.context.t('action.no')}`,
                                        onPress: () => console.log('Cancelled'),
                                        style: 'cancel'
                                      }
                                    ]
                                  )
                                  : this.getSplitBillByHeadCount(order?.orderId)
                            }
                            style={styles?.flexButton(customMainThemeColor)}
                          >
                            <Text style={styles.flexButtonText}>{t('orderForm.payOrder')}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </>
                    }
                    {order.state === 'SETTLED' && <>
                      <View style={{flex: 1, marginHorizontal: 0, flexDirection: 'row'}}>
                        <View style={{flex: 1, marginHorizontal: 5, flexDirection: 'column'}}>
                          <View style={{flex: 1, flexDirection: 'column'}}>
                            <SecondActionButton
                              confirmPrompt={true}
                              onPress={() =>
                                order.lineItems.length === 0
                                  ? warningMessage(t('orderForm.lineItemCountCheck'))
                                  : handlePrintOrderDetails(order.orderId)
                              }
                              containerStyle={[styles?.flexButtonSecondAction(this.context), {marginBottom: 3}]}
                              style={[styles?.flexButtonSecondActionText(customMainThemeColor)]}
                              title={t('printOrderDetails')}
                            />
                            <SecondActionButton
                              confirmPrompt={true}
                              onPress={() => {
                                order.lineItems.length === 0
                                  ? warningMessage(t('orderForm.lineItemCountCheck'))
                                  : this.handleSelectedItemPrint(order.orderId)
                              }}
                              containerStyle={styles?.flexButtonSecondAction(this.context)}
                              style={styles?.flexButtonSecondActionText(customMainThemeColor)}
                              title={t('printWorkingOrder')}
                            />
                          </View>
                        </View>

                      </View>

                      <View style={{flex: 1, marginHorizontal: 5, flexDirection: isAllPrepared ? 'column' : 'row'}}>

                        {isAllPrepared && <View style={{flex: 1, marginLeft: 5, marginBottom: 5}}>
                          <TouchableOpacity
                            onPress={() => {
                              this.handleSettledDeliver(order.orderId);
                            }}
                            style={styles?.flexButton(customMainThemeColor)}
                          >
                            <Text style={styles.flexButtonText}>{t('orderForm.deliverOrder')}</Text>
                          </TouchableOpacity>

                        </View>
                        }

                        <View style={{flex: 1, marginLeft: 5}}>
                          <TouchableOpacity
                            onPress={() => this.handleComplete(this.props.route.params?.orderSetData?.mainOrderId ?? order.orderId)}
                            style={styles?.flexButtonSecondAction(this.context)}
                          >
                            <Text style={styles?.flexButtonSecondActionText(customMainThemeColor)}>{t('order.completeOrder')}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </>
                    }
                    {(!!this.state.moveItemMode && (this.state?.moveItems && this.state?.moveItems.length !== 0)) && <>
                      <View style={{flex: 0.5, marginLeft: 5}}>
                        <TouchableOpacity
                          onPress={() => {
                            this.handleToggleTableModal(true);
                          }}
                          style={styles?.flexButton(customMainThemeColor)}
                        >
                          <Text style={styles.flexButtonText}>{t('orderForm.moveToTable')}</Text>
                        </TouchableOpacity>
                      </View>
                    </>}

                  </View>
                </View>

                <View style={[styles.orderItemRightList, {borderColor: customMainThemeColor, borderTopWidth: 1, paddingTop: 5}]}>
                  {orderIsLoading ? <View style={{flex: 5, borderBottomWidth: 1, borderColor: customMainThemeColor, paddingLeft: 10}}><LoadingScreen /></View>
                    : <View style={{flex: 5, borderBottomWidth: 1, borderColor: customMainThemeColor, paddingLeft: 10}}>
                      {(['OPEN', 'IN_PROCESS', 'ALREADY_IN_PROCESS', 'PREPARED', 'DELIVERED'].includes(order.state) && order?.lineItems?.length > 0) && <View style={[styles.flex(1), {marginBottom: 8, maxHeight: 28}]}>
                        <TouchableOpacity style={[styles.flexButton(customMainThemeColor), (!!this.state.moveItemMode && {backgroundColor: customBackgroundColor})]}
                          onPress={() => {

                            this.setState({moveItemMode: !this.state.moveItemMode, moveItems: []})
                          }}
                        >
                          <View style={{flexDirection: 'row', padding: 4}}>
                            <StyledText style={[styles.dynamicHorizontalPadding(4)]}>
                              <Icon name='redo' size={18} color={!!this.state.moveItemMode ? customMainThemeColor : customBackgroundColor} />
                            </StyledText>
                            <Text style={[{color: customBackgroundColor}, (!!this.state.moveItemMode && {color: customMainThemeColor})]}>
                              {!!this.state.moveItemMode ? t('orderForm.selectItems') : t('orderForm.moveItems')}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>}
                      <ScrollView style={{flex: 1}}>
                        {order?.lineItems?.length > 0 ?
                          order?.lineItems?.map((item, index) => {
                            return (
                              <SwipeRow
                                leftOpenValue={50}
                                rightOpenValue={-50}
                                disableLeftSwipe={!!item?.associatedLineItemId}
                                disableRightSwipe={!!item?.associatedLineItemId || item?.comboTotal > 0}
                                ref={(e) => this[`ref_${index}`] = e}
                                key={index}
                              >
                                <View style={{flex: 1, marginBottom: '3%', borderRadius: 10, width: '100%', flexDirection: 'row'}}>
                                  <View style={{flex: 1, borderRadius: 10}} >
                                    <TouchableOpacity
                                      onPress={() => {
                                        this[`ref_${index}`]?.closeRow()
                                        if (order.state === 'PAYMENT_IN_PROCESS' || order.state === 'COMPLETED') {
                                          warningMessage(t('order.unableEditPayingOrder'))
                                        } else {
                                          if (item.price === 0) {
                                            this.handleFreeLineitem(order.orderId, item.lineItemId, false)
                                          } else {
                                            this.handleFreeLineitem(order.orderId, item.lineItemId, true)
                                          }
                                        }
                                      }}
                                      style={{flex: 1, backgroundColor: customMainThemeColor, borderRadius: 10, paddingLeft: 5, alignItems: 'flex-start', justifyContent: 'center'}}>
                                      <StyledText style={{width: 40, color: '#fff'}}>{item.price === 0 ? t('order.cancelFreeLineitem') : t('order.freeLineitem')}</StyledText>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={{...styles.delIcon, flex: 1, borderRadius: 10}} >
                                    <DeleteBtn
                                      handleDeleteAction={() => {
                                        this[`ref_${index}`]?.closeRow()
                                        if (order.state === 'PAYMENT_IN_PROCESS' || order.state === 'COMPLETED') {
                                          warningMessage(t('order.unableEditPayingOrder'))
                                        } else {
                                          this.handleDeleteLineItem(
                                            order.orderId,
                                            item.lineItemId
                                          )
                                        }
                                      }}
                                      islineItemDelete={true}
                                      containerStyle={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'flex-end'}}
                                    />
                                  </View>
                                </View>


                                <TouchableOpacity
                                  disabled={!!item?.associatedLineItemId || item?.comboTotal > 0 || item?.state !== 'OPEN' || !!this.state.moveItemMode}
                                  style={[{backgroundColor: '#d6d6d6'}, {marginBottom: '3%', borderRadius: 8, width: '100%'}, ((!!this.state?.choosenItem?.[item.lineItemId] || !!this.state?.moveItems.includes(item.lineItemId)) && {backgroundColor: customMainThemeColor})]}
                                  activeOpacity={0.8}
                                  onPress={() => {
                                    this.editItem(item.productId, item)
                                  }}>
                                  <View style={{aspectRatio: 2, alignItems: 'flex-start', flexDirection: 'row'}}>
                                    <View style={{flex: 2.5, flexDirection: 'column', paddingLeft: '3%', paddingTop: '3%'}}>
                                      <StyledText style={[{...{backgroundColor: '#d6d6d6', color: '#000'}, fontSize: 16, fontWeight: 'bold'}, ((!!this.state?.choosenItem?.[item.lineItemId] || !!this.state?.moveItems.includes(item.lineItemId)) && {backgroundColor: customMainThemeColor})]}>
                                        {!!item?.associatedLineItemId && <Icon name='subdirectory-arrow-right' size={20} color={customMainThemeColor} />}
                                        {item.productName} ${item.price}</StyledText>
                                      {!!item?.childProducts?.length > 0 && <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, ((!!this.state?.choosenItem?.[item.lineItemId] || !!this.state?.moveItems.includes(item.lineItemId)) && {backgroundColor: customMainThemeColor})]}> - {item.childProducts.map((childProduct) => childProduct?.productName).join(',')}</StyledText>}
                                      {!!item?.options && <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, ((!!this.state?.choosenItem?.[item.lineItemId] || !!this.state?.moveItems.includes(item.lineItemId)) && {backgroundColor: customMainThemeColor})]}>{item.options}</StyledText>}
                                      {!!item?.sku && <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, ((!!this.state?.choosenItem?.[item.lineItemId] || !!this.state?.moveItems.includes(item.lineItemId)) && {backgroundColor: customMainThemeColor})]}>{item.sku}</StyledText>}
                                      {!!item?.appliedOfferInfo && <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, ((!!this.state?.choosenItem?.[item.lineItemId] || !!this.state?.moveItems.includes(item.lineItemId)) && {backgroundColor: customMainThemeColor})]}>{` ${item?.appliedOfferInfo?.offerName}(${item?.appliedOfferInfo?.overrideDiscount})`}</StyledText>}
                                    </View>
                                    <View style={{position: 'absolute', bottom: '3%', left: '3%', flexDirection: 'row'}}>
                                      <View style={{marginRight: 5}}>
                                        {item?.state === 'OPEN' && <StyledText style={[{backgroundColor: `${Colors.orderBgWhite}`, color: `${Colors.orderOpen}`, paddingHorizontal: 2, fontWeight: "bold"}, ((!!this.state?.choosenItem?.[item.lineItemId] || !!this.state?.moveItems.includes(item.lineItemId)) && {backgroundColor: customMainThemeColor})]}>{t('orderForm.stateTip.open.display')}</StyledText>}
                                        {['IN_PROCESS', 'ALREADY_IN_PROCESS'].includes(item?.state) && (
                                          <StyledText style={[{backgroundColor: `${Colors.orderBgGray}`, color: `${Colors.orderInProcess}`, paddingHorizontal: 2, fontWeight: "bold"}, ((!!this.state?.choosenItem?.[item.lineItemId] || !!this.state?.moveItems.includes(item.lineItemId)) && {backgroundColor: customMainThemeColor})]}>{t('orderForm.stateTip.inProcess.display')}</StyledText>
                                        )}
                                        {item?.state === 'PREPARED' && <StyledText style={[{backgroundColor: `${Colors.orderBgGray}`, color: `${Colors.orderPrepare}`, paddingHorizontal: 2, fontWeight: "bold"}, ((!!this.state?.choosenItem?.[item.lineItemId] || !!this.state?.moveItems.includes(item.lineItemId)) && {backgroundColor: customMainThemeColor})]}>{t('orderForm.stateTip.prepared.display')}</StyledText>}
                                        {item?.state === 'DELIVERED' && (
                                          <StyledText style={[{backgroundColor: `${Colors.orderBgGray}`, color: `${Colors.orderDeliver}`, paddingHorizontal: 2, fontWeight: "bold"}, ((!!this.state?.choosenItem?.[item.lineItemId] || !!this.state?.moveItems.includes(item.lineItemId)) && {backgroundColor: customMainThemeColor})]}>{t('orderForm.stateTip.delivered.display')}</StyledText>
                                        )}
                                        {item?.state === 'SETTLED' && <StyledText style={[{backgroundColor: '#d6d6d6', color: '#808080'}, ((!!this.state?.choosenItem?.[item.lineItemId] || !!this.state?.moveItems.includes(item.lineItemId)) && {backgroundColor: customMainThemeColor})]}>{t('orderForm.stateTip.settled.display')}</StyledText>}
                                      </View>
                                      <StyledText style={[{backgroundColor: '#d6d6d6', color: '#808080'}, ((!!this.state?.choosenItem?.[item.lineItemId] || !!this.state?.moveItems.includes(item.lineItemId)) && {backgroundColor: customMainThemeColor})]}>
                                        {timeAgo.format(Date.now() - getTimeDifference(item?.createdDate), {flavour: 'narrow'})}
                                      </StyledText>
                                    </View>
                                    <View style={{flexDirection: 'column', flex: 1, padding: '3%', justifyContent: 'space-between', height: '100%', alignItems: 'flex-end', borderLeftWidth: 1}} >

                                      <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between'}}>
                                        <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, ((!!this.state?.choosenItem?.[item.lineItemId] || !!this.state?.moveItems.includes(item.lineItemId)) && {backgroundColor: customMainThemeColor})]}>{`${item.quantity}`}</StyledText>
                                        <StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}, ((!!this.state?.choosenItem?.[item.lineItemId] || !!this.state?.moveItems.includes(item.lineItemId)) && {backgroundColor: customMainThemeColor})]}>${item.lineItemSubTotal}</StyledText>

                                      </View>
                                      {item?.comboTotal > 0 && <View style={[styles.flex(1)]}><StyledText style={[{backgroundColor: '#d6d6d6', color: '#000'}]}>{`($${item?.comboTotal})`}</StyledText></View>}
                                      {(this.state.moveItemMode && !item?.associatedLineItemId) &&
                                        <TouchableOpacity
                                          onPress={() => {
                                            let moveList = this.state?.moveItems
                                            if (moveList.includes(item.lineItemId)) {
                                              moveList.splice(moveList.indexOf(item.lineItemId), 1)
                                            } else {
                                              moveList.push(item.lineItemId)
                                            }
                                            this.setState({
                                              moveItems: moveList
                                            });
                                          }}
                                          style={[{width: '100%'}]}
                                        >
                                          <StyledText style={[{borderWidth: 1, borderColor: customMainThemeColor, backgroundColor: customBackgroundColor, padding: 4, shadowColor: '#000', shadowOffset: {width: 1, height: 1}, shadowOpacity: 1, width: '100%', textAlign: 'center'}]}>{t('orderForm.choose')}</StyledText>
                                        </TouchableOpacity>
                                      }
                                      {(['IN_PROCESS', 'ALREADY_IN_PROCESS'].includes(item?.state) && !this.state.moveItemMode) && <TouchableOpacity
                                        onPress={() => {
                                          this.setState({
                                            choosenItem: {...this.state?.choosenItem, [item.lineItemId]: !this.state?.choosenItem?.[item.lineItemId] ?? false}
                                          });
                                          this.toggleOrderLineItem(item.lineItemId);
                                        }}
                                        style={{width: '100%', }}
                                      >
                                        <StyledText style={{...{backgroundColor: '#d6d6d6', color: '#fff'}, padding: 5, backgroundColor: '#808080', shadowColor: '#000', shadowOffset: {width: 1, height: 1}, shadowOpacity: 1, width: '100%', textAlign: 'center'}}>{t('orderForm.choose')}</StyledText>
                                      </TouchableOpacity>}
                                    </View>
                                  </View>
                                </TouchableOpacity>
                              </SwipeRow>
                            )
                          })
                          : <StyledText style={{alignSelf: 'center'}}>{t('orderForm.nothing')}</StyledText>}
                      </ScrollView>
                    </View>}
                  <View style={{flex: 1, marginVertical: 5, justifyContent: 'space-between', paddingLeft: 10}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                      <StyledText >{t('order.subtotal')}</StyledText>
                      <StyledText >${order?.total?.amountWithTax}</StyledText>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                      <StyledText >{t('order.discount')}</StyledText>
                      <OfferTooltip
                        offer={order?.appliedOfferInfo}
                        discount={order?.discount}
                        t={t}
                      />
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                      <StyledText >{t('order.serviceCharge')}</StyledText>
                      <StyledText >${order?.serviceCharge}</StyledText>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                      <StyledText >{t('order.total')}</StyledText>
                      <StyledText >${order?.orderTotal}</StyledText>
                    </View>

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
            <ScrollView style={{flex: 1, marginBottom: 45}} scrollIndicatorInsets={{right: 1}}>
              <View style={styles.container}>
                <Text style={styles?.screenTitle(customMainThemeColor)}>
                  {t('orderForm.newOrderTitle')}
                </Text>
              </View>
              <View style={styles.childContainer}>
                <Accordion
                  onChange={this.onChange}
                  expandMultiple={true}
                  activeSections={this.state.activeSections}
                  containerStyle={[styles.inverseBackground(this.context)]}
                >
                  <Accordion.Panel
                    header={this.PanelHeader(t('orderForm.pinned'), '0', true)}
                    key="pinned"
                  >
                    <List>
                      {map.get('pinned') !== undefined &&
                        map.get('pinned').map(prd => (
                          <ListItem
                            key={prd.id}
                            onPress={() => {
                              if (order.state === 'PAYMENT_IN_PROCESS' || order.state === 'COMPLETED') {
                                warningMessage(t('order.unableEditPayingOrder'))
                              } else {
                                this.addItemToOrder(prd.id)
                              }
                            }}
                            bottomDivider
                            containerStyle={[styles.dynamicVerticalPadding(10), styles.customBorderAndBackgroundColor(this.context)]}
                          >
                            <View style={[styles.tableRowContainer]}>
                              <View style={[styles.tableCellView, styles.flex(1)]}>
                                <StyledText>{prd.name}</StyledText>
                                {!!prd?.description && <StyledText>  ({prd?.description})</StyledText>}
                                {!!prd.hasOptions &&
                                <StyledText style={{paddingLeft: 8}}>
                                  <Icon name='more' size={20} color={customMainThemeColor} />
                                </StyledText>
                                }
                                {!!prd.comboProduct &&
                                <StyledText style={{paddingLeft: 8}}>
                                  <Icon name='basket-unfill' size={20} color={customMainThemeColor} />
                                </StyledText>
                                }
                              </View>
                              <View style={[styles.tableCellView, styles.flex(1), styles.justifyRight]}>
                                <StyledText>${prd.price}</StyledText>
                              </View>
                            </View>
                          </ListItem>
                        ))}
                      {map.get('pinned') !== undefined &&
                        map.get('pinned').length === 0 && (
                          <ListItem
                            bottomDivider
                            containerStyle={[styles.dynamicVerticalPadding(10), styles.customBorderAndBackgroundColor(this.context)]}
                          >
                            <View style={[styles.tableRowContainer]}>
                              <View style={[styles.tableCellView, styles.flex(1)]}>
                                <StyledText>({t('empty')})</StyledText>
                              </View>
                            </View>
                          </ListItem>
                        )}
                    </List>
                  </Accordion.Panel>

                  {
                    labels.map(lbl => {
                      return (
                        <Accordion.Panel
                          header={this.PanelHeader(lbl.label, lbl.id, true)}
                          key={lbl.id}
                        >
                          <List>
                            {map.get(lbl.label)?.map(prd => {
                              return (
                                <ListItem
                                  key={prd.id}
                                  onPress={() => {
                                    if (order.state === 'PAYMENT_IN_PROCESS' || order.state === 'COMPLETED') {
                                      warningMessage(t('order.unableEditPayingOrder'))
                                    } else {
                                      this.addItemToOrder(prd.id)
                                    }
                                  }}
                                  bottomDivider
                                  containerStyle={[styles.dynamicVerticalPadding(10), styles.customBorderAndBackgroundColor(this.context)]}
                                >
                                  <View style={[styles.tableRowContainer]}>
                                    <View style={[styles.tableCellView, styles.flex(1)]}>
                                      <StyledText>{prd.name}</StyledText>
                                      {!!prd?.description && <StyledText>  ({prd?.description})</StyledText>}
                                      {!!prd.hasOptions &&
                                      <StyledText style={{paddingLeft: 8}}>
                                        <Icon name='more' size={20} color={customMainThemeColor} />
                                      </StyledText>
                                      }
                                      {!!prd.comboProduct &&
                                      <StyledText style={{paddingLeft: 8}}>
                                        <Icon name='basket-unfill' size={20} color={customMainThemeColor} />
                                      </StyledText>
                                      }
                                    </View>
                                    <View style={[styles.tableCellView, styles.flex(1), styles.justifyRight]}>
                                      <StyledText>${prd.price}</StyledText>
                                    </View>
                                  </View>
                                </ListItem>
                              )
                            }
                            )}
                            {map.get(lbl.label) !== undefined &&
                              map.get(lbl.label).length === 0 && (
                                <ListItem
                                  bottomDivider
                                  containerStyle={[styles.dynamicVerticalPadding(10), styles.customBorderAndBackgroundColor(this.context)]}
                                >
                                  <View style={[styles.tableRowContainer]}>
                                    <View style={[styles.tableCellView, styles.flex(1)]}>
                                      <StyledText>({t('empty')})</StyledText>

                                    </View>

                                  </View>
                                </ListItem>
                              )}
                          </List>
                        </Accordion.Panel>
                      )
                    }
                    )}
                  <Accordion.Panel
                    header={this.PanelHeader(t('product.ungrouped'), '0', true)}
                    key="ungrouped"
                  >
                    <List>
                      {map.get('ungrouped') !== undefined &&
                        map.get('ungrouped').map(prd => (
                          <ListItem
                            key={prd.id}
                            onPress={() => {
                              if (order.state === 'PAYMENT_IN_PROCESS' || order.state === 'COMPLETED') {
                                warningMessage(t('order.unableEditPayingOrder'))
                              } else {
                                this.addItemToOrder(prd.id)
                              }
                            }}
                            bottomDivider
                            containerStyle={[styles.dynamicVerticalPadding(10), styles.customBorderAndBackgroundColor(this.context)]}
                          >
                            <View style={[styles.tableRowContainer]}>
                              <View style={[styles.tableCellView, styles.flex(1)]}>
                                <StyledText>{prd.name}</StyledText>
                                {!!prd?.description && <StyledText>  ({prd?.description})</StyledText>}
                                {!!prd.hasOptions &&
                                <StyledText style={{paddingLeft: 8}}>
                                  <Icon name='more' size={20} color={customMainThemeColor} />
                                </StyledText>
                                }
                                {!!prd.comboProduct &&
                                <StyledText style={{paddingLeft: 8}}>
                                  <Icon name='basket-unfill' size={20} color={customMainThemeColor} />
                                </StyledText>
                                }
                              </View>
                              <View style={[styles.tableCellView, styles.flex(1), styles.justifyRight]}>
                                <StyledText>${prd.price}</StyledText>
                              </View>
                            </View>
                          </ListItem>
                        ))}
                      {(map.get('ungrouped') === undefined || map.get('ungrouped').length === 0) && (
                        <ListItem
                          bottomDivider
                          containerStyle={[styles.dynamicVerticalPadding(10), styles.customBorderAndBackgroundColor(this.context)]}
                        >
                          <View style={[styles.tableRowContainer]}>
                            <View style={[styles.tableCellView, styles.flex(1)]}>
                              <StyledText>({t('empty')})</StyledText>
                            </View>
                          </View>
                        </ListItem>
                      )}
                    </List>
                  </Accordion.Panel>
                </Accordion>
              </View>
            </ScrollView>

            <View style={[styles?.shoppingBar(customMainThemeColor)]}>
              <View style={[styles.tableCellView, styles.half_width]}>
                <Text style={[styles?.primaryText(customMainThemeColor), styles.whiteColor]} numberOfLines={1}>
                  {getTableDisplayName(order)}
                </Text>
              </View>

              <View style={[styles.tableCellView, styles.quarter_width]}>
                <FontAwesomeIcon
                  name="user"
                  size={30}
                  color="#fff"
                  style={{marginRight: 5}}
                />
                <Text style={[styles?.primaryText(customMainThemeColor), styles.whiteColor]}>
                  &nbsp;{order.demographicData != null ? order.demographicData.customerCount : 0}
                </Text>
              </View>

              <View style={[styles.tableCellView, styles.quarter_width, styles.justifyRight]}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('OrdersSummary', {
                      orderId: this.props.route.params.orderId,
                      route: this.props?.route?.params?.route ?? null,
                      onSubmit: this.props.route.params.onSubmit,
                      handleDelete: this.props.route.params.handleDelete
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
                    <View style={styles?.itemCountContainer(customMainThemeColor)}>
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
  productsDetail: state.productsDetail.data.results,
  haveData: state.productsDetail.haveData,
  haveError: state.productsDetail.haveError,
  isLoading: state.productsDetail.loading,
  order: state.order.data,
  orderIsLoading: state.order.loading,
  productsData: state.productsDetail,
  printers: state.printers.data.printers,
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getLables: () => dispatch(getLables()),
  getProductsDetail: () => dispatch(getProductsDetail()),
  getOrder: () => dispatch(getOrder(props.route.params.orderId)),
  clearOrder: () => dispatch(clearOrder(props.route.params.orderId)),
  getPrinters: () => dispatch(getPrinters()),
})

OrderFormII = reduxForm({
  form: 'orderformII'
})(OrderFormII)

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withContext
)
export default enhance(OrderFormII)

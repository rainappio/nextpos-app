import React, {Component, useContext, useState, useEffect, forwardRef} from 'react'
import {Animated, PanResponder, FlatList, RefreshControl, Text, TouchableOpacity, View, Dimensions, KeyboardAvoidingView, Alert, Keyboard} from 'react-native'
import {connect} from 'react-redux'
import AddBtn from '../components/AddBtn'
import OrderStart from './OrderStart'
import OrderItem from './OrderItem'
import {getfetchOrderInflights, getMostRecentShiftStatus, getShiftStatus, getTableLayouts, getTablesAvailable, getTableLayout} from '../actions'
import styles from '../styles'
import {successMessage, api, dispatchFetchRequest, apiRoot} from '../constants/Backend'
import {LocaleContext} from '../locales/LocaleContext'
import {handleDelete, handleOrderSubmit, handleCreateOrderSet, handleDeleteOrderSet, handleOrderAction} from '../helpers/orderActions'
import {handleOpenShift} from "../helpers/shiftActions";
import {getCurrentClient} from "../actions/client";
import LoadingScreen from "./LoadingScreen";
import ScreenHeader from "../components/ScreenHeader";
import {ThemeContainer} from "../components/ThemeContainer";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {StyledText} from "../components/StyledText";
import {withContext} from "../helpers/contextHelper";
import {compose} from "redux";
import StyledTextInput from "../components/StyledTextInput";
import {withAnchorPoint} from 'react-native-anchor-point';
import {style} from 'd3';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TimeAgo from 'javascript-time-ago';
import {getTimeDifference} from '../actions';
import en from 'javascript-time-ago/locale/en';
import NewOrderModal from './NewOrderModal';
import {getInitialTablePosition, getTablePosition, getSetPosition} from "../helpers/tableAction";
import NavigationService from "../navigation/NavigationService";
import {MaterialIcons} from '@expo/vector-icons';
import {RealTimeOrderUpdate} from '../components/RealTimeOrderUpdate'


class TablesScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    const windowWidth = Dimensions.get('window').width - 30;
    const windowHeight = Dimensions.get('window').height - 76;
    console.log("SCREEN SIZE", context?.isTablet);

    this.state = {
      openBalance: 0,
      refreshing: false,
      windowWidth: Dimensions.get('window').width - 30,
      windowHeight: Dimensions.get('window').height - 76,
      scaleMultiple: (Dimensions.get('window').width - 30) / 300,
      tableIndex: 0,
      isTablet: context?.isTablet,
      themeStyle: context?.themeStyle,
      modalVisible: false,
      orderModalData: {},
      screenMode: 'normal',
      selectedOrderId: [],
      ordersInflight: null,
      ordersInflightWSConnected: false
    }
  }

  componentDidMount() {
    this.loadInfo()
    this._loadInfo = this.props.navigation.addListener('focus', async () => {
      await this.loadInfo()
    })
  }
  componentWillUnmount() {
    this._loadInfo()
  }

  loadInfo = () => {
    this.props.getTableLayouts()
    this.props.getShiftStatus()
    this.props.getMostRecentShiftStatus()
    this.props.getfetchOrderInflights()
    this.props.getAvailableTables()
    this.props.getCurrentClient()
  }



  onRefresh = async () => {
    this.setState({refreshing: true})

    this.loadInfo()

    this.setState({refreshing: false}, () => {
      successMessage(this.context.t('refreshed'))
    })
  }

  getTransform = () => {
    let transform = {
      transform: [{scale: this.state.scaleMultiple}],
    };
    return withAnchorPoint(transform, {x: 0, y: 0}, {width: 300, height: 300});
  };

  handleOpenShift = (balance) => {
    handleOpenShift(balance, (response) => {
      this.loadInfo()
      this.setState({openBalance: 0})
    })
  }

  handleSelectTable = (orderId) => {
    let selectedOrderIdArr = [...this.state?.selectedOrderId]
    const index = selectedOrderIdArr?.indexOf(orderId)
    if (index === -1) {
      selectedOrderIdArr.push(orderId)
      this.setState({selectedOrderId: selectedOrderIdArr})
    } else {
      selectedOrderIdArr.splice(index, 1)
      this.setState({selectedOrderId: selectedOrderIdArr})
    }
  }
  handleCreateOrderSet = async () => {
    console.log('handleCreateOrderSet', this.state?.selectedOrderId)
    await handleCreateOrderSet(this.state?.selectedOrderId)
    this.props.getfetchOrderInflights()
    this.setState({
      screenMode: 'normal', selectedOrderId: [], tableWidth: null,
      tableHeight: null,
    })
  }

  handleDeleteOrderSet = async (setId) => {
    await handleDeleteOrderSet(setId)
    this.props.getfetchOrderInflights()
    this.setState({
      screenMode: 'normal', tableWidth: null,
      tableHeight: null,
    })
  }

  handleOnMessage = (data, id) => {
    if (data === `${id}.inflightOrders.ordersChanged`) {
      console.log("refresh table")
      this.props.getfetchOrderInflights()
    }
  }

  render() {
    const {
      navigation,
      route,
      haveData,
      client,
      isLoading,
      tablelayouts,
      shiftStatus,
      recentShift,
      ordersInflight,
      availableTables,
      themeStyle,
      orderSets
    } = this.props
    const {t, customMainThemeColor, customSecondThemeColor, customBackgroundColor} = this.context


    let tableTimeLimit = 0
    let isTimeLimit = false

    if (client.clientSettings?.TABLE_TIME_LIMIT !== undefined && client.clientSettings?.TABLE_TIME_LIMIT?.value !== undefined || client.clientSettings?.TABLE_TIME_LIMIT?.enabled !== undefined) {
      tableTimeLimit = client.clientSettings?.TABLE_TIME_LIMIT?.value
      isTimeLimit = client.clientSettings?.TABLE_TIME_LIMIT?.enabled
    }

    if (isLoading) {
      return (
        <LoadingScreen />
      )
    } else if (tablelayouts === undefined || tablelayouts.length === 0 || !haveData) {
      return (
        <ThemeScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >

          <View style={styles.fullWidthScreen}>
            <ScreenHeader backNavigation={false}
              parentFullScreen={true}
              title={t('menu.tables')}
            />
            <StyledText style={styles.messageBlock}>{t('tableVisual.noTableLayout')}</StyledText>
          </View>
        </ThemeScrollView>
      )
    } else if (recentShift !== undefined && ['CLOSING', 'CONFIRM_CLOSE'].includes(recentShift.data.shiftStatus)) {
      return (
        <ThemeContainer>
          <View style={[styles.fullWidthScreen]}>
            <ScreenHeader backNavigation={false}
              parentFullScreen={true}
              title={t('menu.tables')}
            />
            <View>
              <StyledText style={styles.messageBlock}>{t('tableVisual.shiftClosing')}</StyledText>
            </View>
            <View style={[styles.bottom, styles.horizontalMargin]}>
              <TouchableOpacity onPress={() => navigation.navigate('ShiftClose')}>
                <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                  {t('shift.closeShift')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ThemeContainer>
      )

    } else if (shiftStatus === 'INACTIVE') {
      return (
        <ThemeContainer>
          <KeyboardAvoidingView style={{flex: 1}} behavior="height">
            <View style={styles.modalContainer}>
              <View style={[styles.boxShadow, styles.popUpLayout, themeStyle, styles?.customBorderAndBackgroundColor(this.context)]}>
                <Text style={styles?.screenSubTitle(customMainThemeColor)}>
                  {t('openShift.title')}
                </Text>
                <View style={styles.tableRowContainer}>
                  <View style={[styles.tableCellView, {flex: 1}]}>
                    <StyledText style={[styles.fieldTitle]}>
                      {t('openShift.openBalance')}
                    </StyledText>
                  </View>
                  <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                    <StyledTextInput
                      name="balance"
                      type="text"
                      onChangeText={value =>
                        this.setState({openBalance: value})
                      }
                      placeholder={t('openShift.enterAmount')}
                      blurOnSubmit={true}
                      keyboardType={`numeric`}
                    />
                  </View>
                </View>
                <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
                  <View style={{width: '45%', marginHorizontal: 5}}>
                    <TouchableOpacity onPress={() => {
                      Keyboard.dismiss()
                      this.handleOpenShift(this.state.openBalance)
                    }}>
                      <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                        {t('openShift.open')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{width: '45%', marginHorizontal: 5}}>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate('LoginSuccess')
                      }}
                    >
                      <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>
                        {t('openShift.cancel')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ThemeContainer>
      )
    } else {
      let tableDisplay = 'SHOW_SEAT'

      if (client.attributes !== undefined && client.attributes.TABLE_AVAILABILITY_DISPLAY !== undefined) {
        tableDisplay = client.attributes.TABLE_AVAILABILITY_DISPLAY
      }

      const floorCapacity = {}

      availableTables && tablelayouts && tablelayouts.forEach((layout, idx) => {

        let seatCount = 0
        let tableCount = 0
        const availableTablesOfLayout = availableTables[layout.id]

        availableTablesOfLayout !== undefined && availableTablesOfLayout.forEach((table, idx2) => {
          seatCount += table.capacity
          tableCount += 1
        })

        floorCapacity[layout.id] = {}
        floorCapacity[layout.id].seatCount = seatCount
        floorCapacity[layout.id].tableCount = tableCount
      })

      /*tablet render*/
      if (this?.state?.isTablet) {
        return (
          <ThemeContainer>
            <RealTimeOrderUpdate
              topics={`/topic/inflightOrders/${client?.id}`}
              handleOnMessage={this.handleOnMessage}
              id={client?.id}
            />

            <View style={[styles.fullWidthScreen]}>
              <ScreenHeader backNavigation={false}
                title={t(`${this.state?.screenMode === 'normal' ? 'menu.tables' : 'tableVisual.joinTableMode'}`)}
                parentFullScreen={true}
                rightComponent={
                  this.state?.screenMode === 'normal' ? <AddBtn
                    onPress={() =>
                      this.props.navigation.navigate('OrderStart')
                    }
                  /> : null
                }
              />



              <NewOrderModal modalVisible={this.state.modalVisible}
                submitOrder={(orderId) => {
                  this.setState({modalVisible: false});
                  this.props.navigation.navigate('OrderFormII', {
                    orderId: orderId
                  })
                }}
                closeModal={() => {this.setState({modalVisible: false})}}
                data={this.state.orderModalData} />
              <View style={[styles.container, {marginTop: 0, marginBottom: 10, justifyContent: 'flex-start', }]}>
                {/* table page button */}
                {this.state?.screenMode === 'normal' && <View style={{flexDirection: 'row', width: '100%', minHeight: 80}}>
                  {tablelayouts?.map((tblLayout, index) => {
                    return (<TouchableOpacity
                      key={index}
                      disabled={this.state?.screenMode === 'joinTable'}
                      style={{
                        borderColor: customMainThemeColor,
                        borderWidth: 2,
                        borderBottomWidth: 0,
                        borderLeftWidth: index === 0 ? 2 : 0,
                        padding: 4,
                        width: 120,
                        backgroundColor: this.state?.tableIndex === index ? customMainThemeColor : null,
                      }}
                      onPress={() => {this.setState({tableIndex: index})}}>
                      <StyledText style={[this.state?.tableIndex === index ? styles?.sectionBarText(customBackgroundColor) : (styles?.sectionBarText(customMainThemeColor)), {flex: 4, textAlign: 'center', marginRight: 4}]}>
                        {tblLayout.layoutName}
                      </StyledText>
                      {floorCapacity[tblLayout.id] !== undefined && tableDisplay === 'SHOW_SEAT' && (
                        <>
                          <Text style={[this.state?.tableIndex === index ? styles?.sectionBarText(customBackgroundColor) : (styles?.sectionBarText(customMainThemeColor)), {flex: 4, textAlign: 'center', marginRight: 4}]}>
                            {t('tableVisual.seatingCapacity')} {tblLayout.totalCapacity}
                          </Text>
                          <Text style={[this.state?.tableIndex === index ? styles?.sectionBarText(customBackgroundColor) : (styles?.sectionBarText(customMainThemeColor)), {flex: 4, textAlign: 'center', marginRight: 4}]}>
                            {t('tableVisual.availableSeats')} {floorCapacity[tblLayout.id].seatCount}
                          </Text>
                        </>
                      )}
                      {floorCapacity[tblLayout.id] !== undefined && tableDisplay === 'SHOW_TABLE' && (
                        <>
                          <Text style={[this.state?.tableIndex === index ? styles?.sectionBarText(customBackgroundColor) : (styles?.sectionBarText(customMainThemeColor)), {flex: 4, textAlign: 'center', marginRight: 4}]}>
                            {t('tableVisual.tableCapacity')} {tblLayout.totalTables}
                          </Text>
                          <Text style={[this.state?.tableIndex === index ? styles?.sectionBarText(customBackgroundColor) : (styles?.sectionBarText(customMainThemeColor)), {flex: 4, textAlign: 'center', marginRight: 4}]}>
                            {t('tableVisual.availableTables')} {floorCapacity[tblLayout.id].tableCount}
                          </Text>
                        </>
                      )}

                    </TouchableOpacity>)
                  })}
                  <View style={{flex: 1, }}>
                    <TouchableOpacity
                      disabled={this.state?.screenMode === 'joinTable'}
                      style={{
                        borderColor: customSecondThemeColor,
                        borderWidth: 2,
                        borderBottomWidth: 0,
                        padding: 4,
                        width: 120,
                        alignSelf: 'flex-end',
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: this.state?.tableIndex === -1 ? customSecondThemeColor : null,
                      }}
                      onPress={() => {this.setState({tableIndex: -1})}}>
                      <Text style={[this.state?.tableIndex === -1 ? styles?.sectionBarText(customBackgroundColor) : (styles?.sectionBarText(customSecondThemeColor))]}>
                        {t('tableVisual.otherOrders')}
                      </Text>
                    </TouchableOpacity>
                  </View>

                </View>}
                {/* table */}
                {this.state.tableIndex >= 0 &&
                  <View style={[styles?.ballContainer(customMainThemeColor), {flex: 6}]}>
                    <View onLayout={(event) => {
                      let {x, y, width, height} = event.nativeEvent.layout;
                      this.setState({
                        tableWidth: width,
                        tableHeight: height,
                      })
                    }} style={{width: '100%', height: '100%', alignSelf: 'center', flexWrap: 'wrap'}}>
                      <View style={{justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, right: 0, flexDirection: 'row'}}>
                        <View style={{backgroundColor: '#e7e7e7', borderColor: '#e7e7e7', borderWidth: 2, borderRadius: 12, height: 12, width: 12, margin: 6}}></View>
                        <StyledText>{t('orderState.OTHERS')}</StyledText>
                        <View style={{backgroundColor: '#FFFFF5', borderColor: '#F9C31C', borderWidth: 2, borderRadius: 12, height: 12, width: 12, margin: 6}}></View>
                        <StyledText>{t('orderState.OPEN')}</StyledText>
                        <View style={{backgroundColor: '#FF6915', borderRadius: 12, height: 12, width: 12, margin: 6}}></View>
                        <StyledText>{t('orderState.IN_PROCESS')}</StyledText>
                        <View style={{backgroundColor: '#FFFFF5', borderColor: '#f75336', borderWidth: 2, borderRadius: 12, height: 12, width: 12, margin: 6}}></View>
                        <StyledText>{t('orderState.OVERDUE')}</StyledText>
                        <View style={{backgroundColor: '#FFFFF5', borderColor: '#006B35', borderWidth: 2, borderRadius: 12, height: 12, width: 12, margin: 6}}></View>
                        <StyledText>{t('orderState.DELIVERED')}</StyledText>
                        <View style={{backgroundColor: '#FFFFF5', borderColor: '#e7e7e7', borderWidth: 2, borderRadius: 12, height: 12, width: 12, margin: 6}}></View>
                        <StyledText>{t('orderState.SETTLED')}</StyledText>

                      </View>
                      {(this.state?.tableWidth && !isLoading) || <View style={{flex: 1, width: '100%'}}><LoadingScreen /></View>}
                      {orderSets?.results?.map((item) => {
                        return (this.state?.tableWidth && tablelayouts[this.state.tableIndex]?.id === item?.tableLayoutId &&
                          <TableSet
                            item={item}
                            tableWidth={this.state?.tableWidth ?? this.state?.windowWidth}
                            tableHeight={this.state?.tableHeight ?? this.state?.windowHeight}
                            onPress={(setId) => {this.handleDeleteOrderSet(setId)}}
                            screenMode={this.state?.screenMode}
                          />
                        )
                      })
                      }


                      {
                        tablelayouts[this.state.tableIndex]?.tables?.map((table, index) => {
                          let positionArr = tablelayouts[this.state.tableIndex]?.tables?.map((table, index) => {
                            if (table.position != null) {
                              return {...getTablePosition(table, this.state?.tableWidth ?? this.state?.windowWidth, this.state?.tableHeight ?? this.state?.windowHeight), tableId: table?.tableId, tableData: table}
                            } else {
                              return {...getInitialTablePosition(index, this.state?.tableHeight ?? this.state?.windowHeight), tableId: table?.tableId, tableData: table}
                            }
                          })
                          return (this.state?.tableWidth && !isLoading && <Draggable
                            screenMode={this.state?.screenMode}
                            borderColor={themeStyle.color === '#e7e7e7' ? '#BFBFBF' : '#BFBFBF'}
                            t={t}
                            table={table}
                            tableTimeLimit={tableTimeLimit}
                            isTimeLimit={isTimeLimit}
                            key={table.tableId}
                            layoutId={tablelayouts[this.state.tableIndex]?.id}
                            index={index}
                            getTableLayout={this.props.getTableLayout}
                            tableWidth={this.state?.tableWidth ?? this.state?.windowWidth}
                            tableHeight={this.state?.tableHeight ?? this.state?.windowHeight}
                            positionArr={positionArr}
                            orders={ordersInflight}
                            onRefresh={this.onRefresh}
                            openOrderModal={(item) => {
                              if (this.state?.screenMode === 'joinTable') {
                                console.log('item1', item)
                              } else {
                                this.setState({
                                  modalVisible: true,
                                  orderModalData: item
                                })
                              }

                            }}
                            gotoOrderDetail={(order) => {
                              if (this.state?.screenMode === 'joinTable') {
                                console.log('item2', order)
                                this.handleSelectTable(order?.orderId)
                              } else {
                                let orderSetData = orderSets?.results?.find((orderSetsItem) => {
                                  return orderSetsItem?.linkedOrders?.some((ordersItem) => {return ordersItem?.orderId === order.orderId})
                                })
                                order.state === 'PAYMENT_IN_PROCESS'
                                  ? Alert.alert(
                                    `${t('tableVisual.isPayingTitle')}`,
                                    `${t('tableVisual.isPayingMsg')}`,
                                    [
                                      {
                                        text: `${t('action.yes')}`,
                                        onPress: () => {
                                          this.props.navigation.navigate('Payment', {
                                            order: order
                                          })
                                        }
                                      },
                                      {
                                        text: `${t('action.no')}`,
                                        onPress: () => console.log('Cancelled'),
                                        style: 'cancel'
                                      }
                                    ]
                                  )
                                  : navigation.navigate('OrderFormII', {
                                    orderId: order.orderId,
                                    orderState: order.state,
                                    orderSetData: orderSetData
                                  })
                              }

                            }}
                          />)
                        })
                      }

                    </View>
                  </View>}
                {this.state.tableIndex === -1 &&
                  <View style={[styles.mgrbtn20, styles?.ballContainer(customSecondThemeColor), {flex: 6}]} key='noLayout'>
                    <View style={[styles.sectionBar, {justifyContent: 'flex-start', paddingVertical: 0, }]}>

                    </View>
                    <View style={{flex: 1}}>
                      <FlatList
                        data={ordersInflight?.['NO_LAYOUT']}
                        renderItem={({item}) => {
                          console.log('NO_LAYOUT')
                          return (
                            <View style={{flex: 1}}>
                              <OrderItem
                                order={item}
                                navigation={navigation}
                                route={route}
                                handleOrderSubmit={handleOrderSubmit}
                                handleDelete={handleDelete}
                                tableTimeLimit={tableTimeLimit}
                                isTimeLimit={isTimeLimit}
                                key={item.orderId}
                              />
                            </View>
                          )
                        }}
                        ListEmptyComponent={
                          <View>
                            <StyledText style={styles.messageBlock}>{t('tableVisual.noInflightOrders')}</StyledText>
                          </View>
                        }
                        keyExtractor={(item, idx) => item.orderId}
                      />
                    </View>
                  </View>
                }
              </View>

              {this.state?.screenMode === 'normal' && <View style={{...styles.bottomButtonContainerWithoutFlex, marginTop: 0, flexDirection: 'row', minHeight: 48}}>
                {/* {this.state.tableIndex !== -1 && <TouchableOpacity onPress={() => this.setState({
                  screenMode: 'joinTable',
                  tableWidth: null,
                  tableHeight: null,
                })} style={{flex: 1, marginRight: 8}}>
                  <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor), {flex: 1}]}>
                    {t('tableVisual.joinTable')}
                  </Text>
                </TouchableOpacity>} */}
                <TouchableOpacity onPress={() => NavigationService?.navigateToRoute('OrderDisplayScreen', {screen: 'OrderDisplayScreen'})} style={{flex: 1}}>
                  <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor), {flex: 1}]}>
                    {t('menu.orderDisplay')}
                  </Text>
                </TouchableOpacity>
              </View>}
              {this.state?.screenMode === 'joinTable' && <View style={{...styles.bottomButtonContainerWithoutFlex, marginTop: 0, flexDirection: 'row', minHeight: 48}}>
                <TouchableOpacity onPress={() => this.setState({
                  screenMode: 'normal', selectedOrderId: [], tableWidth: null,
                  tableHeight: null,
                })} style={{flex: 1, marginRight: 8}}>
                  <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context), {flex: 1}]}>
                    {t('action.cancel')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.handleCreateOrderSet()} style={{flex: 1}}>
                  <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor), {flex: 1}]}>
                    {t('action.save')}
                  </Text>
                </TouchableOpacity>
              </View>}
            </View>
          </ThemeContainer >
        )
      }
      /*phone render */
      else {
        return (
          <ThemeScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
          >
            <RealTimeOrderUpdate
              topics={`/topic/inflightOrders/${client?.id}`}
              handleOnMessage={this.handleOnMessage}
              id={client?.id}
            />

            <View style={styles.fullWidthScreen}>
              <ScreenHeader backNavigation={false}
                title={t('menu.tables')}
                parentFullScreen={true}
                rightComponent={
                  <AddBtn
                    onPress={() =>
                      this.props.navigation.navigate('OrderStart')
                    }
                  />
                }
              />


              {tablelayouts.map((tblLayout, idx) => (
                <View style={{}} key={idx}>
                  <View style={[styles.sectionBar, {flex: 1}]}>
                    <Text
                      style={[styles?.sectionBarText(customMainThemeColor), {flex: 4}
                      ]}
                    >
                      {tblLayout.layoutName}
                    </Text>
                    {floorCapacity[tblLayout.id] !== undefined && tableDisplay === 'SHOW_SEAT' && (
                      <Text style={[styles?.sectionBarText(customMainThemeColor), {flex: 4, textAlign: 'right', marginRight: 4}]}>
                        {t('tableVisual.seatingCapacity')} {tblLayout.totalCapacity} {t('tableVisual.availableSeats')} {floorCapacity[tblLayout.id].seatCount}
                      </Text>
                    )}
                    {floorCapacity[tblLayout.id] !== undefined && tableDisplay === 'SHOW_TABLE' && (
                      <Text style={[styles?.sectionBarText(customMainThemeColor), {flex: 4, textAlign: 'right', marginRight: 4}]}>
                        {t('tableVisual.tableCapacity')} {tblLayout.totalTables} {t('tableVisual.availableTables')} {floorCapacity[tblLayout.id].tableCount}
                      </Text>
                    )}
                  </View>
                  <FlatList
                    data={ordersInflight?.[tblLayout.id]}
                    renderItem={({item}) => {
                      return (
                        <OrderItem
                          order={item}
                          navigation={navigation}
                          route={route}
                          handleOrderSubmit={handleOrderSubmit}
                          handleDelete={handleDelete}
                          tableTimeLimit={tableTimeLimit}
                          isTimeLimit={isTimeLimit}
                          key={item.orderId}
                        />
                      )
                    }}
                    ListEmptyComponent={
                      <View>
                        <StyledText style={styles.messageBlock}>{t('tableVisual.noInflightOrders')}</StyledText>
                      </View>
                    }
                    keyExtractor={(item, idx) => item.orderId}
                  />
                </View>
              ))}
              <View style={styles.mgrbtn20} key='noLayout'>
                <View style={[styles.sectionBar, {flex: 1, justifyContent: 'flex-start'}]}>
                  <Text style={[styles?.sectionBarText(customMainThemeColor)]}>
                    {t('tableVisual.otherOrders')}
                  </Text>
                </View>
                <FlatList
                  data={ordersInflight?.['NO_LAYOUT']}
                  renderItem={({item}) => {
                    return (
                      <OrderItem
                        order={item}
                        navigation={navigation}
                        route={route}
                        handleOrderSubmit={handleOrderSubmit}
                        handleDelete={handleDelete}
                        tableTimeLimit={tableTimeLimit}
                        isTimeLimit={isTimeLimit}
                        key={item.orderId}
                      />
                    )
                  }}
                  ListEmptyComponent={
                    <View>
                      <StyledText style={styles.messageBlock}>{t('tableVisual.noInflightOrders')}</StyledText>
                    </View>
                  }
                  keyExtractor={(item, idx) => item.orderId}
                />
              </View>

              <View style={[styles.bottom, styles.horizontalMargin]}>
                <TouchableOpacity onPress={() => NavigationService?.navigateToRoute('OrderDisplayScreen', {screen: 'OrderDisplayScreen'})}>
                  <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                    {t('menu.orderDisplay')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ThemeScrollView>
        )
      }

    }
  }
}

const mapStateToProps = state => ({
  tablelayouts: state.tablelayouts.data.tableLayouts,
  ordersInflight: state.ordersinflight.data.orders,
  orderSets: state.ordersinflight.data?.setData,
  haveData: state.tablelayouts.haveData,
  haveError: state.ordersinflight.haveError || state.tablelayouts.haveError,
  isLoading: state.ordersinflight.loading || state.tablelayouts.loading,
  shiftStatus: state.shift.data.shiftStatus,
  availableTables: state.tablesavailable.data.availableTables,
  client: state.client.data,
  recentShift: {
    loading: state.mostRecentShift.loading,
    haveData: state.mostRecentShift.haveData,
    data: state.mostRecentShift.data,
  }
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getfetchOrderInflights: () => dispatch(getfetchOrderInflights()),
  getTableLayouts: () => dispatch(getTableLayouts()),
  getShiftStatus: () => dispatch(getShiftStatus()),
  getMostRecentShiftStatus: () => dispatch(getMostRecentShiftStatus()),
  getAvailableTables: () => dispatch(getTablesAvailable()),
  getCurrentClient: () => dispatch(getCurrentClient()),
  getTableLayout: (id) => dispatch(getTableLayout(id))
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withContext
)
export default enhance(TablesScreen)

class DraggableBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropAreaValues: null,
      pan: new Animated.ValueXY(),
      panUnder: new Animated.ValueXY(),
      opacity: new Animated.Value(1),
      isDraggable: false,
      tableOrder: props?.orders?.[`${props?.layoutId}`]?.find((item) => {return (item?.tableId === props?.table?.tableId || item?.tables?.some((table) => table?.tableId === props?.table?.tableId))}),
      isSelected: false,
      tableTimeLimit: props?.tableTimeLimit,
      isTimeLimit: props?.isTimeLimit
    };
  }


  componentDidMount() {
    this.initPosition()
  }

  initPosition = () => {
    const windowWidth = this.props.tableWidth;
    const windowHeight = this.props.tableHeight;
    if (this.props.table.position != null) {
      this.state.pan.setValue(getTablePosition(this.props.table, windowWidth, windowHeight))
      this.state.panUnder.setValue(getTablePosition(this.props.table, windowWidth, windowHeight))
    } else {
      this.state.pan.setValue(getInitialTablePosition(this.props.index, windowHeight))
      this.state.panUnder.setValue(getInitialTablePosition(this.props.index, windowHeight))
    }
  }

  handleDragEnd = (pan) => {
    let positionArr = this.props.positionArr
    positionArr?.every((table) => {
      if ((pan.x?._value >= (table?.x - 50)) && (pan.x?._value <= (table?.x + 50)) && (pan.y?._value >= (table?.y - 50)) && (pan.y?._value <= (table?.y + 50))) {
        let toTable = this.props?.orders[`${this.props?.layoutId}`]?.find((item) => {return (item?.tableId === table?.tableId || item?.tables?.some((tableItem) => tableItem?.tableId === table?.tableId))})

        if (!toTable) {
          this.handleChangeTable(table, this.state.tableOrder)
        } else if (toTable && toTable.state !== 'SETTLED' && this.state.tableOrder.state !== 'SETTLED') {
          const t = this.props.t
          Alert.alert(
            `${t('tableVisual.isMergingTitle')}`,
            `${t('tableVisual.isMergingMsg')}`,
            [
              {
                text: `${t('action.yes')}`,
                onPress: () => {
                  this.handleMergeOrder(table, this.state.tableOrder, toTable)
                }
              },
              {
                text: `${t('action.no')}`,
                onPress: () => console.log('Cancelled'),
                style: 'cancel'
              }
            ]
          )
        }
        return false
      } else {
        return true
      }
    })

  }

  handleChangeTable = (table, values) => {
    const updateOrder = {}
    updateOrder.orderType = values.orderType
    updateOrder.tableIds = []
    if (values?.tables?.length >= 1) {
      let array = [...values?.tables]
      let removeTable = null
      array?.forEach((item, index) => {
        if (item?.tableId === this.props.table?.tableId)
          removeTable = index
      })
      if (removeTable !== null) {
        array.splice(removeTable, 1);
      }
      let otherTableArr = array?.map((item) => item?.tableId)
      otherTableArr.push(table.tableId)
      updateOrder.tableIds = otherTableArr
    }


    dispatchFetchRequest(api.order.update(values.orderId), {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateOrder)
    },
      response => {
        response.json().then(data => {
          this.props?.onRefresh()
        })
      }).then()
  }

  handleMergeOrder = (table, values, toTable) => {
    const updateOrder = {}
    updateOrder.orderType = values.orderType
    updateOrder.tableIds = []
    if (values?.tables?.length >= 1) {
      let array = [...values?.tables]
      let removeTable = null
      array?.forEach((item, index) => {
        if (item?.tableId === this.props.table?.tableId)
          removeTable = index
      })
      if (removeTable !== null) {
        array.splice(removeTable, 1);
      }
      let otherTableArr = array?.map((item) => item?.tableId)
      otherTableArr.push(table.tableId)
      updateOrder.tableIds = otherTableArr
    }

    dispatchFetchRequest(api.order.moveOrder(values.orderId), {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({targetOrderId: toTable.orderId})
    },
      response => {
        response.json().then(data => {
          this.props?.onRefresh()
        })
      }).then()
  }

  UNSAFE_componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => this.state.isDraggable,
      //onStartShouldSetPanResponderCapture: (evt, gestureState) => this.state.isDraggable,
      onMoveShouldSetPanResponder: () => this.state.isDraggable,
      // onMoveShouldSetPanResponderCapture: (evt, gestureState) =>
      //   this.state.isDraggable,
      onPanResponderGrant: (e, gesture) => {
        this.state.pan.setOffset({
          x: this.state.pan.x._value,
          y: this.state.pan.y._value
        })
        this.state.pan.setValue({x: 0, y: 0})
      },
      onPanResponderMove: Animated.event([
        null, {dx: this.state.pan.x, dy: this.state.pan.y}
      ], {useNativeDriver: false}),
      onPanResponderRelease: (e, gesture) => {
        this.state.pan.flattenOffset();
        console.log(`on release: ${JSON.stringify(this.state.pan)}`)
        this.handleDragEnd(this.state.pan)
        this.setState({isDraggable: false})
        this.initPosition()
      }
    });
  }


  handleFlashBorder = (count = 0) => {
    let isSelected = this.state.isSelected
    if (isSelected && count < 20) {
      Animated.timing(this.state.opacity, {
        toValue: this.state.opacity?._value === 0.5 ? 1 : 0.5,
        duration: 500
      }).start(() => {
        this.handleFlashBorder(count + 1)
      })
    } else {
      this.setState({opacity: new Animated.Value(1)})
    }
  }


  renderDraggable(layoutId, table, orders, openOrderModal, index, borderColor, positionArr, screenMode, customMainThemeColor, customSecondThemeColor, customBackgroundColor, t) {
    TimeAgo.addLocale(en)
    const timeAgo = new TimeAgo()

    const panStyle = {
      transform: this.state.pan.getTranslateTransform()
    }
    const panStyleUnder = {
      transform: this.state.panUnder.getTranslateTransform()
    }
    const tableOrder = this.state.tableOrder
    const tableStatus = tableOrder?.state
    const tableTimeLimit = this.state.tableTimeLimit * 60 * 1000
    const isTimeLimit = this.state.isTimeLimit

    const selectedStyle = {
      borderColor: `rgba(255, 0, 0, ${this.state.opacity?._value})`
    }

    return (
      <View >
        {
          table.position !== null
            ?
            <>
              <Animated.View {...this.panResponder.panHandlers} style={{opacity: this.state.opacity}}>
                <TouchableOpacity

                  onPress={() => {
                    if (!!tableStatus) {
                      if (screenMode === 'joinTable') {
                        this.state.isSelected ? this.setState({isSelected: false}) : this.setState({isSelected: true}, () => this.handleFlashBorder())
                      }
                      this.props?.gotoOrderDetail({
                        orderId: tableOrder?.orderId,
                        state: tableStatus
                      })
                    } else {
                      openOrderModal({
                        table: table,
                        order: orders
                      });
                    }
                  }}
                  onLongPress={() => tableStatus && screenMode !== 'joinTable' && this.setState({isDraggable: true})}
                  style={[panStyle, styles?.circle(customMainThemeColor), {zIndex: 1000, position: 'absolute', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#e7e7e7', borderColor: '#e7e7e7', borderWidth: 3}, (!!tableStatus &&
                  {

                    backgroundColor: tableStatus == 'OPEN' ? '#FFFFF5'
                      : tableStatus == 'IN_PROCESS' ? (tableOrder?.itemNeedAttention ? '#FFFFF5' : '#FF6915')
                        : tableStatus == 'DELIVERED' ? '#FFFFF5'
                          : '#FFFFF5',
                    borderColor: tableStatus == 'OPEN' ? '#F9C31C'
                      : tableStatus == 'IN_PROCESS' ? (tableOrder?.itemNeedAttention ? '#f75336' : '#FF6915')
                        : tableStatus == 'DELIVERED' ? '#006B35'
                          : '#e7e7e7',

                  })]}>
                  {tableStatus === 'PAYMENT_IN_PROCESS' && <View style={{position: 'absolute', top: 0, right: 0, width: 25, height: 25}}><MaterialIcons name="attach-money" size={25}
                    style={[{color: '#f75336'}]} /></View>}
                  {!!tableOrder?.createdTime && !!isTimeLimit && getTimeDifference(tableOrder?.createdTime) > tableTimeLimit && <View style={{position: 'absolute', top: 0, right: -8, width: 25, height: 25}}><FontAwesomeIcon name="exclamation-triangle" size={25}
                    style={[{color: '#f75336'}]} /></View>}
                  <Text style={{color: '#000', textAlign: 'center', }}>{table.tableName}</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Ionicons name={'ios-people'} color={'black'} size={20} />
                    <Text style={{color: '#000', textAlign: 'center', }}>{` ${tableOrder?.customerCount ?? 0}(${table.capacity})`}</Text>
                  </View>
                  {!!tableOrder?.createdTime &&
                    <View style={[styles.tableCellView, {justifyContent: 'center'}]}>
                      <FontAwesomeIcon name={'clock-o'} color={(getTimeDifference(tableOrder?.createdTime) > 30 * 60 * 1000 && tableStatus == 'OPEN') ? '#f75336' : 'black'} size={20} />
                      <StyledText style={{marginLeft: 2, color: '#000'}}>
                        {timeAgo.format(Date.now() - getTimeDifference(tableOrder?.createdTime), {flavour: 'tiny'})}
                      </StyledText>
                    </View>}
                </TouchableOpacity>

              </Animated.View>

              {this.state.isDraggable && <View >
                <TouchableOpacity


                  style={[panStyleUnder, styles?.circle(customMainThemeColor), {position: 'absolute', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#e7e7e7', borderColor: '#e7e7e7', borderWidth: 3}, (!!tableStatus &&
                  {

                    backgroundColor: tableStatus == 'OPEN' ? '#FFFFF5'
                      : tableStatus == 'IN_PROCESS' ? (tableOrder?.itemNeedAttention ? '#FFFFF5' : '#FF6915')
                        : tableStatus == 'DELIVERED' ? '#FFFFF5'
                          : '#FFFFF5',
                    borderColor: tableStatus == 'OPEN' ? '#F9C31C'
                      : tableStatus == 'IN_PROCESS' ? (tableOrder?.itemNeedAttention ? '#f75336' : '#FF6915')
                        : tableStatus == 'DELIVERED' ? '#006B35'
                          : '#e7e7e7',

                  })]}>
                  {tableStatus === 'PAYMENT_IN_PROCESS' && <View style={{position: 'absolute', top: 0, right: 0, width: 25, height: 25}}><MaterialIcons name="attach-money" size={25}
                    style={[{color: '#f75336'}]} /></View>}
                  {!!tableOrder?.createdTime && !!isTimeLimit && getTimeDifference(tableOrder?.createdTime) > tableTimeLimit && <View style={{position: 'absolute', top: 0, right: 0, width: 25, height: 25}}><FontAwesomeIcon name="exclamation-triangle" size={25}
                    style={[{color: '#f75336'}]} /></View>}
                  <Text style={{color: '#000', textAlign: 'center', }}>{table.tableName}</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Ionicons name={'ios-people'} color={'black'} size={20} />
                    <Text style={{color: '#000', textAlign: 'center', }}>{` ${tableOrder?.customerCount ?? 0}(${table.capacity})`}</Text>
                  </View>
                  {!!tableOrder?.createdTime &&
                    <View style={[styles.tableCellView, {justifyContent: 'center'}]}>
                      <FontAwesomeIcon name={'clock-o'} color={(getTimeDifference(tableOrder?.createdTime) > 30 * 60 * 1000 && tableStatus == 'OPEN') ? '#f75336' : 'black'} size={20} />
                      <StyledText style={{marginLeft: 2, color: '#000'}}>
                        {timeAgo.format(Date.now() - getTimeDifference(tableOrder?.createdTime), {flavour: 'tiny'})}
                      </StyledText>
                    </View>}
                </TouchableOpacity>

              </View>}
            </>
            :
            <>
              <Animated.View {...this.panResponder.panHandlers} style={{opacity: this.state.opacity}}>

                <TouchableOpacity
                  onPress={() => {

                    if (!!tableStatus) {
                      if (screenMode === 'joinTable') {
                        this.state.isSelected ? this.setState({isSelected: false}) : this.setState({isSelected: true}, () => this.handleFlashBorder())
                      }
                      this.props?.gotoOrderDetail({
                        orderId: tableOrder?.orderId,
                        state: tableStatus
                      })
                    } else {
                      openOrderModal({
                        table: table,
                        order: orders
                      });
                    }
                  }}
                  onLongPress={() => tableStatus && screenMode !== 'joinTable' && this.setState({isDraggable: true})}
                  style={[panStyle, styles?.circle(customMainThemeColor), {zIndex: 1000, position: 'absolute', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#e7e7e7', borderColor: '#e7e7e7', borderWidth: 3}, (!!tableStatus &&
                  {

                    backgroundColor: tableStatus == 'OPEN' ? '#FFFFF5'
                      : tableStatus == 'IN_PROCESS' ? (tableOrder?.itemNeedAttention ? '#FFFFF5' : '#FF6915')
                        : tableStatus == 'DELIVERED' ? '#FFFFF5'
                          : '#FFFFF5',
                    borderColor: tableStatus == 'OPEN' ? '#F9C31C'
                      : tableStatus == 'IN_PROCESS' ? (tableOrder?.itemNeedAttention ? '#f75336' : '#FF6915')
                        : tableStatus == 'DELIVERED' ? '#006B35'
                          : '#e7e7e7',

                  })]}>

                  {tableStatus === 'PAYMENT_IN_PROCESS' && <View style={{position: 'absolute', top: 0, right: 0, width: 25, height: 25}}><MaterialIcons name="attach-money" size={25}
                    style={[{color: '#f75336'}]} /></View>}
                  {!!tableOrder?.createdTime && !!isTimeLimit && getTimeDifference(tableOrder?.createdTime) > tableTimeLimit && <View style={{position: 'absolute', top: 0, right: 0, width: 25, height: 25}}><FontAwesomeIcon name="exclamation-triangle" size={25}
                    style={[{color: '#f75336'}]} /></View>}
                  <Text style={{color: '#000', textAlign: 'center', }}>{table.tableName}</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Ionicons name={'ios-people'} color={'black'} size={20} />
                    <Text style={{color: '#000', textAlign: 'center', }}>{` ${tableOrder?.customerCount ?? 0}(${table.capacity})`}</Text>
                  </View>
                  {!!tableOrder?.createdTime &&
                    <View style={[styles.tableCellView, {justifyContent: 'center'}]}>
                      <FontAwesomeIcon name={'clock-o'} color={(getTimeDifference(tableOrder?.createdTime) > 30 * 60 * 1000 && tableStatus == 'OPEN') ? '#f75336' : 'black'} size={20} />
                      <StyledText style={{marginLeft: 2, color: '#000'}}>
                        {timeAgo.format(Date.now() - getTimeDifference(tableOrder?.createdTime), {flavour: 'tiny'})}
                      </StyledText>
                    </View>}
                </TouchableOpacity>

              </Animated.View>

              {this.state.isDraggable && <View >

                <TouchableOpacity

                  style={[panStyleUnder, styles?.circle(customMainThemeColor), {position: 'absolute', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#e7e7e7', borderColor: '#e7e7e7', borderWidth: 3}, (!!tableStatus &&
                  {

                    backgroundColor: tableStatus == 'OPEN' ? '#FFFFF5'
                      : tableStatus == 'IN_PROCESS' ? (tableOrder?.itemNeedAttention ? '#FFFFF5' : '#FF6915')
                        : tableStatus == 'DELIVERED' ? '#FFFFF5'
                          : '#FFFFF5',
                    borderColor: tableStatus == 'OPEN' ? '#F9C31C'
                      : tableStatus == 'IN_PROCESS' ? (tableOrder?.itemNeedAttention ? '#f75336' : '#FF6915')
                        : tableStatus == 'DELIVERED' ? '#006B35'
                          : '#e7e7e7',

                  })]}>
                  {tableStatus === 'PAYMENT_IN_PROCESS' && <View style={{position: 'absolute', top: 0, right: 0, width: 25, height: 25}}><MaterialIcons name="attach-money" size={25}
                    style={[{color: '#f75336'}]} /></View>}
                  {!!tableOrder?.createdTime && !!isTimeLimit && getTimeDifference(tableOrder?.createdTime) > tableTimeLimit && <View style={{position: 'absolute', top: 0, right: 0, width: 25, height: 25}}><FontAwesomeIcon name="exclamation-triangle" size={25}
                    style={[{color: '#f75336'}]} /></View>}
                  <Text style={{color: '#000', textAlign: 'center', }}>{table.tableName}</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Ionicons name={'ios-people'} color={'black'} size={20} />
                    <Text style={{color: '#000', textAlign: 'center', }}>{` ${tableOrder?.customerCount ?? 0}(${table.capacity})`}</Text>
                  </View>
                  {!!tableOrder?.createdTime &&
                    <View style={[styles.tableCellView, {justifyContent: 'center'}]}>
                      <FontAwesomeIcon name={'clock-o'} color={(getTimeDifference(tableOrder?.createdTime) > 30 * 60 * 1000 && tableStatus == 'OPEN') ? '#f75336' : 'black'} size={20} />
                      <StyledText style={{marginLeft: 2, color: '#000'}}>
                        {timeAgo.format(Date.now() - getTimeDifference(tableOrder?.createdTime), {flavour: 'tiny'})}
                      </StyledText>
                    </View>}
                </TouchableOpacity>

              </View>}
            </>
        }
      </View>
    );
  }

  render() {
    const {table, layoutId, orders, openOrderModal, index, borderColor, positionArr, screenMode, locale: {customMainThemeColor, customSecondThemeColor, customBackgroundColor}} = this.props
    return (
      <View style={{alignItems: "flex-start", borderWidth: 0, marginBottom: 0}} ref='self'>
        {this.renderDraggable(layoutId, table, orders, openOrderModal, index, borderColor, positionArr, screenMode, customMainThemeColor, customSecondThemeColor, customBackgroundColor)}
      </View>
    );
  }
}

const Draggable = withContext(DraggableBase)

//https://snack.expo.io/@yoobidev/draggable-component


class TableSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropAreaValues: null,
      pan: new Animated.ValueXY(),
      opacity: new Animated.Value(1),
      setWidth: 100,
      setHeight: 100,
    };
  }
  componentDidMount() {
    const windowWidth = this.props.tableWidth;
    const windowHeight = this.props.tableHeight;
    let minX = windowWidth
    let minY = windowHeight
    let maxX = 0
    let maxY = 0
    this.props?.item?.linkedOrders?.forEach((item) => {
      if (item?.screenPosition?.x * windowWidth < minX)
        minX = item.screenPosition.x * windowWidth
      if (item?.screenPosition?.y * windowHeight < minY)
        minY = item.screenPosition.y * windowHeight
      if (item?.screenPosition?.x * windowWidth > maxX)
        maxX = item.screenPosition.x * windowWidth
      if (item?.screenPosition?.y * windowHeight > maxY)
        maxY = item.screenPosition.y * windowHeight
    })
    this.state.pan.setValue({x: minX, y: minY})

    this.setState({setWidth: maxX - minX + 100})

    this.setState({setHeight: maxY - minY + 100})

  }



  render() {
    const panStyle = {
      transform: this.state.pan.getTranslateTransform()
    }
    return (
      <TouchableOpacity
        onPress={() => {
          if (this.props?.screenMode === 'joinTable')
            this.props?.onPress(this.props?.item?.id)
        }}
        style={[panStyle, {position: 'absolute', alignItems: 'center', justifyContent: 'center', backgroundColor: '#80808080', borderRadius: 25, width: this.state.setWidth, height: this.state.setHeight}]}>
        {this.props?.screenMode === 'joinTable' && <FontAwesomeIcon name={'remove'} color={'#f75336'} size={30} />}
      </TouchableOpacity>
    );
  }

}


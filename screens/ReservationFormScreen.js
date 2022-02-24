import React, {Component} from 'react'
import {Field, reduxForm, formValueSelector} from 'redux-form'
import {Keyboard, Text, TouchableOpacity, View, FlatList, Dimensions, Alert, Animated, RefreshControl} from 'react-native'
import {Accordion, List} from '@ant-design/react-native'
import {ListItem, CheckBox} from "react-native-elements";
import {connect} from 'react-redux'
import {compose} from "redux";
import {withContext} from "../helpers/contextHelper";
import {isRequired, isCountZero} from '../validators'
import InputText from '../components/InputText'
import InputTextComponent from '../components/InputTextComponent'
import {getTableLayouts, getTablesAvailable, getTableLayout, getfetchOrderInflights, getShiftStatus} from '../actions'
import {getInitialTablePosition, getTablePosition, getSetPosition} from "../helpers/tableAction";
import {api, dispatchFetchRequest, dispatchFetchRequestWithOption} from '../constants/Backend'
import {LocaleContext} from '../locales/LocaleContext'
import SegmentedControl from "../components/SegmentedControl"
import RenderStepper from '../components/RenderStepper'
import ScreenHeader from "../components/ScreenHeader";
import LoadingScreen from "./LoadingScreen";
import {RenderDatePicker} from '../components/DateTimePicker'
import TimeZoneService from "../helpers/TimeZoneService";
import styles from '../styles'
import {StyledText} from "../components/StyledText";
import {RadioReservationTimePick} from '../components/RadioItemObjPick'
import {ThemeContainer} from "../components/ThemeContainer";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {withAnchorPoint} from 'react-native-anchor-point';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import moment from 'moment-timezone'
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";
import NotificationTask, {schedulePushNotification} from '../components/NotificationTask'


class ReservationFormScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      windowWidth: Dimensions.get('window').width - 30,
      windowHeight: Dimensions.get('window').height - 76,
      scaleMultiple: (Dimensions.get('window').width - 30) / 300,
      tableWidth: null,
      tableHeight: null,
      isTablet: context?.isTablet,
      tableIndex: 0,
      selectedTimeBlock: null,
      timeBlocks: {
        0: {value: 'MORNING', label: context.t('reservation.timeBlock.morning')},
        1: {value: 'NOON', label: context.t('reservation.timeBlock.noon')},
        2: {value: 'EVENING', label: context.t('reservation.timeBlock.evening')},
      },
      showDatePicker: false,
      reservationDate: null,
      hoursArr: null,
      minutesArr: ['15', '30', '45', '00'],
      selectedHour: null,
      selectedMinutes: null,
      isTimeView: !!props?.isEdit ? true : false,
      isGetTables: !!props?.isEdit ?? false,
      availableTables: null,
      selectedTableIds: [],
      selectedTableNames: [],
      activeTableLayout: [],
      searching: false,
      searchResults: null,
      membershipModalVisible: false,
      isMembership: false,
      isSearched: false,
      isNameEditable: props?.initialValues?.membershipId ? false : true,
    }
  }

  componentDidMount() {

      this.loadInfo()
      this.props.getTableLayouts()
      this.props.getfetchOrderInflights()
      this.props.getAvailableTables()
      this.props.getShiftStatus()
      this._resetForm = this.props.navigation.addListener('focus', () => {
        if (!this.props.isEdit && !this.props.nextStep) {
          this.handleResetForm()
        }
      })
  }

  componentWillUnmount() {
    this._resetForm()
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.isEdit && (prevProps.initialValues !== this.props.initialValues)) {
      this.loadInfo()
    }
  }

  loadInfo = () => {
    let data = this.props?.initialValues

    if (data) {
      this.props.change(`reservationStartDate`, data?.reservationStartDate)
      this.setState({reservationDate: moment(data?.reservationStartDate).format('YYYY-MM-DD')})

      if (!!data.id) {
        this.props.change(`id`, data.id)
        this.props.change(`membershipId`, data?.membershipId ?? null)

        let idArray = [], nameArr = [], selectedTimeBlock = 0
        !!data?.tables && data?.tables.forEach((table) => {
          idArray.push(table.tableId)
          nameArr.push(table.tableName)
        })
        this.props.change(`tableIds`, idArray)

        let timezone = TimeZoneService.getTimeZone()
        let eventDate = moment(data?.reservationStartDate).tz(timezone).format('YYYY-MM-DD')
        let eventHour = moment(data?.reservationStartDate).tz(timezone).format('HH')
        let eventMins = moment(data?.reservationStartDate).tz(timezone).format('mm')
        selectedTimeBlock = eventHour <= 10 ? 0 : eventHour > 10 && eventHour < 17 ? 1 : 2

        this.handlesetTableIndex(idArray)
        this.setState({selectedTableIds: idArray, selectedTableNames: nameArr, reservationDate: eventDate, selectedTimeBlock: selectedTimeBlock, selectedHour: eventHour, selectedMinutes: eventMins})

        this.props.change(`hour`, eventHour)
        this.props.change(`minutes`, eventMins)

        this.handleHourSelection(selectedTimeBlock)
      }
    }
  }

  getTransform = () => {
    let transform = {
      transform: [{scale: this.state.scaleMultiple}],
    };
    return withAnchorPoint(transform, {x: 0, y: 0}, {width: 300, height: 300});
  };

  handleGetReservationDate = (event, selectedDate) => {

    if (!!this.state.selectedHour && !!this.state.selectedMinutes) {
      this.props.change(`reservationStartDate`, new Date(selectedDate))
      this.setState({reservationDate: moment(selectedDate).format('YYYY-MM-DD')})
      this.handleCheckAvailableTables(moment(selectedDate).format('YYYY-MM-DD'), this.state.selectedHour, this.state.selectedMinutes)

    } else {
      this.setState({
        reservationDate: moment(selectedDate).format('YYYY-MM-DD')
      })
    }
  }
  showDatePicker = () => {
    this.setState({
      showDatePicker: !this.state?.showDatePicker
    })
  };

  handleTimeBlockSelection = (value, index) => {
    this.setState({selectedTimeBlock: index})
    this.handleHourSelection(index)
  }
  handleHourSelection = (index) => {
    let morningHours = ['07', '08', '09', '10']
    let noonHours = ['11', '12', '13', '14', '15', '16']
    let eveningHours = ['17', '18', '19', '20', '21', '22', '23']

    if (index === 0) {
      this.setState({hoursArr: morningHours})
    }
    if (index === 1) {
      this.setState({hoursArr: noonHours})
    }
    if (index === 2) {
      this.setState({hoursArr: eveningHours})
    }
  }
  handleHourCheck = (value) => {
    if (!this.state.selectedHour) {
      this.viewToggle(true)
    }
    if (!!this.state.selectedMinutes) {
      this.handleCheckAvailableTables(this.state.reservationDate, value, this.state.selectedMinutes)
    }
    this.setState({selectedHour: value})
  }
  handleMinuteCheck = (value) => {
    this.setState({selectedMinutes: value})
    this.handleCheckAvailableTables(this.state.reservationDate, this.state.selectedHour, value)
  }

  viewToggle = (toggle) => {
    this.setState({isTimeView: toggle})
  }


  handleCheckAvailableTables = async (date, hour, mins) => {

    if (!!date && !!hour && !!mins) {
      let timezone = TimeZoneService.getTimeZone()
      let dateStr = `${date} ${hour}:${mins}`
      let checkDate = moment(dateStr).tz(timezone).format('YYYY-MM-DDTHH:mm:ss')

      console.log("check datetime for reservation", dateStr)
      this.props.change(`checkDate`, checkDate)

      let reservationId = this.props?.initialValues?.id != undefined ? this.props?.initialValues?.id : null

      await dispatchFetchRequestWithOption(api.reservation.getAvailableTables(checkDate, reservationId), {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {},
      }, {
        defaultMessage: false
      },
        response => {
          response.json().then(async data => {
            this.setState({availableTables: data.results, isGetTables: true})
            this.handleCheckConflictTables(data.results)

          })
        }).then()
    }
  }
  handleCheckConflictTables = (availableTables) => {

    let tableIds = this.state.selectedTableIds
    let tableNames = this.state.selectedTableNames
    let conflictTables = []

    tableIds && tableIds.forEach((table) => {
      if (availableTables.indexOf(table) < 0) {
        conflictTables.push(table)
      }
    })
    conflictTables.length > 0 && conflictTables.forEach((table) => {
      tableIds.splice(tableIds.indexOf(table), 1)
      tableNames.splice(tableNames.indexOf(this.handleGetTableName(table)), 1)
    })
    this.props.change(`tableIds`, tableIds)
    this.setState({selectedTableIds: tableIds, selectedTableNames: tableNames})
  }
  handleGetTableName = (id) => {
    let layoutId = id.slice(0, 36)
    let target = null

    this.props.tablelayouts.forEach((layout) => {
      if (layout.id === layoutId) {
        target = layout.tables.find((table) => table.tableId === id)
      }
    })
    return target.tableName
  }
  handlesetTableIndex = (ids) => {
    if (ids && ids.length > 0 && this.state.isTablet) {

      let layoutId = ids[0].slice(0, 36)
      let tabIndex = this.props.tablelayouts.findIndex((layout) =>
        layout.id === layoutId)

      this.setState({tableIndex: tabIndex})
    }
    if (ids && ids.length > 0 && !this.state.isTablet) {
      let layoutIds = []
      layoutIds = ids.map((id) => id.slice(0, 36))
      let layoutArr = [...new Set(layoutIds)]
      this.props.tablelayouts.forEach((layout, index) => {
        if (layoutArr.includes(layout.id)) {
          this.handleChooseLayout(index)
        }
      })
    }
  }

  handleChooseTable = (id, name) => {
    let tableIds = this.state.selectedTableIds
    let tableNames = this.state.selectedTableNames
    let cancelTableIdx = tableIds.indexOf(id)

    if (!!tableIds && cancelTableIdx > -1) {
      tableIds.splice(cancelTableIdx, 1)
      tableNames.splice(cancelTableIdx, 1)
      this.props.change(`tableIds`, tableIds)
      this.setState({selectedTableIds: tableIds, selectedTableNames: tableNames})
    } else {
      this.props.change(`tableIds`, [...tableIds, id])
      this.setState({selectedTableIds: [...tableIds, id], selectedTableNames: [...tableNames, name]})
    }
  }
  handleChooseLayout = (value) => {
    let arr = this.state.activeTableLayout

    if (!arr.includes(value)) {
      arr.push(value)
    }
    this.setState({activeTableLayout: arr})
  }


  handleSearchMember = (phone) => {
    if (phone !== '') {
      this.setState({searching: true, isSearched: false})

      dispatchFetchRequest(api.membership.getByPhone(phone), {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      }, response => {
        response.json().then(data => {
          if (data?.results?.length > 0) {
            this.props.change(`membershipId`, data.results[0]?.id)
            this.setState({searchResults: data.results[0], searching: false, isMembership: true, membershipModalVisible: true, isSearched: true})
          } else {
            this.setState({searchResults: data.results, searching: false, isMembership: false, membershipModalVisible: false, isSearched: true})
          }
        })
      }).then()
    } else {
      this.setState({isSearched: false, isMembership: false, searchResults: []})
    }
  }

  handleCreateMember = () => {
    if (this.props?.name && this.props?.phoneNumber) {
      let request = {
        name: this.props?.name,
        phoneNumber: this.props?.phoneNumber,
        tags: this.props?.note ? [this.props?.note] : null
      }
      dispatchFetchRequestWithOption(api.membership.creat, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      }, {
        defaultMessage: false
      }, response => {
        response.json().then(data => {
          this.props.change(`membershipId`, data?.id)
          this.setState({isMembership: true, })
          Alert.alert(
            ``,
            `${data?.phoneNumber} ${this.context.t(`membership.createSuccessMsg`)}`,
            [
              {
                text: `${this.context.t('action.yes')}`,
                onPress: () => {
                }
              }
            ]
          )
        })
      }).then()
    } else {
      Alert.alert(
        ``,
        `${this.context.t(`membership.createFailedMsg`)}`,
        [
          {
            text: `${this.context.t('action.yes')}`,
            onPress: () => {
            }
          }
        ]
      )
    }
  }
  handleFillName = (flag) => {

    if (!!flag) {
      this.props.change(`name`, this.state.searchResults.name)
      this.setState({isNameEditable: true, membershipModalVisible: false})
    } else {
      this.setState({isNameEditable: true, membershipModalVisible: false})
    }
  }
  handleUnbindMember = () => {
    this.props.change(`membershipId`, null)
    this.props.change(`phoneNumber`, '')
    this.props.change(`name`, '')
    this.setState({isSearched: false, isMembership: false, searchResults: [], isNameEditable: true, })
  }


  handleCheckForm = (value) => {
    this.props.navigation.navigate('ReservationConfirmScreen', {
      handleCancel: this.props.handleCancel,
      handleSaveReservation: this.props.handleSaveReservation,
      initialValues: value,
      isEdit: this.props.isEdit,
      reservationDate: this.state.reservationDate,
      tableNames: this.state.selectedTableNames,
    })
  }
  handleResetForm = () => {
    this.props.change(`id`, null)
    this.props.change(`checkDate`, null)
    this.props.change(`hour`, null)
    this.props.change(`minutes`, null)
    this.props.change(`people`, 0)
    this.props.change(`kid`, 0)
    this.props.change(`name`, '')
    this.props.change(`phoneNumber`, '')
    this.props.change(`note`, '')
    this.props.change(`tableIds`, null)
    this.setState({selectedTableIds: [], selectedTableNames: [], reservationDate: moment(this.props?.initialValues.reservationStartDate ?? new Date()).format('YYYY-MM-DD'), selectedTimeBlock: 0, selectedHour: null, selectedMinutes: null, isGetTables: false})
    this.handleHourSelection(0)
    this.props.handleNextStep(false)
  }


  render() {
    const {
      navigation,
      haveData,
      isLoading,
      tablelayouts,
      ordersInflight,
      availableTables,
      initialValues,
      nextStep,
      isEdit,
      handleReset,
      handleNextStep,
      handleSubmit,
      handleCancel,
      handleSaveReservation,
      statusHeight,
      shiftStatus,
      client
    } = this.props

    const {t, customMainThemeColor, customBackgroundColor} = this.context
    const timeBlocks = Object.keys(this.state.timeBlocks).map(key => this.state.timeBlocks[key].label)


    if (isLoading) {
      return (
        <LoadingScreen />
      )
    } else if (tablelayouts === undefined || tablelayouts.length === 0 || !haveData) {

      return (
        <ThemeContainer>
          <View style={[styles.fullWidthScreen]}>
            <ScreenHeader backNavigation={false}
              leftMenuIcon={!isTablet}
              parentFullScreen={true}
              title={t('reservation.reservationTitle')}
            />
            <View>
              <StyledText style={styles.messageBlock}>{t('tableVisual.noTableLayout')}</StyledText>
            </View>
            <View style={[styles.bottom, styles.horizontalMargin]}>
              <TouchableOpacity onPress={() => navigation.navigate('TableLayouts')}>
                <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                  {t('settings.tableLayouts')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ThemeContainer>
      )
    } else {

      const floorCapacity = {}
      const tablesMap = {}

      if (shiftStatus === 'ACTIVE') {

        availableTables && tablelayouts && tablelayouts.forEach((layout, idx) => {

          let seatCount = 0
          let tableCount = 0
          const availableTablesOfLayout = availableTables[layout.id]

          if (availableTablesOfLayout !== undefined) {
            tablesMap[layout.layoutName] = tablelayouts?.[idx]?.tables
          }
          availableTablesOfLayout !== undefined && availableTablesOfLayout.forEach((table, idx2) => {
            seatCount += table.capacity
            tableCount += 1
          })
          floorCapacity[layout.id] = {}
          floorCapacity[layout.id].seatCount = seatCount
          floorCapacity[layout.id].tableCount = tableCount
        })
      } else {
        tablelayouts && tablelayouts.forEach((layout, idx) => {

          let seatCount = 0
          let tableCount = 0

          const availableTablesOfLayout = tablelayouts?.[idx]?.tables
          tablesMap[layout.layoutName] = tablelayouts?.[idx]?.tables

          availableTablesOfLayout !== undefined && availableTablesOfLayout.forEach((table, idx2) => {
            seatCount += table.capacity
            tableCount += 1
          })
          floorCapacity[layout.id] = {}
          floorCapacity[layout.id].seatCount = seatCount
          floorCapacity[layout.id].tableCount = tableCount
        })
      }

      const layoutList = Object.keys(tablesMap)
      const noAvailableTables = Object.keys(tablesMap).length === 0

      if (!!this?.state?.isTablet) {
        return (
          <ThemeScrollView>
            <View style={[styles.fullWidthScreen, {marginTop: 53 - statusHeight}]}>
              <ScreenHeader
                backNavigation={true}
                backAction={() => {
                  if (!nextStep && !isEdit) {
                    this.handleResetForm()
                    handleReset()
                    navigation.navigate('ReservationCalendarScreen')
                  }
                  if (nextStep) {
                    handleNextStep(false)
                  }
                  if (!nextStep && isEdit) {
                    this.handleResetForm()
                    handleReset()
                    navigation.navigate('ReservationViewScreen')
                  }
                }}
                title={t('reservation.reservationTitle')}
                parentFullScreen={true} />
              <View style={[styles.fieldContainer, styles.flex(1), {flexDirection: 'row-reverse'}]}>

                <View style={[styles.flex(2), {marginHorizontal: 20, minHeight: 780}]}>
                  <View style={[{flexDirection: 'row', width: '100%', minHeight: 80}]}>
                    {tablelayouts?.map((tblLayout, index) => {
                      return (<TouchableOpacity
                        key={index}
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
                        {floorCapacity[tblLayout.id] !== undefined && (
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

                  </View>
                  {this.state.tableIndex >= 0 &&
                    <View style={[styles?.ballContainer(customMainThemeColor), {flex: 6}]}>
                      <View onLayout={(event) => {
                        let {x, y, width, height} = event.nativeEvent.layout;
                        this.setState({
                          tableWidth: width,
                          tableHeight: height,
                        })
                      }}
                        pointerEvents={nextStep ? 'none' : 'auto'}
                        style={[{width: '100%', height: '100%', alignSelf: 'center', flexWrap: 'wrap'}, nextStep && {opacity: 0.7, backgroundColor: '#BFBFBF'}]}>

                        {(this.state?.tableWidth && !isLoading) || <View style={{flex: 1, width: '100%'}}><LoadingScreen /></View>}

                        {
                          tablelayouts[this.state.tableIndex]?.tables?.map((table, index) => {
                            let positionArr = tablelayouts[this.state.tableIndex]?.tables?.map((table, index) => {
                              if (table.position != null) {
                                return {...getTablePosition(table, this.state?.tableWidth ?? this.state?.windowWidth, this.state?.tableHeight ?? this.state?.windowHeight), tableId: table?.tableId, tableData: table}
                              } else {
                                return {...getInitialTablePosition(index, this.state?.tableHeight ?? this.state?.windowHeight), tableId: table?.tableId, tableData: table}
                              }
                            })
                            return (
                              (this.state?.tableWidth && !isLoading && this.state?.availableTables) && <TableMap
                                borderColor={'#BFBFBF'}
                                t={t}
                                table={table}
                                key={table.tableId}
                                layoutId={tablelayouts[this.state.tableIndex]?.id}
                                index={index}
                                orders={ordersInflight}
                                handleChooseTable={this.handleChooseTable}
                                selectedTableIds={this.state?.selectedTableIds}
                                getTableLayout={this.props.getTableLayout}
                                tableWidth={this.state?.tableWidth ?? this.state?.windowWidth}
                                tableHeight={this.state?.tableHeight ?? this.state?.windowHeight}
                                positionArr={positionArr}
                                availableTables={this.state?.availableTables}
                              />
                            )
                          })
                        }
                        {this.state?.tableWidth && !isLoading && !this.state.isGetTables &&
                          <View style={[styles.flex(1), styles.jc_alignIem_center, {backgroundColor: '#eee', width: '100%'}]}>
                            <StyledText style={[styles.primaryText(customMainThemeColor)]}>{'Please Select Time'}</StyledText>
                          </View>
                        }
                      </View>
                    </View>}
                </View>

                <View style={[styles.flex(1), {marginLeft: 20, justifyContent: 'flex-start', maxHeight: '100%'}]}>
                  {!nextStep &&
                    <ThemeKeyboardAwareScrollView
                      getRef={ref => {this.scroll = ref}}
                      extraHeight={300}
                      persistTaps='handled'
                      enableResetScrollToCoords={false}>

                      <View style={styles.tableRowContainer}>
                        <View style={[styles.tableCellView, styles.flex(1)]}>
                          <StyledText style={styles.fieldTitle}>{t('reservation.date')}</StyledText>
                        </View>
                        <View style={[styles.tableCellView, styles.justifyRight]}>
                          <Field
                            name={`reservationStartDate`}
                            component={RenderDatePicker}
                            onChange={this.handleGetReservationDate}
                            minimumDate={moment().toDate()}
                            isShow={this.state?.showDatePicker ?? false}
                            showDatepicker={() => this.showDatePicker()}
                          />
                        </View>
                      </View>

                      <View style={styles.tableRowContainerWithBorder}>
                        <View style={[styles.flex(1)]}>
                          {timeBlocks && <Field
                            name="selectedTimeBlock"
                            component={SegmentedControl}
                            values={timeBlocks}
                            selectedIndex={this.state.selectedTimeBlock}
                            onChange={(value, index) => this.handleTimeBlockSelection(value, index)}
                          />}
                        </View>
                      </View>

                      <View style={[styles.withBottomBorder]}>
                        <View style={[styles.sectionTitleContainer, {marginBottom: 4}]}>
                          <StyledText style={[styles.sectionTitleText]}>{t('reservation.hours')}</StyledText>
                        </View>
                        <View style={[styles.flex(2), styles.fieldContainer, {flexWrap: 'wrap'}]}>
                          {!!this.state.hoursArr && this.state.hoursArr?.map((item, index) => (
                            <Field
                              key={index}
                              name="hour"
                              component={RadioReservationTimePick}
                              customValueOrder={item}
                              optionName={`${item}00`}
                              onChange={(value) => this.handleHourCheck(value)}
                              onCheck={(currentVal, fieldVal) => {
                                return fieldVal !== undefined && currentVal === fieldVal
                              }}
                            />))}
                        </View>
                      </View>

                      {(this.state.isTimeView) &&
                        <Animated.View style={[styles.withBottomBorder, {marginBottom: 4}]}>
                          <View style={[styles.sectionTitleContainer, {marginBottom: 4}]}>
                            <StyledText style={styles.sectionTitleText}>{t('reservation.minutes')}</StyledText>
                          </View>
                          <View style={[styles.flex(2), styles.fieldContainer]}>
                            {!!this.state.minutesArr && this.state.minutesArr?.map((item, index) => (
                              <Field
                                key={index}
                                name="minutes"
                                component={RadioReservationTimePick}
                                customValueOrder={item}
                                optionName={`${item}`}
                                onChange={(value) => this.handleMinuteCheck(value)}
                                onCheck={(currentVal, fieldVal) => {
                                  return fieldVal !== undefined && currentVal === fieldVal
                                }}
                              />
                            ))}
                          </View>
                        </Animated.View>}
                      <View style={[styles.bottom, styles.horizontalMargin]}>
                        {this.state.isGetTables &&
                          <>
                            <View style={[{marginBottom: 8}]}>
                              <View style={[styles.sectionTitleContainer, {marginVertical: 0}]}>
                                <StyledText style={styles.sectionTitleText}>{t('reservation.peopleCount')}</StyledText>
                              </View>
                              <View>
                                <View style={[styles.tableRowContainer]}>
                                  <Field
                                    name={`people`}
                                    component={RenderStepper}
                                    optionName={t('reservation.adult')}
                                    validate={[isRequired, isCountZero]}
                                    showNumber={false}
                                  />
                                </View>
                                <View style={[styles.tableRowContainer]}>
                                  <Field
                                    name={`kid`}
                                    component={RenderStepper}
                                    optionName={t('reservation.kid')}
                                    showNumber={false}
                                  />
                                </View>
                              </View>
                            </View>

                            <View style={[styles.withBottomBorder, styles.sectionContent]}>
                              <View style={[styles.sectionTitleContainer, {marginBottom: 12}]}>
                                <StyledText style={styles.sectionTitleText}>{t('reservation.contactInfo')}</StyledText>
                              </View>
                              <View style={[styles.flex(1), styles.fieldContainer]}>
                                <Field
                                  name="phoneNumber"
                                  component={InputTextComponent}
                                  clearTextOnFocus={true}
                                  onEndEditing={(value) => {
                                    this.handleSearchMember(value.nativeEvent.text)
                                  }}
                                  setFieldToBeFocused={input => {
                                    this.phoneNumberInput = input
                                  }}
                                  nextField={this.nameInput}
                                  extraStyle={this.props?.membershipId && {backgroundColor: '#e7e7e7'}}
                                  editable={!this.props?.membershipId}
                                  validate={isRequired}
                                  placeholder={t('reservation.phone')}
                                  keyboardType={'numeric'}
                                />
                                {this.state.searching ? <View style={{width: 24}}><LoadingScreen /></View> : this.state.isSearched ? <View>
                                  {this.state.isMembership ? <Ionicons name="checkmark-circle" size={24} color={customMainThemeColor} /> :
                                    <TouchableOpacity onPress={() =>
                                      Alert.alert(
                                        ``,
                                        `${this.context.t(`membership.searchNullMsg`)}`,
                                        [
                                          {
                                            text: `${this.context.t('action.yes')}`,
                                            onPress: () => {
                                              this.handleCreateMember()
                                            }
                                          },
                                          {
                                            text: `${this.context.t('action.no')}`,
                                            onPress: () => {},
                                            style: 'cancel'
                                          }
                                        ]
                                      )}>
                                      <Ionicons name="add" size={24} color={customMainThemeColor} />
                                    </TouchableOpacity>
                                  }
                                </View> : null}
                                {(isEdit && !!this.props?.membershipId) &&
                                  <TouchableOpacity onPress={() =>
                                    Alert.alert(
                                      ``,
                                      `${this.context.t(`reservation.unbindMemberContext`)}`,
                                      [
                                        {
                                          text: `${this.context.t('action.yes')}`,
                                          onPress: () => {
                                            this.handleUnbindMember()
                                          }
                                        },
                                        {
                                          text: `${this.context.t('action.no')}`,
                                          onPress: () => {},
                                          style: 'cancel'
                                        }
                                      ]
                                    )}>
                                    <Ionicons name="close-circle" size={24} color={customMainThemeColor} />
                                  </TouchableOpacity>
                                }
                              </View>
                              <View style={[styles.flex(1), styles.fieldContainer]}>
                                <Field
                                  name="name"
                                  component={InputTextComponent}
                                  setFieldToBeFocused={input => {
                                    this.nameInput = input
                                  }}
                                  nextField={this.noteInput}
                                  extraStyle={(!this.state.isNameEditable) && {backgroundColor: '#e7e7e7'}}
                                  editable={this.state.isNameEditable}
                                  validate={isRequired}
                                  placeholder={t('reservation.name')}
                                />
                                {this.state.membershipModalVisible &&
                                  <View style={[{
                                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                                    position: 'absolute', width: '100%', top: -4, right: 0, backgroundColor: '#eee', borderRadius: 8, paddingHorizontal: 12
                                  }]}>
                                    {this.state.searching ? <LoadingScreen /> :
                                      <>
                                        <View>
                                          <StyledText style={[styles.textMedium]}>{this.state.searchResults.name}</StyledText>
                                        </View>
                                        <View style={[styles.fieldContainer]}>
                                          <TouchableOpacity style={[styles.dynamicHorizontalPadding(4)]} onPress={() => this.handleFillName(true)}>
                                            <Ionicons name="checkmark" size={24} color={customMainThemeColor} />
                                          </TouchableOpacity>
                                          <TouchableOpacity onPress={() => this.handleFillName(false)}>
                                            <Ionicons name="close" size={24} color={customMainThemeColor} />
                                          </TouchableOpacity>
                                        </View>

                                      </>}
                                  </View>}
                              </View>
                              <View style={[styles.flex(1), styles.fieldContainer]}>
                                <Field
                                  name="note"
                                  component={InputTextComponent}
                                  setFieldToBeFocused={input => {
                                    this.noteInput = input
                                  }}
                                  placeholder={t('reservation.otherNote')}
                                />
                              </View>
                            </View>

                            <View>
                              <TouchableOpacity onPress={(value) => {
                                handleSubmit(value, false)
                              }}>
                                <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                                  {t('reservation.next')}
                                </Text>
                              </TouchableOpacity>
                              {isEdit && <TouchableOpacity onPress={() => {
                                navigation.navigate('ReservationViewScreen')
                              }}>
                                <Text
                                  style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}
                                >
                                  {t('action.cancel')}
                                </Text>
                              </TouchableOpacity>}
                            </View>
                          </>
                        }
                      </View>

                    </ThemeKeyboardAwareScrollView>
                  }

                  {nextStep &&
                    <>
                      <View style={[styles.tableRowContainerWithBorder, {marginTop: 0}]}>
                        <View style={[styles.tableCellView, styles.flex(1)]}>
                          <StyledText style={[styles.reservationFormTitle(customMainThemeColor)]}>{t('reservation.date')}</StyledText>
                        </View>
                        <View style={[styles.tableCellView, styles.justifyRight]}>
                          <StyledText style={[styles.reservationFormContainer]}>{this.state.reservationDate}</StyledText>
                        </View>
                      </View>
                      <View style={[styles.tableRowContainerWithBorder]}>
                        <View style={[styles.tableCellView, styles.flex(1)]}>
                          <StyledText style={[styles.reservationFormTitle(customMainThemeColor)]}>{t('reservation.time')}</StyledText>
                        </View>
                        <View style={[styles.tableCellView, styles.justifyRight]}>
                          <StyledText style={[styles.reservationFormContainer]}>{this.state.selectedHour}:{this.state.selectedMinutes}</StyledText>
                        </View>
                      </View>

                      <View style={styles.tableRowContainerWithBorder}>
                        <View style={[styles.tableCellView, styles.flex(1)]}>
                          <StyledText style={[styles.reservationFormTitle(customMainThemeColor)]}>{t('reservation.name')}</StyledText>
                        </View>
                        <View style={[styles.tableCellView, styles.justifyRight]}>
                          <StyledText style={[styles.reservationFormContainer]}>{initialValues.name}</StyledText>
                        </View>
                      </View>
                      <View style={styles.tableRowContainerWithBorder}>
                        <View style={[styles.tableCellView, styles.flex(1)]}>
                          <StyledText style={[styles.reservationFormTitle(customMainThemeColor)]}>{t('reservation.phone')}</StyledText>
                        </View>
                        <View style={[styles.tableCellView, styles.justifyRight]}>
                          <StyledText style={[styles.reservationFormContainer]}>{initialValues.phoneNumber}</StyledText>
                        </View>
                      </View>
                      <View style={styles.tableRowContainerWithBorder}>
                        <View style={[styles.tableCellView, styles.flex(1)]}>
                          <StyledText style={[styles.reservationFormTitle(customMainThemeColor)]}>{t('reservation.peopleCount')}</StyledText>
                        </View>
                        <View style={[styles.tableCellView, styles.justifyRight]}>
                          <StyledText style={[styles.reservationFormContainer]}>{t('reservation.adult')}: {initialValues.people ?? 0}, {t('reservation.kid')}: {initialValues.kid ?? 0}</StyledText>
                        </View>
                      </View>
                      <View style={styles.tableRowContainerWithBorder}>
                        <View style={[styles.tableCellView, styles.flex(1)]}>
                          <StyledText style={[styles.reservationFormTitle(customMainThemeColor)]}>{t('reservation.otherNote')}</StyledText>
                        </View>
                        <View style={[styles.tableCellView, styles.justifyRight]}>
                          <StyledText style={[styles.reservationFormContainer]}>{initialValues.note}</StyledText>
                        </View>
                      </View>
                      <View style={styles.tableRowContainerWithBorder}>
                        <View style={[styles.tableCellView, styles.flex(1)]}>
                          <StyledText style={[styles.reservationFormTitle(customMainThemeColor)]}>{t('reservation.table')}</StyledText>
                        </View>
                        <View style={[styles.tableCellView, {flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', }]}>
                          {!!this.state.selectedTableNames.length ? (this.state.selectedTableNames).map((name, index) => (
                            <StyledText key={index} style={[styles.reservationFormContainer, {marginBottom: 4}]}>{name} </StyledText>
                          )
                          )
                            :
                            <StyledText style={[styles.reservationFormContainer]}>{t('reservation.noTable')}</StyledText>
                          }
                        </View>
                      </View>

                      <View style={[styles.bottom, styles.horizontalMargin]}>
                        <NotificationTask
                          buttonText={t('action.save')}
                          isStyledText={false}
                          buttonStyles={[]}
                          textStyles={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}
                          onPress={() => handleSaveReservation(schedulePushNotification, t, 'CREATE')}
                        />

                        <TouchableOpacity onPress={() => {
                          handleCancel(isEdit)
                        }}>
                          <Text
                            style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}
                          >
                            {t('action.cancel')}
                          </Text>
                        </TouchableOpacity>

                      </View>
                    </>
                  }
                </View>


              </View>
            </View>
          </ThemeScrollView >
        )
      } else {
        return (
          <ThemeContainer>
            <View style={[styles.fullWidthScreen, {marginTop: 53 - statusHeight}]}>
              <ScreenHeader
                backNavigation={true}
                backAction={() => {
                  if (!isEdit) {
                    this.handleResetForm()
                    handleReset()
                    navigation.navigate('ReservationCalendarScreen')
                  }
                  if (isEdit) {
                    this.handleResetForm()
                    handleReset()
                    navigation.navigate('ReservationViewScreen')
                  }
                }}
                leftMenuIcon={true}
                title={t('reservation.reservationTitle')}
                parentFullScreen={true} />

              <ThemeKeyboardAwareScrollView
                getRef={ref => {this.scroll = ref}}
                extraHeight={300}
                persistTaps='handled'
                enableResetScrollToCoords={false}
              >
                <>
                  <View style={styles.tableRowContainer}>
                    <View style={[styles.tableCellView, styles.flex(1)]}>
                      <StyledText style={styles.fieldTitle}>{t('reservation.date')}</StyledText>
                    </View>
                    <View style={[styles.tableCellView, styles.justifyRight]}>
                      <Field
                        name={`reservationStartDate`}
                        component={RenderDatePicker}
                        onChange={this.handleGetReservationDate}
                        minimumDate={moment().toDate()}
                        isShow={this.state?.showDatePicker ?? false}
                        showDatepicker={() => this.showDatePicker()}
                      />
                    </View>
                  </View>

                  <View style={styles.tableRowContainerWithBorder}>
                    <View style={[styles.flex(1)]}>
                      {timeBlocks && <Field
                        name="selectedTimeBlock"
                        component={SegmentedControl}
                        values={timeBlocks}
                        selectedIndex={this.state.selectedTimeBlock}
                        onChange={(value, index) => this.handleTimeBlockSelection(value, index)}
                      />}
                    </View>
                  </View>

                  <View style={[styles.withBottomBorder]}>
                    <View style={[styles.sectionTitleContainer]}>
                      <StyledText style={[styles.sectionTitleText]}>{t('reservation.hours')}</StyledText>
                    </View>
                    <View style={[styles.flex(1), styles.fieldContainer, {flexWrap: 'wrap'}]}>
                      {!!this.state.hoursArr && this.state.hoursArr?.map((item, index) => (
                        <Field
                          key={item + index}
                          name="hour"
                          component={RadioReservationTimePick}
                          customValueOrder={item}
                          optionName={`${item}00`}
                          onChange={(value) => this.handleHourCheck(value)}
                          onCheck={(currentVal, fieldVal) => {
                            return fieldVal !== undefined && currentVal === fieldVal
                          }}
                        />))}
                    </View>
                  </View>

                  {(this.state.isTimeView) &&
                    <Animated.View style={[styles.withBottomBorder, {marginBottom: 12}]}>
                      <View style={[styles.sectionTitleContainer]}>
                        <StyledText style={styles.sectionTitleText}>{t('reservation.minutes')}</StyledText>
                      </View>
                      <View style={[styles.flex(2), styles.fieldContainer]}>
                        {!!this.state.minutesArr && this.state.minutesArr?.map((item, index) => (
                          <Field
                            key={item + index}
                            name="minutes"
                            component={RadioReservationTimePick}
                            customValueOrder={item}
                            optionName={`${item}`}
                            onChange={(value) => this.handleMinuteCheck(value)}
                            onCheck={(currentVal, fieldVal) => {
                              return fieldVal !== undefined && currentVal === fieldVal
                            }}
                          />
                        ))}
                      </View>
                    </Animated.View>}
                  <View style={[styles.bottom, styles.horizontalMargin]}>
                    {this.state.isGetTables &&
                      <>
                        {noAvailableTables && (
                          <View style={[styles.sectionContent]}>
                            <View style={[styles.jc_alignIem_center]}>
                              <StyledText>({t('empty')})</StyledText>
                            </View>
                          </View>
                        )}
                        <Accordion
                          onChange={(activeSections) => this.setState({activeTableLayout: activeSections})}
                          activeSections={this.state?.activeTableLayout}
                          expandMultiple
                        >
                          {layoutList.map((layout, layoutIndex) => {
                            return (
                              <Accordion.Panel
                                key={layoutIndex}
                                header={
                                  <View style={[styles.listPanel]}>
                                    <View style={[styles.tableCellView, styles.flex(1)]}>
                                      <StyledText style={[{color: customMainThemeColor, fontWeight: 'bold'}, styles.listPanelText]}>{layout}
                                      </StyledText>
                                    </View>
                                  </View>
                                }
                              >
                                <List>
                                  {tablesMap?.[layout].map((table) => {
                                    let isAvailable = this.state.availableTables && this.state.availableTables?.includes(table.tableId)
                                    let isSelected = this.state?.selectedTableIds.includes(table.tableId)

                                    if (isAvailable) {
                                      return (
                                        <ListItem
                                          key={table?.tableId}
                                          onPress={() => {
                                            let tableList = this.state.availableTables
                                            if (isAvailable || (!isAvailable && isSelected)) {
                                              this.handleChooseTable(table.tableId, table.tableName)
                                              if (isSelected) {
                                                tableList.push(table.tableId)
                                                this.setState({availableTables: tableList})
                                              }
                                            }
                                          }}
                                          bottomDivider
                                          containerStyle={[styles.dynamicVerticalPadding(5), {backgroundColor: customBackgroundColor},]}
                                        >
                                          <View style={[styles.tableRowContainer]}>
                                            <View style={[styles.tableCellView]}>
                                              <CheckBox
                                                containerStyle={{margin: 0, padding: 0}}
                                                checkedIcon={'check-circle'}
                                                uncheckedIcon={'circle'}
                                                checked={this.state.selectedTableIds.includes(table.tableId)}
                                                onPress={() => {
                                                  let tableList = this.state.availableTables
                                                  if (isAvailable) {
                                                    this.handleChooseTable(table.tableId, table.tableName)
                                                    if (isSelected) {
                                                      tableList.push(table.tableId)
                                                      this.setState({availableTables: tableList})
                                                    }
                                                  }
                                                }}
                                              >
                                              </CheckBox>
                                            </View>
                                            <View style={[styles.tableCellView]}>
                                              <StyledText>{table?.tableName}</StyledText>
                                            </View>
                                          </View>
                                        </ListItem>
                                      )
                                    }
                                  })}
                                  {tablesMap?.[layout].length == 0 && (
                                    <ListItem
                                      onPress={() => {
                                      }}
                                      bottomDivider
                                      containerStyle={[styles.dynamicVerticalPadding(10), {backgroundColor: customBackgroundColor},]}
                                    >
                                      <View style={[styles.tableRowContainer]}>
                                        <View style={[styles.tableCellView]}>
                                          <StyledText>({t('empty')})</StyledText>
                                        </View>
                                      </View>
                                    </ListItem>
                                  )}
                                </List>
                              </Accordion.Panel>
                            )
                          })}
                        </Accordion>

                        <View style={[{marginBottom: 12}]}>
                          <View style={styles.sectionTitleContainer}>
                            <StyledText style={styles.sectionTitleText}>{t('reservation.peopleCount')}</StyledText>
                          </View>
                          <View>
                            <View style={[styles.tableRowContainer]}>
                              <Field
                                name={`people`}
                                component={RenderStepper}
                                optionName={t('reservation.adult')}
                                validate={[isRequired, isCountZero]}
                                showNumber={false}
                              />
                            </View>
                            <View style={[styles.tableRowContainer]}>
                              <Field
                                name={`kid`}
                                component={RenderStepper}
                                optionName={t('reservation.kid')}
                                showNumber={false}
                              />
                            </View>
                          </View>
                        </View>

                        <View style={[styles.withBottomBorder, styles.sectionContent]}>
                          <View style={[styles.sectionTitleContainer]}>
                            <StyledText style={styles.sectionTitleText}>{t('reservation.contactInfo')}</StyledText>
                          </View>
                          <View style={[styles.flex(1), styles.fieldContainer]}>
                            <Field
                              name="phoneNumber"
                              component={InputTextComponent}
                              clearTextOnFocus={true}
                              onEndEditing={(value) => {
                                this.handleSearchMember(value.nativeEvent.text);
                              }}
                              setFieldToBeFocused={input => {
                                this.phoneNumberInput = input
                              }}
                              nextField={this.nameInput}
                              extraStyle={this.props?.membershipId && {backgroundColor: '#e7e7e7'}}
                              editable={!this.props?.membershipId}
                              validate={isRequired}
                              placeholder={t('reservation.phone')}
                              keyboardType={'numeric'}
                            />
                            {this.state.searching ? <View style={{width: 24}}><LoadingScreen /></View> : this.state.isSearched ? <View>
                              {this.state.isMembership ? <Ionicons name="checkmark-circle" size={24} color={customMainThemeColor} /> :
                                <TouchableOpacity onPress={() =>
                                  Alert.alert(
                                    ``,
                                    `${this.context.t(`membership.searchNullMsg`)}`,
                                    [
                                      {
                                        text: `${this.context.t('action.yes')}`,
                                        onPress: () => {
                                          this.handleCreateMember()
                                        }
                                      },
                                      {
                                        text: `${this.context.t('action.no')}`,
                                        onPress: () => {},
                                        style: 'cancel'
                                      }
                                    ]
                                  )}>
                                  <Ionicons name="add" size={24} color={customMainThemeColor} />
                                </TouchableOpacity>
                              }
                            </View> : null}
                            {(isEdit && !!this.props?.membershipId) &&
                              <TouchableOpacity onPress={() =>
                                Alert.alert(
                                  ``,
                                  `${this.context.t(`reservation.unbindMemberContext`)}`,
                                  [
                                    {
                                      text: `${this.context.t('action.yes')}`,
                                      onPress: () => {
                                        this.handleUnbindMember()
                                      }
                                    },
                                    {
                                      text: `${this.context.t('action.no')}`,
                                      onPress: () => {},
                                      style: 'cancel'
                                    }
                                  ]
                                )}>
                                <Ionicons name="close-circle" size={24} color={customMainThemeColor} />
                              </TouchableOpacity>
                            }
                          </View>
                          <View style={[styles.flex(1), styles.fieldContainer]}>
                            <Field
                              name="name"
                              component={InputTextComponent}
                              setFieldToBeFocused={input => {
                                this.nameInput = input
                              }}
                              nextField={this.noteInput}
                              extraStyle={(!this.state.isNameEditable) && {backgroundColor: '#e7e7e7'}}
                              editable={this.state.isNameEditable}
                              validate={isRequired}
                              placeholder={t('reservation.name')}
                            />
                            {this.state.membershipModalVisible &&
                              <View style={[{
                                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                                position: 'absolute', width: '100%', top: -4, right: 0, backgroundColor: '#eee', borderRadius: 8, paddingHorizontal: 12
                              }]}>
                                {this.state.searching ? <LoadingScreen /> :
                                  <>
                                    <View>
                                      <StyledText style={[styles.textMedium]}>{this.state.searchResults.name}</StyledText>
                                    </View>
                                    <View style={[styles.fieldContainer]}>
                                      <TouchableOpacity style={[styles.dynamicHorizontalPadding(4)]} onPress={() => this.handleFillName(true)}>
                                        <Ionicons name="checkmark" size={24} color={customMainThemeColor} />
                                      </TouchableOpacity>
                                      <TouchableOpacity onPress={() => this.handleFillName(false)}>
                                        <Ionicons name="close" size={24} color={customMainThemeColor} />
                                      </TouchableOpacity>
                                    </View>

                                  </>}
                              </View>}
                          </View>
                          <View style={[styles.flex(1), styles.fieldContainer]}>
                            <Field
                              name="note"
                              component={InputTextComponent}
                              setFieldToBeFocused={input => {
                                this.noteInput = input
                              }}
                              placeholder={t('reservation.otherNote')}
                            />
                          </View>
                        </View>

                        <View>
                          <TouchableOpacity onPress={handleSubmit(value => {
                            handleSubmit()
                            handleNextStep(true)
                            this.handleCheckForm(value)
                          })}>
                            <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                              {t('reservation.next')}
                            </Text>
                          </TouchableOpacity>
                          {isEdit && <TouchableOpacity onPress={() => {
                            handleCancel(isEdit)
                          }}>
                            <Text
                              style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}
                            >
                              {t('action.cancel')}
                            </Text>
                          </TouchableOpacity>}
                        </View>
                      </>
                    }
                  </View>

                </>

              </ThemeKeyboardAwareScrollView>

            </View>
          </ThemeContainer>
        )
      }

    }
  }
}

const selector = formValueSelector('reservationForm')

const mapStateToProps = state => {
  const phoneNumber = selector(state, 'phoneNumber')
  const name = selector(state, 'name')
  const note = selector(state, 'note')
  const membershipId = selector(state, 'membershipId')
  return {
    phoneNumber,
    name,
    note,
    membershipId,
    tablelayouts: state.tablelayouts.data.tableLayouts,
    tablelayout: state.tablelayout.data,
    haveData: state.tablelayouts.haveData,
    haveError: state.ordersinflight.haveError || state.tablelayouts.haveError,
    isLoading: state.ordersinflight.loading || state.tablelayouts.loading,
    availableTables: state.tablesavailable.data.availableTables,
    ordersInflight: state.ordersinflight.data.orders,
    orderSets: state.ordersinflight.data?.setData,
    shiftStatus: state.shift.data.shiftStatus,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
  getTableLayouts: () => dispatch(getTableLayouts()),
  getAvailableTables: () => dispatch(getTablesAvailable()),
  getTableLayout: (id) => dispatch(getTableLayout(id)),
  getfetchOrderInflights: () => dispatch(getfetchOrderInflights()),
  getShiftStatus: () => dispatch(getShiftStatus()),
})

ReservationFormScreen = reduxForm({
  form: 'reservationForm'
})(ReservationFormScreen)


const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withContext
)
export default enhance(ReservationFormScreen)


class TableMapBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pan: new Animated.ValueXY(),
      panUnder: new Animated.ValueXY(),
      opacity: new Animated.Value(1),
      tableOrder: props?.orders?.[`${props?.layoutId}`]?.find((item) => {return (item?.tableId === props?.table?.tableId || item?.tables?.some((table) => table?.tableId === props?.table?.tableId))}),
      isSelected: false,
      availableTables: props?.availableTables ?? null
    };
  }

  componentDidUpdate(prevProps, prevState) {

    if (prevProps.availableTables !== this.props.availableTables) {
      this.initPosition()
    }
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

  renderTableMap(layoutId, table, index, borderColor, positionArr, customMainThemeColor, customSecondThemeColor, customBackgroundColor, t) {
    TimeAgo.addLocale(en)
    const timeAgo = new TimeAgo()

    const panStyle = {
      transform: this.state.pan.getTranslateTransform()
    }
    const panStyleUnder = {
      transform: this.state.panUnder.getTranslateTransform()
    }
    const tableOrder = this.state.tableOrder
    const tableStatus = tableOrder?.state // current table status


    const selectedStyle = {
      backgroundColor: customMainThemeColor
    }

    const tableSize = 72
    const isAvailable = this.props.availableTables?.find((item) => item === table.tableId)
    const isSelected = !!this.props?.selectedTableIds && ((this.props?.selectedTableIds.indexOf(table.tableId) > -1) && isAvailable)

    const customStyle = [{color: '#222', textAlign: 'center'}, isSelected ? {color: customBackgroundColor} : {}]

    return (
      <View>
        {
          table.position !== null
            ?
            <Animated.View style={{opacity: this.state.opacity}}>
              <TouchableOpacity

                onPress={() => {
                  if (isAvailable) {
                    this.props.handleChooseTable(table.tableId, table.tableName)
                  }
                }}
                style={[panStyle, {zIndex: 1000, position: 'absolute', alignItems: 'center', justifyContent: 'space-around', width: tableSize, height: tableSize, borderRadius: 50}, (!isAvailable) ? {backgroundColor: '#f75336'} : {backgroundColor: '#e7e7e7'}, isSelected && selectedStyle]}>

                <Text style={customStyle}>{table.tableName}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Ionicons name={'ios-people'} color={isSelected ? customBackgroundColor : '#222'} size={20} />
                  <Text style={customStyle}>{` ${tableOrder?.customerCount ?? 0}(${table.capacity})`}</Text>
                </View>
              </TouchableOpacity>

            </Animated.View>

            :
            <Animated.View style={{opacity: this.state.opacity}}>

              <TouchableOpacity
                onPress={() => {
                }}
                style={[panStyle, {zIndex: 1000, position: 'absolute', alignItems: 'center', justifyContent: 'space-around', width: tableSize, height: tableSize, borderRadius: 50}, (!isAvailable) ? {backgroundColor: '#f75336', opacity: 0.5} : {backgroundColor: '#e7e7e7'}, isSelected && selectedStyle]}>

                <Text style={customStyle}>{table.tableName}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Ionicons name={'ios-people'} color={isSelected ? customBackgroundColor : '#222'} size={20} />
                  <Text style={customStyle}>{` ${tableOrder?.customerCount ?? 0}(${table.capacity})`}</Text>
                </View>
              </TouchableOpacity>

            </Animated.View>
        }
      </View>
    );
  }

  render() {
    const {table, layoutId, index, borderColor, positionArr, locale: {customMainThemeColor, customSecondThemeColor, customBackgroundColor}} = this.props
    return (
      <View style={{alignItems: "flex-start", borderWidth: 0, marginBottom: 0}} ref='self'>
        {this.renderTableMap(layoutId, table, index, borderColor, positionArr, customMainThemeColor, customSecondThemeColor, customBackgroundColor)}
      </View>
    );
  }
}

const TableMap = withContext(TableMapBase)

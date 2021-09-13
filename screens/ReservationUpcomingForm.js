import React, {Component} from 'react'
import {Field, reduxForm, formValueSelector} from 'redux-form'
import {Keyboard, Text, TouchableOpacity, View, FlatList, Dimensions, Alert, Animated, ScrollView, Modal} from 'react-native'
import FullModal from 'react-native-modal';
import {Accordion, List} from '@ant-design/react-native'
import {ListItem, CheckBox, Button, Tooltip} from "react-native-elements";
import {connect} from 'react-redux'
import {compose} from "redux";
import {normalizeTimeString} from '../actions'
import {withContext} from "../helpers/contextHelper";
import {isRequired, isCountZero} from '../validators'
import InputText from '../components/InputText'
import InputTextComponent from '../components/InputTextComponent'
import {api, dispatchFetchRequest, dispatchFetchRequestWithOption} from '../constants/Backend'
import {LocaleContext} from '../locales/LocaleContext'
import SegmentedControl from "../components/SegmentedControl"
import RenderStepper from '../components/RenderStepper'
import ScreenHeader from "../components/ScreenHeader";
import LoadingScreen from "./LoadingScreen";
import {RenderDatePicker} from '../components/DateTimePicker'
import {RadioReservationTimePick} from '../components/RadioItemObjPick'
import TimeZoneService from "../helpers/TimeZoneService";
import styles from '../styles'
import {StyledText} from "../components/StyledText";
import {ThemeContainer} from "../components/ThemeContainer";
import {ThemeScrollView} from "../components/ThemeScrollView";
import moment from 'moment-timezone'
import Icon from 'react-native-vector-icons/Ionicons'
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";
import NotificationTask, {schedulePushNotification} from '../components/NotificationTask'



class ReservationUpcomingForm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  _isMounted = false

  constructor(props, context) {
    super(props, context)

    this.state = {
      isTablet: context?.isTablet,
      isLoading: false,
      selectedTimeBlock: null,
      timeBlocks: {
        0: {value: 'MORNING', label: context.t('reservation.timeBlock.morning')},
        1: {value: 'NOON', label: context.t('reservation.timeBlock.noon')},
        2: {value: 'EVENING', label: context.t('reservation.timeBlock.evening')},
      },
      showDatePicker: false,
      reservationDate: moment(new Date()).format('YYYY-MM-DD'),
      startDate: moment(new Date()).startOf('day').add(7, 'hour').format('YYYY-MM-DDTHH:mm:ss'),
      endDate: moment(new Date()).startOf('day').add(11, 'hour').format('YYYY-MM-DDTHH:mm:ss'),
      dayBookedEvents: [],
      dayWaitingEvents: [],
      bookedCount: 0,
      waitingCount: 0,
      isBookedMode: true,
      modeStatus: 'BOOKED, CONFIRMED, SEATED',
      delayModalVisible: false,
      delayArr: [10, 20, 30],
      showTableModal: false,
      availableTables: null,
      selectedTableIds: [],
      selectedEventValues: null,
      mobileFormVisible: false,
      searching: false,
      searchResults: null,
      membershipModalVisible: false,
      isMembership: false,
      isSearched: false,
      hoursArr: null,
      minutesArr: ['15', '30', '45', '00'],
      selectedHour: null,
      selectedMinutes: null
    }
  }

  componentDidMount() {
    this._isMounted = true;

    if (this._isMounted) {
      this._refreshScreen = this.props.navigation.addListener('focus', () => {
        this.getReservationEventsByTime(this.state.startDate, this.state.endDate, this.state.modeStatus)
      })
    }

  }
  componentWillUnmount() {
    this._isMounted = false;

    this._refreshScreen()
    this.setState = (state, callback) => {
      return
    }
  }

  refreshScreen = () => {
    this.getReservationEventsByTime(this.state.startDate, this.state.endDate, this.state.modeStatus)
  }


  handleGetReservationDate = (event, selectedDate) => {

    this.props.change(`reservationStartDate`, new Date(selectedDate))

    let currentHour = moment(selectedDate).hour()
    let timeBlockIndex = currentHour <= 10 ? 0 : currentHour > 10 && currentHour < 17 ? 1 : 2

    this.setState({reservationDate: moment(selectedDate).format('YYYY-MM-DD'), selectedTimeBlock: timeBlockIndex})
    this.handleTimeFormat(timeBlockIndex, moment(selectedDate).format('YYYY-MM-DD'))
  }
  showDatePicker = () => {
    this.setState({
      showDatePicker: !this.state?.showDatePicker
    })
  };

  handleViewMode = (mode, status) => {
    this.setState({isBookedMode: mode, modeStatus: status})
    this.getReservationEventsByTime(this.state.startDate, this.state.endDate, status)
  }
  handleTimeBlockSelection = (value, index) => {
    this.setState({selectedTimeBlock: index})
    this.handleTimeFormat(index, this.state.reservationDate)
  }

  handleTimeFormat = (index, currentDate) => {
    let startHour = index == 0 ? '07' : index == 1 ? '11' : '17'
    let endHour = index == 0 ? '11' : index == 1 ? '17' : '24'

    let startDate = moment(`${currentDate} ${startHour}:00`).format('YYYY-MM-DDTHH:mm:ss')
    let endDate = moment(`${currentDate} ${endHour}:00`).format('YYYY-MM-DDTHH:mm:ss')
    this.setState({startDate: startDate, endDate: endDate})

    if (this._isMounted) {
      this.getReservationEventsByTime(startDate, endDate, 'BOOKED, CONFIRMED, SEATED')
      this.getReservationEventsByTime(startDate, endDate, 'WAITING')
    }
  }

  getReservationEventsByTime = async (startDate, endDate, status) => {
    this.setState({isLoading: true})
    await dispatchFetchRequest(api.reservation.getReservationByTime(startDate, endDate, status), {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }, response => {
      response.json().then((data) => {
        if (status == 'BOOKED, CONFIRMED, SEATED') {
          this.setState({dayBookedEvents: data?.results, bookedCount: data?.results.length, isLoading: false})
        } else {
          this.setState({dayWaitingEvents: data?.results, waitingCount: data?.results.length, isLoading: false})
        }
      })
    }).then()
  }

  handleToggleDelayModal = (flag, id) => {
    this.setState({delayModalVisible: flag, selectedEventId: id})
  }
  handleDelay = (mins) => {
    let id = this.state.selectedEventId
    Alert.alert(
      ``,
      `${this.context.t('reservation.delayActionContext', {minutes: mins})}`,
      [
        {
          text: `${this.context.t('action.yes')}`,
          onPress: () => {
            dispatchFetchRequestWithOption(
              api.reservation.delay(id),
              {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({minutes: mins})
              }, {defaultMessage: false},
              response => {
                this.handleToggleDelayModal(false, null)
              }
            ).then(
              setTimeout(() => {
                this.refreshScreen()
              }, 300)
            )
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
  handleSeat = (id) => {
    Alert.alert(
      ``,
      `${this.context.t('reservation.seatActionContext')}`,
      [
        {
          text: `${this.context.t('action.yes')}`,
          onPress: () => {
            dispatchFetchRequestWithOption(
              api.reservation.seat(id),
              {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {},
              }, {defaultMessage: false},
              response => {
              }
            ).then(
              setTimeout(() => {
                this.refreshScreen()
              }, 500)
            )
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

  handleCancel = (reservation, notificationPush, t, flag) => {
    Alert.alert(
      ``,
      `${this.context.t('reservation.deleteActionContext')}`,
      [
        {
          text: `${this.context.t('action.yes')}`,
          onPress: () => {
            dispatchFetchRequestWithOption(
              api.reservation.update(reservation.id),
              {
                method: 'DELETE',
                withCredentials: true,
                credentials: 'include',
                headers: {},
              }, {defaultMessage: false},
              response => {

              }
            ).then(() => {
              if (this.props.client?.clientSettings?.PUSH_NOTIFICATION !== undefined && this.props.client?.clientSettings?.PUSH_NOTIFICATION?.value) {
                notificationPush(reservation, t, flag)
              }
              setTimeout(() => {
                this.refreshScreen()
              }, 300)
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

  handleToggleTableList = (flag, event) => {
    console.log(this.state.selectedHour, this.state.selectedMinutes)
    this.setState({showTableModal: flag, selectedEventValues: event})
    if (event !== null) {
      let startHour = moment(event.reservationStartDate).hour()
      let endHour = startHour + 4 > 24 ? 24 : startHour + 4
      let customHours = []
      for (let i = startHour; i <= endHour; i++) {
        customHours.push(i.toString())
      }
      this.setState({hoursArr: customHours})
      // this.handleCheckAvailableTables(event.id, event.reservationStartDate)
    } else {
      this.props.change(`hour`, null)
      this.props.change(`minutes`, null)
      this.handleHourCheck(null)
      this.handleMinuteCheck(null)
    }
  }
  handleCheckAvailableTables = (id, time) => {

    let checkDate = normalizeTimeString(time, 'YYYY-MM-DDTHH:mm:ss')

    console.log("check date", checkDate)
    dispatchFetchRequestWithOption(api.reservation.getAvailableTables(checkDate, id), {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',
      headers: {},
    }, {
      defaultMessage: false
    },
      response => {
        response.json().then(data => {
          this.setState({availableTables: data.results, isGetTables: true})

        })
      }).then()
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
            this.setState({searchResults: data.results[0], searching: false, isMembership: true, membershipModalVisible: true, isSearched: true})
          } else {
            this.setState({searchResults: data.results, searching: false, isMembership: false, membershipModalVisible: false, isSearched: true})
            this.nameInput.focus()
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

          this.setState({isMembership: true})
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
    this.setState({membershipModalVisible: false})

    if (!!flag) {
      this.props.change(`name`, this.state.searchResults.name)
      this.scroll?.scrollToEnd({animated: true})
      this.noteInput.focus()
    } else {
      this.nameInput.focus()
    }
  }


  handleUpdateReservation = (values) => {
    let eventDate = normalizeTimeString(values.reservationStartDate, 'YYYY-MM-DD')
    let dateStr = `${eventDate} ${this.state.selectedHour}:${this.state.selectedMinutes}`

    let request = {
      reservationDate: normalizeTimeString(dateStr, 'YYYY-MM-DDTHH:mm:ss'),
      name: values.name,
      phoneNumber: values.phoneNumber,
      tableIds: this.state.selectedTableIds,
      people: values?.people,
      kid: values?.kid,
      note: values?.note
    }
    console.log("check update=", request)

    if (this.state.selectedTableIds && this.state.selectedTableIds.length > 0) {
      dispatchFetchRequestWithOption(
        api.reservation.update(values.id),
        {
          method: 'POST',
          withCredentials: true,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(request)
        }, {defaultMessage: true},
        response => {
          this.handleToggleTableList(false, null)
          this.setState({selectedTableIds: [], selectedHour: null, selectedMinutes: null})
        }
      ).then(
        setTimeout(() => {
          this.refreshScreen()
        }, 300)
      )
    } else {
      Alert.alert(
        ``,
        `${this.context.t('reservation.selectTablesContext')}`,
        [
          {
            text: `${this.context.t('action.confirm')}`,
            onPress: () => {}
          }
        ]
      )
    }
  }

  handleHourCheck = (value) => {
    if ((value !== null) && !!this.state.selectedMinutes) {
      let dateStr = `${this.state.reservationDate} ${value}:${this.state.selectedMinutes}`
      this.handleCheckAvailableTables((this.state.selectedEventValues?.id ?? null), dateStr)
    }
    this.setState({selectedHour: value})
  }
  handleMinuteCheck = (value) => {
    if ((value !== null) && !!this.state.selectedHour) {
      let dateStr = `${this.state.reservationDate} ${this.state.selectedHour}:${value}`
      this.handleCheckAvailableTables((this.state.selectedEventValues?.id ?? null), dateStr)
    }
    this.setState({selectedMinutes: value})

  }

  handleChooseTable = (id, name) => {
    let tableIds = this.state.selectedTableIds
    let cancelTableIdx = tableIds.indexOf(id)

    if (!!tableIds && cancelTableIdx > -1) {
      tableIds.splice(cancelTableIdx, 1)
      this.setState({selectedTableIds: tableIds})
    } else {
      this.setState({selectedTableIds: [...tableIds, id]})
    }
  }


  handleToggleMobileForm = (flag) => {
    this.setState({mobileFormVisible: flag})
  }



  render() {
    const {
      navigation,
      route,
      haveData,
      isLoading,
      tablelayouts,
      ordersInflight,
      availableTables,
      handleSubmit,
      statusHeight,
      shiftStatus,
      client
    } = this.props

    const {t, customMainThemeColor, customBackgroundColor, appType} = this.context
    const timeBlocks = Object.keys(this.state.timeBlocks).map(key => this.state.timeBlocks[key].label)
    const timezone = TimeZoneService.getTimeZone()


    const tablesMap = {}

    if (shiftStatus === 'ACTIVE') {
      availableTables && tablelayouts && tablelayouts.forEach((layout, idx) => {
        const availableTablesOfLayout = availableTables[layout.id]

        if (availableTablesOfLayout !== undefined) {
          tablesMap[layout.layoutName] = tablelayouts?.[idx]?.tables
        }
      })
    } else {
      tablelayouts && tablelayouts.forEach((layout, idx) => {

        tablesMap[layout.layoutName] = tablelayouts?.[idx]?.tables
      })
    }

    const layoutList = Object.keys(tablesMap)
    const noAvailableTables = Object.keys(tablesMap).length === 0


    if (!!this?.state?.isTablet) {
      return (
        <ThemeScrollView keyboardShouldPersistTaps={'always'}>
          <View style={[styles.fullWidthScreen, {marginTop: 53 - statusHeight}]}>
            <ScreenHeader
              backNavigation={false}
              title={t('reservation.reservationUpcomingTitle')}
              parentFullScreen={true} />


            <FullModal
              isVisible={this.state?.showTableModal}
              useNativeDriver
              hideModalContentWhileAnimating
              animationIn='fadeInDown'
              animationOut='fadeOutUp'
              onBackdropPress={() => this.handleToggleTableList(false, null)}
              style={{
                margin: 0, justifyContent: 'center', flex: 1
              }}
            >
              <View style={[styles.customBorderAndBackgroundColor(this.context), {maxWidth: 540, alignSelf: 'center', minHeight: 620, maxHeight: '70%', width: '100%', borderRadius: 16, paddingBottom: 8}]}>
                <View style={[styles.tableRowContainer, styles.dynamicVerticalPadding(24), {justifyContent: 'center'}]}>
                  <StyledText style={[styles?.announcementTitle(customMainThemeColor)]}>{t('reservation.actionTip.tableSelect')}</StyledText>
                  <TouchableOpacity style={{position: 'absolute', right: 10, top: 8, zIndex: 100}}
                    onPress={() => this.handleToggleTableList(false, null)}
                  >
                    <Icon name="close" size={32} color={customMainThemeColor} />
                  </TouchableOpacity>
                </View>
                <ScrollView style={{maxHeight: 480}}>
                  <View>
                    <View>
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
                      <View style={[styles.withBottomBorder, {marginBottom: 4}]}>
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
                      </View>
                    </View>
                    {noAvailableTables && (
                      <View style={[styles.sectionContent]}>
                        <View style={[styles.jc_alignIem_center]}>
                          <StyledText>({t('empty')})</StyledText>
                        </View>
                      </View>
                    )}
                    {(!!this.state.selectedHour && !!this.state.selectedMinutes) &&
                      <Accordion
                        onChange={(activeSections) => this.setState({activeTableLayout: activeSections})}
                        activeSections={this.state?.activeTableLayout}
                        expandMultiple
                      >
                        {layoutList && layoutList.map((layout, layoutIndex) => {
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
                                  let isAvailable = this.state.availableTables?.includes(table.tableId)
                                  let isSelected = this.state?.selectedTableIds.includes(table.tableId)

                                  return (
                                    <ListItem
                                      key={table?.tableId}
                                      title={
                                        <View style={[styles.tableRowContainer]}>
                                          <View style={[styles.tableCellView]}>
                                            <CheckBox
                                              containerStyle={{margin: 0, padding: 0}}
                                              disabled={!isAvailable}
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
                                      }
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
                                      containerStyle={[styles.dynamicVerticalPadding(5), {backgroundColor: !isAvailable ? '#ccc' : customBackgroundColor},]}
                                    />
                                  )
                                })}
                                {tablesMap?.[layout].length == 0 && (
                                  <ListItem
                                    title={
                                      <View style={[styles.tableRowContainer]}>
                                        <View style={[styles.tableCellView, styles.withBottomBorder]}>
                                          <StyledText>({t('empty')})</StyledText>
                                        </View>
                                      </View>
                                    }
                                    onPress={() => {
                                    }}
                                    bottomDivider
                                    containerStyle={[styles.dynamicVerticalPadding(10), {backgroundColor: customBackgroundColor},]}
                                  />
                                )}
                              </List>
                            </Accordion.Panel>
                          )
                        })}
                      </Accordion>
                    }

                  </View>
                </ScrollView>
                <View style={[styles.bottom]}>
                  <TouchableOpacity onPress={() => {
                    Keyboard.dismiss()
                    this.handleUpdateReservation(this.state.selectedEventValues)
                  }} style={[styles.dynamicHorizontalPadding(12)]}>
                    <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                      {t('action.save')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </FullModal>

            <FullModal
              isVisible={this.state.delayModalVisible}
              useNativeDriver
              hideModalContentWhileAnimating
              animationIn='fadeInDown'
              animationOut='fadeOutUp'
              onBackdropPress={() => this.handleToggleDelayModal(false, null)
              }
            >
              <View style={[styles.customBorderAndBackgroundColor(this.context), {maxWidth: 360, alignSelf: 'center', width: '100%', paddingBottom: 8, borderRadius: 8}]}>

                <View style={[styles.tableRowContainer, styles.jc_alignIem_center, styles.withBottomBorder, {marginBottom: 12}]}>
                  <StyledText style={[styles?.announcementTitle(customMainThemeColor)]}>{t('reservation.actionTip.delay')}</StyledText>

                </View>

                <View style={[styles.fieldContainer, {justifyContent: 'space-evenly'}]}>

                  {this.state.delayArr.map((mins, index) => (
                    <TouchableOpacity key={index} style={[styles.jc_alignIem_center, {backgroundColor: customMainThemeColor, borderWidth: 1, borderColor: customMainThemeColor, justifyContent: 'center', marginHorizontal: 8, marginVertical: 8, padding: 8, paddingHorizontal: 20}]} onPress={() => this.handleDelay(mins)}>
                      <StyledText style={[styles.inverseText(this.context)]}>
                        {mins}
                      </StyledText>
                    </TouchableOpacity>
                  ))}
                </View>

              </View>
            </FullModal>

            <View style={[styles.fieldContainer, styles.flex(1), {flexDirection: 'column', margin: 20}]}>

              {/* Top time selector */}
              <View style={[styles.flex(1), {flexDirection: 'row'}]}>
                <View style={[styles.flex(1), {justifyContent: 'flex-end', maxHeight: '100%'}]}>
                  <View style={[styles.tableRowContainer, styles.justifyRight]}>
                    <View style={[styles.tableCellView, styles.flex(0.25)]}>
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
                  <View style={[styles.tableRowContainer, styles.justifyRight]}>
                    <View style={[styles.flex(0.25)]}>
                      {timeBlocks && <Field
                        name="selectedTimeBlock"
                        component={SegmentedControl}
                        values={timeBlocks}
                        selectedIndex={this.state.selectedTimeBlock}
                        onChange={(value, index) => this.handleTimeBlockSelection(value, index)}
                      />}
                    </View>
                  </View>

                </View>
              </View>

              {/* Bottomform content */}
              <View style={[styles.flex(9), styles.withBorder(this.context), {flexDirection: 'row'}]}>

                <View style={[styles.flex(1), {justifyContent: 'flex-start', borderRightWidth: 1, borderColor: customMainThemeColor}]}>
                  <ThemeKeyboardAwareScrollView getRef={ref => {this.scroll = ref}} extraHeight={-72} enableResetScrollToCoords={false}
                  >
                    <View style={[styles.horizontalMargin]}>
                      <View style={[{marginBottom: 8}]}>
                        <View style={[styles.sectionTitleContainer, {marginVertical: 0}]}>
                          <StyledText style={styles.screenSubTitle(customMainThemeColor)}>{t('reservation.addWaiting')}</StyledText>
                        </View>
                        <View style={[styles.sectionTitleContainer, {marginVertical: 0}]}>
                          <StyledText style={styles.sectionTitleText}>{t('reservation.peopleCount')}</StyledText>
                        </View>
                        <View>
                          <View style={[styles.tableRowContainerWithBorder]}>
                            <Field
                              name={`people`}
                              component={RenderStepper}
                              optionName={t('reservation.adult')}
                              validate={[isRequired, isCountZero]}
                            />
                          </View>
                          <View style={[styles.tableRowContainerWithBorder]}>
                            <Field
                              name={`kid`}
                              component={RenderStepper}
                              optionName={t('reservation.kid')}
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
                            onEndEditing={(value) =>
                              this.handleSearchMember(value.nativeEvent.text)
                            }
                            setFieldToBeFocused={input => {
                              this.phoneNumberInput = input
                            }}
                            validate={isRequired}
                            placeholder={t('reservation.phone')}
                            keyboardType={'numeric'}
                          />
                          {this.state.searching ? <View style={{width: 24}}><LoadingScreen /></View> : this.state.isSearched ? <View>
                            {this.state.isMembership ? <Icon name="checkmark-circle" size={24} color={customMainThemeColor} /> :
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
                                <Icon name="add" size={24} color={customMainThemeColor} />
                              </TouchableOpacity>
                            }
                          </View> : null}
                        </View>
                        <View style={[styles.flex(1), styles.fieldContainer]}>
                          <Field
                            name="name"
                            component={InputTextComponent}
                            onEndEditing={() =>
                              this.noteInput.focus()
                            }
                            setFieldToBeFocused={input => {
                              this.nameInput = input
                            }}
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
                                      <Icon name="checkmark" size={24} color={customMainThemeColor} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.handleFillName(false)}>
                                      <Icon name="close" size={24} color={customMainThemeColor} />
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
                            onEndEditing={() =>
                              this.scroll?.scrollTo({x: 0, y: 0, animated: true})
                            }
                            placeholder={t('reservation.otherNote')}
                          />
                        </View>
                      </View>

                      <View>
                        <NotificationTask
                          buttonText={t('action.save')}
                          isStyledText={false}
                          buttonStyles={[]}
                          textStyles={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}
                          onPress={(values) => handleSubmit(values)}
                        />
                      </View>

                    </View>

                  </ThemeKeyboardAwareScrollView>


                </View>

                <View style={[styles.flex(2), {marginVertical: 12}]}>

                  <View style={[{flexDirection: 'row', paddingHorizontal: 20, marginBottom: 8, borderBottomWidth: 2, borderColor: customMainThemeColor}]}>
                    <StyledText style={[styles.primaryText(customMainThemeColor)]}>{t('reservation.summary')}</StyledText>
                    <View style={[styles.justifyRight, {flexDirection: 'row'}]}>
                      <TouchableOpacity onPress={() => this.handleViewMode(true, 'BOOKED, CONFIRMED, SEATED')} style={[styles.withBorder(this.context), styles.dynamicHorizontalPadding(16), styles.dynamicVerticalPadding(8), {borderTopEndRadius: 8, borderTopStartRadius: 8, borderBottomWidth: 0, backgroundColor: (this.state.isBookedMode ? customMainThemeColor : customBackgroundColor), }]}>
                        <StyledText style={[{color: (this.state.isBookedMode ? customBackgroundColor : customMainThemeColor)}]}>{t('reservation.booked')}: {this.state.bookedCount}</StyledText>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.handleViewMode(false, 'WAITING')} style={[styles.withBorder(this.context), styles.dynamicHorizontalPadding(16), styles.dynamicVerticalPadding(8), {borderTopEndRadius: 8, borderTopStartRadius: 8, borderBottomWidth: 0, backgroundColor: (this.state.isBookedMode ? customBackgroundColor : customMainThemeColor)}]}>
                        <StyledText style={[{color: (this.state.isBookedMode ? customMainThemeColor : customBackgroundColor)}]}>{t('reservation.waiting')}: {this.state.waitingCount}</StyledText>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {this.state.isLoading ? <LoadingScreen /> :
                    <ThemeScrollView>
                      {(this.state.isBookedMode && this.state.dayBookedEvents.length > 0) && this.state.dayBookedEvents.map((event) => {

                        return (
                          <View key={event?.id} style={[styles.withBottomBorder, {flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, maxHeight: 96}]}>

                            <View style={[styles.flex(2), {alignItems: 'flex-start', paddingLeft: 8}]}>
                              <View>
                                <View style={{flexDirection: 'row'}}>
                                  <View>
                                    <StyledText style={[styles.textBold]}>
                                      {event?.name}
                                    </StyledText>
                                  </View>
                                  <View style={{marginLeft: 2}}>
                                    <MCIcon color={customMainThemeColor} size={16} name={event?.sourceOfOrigin == 'APP' ? 'tablet-cellphone' : 'web'} />
                                  </View>
                                </View>

                                <StyledText>
                                  {event?.phoneNumber}
                                </StyledText>
                              </View>

                            </View>

                            <View style={[styles.flex(1), {justifyContent: 'center'}]}>
                              <StyledText>
                                {normalizeTimeString(event?.reservationStartDate, 'HH:mm')}
                              </StyledText>
                            </View>
                            <View style={[styles.flex(0.5), {justifyContent: 'center'}]}>
                              <View style={[{}]}>
                                <StyledText style={[{width: 20, height: 20, borderRadius: 10, borderWidth: 1, backgroundColor: (event?.status === 'BOOKED') ? customBackgroundColor : (event?.status === 'SEATED') ? '#f75336' : customMainThemeColor, color: (event?.status === 'BOOKED') ? customMainThemeColor : customBackgroundColor, borderColor: (event?.status === 'SEATED') ? '#f75336' : customMainThemeColor, textAlign: 'center', marginHorizontal: 4}]}>
                                  {event?.status?.slice(0, 1)}
                                </StyledText>
                              </View>
                            </View>
                            <View style={[styles.flex(0.5), {justifyContent: 'flex-start'}]}>
                              {(event?.note !== null && event?.note.length > 0) &&
                                <View>
                                  <Tooltip height={88} width={160} backgroundColor={customMainThemeColor}
                                    popover={
                                      <View>
                                        <StyledText style={{color: customBackgroundColor}}>{t('reservation.otherNote')}: </StyledText>
                                        <StyledText style={{color: customBackgroundColor}}>{event?.note}</StyledText>
                                      </View>
                                    }
                                  >
                                    <Icon color={customMainThemeColor} size={26} name='md-information-circle-sharp' />
                                  </Tooltip>
                                </View>
                              }
                            </View>
                            <View style={[styles.flex(0.5), {justifyContent: 'center', flexDirection: 'row'}]}>

                              <View>
                                <Icon color={customMainThemeColor} size={16} name='md-people' />
                              </View>
                              <View>
                                <StyledText style={[{paddingLeft: 4}]}>
                                  {event?.people + event?.kid}
                                </StyledText>

                              </View>
                            </View>
                            <View style={[styles.flex(1.5), {justifyContent: 'center'}]}>

                              <View style={[{flexDirection: 'column'}]}>
                                {(event?.tables && event?.tables.length > 0) ? event?.tables.map((table) => (
                                  <StyledText key={table.tableId} style={[{textAlign: 'center'}]}>
                                    {table.tableName}
                                  </StyledText>
                                ))
                                  :
                                  <StyledText style={[{borderWidth: 1, borderColor: '#e7e7e7', maxWidth: 80, marginHorizontal: 4, textAlign: 'center'}]}>{'None'}</StyledText>

                                }

                              </View>
                            </View>
                            <View style={[styles.flex(3), {justifyContent: 'flex-end'}]}>
                              {(event?.status !== 'SEATED' && shiftStatus === 'ACTIVE' && appType !== 'reservation') &&
                                <View style={[styles.tableRowContainer]}>
                                  <TouchableOpacity onPress={() => {
                                    this.handleSeat(event.id)
                                  }} style={[styles.flexButton(customMainThemeColor), {margin: 4, paddingVertical: 2}]}>
                                    <StyledText style={[styles.flexButtonText]}>{t('reservation.actionTip.seat')}</StyledText>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => {
                                      this.handleToggleDelayModal(true, event.id)
                                    }}
                                    style={[styles.flexButton(customMainThemeColor), {margin: 4, paddingVertical: 2}]}>
                                    <StyledText style={[styles.flexButtonText]}>{t('reservation.actionTip.delay')}</StyledText>
                                  </TouchableOpacity>
                                  <NotificationTask
                                    buttonText={t('reservation.actionTip.cancel')}
                                    isStyledText={true}
                                    buttonStyles={[styles.flexButton(customMainThemeColor), {margin: 4, paddingVertical: 2}]}
                                    textStyles={[styles.flexButtonText]}
                                    onPress={() => this.handleCancel(event, schedulePushNotification, t, 'DELETE')}
                                  />
                                </View>
                              }
                              {(appType === 'reservation') &&
                                <View style={[styles.tableRowContainer]}>
                                  <TouchableOpacity
                                    onPress={() => {
                                      this.handleToggleDelayModal(true, event.id)
                                    }}
                                    style={[styles.flexButton(customMainThemeColor), {margin: 4, paddingVertical: 2}]}>
                                    <StyledText style={[styles.flexButtonText]}>{t('reservation.actionTip.delay')}</StyledText>
                                  </TouchableOpacity>
                                  <NotificationTask
                                    buttonText={t('reservation.actionTip.cancel')}
                                    isStyledText={true}
                                    buttonStyles={[styles.flexButton(customMainThemeColor), {margin: 4, paddingVertical: 2}]}
                                    textStyles={[styles.flexButtonText]}
                                    onPress={() => this.handleCancel(event, schedulePushNotification, t, 'DELETE')}
                                  />
                                </View>
                              }
                            </View>
                          </View>
                        )
                      })}

                      {(!this.state.isBookedMode && this.state.dayWaitingEvents.length > 0) && this.state.dayWaitingEvents.map((event) => {
                        return (
                          <View key={event?.id} style={[styles.withBottomBorder, {flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, maxHeight: 96}]}>

                            <View style={[styles.flex(2), {alignItems: 'flex-start', paddingLeft: 8}]}>
                              <View>
                                <View style={{flexDirection: 'row'}}>
                                  <View>
                                    <StyledText style={[styles.textBold]}>
                                      {event?.name}
                                    </StyledText>
                                  </View>
                                  <View style={{marginLeft: 2}}>
                                    <MCIcon color={customMainThemeColor} size={16} name={event?.sourceOfOrigin == 'APP' ? 'tablet-cellphone' : 'web'} />
                                  </View>
                                </View>
                                <StyledText>
                                  {event?.phoneNumber}
                                </StyledText>
                              </View>
                            </View>
                            <View style={[styles.flex(0.5), {justifyContent: 'center'}]}>
                              {(event?.note !== null && event?.note.length > 0) &&
                                <View>
                                  <Tooltip height={88} width={160} backgroundColor={customMainThemeColor}
                                    popover={
                                      <View>
                                        <StyledText style={{color: customBackgroundColor}}>{t('reservation.otherNote')}: </StyledText>
                                        <StyledText style={{color: customBackgroundColor}}>{event?.note}</StyledText>
                                      </View>
                                    }
                                  >
                                    <Icon color={customMainThemeColor} size={20} name='md-information-circle-sharp' />
                                  </Tooltip>
                                </View>
                              }
                            </View>
                            <View style={[styles.flex(1), {justifyContent: 'center'}]}>
                              <StyledText>
                                {normalizeTimeString(event?.reservationStartDate, 'HH:mm')}
                              </StyledText>
                            </View>
                            <View style={[styles.flex(0.5), {justifyContent: 'center', flexDirection: 'row'}]}>

                              <View>
                                <Icon color={customMainThemeColor} size={16} name='md-people' />
                              </View>
                              <View>
                                <StyledText style={[{paddingLeft: 4}]}>
                                  {event?.people + event?.kid}
                                </StyledText>
                              </View>
                            </View>
                            <View style={[styles.flex(1), styles.jc_alignIem_center]}>
                              <StyledText style={[{borderWidth: 1, borderColor: '#e7e7e7', maxWidth: 80, marginHorizontal: 4, textAlign: 'center', paddingHorizontal: 4}]}>{'None'}</StyledText>
                            </View>
                            <View style={[styles.flex(3), {justifyContent: 'flex-end'}]}>

                              <View style={[styles.tableRowContainer]}>
                                <TouchableOpacity onPress={() => this.handleToggleTableList(true, event)} style={[styles.flexButton(customMainThemeColor), {margin: 4, paddingVertical: 2}]}>
                                  <StyledText style={[styles.flexButtonText]}>{t('reservation.actionTip.tableSelect')}</StyledText>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        )
                      })}
                      {((this.state.isBookedMode && this.state.dayBookedEvents.length == 0) || (!this.state.isBookedMode && this.state.dayWaitingEvents.length == 0)) &&
                        <View style={[styles.jc_alignIem_center]}>
                          <StyledText style={[styles.messageBlock]}>
                            {t('general.noData')}

                          </StyledText>
                        </View>}
                    </ThemeScrollView>

                  }
                </View>
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
              backNavigation={false}
              title={t('reservation.reservationUpcomingTitle')}
              parentFullScreen={true}
              leftMenuIcon={true}
              rightComponent={
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() => {
                      this.handleToggleMobileForm(true)
                    }}
                  >
                    <View>
                      <Icon name="add" size={32} color={customMainThemeColor} />
                    </View>
                  </TouchableOpacity>
                </View>
              }
            />

            <FullModal
              isVisible={this.state?.showTableModal}
              useNativeDriver
              hideModalContentWhileAnimating
              animationIn='fadeInDown'
              animationOut='fadeOutUp'
              onBackdropPress={() => this.handleToggleTableList(false, null)}
              style={{
                margin: 0, justifyContent: 'center', flex: 1
              }}
            >
              <View style={[styles.customBorderAndBackgroundColor(this.context), {alignSelf: 'center', minHeight: 540, height: '80%', width: '100%', borderRadius: 16, paddingBottom: 8}]}>
                <View style={[styles.tableRowContainer, styles.dynamicVerticalPadding(24), {justifyContent: 'center'}]}>
                  <StyledText style={[styles?.announcementTitle(customMainThemeColor)]}>{t('reservation.actionTip.tableSelect')}</StyledText>
                  <TouchableOpacity style={{position: 'absolute', right: 10, top: 8, zIndex: 100}}
                    onPress={() => this.handleToggleTableList(false, null)}
                  >
                    <Icon name="close" size={32} color={customMainThemeColor} />
                  </TouchableOpacity>
                </View>
                <ScrollView style={{maxHeight: 480}}>
                  <View>
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
                    <View style={[styles.withBottomBorder, {marginBottom: 4}]}>
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
                    </View>
                  </View>
                  <View>
                    {noAvailableTables && (
                      <View style={[styles.sectionContent]}>
                        <View style={[styles.jc_alignIem_center]}>
                          <StyledText>({t('empty')})</StyledText>
                        </View>
                      </View>
                    )}
                    {(!!this.state.selectedHour && !!this.state.selectedMinutes) &&
                      <Accordion
                        onChange={(activeSections) => this.setState({activeTableLayout: activeSections})}
                        activeSections={this.state?.activeTableLayout}
                        expandMultiple
                      >
                        {layoutList && layoutList.map((layout, layoutIndex) => {
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
                                  let isAvailable = this.state.availableTables?.includes(table.tableId)
                                  let isSelected = this.state?.selectedTableIds.includes(table.tableId)

                                  if (isAvailable) {
                                    return (
                                      <ListItem
                                        key={table?.tableId}
                                        title={
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
                                        }
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
                                      />
                                    )
                                  }
                                })}
                                {tablesMap?.[layout].length == 0 && (
                                  <ListItem
                                    title={
                                      <View style={[styles.tableRowContainer]}>
                                        <View style={[styles.tableCellView]}>
                                          <StyledText>({t('empty')})</StyledText>
                                        </View>
                                      </View>
                                    }
                                    onPress={() => {
                                    }}
                                    bottomDivider
                                    containerStyle={[styles.dynamicVerticalPadding(10), {backgroundColor: customBackgroundColor},]}
                                  />
                                )}
                              </List>
                            </Accordion.Panel>
                          )
                        })}
                      </Accordion>}

                  </View>
                </ScrollView>
                <View style={[styles.bottom]}>
                  <TouchableOpacity onPress={() => {
                    Keyboard.dismiss()
                    this.handleUpdateReservation(this.state.selectedEventValues)
                  }} style={[styles.dynamicHorizontalPadding(12)]}>
                    <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                      {t('action.save')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </FullModal>


            <FullModal
              isVisible={this.state.delayModalVisible}
              useNativeDriver
              hideModalContentWhileAnimating
              animationIn='fadeInDown'
              animationOut='fadeOutUp'
              onBackdropPress={() => this.handleToggleDelayModal(false, null)
              }
            >
              <View style={[styles.customBorderAndBackgroundColor(this.context), {maxWidth: 360, alignSelf: 'center', width: '100%', paddingBottom: 8, borderRadius: 8}]}>

                <View style={[styles.tableRowContainer, styles.jc_alignIem_center, styles.withBottomBorder, {marginBottom: 12}]}>
                  <StyledText style={[styles?.announcementTitle(customMainThemeColor)]}>{t('reservation.actionTip.delay')}</StyledText>

                </View>

                <View style={[styles.fieldContainer, {justifyContent: 'space-evenly'}]}>

                  {this.state.delayArr.map((mins, index) => (
                    <TouchableOpacity key={index} style={[styles.jc_alignIem_center, {backgroundColor: customMainThemeColor, borderWidth: 1, borderColor: customMainThemeColor, justifyContent: 'center', marginHorizontal: 8, marginVertical: 8, padding: 8, paddingHorizontal: 20}]} onPress={() => this.handleDelay(mins)}>
                      <StyledText style={[styles.inverseText(this.context)]}>
                        {mins}
                      </StyledText>
                    </TouchableOpacity>
                  ))}
                </View>

              </View>
            </FullModal>

            <FullModal
              isVisible={this.state?.mobileFormVisible}
              useNativeDriver
              hideModalContentWhileAnimating
              animationIn='fadeInUp'
              animationOut='fadeOutDown'
              onBackdropPress={() => this.handleToggleMobileForm(false)}
              style={{
                margin: 0, justifyContent: 'center', flex: 1
              }}
              initialVallues={this.props.initialVallues}
            >
              <View style={[styles.customBorderAndBackgroundColor(this.context), {alignSelf: 'center', maxHeight: '90%', width: '100%', borderRadius: 16, paddingBottom: 8}]}>
                <View style={[styles.tableRowContainer, styles.dynamicVerticalPadding(16), {justifyContent: 'center'}]}>
                  <StyledText style={[styles?.screenSubTitle(customMainThemeColor)]}>{t('reservation.addWaiting')}</StyledText>

                  <TouchableOpacity style={{position: 'absolute', right: 10, top: 8, zIndex: 100}}
                    onPress={() => this.handleToggleMobileForm(false)}
                  >
                    <Icon name="close" size={32} color={customMainThemeColor} />
                  </TouchableOpacity>
                </View>

                <ThemeKeyboardAwareScrollView
                  getRef={ref => {this.scroll = ref}}
                  extraHeight={-120} enableResetScrollToCoords={false}
                >
                  <View style={[styles.horizontalMargin]}>
                    <View style={[{marginBottom: 8}]}>
                      <View style={[styles.sectionTitleContainer, {marginVertical: 0}]}>
                        <StyledText style={styles.sectionTitleText}>{t('reservation.peopleCount')}</StyledText>
                      </View>
                      <View>
                        <View style={[styles.tableRowContainerWithBorder]}>
                          <Field
                            name={`people`}
                            component={RenderStepper}
                            optionName={t('reservation.adult')}
                            validate={[isRequired, isCountZero]}
                          />
                        </View>
                        <View style={[styles.tableRowContainerWithBorder]}>
                          <Field
                            name={`kid`}
                            component={RenderStepper}
                            optionName={t('reservation.kid')}
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
                          onEndEditing={(value) =>
                            this.handleSearchMember(value.nativeEvent.text)
                          }
                          setFieldToBeFocused={input => {
                            this.phoneNumberInput = input
                          }}
                          validate={isRequired}
                          placeholder={t('reservation.phone')}
                          keyboardType={'numeric'}
                        />
                        {this.state.searching ? <View style={{width: 24}}><LoadingScreen /></View> : this.state.isSearched ? <View>
                          {this.state.isMembership ? <Icon name="checkmark-circle" size={24} color={customMainThemeColor} /> :
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
                              <Icon name="add" size={24} color={customMainThemeColor} />
                            </TouchableOpacity>
                          }
                        </View> : null}
                      </View>
                      <View style={[styles.flex(1), styles.fieldContainer]}>
                        <Field
                          name="name"
                          component={InputTextComponent}
                          onEndEditing={() =>
                            this.noteInput.focus()
                          }
                          setFieldToBeFocused={input => {
                            this.nameInput = input
                          }}
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
                                    <Icon name="checkmark" size={24} color={customMainThemeColor} />
                                  </TouchableOpacity>
                                  <TouchableOpacity onPress={() => this.handleFillName(false)}>
                                    <Icon name="close" size={24} color={customMainThemeColor} />
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
                          onEndEditing={() =>
                            this.scroll?.scrollTo({x: 0, y: 0, animated: true})
                          }
                          placeholder={t('reservation.otherNote')}
                        />
                      </View>
                    </View>

                    <View>
                      <NotificationTask
                        buttonText={t('action.save')}
                        isStyledText={false}
                        buttonStyles={[]}
                        textStyles={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}
                        onPress={(values) => handleSubmit(values)}
                      />
                    </View>

                  </View>

                </ThemeKeyboardAwareScrollView>

              </View>
            </FullModal>


            <View style={[styles.flex(1), {flexDirection: 'column', margin: 0}]}>

              {/* Top time selector */}
              <View style={[styles.flex(1), {flexDirection: 'row'}]}>
                <View style={[styles.flex(1)]}>
                  <View style={[styles.tableRowContainer]}>
                    <View style={[styles.tableCellView, styles.flex(1)]}>
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
                  <View style={[styles.tableRowContainer]}>
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

                </View>
              </View>

              {/* Bottomform content */}
              <View style={[styles.flex(3), styles.withBorder(this.context), {marginHorizontal: 8}]}>

                <View style={[{flexDirection: 'row', paddingHorizontal: 20, marginVertical: 8, borderBottomWidth: 2, borderColor: customMainThemeColor}]}>
                  <StyledText style={[styles.primaryText(customMainThemeColor)]}>{t('reservation.summary')}</StyledText>
                  <View style={[styles.justifyRight, {flexDirection: 'row', }]}>
                    <TouchableOpacity onPress={() => this.handleViewMode(true, 'BOOKED, CONFIRMED, SEATED')} style={[styles.withBorder(this.context), styles.dynamicHorizontalPadding(16), styles.dynamicVerticalPadding(8), {borderTopEndRadius: 8, borderTopStartRadius: 8, borderBottomWidth: 0, backgroundColor: (this.state.isBookedMode ? customMainThemeColor : customBackgroundColor), }]}>
                      <StyledText style={[{color: (this.state.isBookedMode ? customBackgroundColor : customMainThemeColor)}]}>{t('reservation.booked')}: {this.state.bookedCount}</StyledText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.handleViewMode(false, 'WAITING')} style={[styles.withBorder(this.context), styles.dynamicHorizontalPadding(16), styles.dynamicVerticalPadding(8), {borderTopEndRadius: 8, borderTopStartRadius: 8, borderBottomWidth: 0, backgroundColor: (this.state.isBookedMode ? customBackgroundColor : customMainThemeColor)}]}>
                      <StyledText style={[{color: (this.state.isBookedMode ? customMainThemeColor : customBackgroundColor)}]}>{t('reservation.waiting')}: {this.state.waitingCount}</StyledText>
                    </TouchableOpacity>
                  </View>
                </View>

                {this.state.isLoading ? <LoadingScreen /> :
                  <ThemeScrollView style={[styles.flex(1)]}>
                    {(this.state.isBookedMode && this.state.dayBookedEvents.length > 0) && this.state.dayBookedEvents.map((event) => {

                      return (
                        <View key={event?.id} style={[styles.dynamicVerticalPadding(8), styles.withBottomBorder, {flexDirection: 'row', flex: 1, justifyContent: 'space-evenly', alignItems: 'center', maxHeight: 108}]}>
                          <View style={[styles.flex(2), {alignItems: 'flex-start', paddingLeft: 8}]}>
                            <View>
                              <View style={{flexDirection: 'row'}}>
                                <View>
                                  <StyledText style={[styles.textBold]}>
                                    {event?.name}
                                  </StyledText>
                                </View>
                                <View style={{marginLeft: 2}}>
                                  <MCIcon color={customMainThemeColor} size={16} name={event?.sourceOfOrigin == 'APP' ? 'tablet-cellphone' : 'web'} />
                                </View>
                              </View>
                              <StyledText>
                                {event?.phoneNumber}
                              </StyledText>
                            </View>
                          </View>

                          <View style={[styles.flex(0.9), {justifyContent: 'center'}]}>
                            <StyledText>
                              {normalizeTimeString(event?.reservationStartDate, 'HH:mm')}
                            </StyledText>
                          </View>
                          <View style={[styles.flex(0.6), {justifyContent: 'center'}]}>
                            <StyledText style={[{width: 20, height: 20, borderRadius: 10, backgroundColor: (event?.status === 'BOOKED') ? customBackgroundColor : (event?.status === 'SEATED') ? '#f75336' : customMainThemeColor, color: (event?.status === 'BOOKED') ? customMainThemeColor : customBackgroundColor, borderWidth: 1, borderColor: (event?.status === 'SEATED') ? '#f75336' : customMainThemeColor, textAlign: 'center', marginHorizontal: 4}]}>
                              {event?.status?.slice(0, 1)}
                            </StyledText>
                          </View>

                          <View style={[styles.flex(0.5), {justifyContent: 'center'}]}>
                            {(event?.note !== null && event?.note.length > 0) &&
                              <View>
                                <Tooltip height={88} width={160} backgroundColor={customMainThemeColor}
                                  popover={
                                    <View>
                                      <StyledText style={{color: customBackgroundColor}}>{t('reservation.otherNote')}: </StyledText>
                                      <StyledText style={{color: customBackgroundColor}}>{event?.note}</StyledText>
                                    </View>
                                  }
                                >
                                  <Icon color={customMainThemeColor} size={26} name='md-information-circle-sharp' />
                                </Tooltip>
                              </View>
                            }
                          </View>
                          <View style={[styles.flex(0.5), {justifyContent: 'center'}]}>
                            <StyledText style={[{paddingLeft: 4}]}>
                              {event?.people + event?.kid}
                            </StyledText>
                          </View>
                          <View style={[styles.flex(1.5), {justifyContent: 'center', flexDirection: 'column'}]}>

                            {(event?.tables && event?.tables.length > 0) ? event?.tables.map((table) => (
                              <StyledText key={table.tableId} style={[{textAlign: 'center'}]}>
                                {table.tableName}
                              </StyledText>
                            ))
                              :
                              <StyledText style={[{borderWidth: 1, borderColor: '#e7e7e7', maxWidth: 80, marginHorizontal: 4, textAlign: 'center'}]}>{'None'}</StyledText>

                            }

                          </View>
                          <View style={[styles.flex(2), {justifyContent: 'center', flexDirection: 'column', marginRight: 4}]}>
                            {(event?.status !== 'SEATED' && shiftStatus === 'ACTIVE' && appType !== 'reservation') &&
                              <>
                                <TouchableOpacity onPress={() => {
                                  this.handleSeat(event.id)
                                }} style={[styles.flexButton(customMainThemeColor), {marginBottom: 8, paddingVertical: 2}]}>
                                  <StyledText style={[styles.flexButtonText]}>{t('reservation.actionTip.seat')}</StyledText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => {
                                    this.handleToggleDelayModal(true, event.id)
                                  }}
                                  style={[styles.flexButton(customMainThemeColor), {marginBottom: 8, paddingVertical: 2}]}>
                                  <StyledText style={[styles.flexButtonText]}>{t('reservation.actionTip.delay')}</StyledText>
                                </TouchableOpacity>
                                <NotificationTask
                                  buttonText={t('reservation.actionTip.cancel')}
                                  isStyledText={true}
                                  buttonStyles={[styles.flexButton(customMainThemeColor), {paddingVertical: 2}]}
                                  textStyles={[styles.flexButtonText]}
                                  onPress={() => this.handleCancel(event, schedulePushNotification, t, 'DELETE')}
                                />
                              </>}
                            {(appType === 'reservation') &&
                              <>
                                <TouchableOpacity
                                  onPress={() => {
                                    this.handleToggleDelayModal(true, event.id)
                                  }}
                                  style={[styles.flexButton(customMainThemeColor), {margin: 4, paddingVertical: 2}]}>
                                  <StyledText style={[styles.flexButtonText]}>{t('reservation.actionTip.delay')}</StyledText>
                                </TouchableOpacity>
                                <NotificationTask
                                  buttonText={t('reservation.actionTip.cancel')}
                                  isStyledText={true}
                                  buttonStyles={[styles.flexButton(customMainThemeColor), {margin: 4, paddingVertical: 2}]}
                                  textStyles={[styles.flexButtonText]}
                                  onPress={() => this.handleCancel(event, schedulePushNotification, t, 'DELETE')}
                                />
                              </>
                            }
                          </View>
                        </View>
                      )
                    })}

                    {(!this.state.isBookedMode && this.state.dayWaitingEvents.length > 0) && this.state.dayWaitingEvents.map((event) => {
                      return (
                        <View key={event?.id} style={[styles.withBottomBorder, {flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, maxHeight: 96}]}>
                          <View style={[styles.flex(2), {alignItems: 'flex-start', paddingLeft: 8}]}>
                            <View style={{flexDirection: 'row'}}>
                              <View>
                                <StyledText style={[styles.textBold]}>
                                  {event?.name}
                                </StyledText>
                              </View>
                              <View style={{marginLeft: 2}}>
                                <MCIcon color={customMainThemeColor} size={16} name={event?.sourceOfOrigin == 'APP' ? 'tablet-cellphone' : 'web'} />
                              </View>
                            </View>
                            <StyledText>
                              {event?.phoneNumber}
                            </StyledText>
                          </View>
                          <View style={[styles.flex(0.5), {justifyContent: 'center'}]}>
                            {(event?.note !== null && event?.note.length > 0) &&
                              <View>
                                <Tooltip height={88} width={160} backgroundColor={customMainThemeColor}
                                  popover={
                                    <View>
                                      <StyledText style={{color: customBackgroundColor}}>{t('reservation.otherNote')}: </StyledText>
                                      <StyledText style={{color: customBackgroundColor}}>{event?.note}</StyledText>
                                    </View>
                                  }
                                >
                                  <Icon color={customMainThemeColor} size={20} name='md-information-circle-sharp' />
                                </Tooltip>
                              </View>
                            }
                          </View>
                          <View style={[styles.flex(1.2), {justifyContent: 'flex-end'}]}>
                            <StyledText>
                              {normalizeTimeString(event?.reservationStartDate, 'HH:mm')}
                            </StyledText>
                          </View>
                          <View style={[styles.flex(0.8), {textAlign: 'center', flexDirection: 'row'}]}>
                            <View>
                              <Icon color={customMainThemeColor} size={16} name='md-people' />
                            </View>
                            <View>
                              <StyledText style={[{paddingLeft: 2}]}>
                                {event?.people + event?.kid}
                              </StyledText>
                            </View>
                          </View>
                          <View style={[styles.flex(2), {justifyContent: 'flex-end', paddingVertical: 8, }]}>
                            <TouchableOpacity onPress={() => this.handleToggleTableList(true, event)} style={[styles.flexButton(customMainThemeColor), {margin: 4, paddingVertical: 4}]}>
                              <StyledText style={[styles.flexButtonText]}>{t('reservation.actionTip.tableSelect')}</StyledText>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )
                    })}
                    {((this.state.isBookedMode && this.state.dayBookedEvents.length == 0) || (!this.state.isBookedMode && this.state.dayWaitingEvents.length == 0)) &&
                      <View style={[styles.jc_alignIem_center]}>
                        <StyledText style={[styles.messageBlock]}>
                          {t('general.noData')}

                        </StyledText>
                      </View>}
                  </ThemeScrollView>

                }
              </View>
            </View>

          </View>
        </ThemeContainer>
      )
    }
  }
}


ReservationUpcomingForm = reduxForm({
  form: 'reservationUpcomingForm'
})(ReservationUpcomingForm)

const selector = formValueSelector('reservationUpcomingForm')


ReservationUpcomingForm = connect(
  state => {
    const phoneNumber = selector(state, 'phoneNumber')
    const name = selector(state, 'name')
    const note = selector(state, 'note')
    return {
      phoneNumber,
      name,
      note,
    }
  }
)(ReservationUpcomingForm)


export default (ReservationUpcomingForm)



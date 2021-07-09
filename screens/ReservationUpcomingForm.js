import React, {Component} from 'react'
import {Field, reduxForm} from 'redux-form'
import {Keyboard, Text, TouchableOpacity, View, FlatList, Dimensions, Alert, Animated, RefreshControl} from 'react-native'
import {Accordion, List} from '@ant-design/react-native'
import {ListItem, CheckBox, Button} from "react-native-elements";
import {connect} from 'react-redux'
import {compose} from "redux";
import {withContext} from "../helpers/contextHelper";
import {isRequired, isNDigitsNumber} from '../validators'
import InputText from '../components/InputText'
import {getTableLayouts, getTablesAvailable, getTableLayout, getfetchOrderInflights} from '../actions'
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
import Icon from 'react-native-vector-icons/Ionicons'
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";


class ReservationUpcomingForm extends React.Component {
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
      timeViewSize: new Animated.Value(0),
      isAnimating: false,
      isGetTables: false,
      people: [
        {label: context.t('reservation.adult'), value: 'people'},
        {label: context.t('reservation.kid'), value: 'kid'}
      ],
      availableTables: null,
      selectedTableIds: [],
      selectedTableNames: [],
      activeTableLayout: [],
      dayEvents: [],
    }
  }

  componentDidMount() {

    this.getReservationEventsByDate()

  }


  handleGetReservationDate = (event, selectedDate) => {

    this.props.change(`reservationStartDate`, new Date(selectedDate))
    this.setState({reservationDate: moment(selectedDate).format('YYYY-MM-DD')})
  }
  showDatePicker = () => {
    this.setState({
      showDatePicker: !this.state?.showDatePicker
    })
  };

  handleTimeBlockSelection = (value, index) => {
    this.setState({selectedTimeBlock: index})
  }

  getReservationEventsByDate = (date = '2021-07-07', status = '') => {

    dispatchFetchRequest(api.reservation.getReservationByDate(date, status), {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }, response => {
      response.json().then(async (data) => {

        // let result = data?.results.filter((event) => {
        //     return (
        //         this.state.isBookedMode ? (event.status !== 'WAITING' && event.status !== 'CANCELLED') : event.status === 'WAITING' || event.status === 'CANCELLED')
        // })
        this.setState({dayEvents: data?.results})
      })
    }).then()
  }


  render() {
    const {
      navigation,
      route,
      handleSubmit,
    } = this.props

    const {t, customMainThemeColor, customBackgroundColor} = this.context
    const timeBlocks = Object.keys(this.state.timeBlocks).map(key => this.state.timeBlocks[key].label)
    const timezone = TimeZoneService.getTimeZone()

    const testView = true


    if (testView) {
      return (
        <View style={[styles.fullWidthScreen]}>

          <View style={{flex: 3, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center'}}>
            <Button
              icon={
                <Icon name="build" size={32} color={customMainThemeColor} />
              }
              type='outline'
              raised
              onPress={() => console.log('test view')}
              buttonStyle={{minWidth: 320, borderColor: customMainThemeColor, backgroundColor: customBackgroundColor}}
              title={`Coming Soon...`}
              titleStyle={{marginLeft: 10, color: customMainThemeColor}}
            />
          </View>

        </View>
      )
    } else {


      if (!!this?.state?.isTablet) {
        return (
          <ThemeScrollView>
            <View style={styles.fullWidthScreen}>
              <ScreenHeader
                backNavigation={true}
                backAction={() => {
                  navigation.navigate('ReservationCalendarScreen')

                }}
                title={t('reservation.reservationTitle')}
                parentFullScreen={true} />
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

                  <View style={[styles.flex(1), {marginLeft: 20, justifyContent: 'flex-start', maxHeight: '100%'}]}>
                    <ThemeKeyboardAwareScrollView>
                      <View style={[styles.horizontalMargin]}>
                        <View style={[{marginBottom: 8}]}>
                          <View style={[styles.sectionTitleContainer, {marginVertical: 0}]}>
                            <StyledText style={styles.screenSubTitle(customMainThemeColor)}>{t('reservation.waiting')}</StyledText>
                          </View>
                          <View style={[styles.sectionTitleContainer, {marginVertical: 0}]}>
                            <StyledText style={styles.sectionTitleText}>{t('reservation.peopleCount')}</StyledText>
                          </View>
                          <View>
                            {this.state.people.map((people, ix) => (
                              <View
                                style={[styles.tableRowContainerWithBorder]}
                                key={ix}
                              >
                                <Field
                                  name={people.value}
                                  component={RenderStepper}
                                  optionName={people.label}
                                />
                              </View>
                            ))}
                          </View>
                        </View>

                        <View style={[styles.withBottomBorder, styles.sectionContent]}>
                          <View style={[styles.sectionTitleContainer, {marginBottom: 12}]}>
                            <StyledText style={styles.sectionTitleText}>{t('reservation.contactInfo')}</StyledText>
                          </View>
                          <View style={[styles.flex(1), styles.fieldContainer]}>
                            <Field
                              name="name"
                              component={InputText}
                              validate={isRequired}
                              placeholder={t('reservation.name')}
                            />
                          </View>
                          <View style={[styles.flex(1), styles.fieldContainer]}>
                            <Field
                              name="phoneNumber"
                              component={InputText}
                              onChange={val => {
                                if (val.length === 10)
                                  Keyboard.dismiss()
                              }}
                              validate={isRequired}
                              placeholder={t('reservation.phone')}
                              keyboardType={'numeric'}
                            />
                          </View>
                          <View style={[styles.flex(1), styles.fieldContainer]}>
                            <Field
                              name="note"
                              component={InputText}
                              placeholder={t('reservation.otherNote')}
                            />
                          </View>
                        </View>

                        <View>
                          <TouchableOpacity onPress={(value) => {
                            Keyboard.dismiss()
                          }}>
                            <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                              {t('action.save')}
                            </Text>
                          </TouchableOpacity>
                        </View>

                      </View>

                    </ThemeKeyboardAwareScrollView>


                  </View>

                  <View style={[styles.flex(2), {marginHorizontal: 20}]}>
                    <View style={[{flexDirection: 'row'}]}>
                      <StyledText>Summary</StyledText>
                      <View style={[styles.justifyRight, {flexDirection: 'row'}]}>
                        <TouchableOpacity style={[styles.withBorder(this.context)]}>
                          <StyledText>Reservation</StyledText>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.withBorder(this.context)]}>
                          <StyledText>Waiting</StyledText>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View>
                      {this.state.dayEvents.length > 0 && this.state.dayEvents.map((event) => {
                        let eventHour = moment(event.reservationStartDate).tz(timezone).format('HH')
                        let eventMins = moment(event.reservationStartDate).tz(timezone).format('mm')
                        return (

                          <TouchableOpacity key={event?.id} onPress={() => {
                            this.props.navigation.navigate('ReservationViewScreen', {
                              reservationId: event.id
                            })
                          }
                          }>
                            <View style={{flexDirection: 'row', flex: 6, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#e7e7e7'}}>

                              <View style={[styles.flex(2), {textAlign: 'center'}]}>

                                <StyledText style={[{paddingLeft: 8}]}>
                                  {event?.name}
                                </StyledText>
                              </View>
                              <View style={[styles.flex(1.7), {justifyContent: 'center'}]}>
                                <StyledText>
                                  {event?.phoneNumber}
                                </StyledText>

                              </View>
                              <View style={[styles.flex(0.8), {justifyContent: 'center'}]}>

                                <StyledText>
                                  {moment(event?.reservationStartDate).tz(timezone).format('HH:mm')}
                                </StyledText>
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
                              <View style={[styles.flex(0.5), {justifyContent: 'flex-end'}]}>

                                <StyledText style={[{borderRadius: 4, backgroundColor: (event?.status === 'WAITING') ? customBackgroundColor : (event?.status === 'CANCELLED') ? '#f75336' : customMainThemeColor, color: (event?.status === 'WAITING') ? customMainThemeColor : customBackgroundColor, borderWidth: 1, borderColor: (event?.status === 'CANCELLED') ? '#f75336' : customMainThemeColor, textAlign: 'center', marginHorizontal: 4}]}>
                                  {event?.status?.slice(0, 1)}
                                </StyledText>
                              </View>

                            </View>
                          </TouchableOpacity>

                        )
                      })}
                    </View>

                  </View>
                </View>



              </View>
            </View>
          </ThemeScrollView >
        )
      } else {
        return (
          <ThemeContainer>
            <View style={styles.fullWidthScreen}>
              <ScreenHeader
                backNavigation={true}
                backAction={() => {
                  navigation.navigate('ReservationCalendarScreen')
                }}
                title={t('reservation.reservationTitle')}
                parentFullScreen={true} />

              <ThemeKeyboardAwareScrollView>
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
                  {(!!this.state.isAnimating && this.state.timeViewSize._value !== 1) && <LoadingScreen />}


                </>

              </ThemeKeyboardAwareScrollView>

            </View>
          </ThemeContainer>
        )
      }

    }
  }
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({
  dispatch,

})

ReservationUpcomingForm = reduxForm({
  form: 'reservationUpcomingForm'
})(ReservationUpcomingForm)


const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withContext
)
export default enhance(ReservationUpcomingForm)



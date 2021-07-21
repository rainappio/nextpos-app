import React from 'react'
import {View, Text, ScrollView, TouchableOpacity, Alert} from 'react-native'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import MenuButton from "../components/MenuButton";
import {withContext} from "../helpers/contextHelper";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {ThemeContainer} from "../components/ThemeContainer";
import {Calendar, LocaleConfig, Agenda, AgendaList} from 'react-native-calendars';
import {api, dispatchFetchRequest} from '../constants/Backend'
import TimeZoneService from "../helpers/TimeZoneService";
import moment from "moment-timezone";
import {StyledText} from '../components/StyledText'
import {RenderAgenda, DayCalendar, ReservationDayEvent, ReservationEvent} from "../components/Calendars";
import AddBtn from '../components/AddBtn'
import Modal from 'react-native-modal';
import {OptionModal} from "../components/OptionModal";
import {MainActionButton} from '../components/ActionButtons'
import SegmentedControlTab from "react-native-segmented-control-tab";
import {CheckBox} from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons'
import {CalendarEvent} from "../components/CalendarEvent";
import {Ionicons} from '@expo/vector-icons';
import {compose} from "redux";
import {connect} from 'react-redux'
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {getTableLayouts, getTableLayout} from '../actions'
import LoadingScreen from "./LoadingScreen";
import {FocusAwareStatusBar} from '../components/FocusAwareStatusBar'

class ReservationCalendarScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    static contextType = LocaleContext

    constructor(props, context) {
        super(props, context)
        const timezone = TimeZoneService.getTimeZone()
        this.state = {
            isLoading: true,
            isDateEventLoading: false,
            calendarMode: 'month',
            selectedDate: moment(new Date()).tz(timezone).format("YYYY-MM-DD"),
            isShowModal: false,
            calendarTypeIndex: 0, modalTasks: [],
            nowYear: new Date().getFullYear(),
            nowMonth: new Date().getMonth() + 1,
            monthLoading: false,
            reservationEvents: [],
            reservationEventsByDate: [],
            showReservationFormModal: false,
        }
        LocaleConfig.locales['zh-Hant-TW'] = {
            monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            monthNamesShort: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            dayNames: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
            dayNamesShort: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
            today: '今日'
        }
        if (this.context?.locale === 'zh-Hant-TW' || this.context?.locale === 'zh-TW')
            LocaleConfig.defaultLocale = 'zh-Hant-TW'
    }

    componentDidMount() {
        this.props.getTableLayouts()
        this.getReservationEvents()
        this.getReservationEventsByDate()
        this._refreshScreen = this.props.navigation.addListener('focus', () => {
            this.refreshScreen()
        })
    }
    componentWillUnmount() {
        this._refreshScreen()
    }

    refreshScreen = () => {

        this.props.getTableLayouts()
        this.getReservationEvents(new Date(this.state?.selectedDate ?? new Date()).getFullYear(), moment(new Date(this.state?.selectedDate ?? new Date())).format('MM'))
        this.getReservationEventsByDate(this.state?.selectedDate, '')
    }

    getReservationEvents = async (year = new Date().getFullYear(), month = moment(new Date()).format('MM')) => {

        this.setState({isLoading: true})

        await dispatchFetchRequest(api.reservation.getReservationByMonth(year, month), {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }, response => {
            response.json().then(async (data) => {
                this.setState({reservationEvents: data?.results})
                this.setState({
                    isLoading: false, nowYear: new Date(this.state?.selectedDate).getFullYear(),
                    nowMonth: new Date(this.state?.selectedDate).getMonth() + 1
                })
            })
        }).then().catch(() => this.setState({isLoading: false}))
    }

    getReservationEventsByDate = async (date = this.state.selectedDate, status = '') => {

        this.setState({isDateEventLoading: true})
        await dispatchFetchRequest(api.reservation.getReservationByDate(date, status), {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }, response => {
            response.json().then(async (data) => {
                this.setState({isDateEventLoading: false, reservationEventsByDate: data?.results})
            })
        }).then()


    }



    handleChangeCalendarMode = (date = null, modeIndex = 0) => {
        this.refreshScreen()
        this.setState({
            calendarMode: ['month', 'day']?.[modeIndex], calendarTypeIndex: modeIndex,
            nowYear: new Date(this.state?.selectedDate).getFullYear(),
            nowMonth: new Date(this.state?.selectedDate).getMonth() + 1
        })
    }

    toggleReservationFormModal = (date, flag) => {
        if (!!date) {
            this.getReservationEventsByDate(date, '')
        }
        this.setState({showReservationFormModal: flag})
    }

    handleMonthChange = async (year = new Date().getFullYear(), month = moment(new Date()).format('MM'), callback) => {

        month = moment(new Date(`${year}-${month <= 10 ? '0' : ''}${month}-01`)).format('MM')

        this.setState({monthLoading: true})
        await dispatchFetchRequest(api.reservation.getReservationByMonth(year, month), {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }, response => {
            response.json().then(async (data) => {
                this.setState({
                    reservationEvents: data?.results,
                    isLoading: false, nowYear: year, nowMonth: parseInt(month, 10), monthLoading: false, selectedDate: `${year}-${month}-01`
                }, () => callback())

            })
        }).then().catch(() => this.setState({monthLoading: true}))

    }


    render() {
        const {themeStyle, handleSubmit, tablelayouts} = this.props
        const {t, isTablet, customMainThemeColor, customBackgroundColor} = this.context
        const timezone = TimeZoneService.getTimeZone()
        const customCalendarTheme = {
            calendarBackground: customBackgroundColor,
            monthTextColor: customMainThemeColor,
            textMonthFontWeight: 'bold',
            arrowColor: customMainThemeColor,
            selectedDayBackgroundColor: customMainThemeColor,
        }

        return (
            <ThemeContainer>
                <FocusAwareStatusBar barStyle="light-content" backgroundColor="#222" />
                <View style={[styles.fullWidthScreen, {marginBottom: 0}]}>
                    <ScreenHeader backNavigation={false}
                        parentFullScreen={true}
                        title={t('reservation.reservationCalendarTitle')}
                        rightComponent={
                            <View style={{flexDirection: 'row'}}>
                                <View style={{marginRight: 8}}>
                                    <OptionModal
                                        icon={<MaterialCommunityIcons name="filter-variant" size={32} color={customMainThemeColor} />}
                                        toggleModal={(flag) => this.setState({isShowModal: flag})}
                                        isShowModal={this.state?.isShowModal}>
                                        <View style={{maxWidth: 420, alignContent: 'center'}}>
                                            <View style={[styles.tableRowContainer]}>

                                                <StyledText style={[styles.screenSubTitle(customMainThemeColor), {flex: 1, alignItems: 'center', justifyContent: 'center'}]}>{t('calendar.calendarOptions')}
                                                </StyledText>
                                            </View>

                                            <View style={[styles.tableRowContainer]}>
                                                <SegmentedControlTab
                                                    values={[t('calendar.monthly'), t('calendar.daily')]}
                                                    selectedIndex={this.state?.calendarTypeIndex}
                                                    onTabPress={(index) => {
                                                        this.handleChangeCalendarMode(null, index)
                                                    }}
                                                    {...{
                                                        tabsContainerStyle: {width: '100%'},
                                                        tabStyle: {borderColor: customMainThemeColor, width: '100%', backgroundColor: customBackgroundColor},
                                                        tabTextStyle: {color: customMainThemeColor},
                                                        activeTabStyle: {backgroundColor: customMainThemeColor}
                                                    }}
                                                />
                                            </View>

                                        </View>
                                    </OptionModal>
                                </View>

                                <TouchableOpacity
                                    onPress={() => {
                                        this.props?.navigation.navigate('ReservationScreen', {
                                            initialValues: {
                                                reservationStartDate: new Date(this.state?.selectedDate),
                                                people: 0, kid: 0
                                            },
                                        })
                                    }}
                                >
                                    <View>
                                        <Icon name="add" size={32} color={customMainThemeColor} />
                                    </View>
                                </TouchableOpacity>

                            </View>
                        }
                    />

                    <Modal
                        isVisible={this.state?.showReservationFormModal}
                        useNativeDriver
                        hideModalContentWhileAnimating
                        animationIn='fadeInDown'
                        animationOut='fadeOutUp'
                        onBackdropPress={() => this.toggleReservationFormModal(null, false)}
                        style={{
                            margin: 0, justifyContent: 'center', flex: 1
                        }}
                    >
                        <View style={[themeStyle, {maxWidth: 640, alignSelf: 'center', maxHeight: '70%', width: '100%', borderRadius: 16, paddingBottom: 8}]}>
                            <View style={[styles.tableRowContainer, {justifyContent: 'center'}]}>
                                <Text style={[styles?.announcementTitle(customMainThemeColor)]}>{moment(this.state?.selectedDate ?? new Date()).tz(timezone).format("YYYY-MM-DD")}</Text>
                            </View>
                            <ScrollView >
                                {this.state?.isDateEventLoading && <LoadingScreen />}
                                {!this.state?.isDateEventLoading && !!this.state?.reservationEventsByDate && this.state?.reservationEventsByDate?.map((task, index) => {
                                    return (
                                        <CalendarEvent key={index} event={task}
                                            closeModal={() => this.toggleReservationFormModal(null, false)} refreshScreen={() => this.refreshScreen()} />
                                    )
                                })}
                            </ScrollView>
                        </View>
                    </Modal>




                    {this.state.isLoading || this.state.calendarMode === 'month' &&

                        <View style={[styles.flex(1)]}>
                            <Calendar
                                current={this.state?.selectedDate}

                                onDayPress={(day) => {console.log('selected day', day)}}
                                onDayLongPress={(day) => {console.log('selected day', day)}}
                                monthFormat={'yyyy MM'}
                                hideExtraDays={false}
                                disableMonthChange={false}
                                firstDay={1}
                                hideDayNames={false}
                                showWeekNumbers={false}
                                onPressArrowLeft={subtractMonth => {
                                    this.handleMonthChange(
                                        this.state?.nowMonth === 1 ? this.state?.nowYear - 1 :
                                            this.state?.nowYear,
                                        this.state?.nowMonth === 1 ? 12 : this.state?.nowMonth - 1, () => subtractMonth())
                                }}
                                onPressArrowRight={addMonth => {
                                    this.handleMonthChange(
                                        this.state?.nowMonth === 12 ? this.state?.nowYear + 1 :
                                            this.state?.nowYear,
                                        this.state?.nowMonth === 12 ? 1 : this.state?.nowMonth + 1, () => addMonth())
                                }}
                                disableArrowLeft={this.state?.monthLoading}
                                disableArrowRight={this.state?.monthLoading}
                                disableAllTouchEventsForDisabledDays={true}
                                enableSwipeMonths={false}
                                style={{
                                    height: '100%', width: '100%'
                                }}
                                theme={{
                                    'stylesheet.calendar.main': {
                                        week: {
                                            flexDirection: 'row',
                                            flex: 1,
                                            height: 1
                                        },
                                        monthView: {
                                            flex: 1,
                                            marginHorizontal: -5
                                        },
                                        dayContainer: {
                                            flex: 1,
                                            alignItems: 'center',
                                            borderColor: 'gray',
                                            borderWidth: 0.5
                                        },
                                    },
                                    ...customCalendarTheme
                                }}
                                dayComponent={({date, state, onPress}) => {
                                    let today = moment(this.state?.selectedDate ?? new Date()).tz(timezone).format("YYYY-MM-DD")
                                    let isToday = today === date.dateString

                                    let unsortTask = []
                                    let task = []
                                    let bookedCount = 0
                                    let waitingCount = 0
                                    let cancelledCount = 0

                                    unsortTask = !!this.state?.reservationEvents
                                        ? this.state?.reservationEvents?.filter((event) => {
                                            return moment(event?.reservationStartDate ?? new Date()).tz(timezone).format("YYYY-MM-DD") === date.dateString
                                        })
                                        : []

                                    task = unsortTask.length > 0 ? unsortTask.sort(function (a, b) {

                                        return -(new Date(b.reservationStartDate) - new Date(a.reservationStartDate));
                                    }) : []

                                    bookedCount = task.length > 0 ? task.map((event) => (event.status === 'BOOKED' || event.status === 'CONFIRMED' || event.status === 'SEATED') ? 1 : 0).reduce((a, b) => a + b) : 0
                                    waitingCount = task.length > 0 ? task.map((event) => event.status === 'WAITING' ? 1 : 0).reduce((a, b) => a + b) : 0
                                    cancelledCount = task.length > 0 ? task.map((event) => event.status === 'CANCELLED' ? 1 : 0).reduce((a, b) => a + b) : 0

                                    return (

                                        <TouchableOpacity
                                            style={{flex: 1, width: '100%'}}
                                            onPress={() => {
                                                this.setState({selectedDate: date?.dateString})
                                            }}
                                        >
                                            <View style={{flex: 1}}>
                                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                    <View style={{
                                                        backgroundColor: isToday ? customMainThemeColor : undefined, width: 24,
                                                        borderRadius: 24,
                                                        height: 24, justifyContent: 'center', alignItems: 'center'
                                                    }}>
                                                        <Text style={{
                                                            textAlign: 'center',
                                                            color: isToday ? '#fff' : state === 'disabled' ? 'rgba(128, 128, 128, 0.5)' : themeStyle?.color,

                                                        }}>
                                                            {date.day}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={{flex: 2}}>
                                                    <ScrollView style={{flex: 1}}>
                                                        {unsortTask.length > 0 &&
                                                            <TouchableOpacity
                                                                onPress={() => {

                                                                    this.setState({selectedDate: date?.dateString})
                                                                    task?.length > 0 && this.toggleReservationFormModal(date?.dateString, true)
                                                                }}
                                                                style={{borderWidth: 1, borderColor: customMainThemeColor, backgroundColor: customBackgroundColor, margin: 5, paddingVertical: 4, borderRadius: 5}}
                                                            >
                                                                <Text style={{
                                                                    color: '#454545',
                                                                    textAlign: 'center',
                                                                }}
                                                                    numberOfLines={2}
                                                                >
                                                                    {isTablet ? t('reservation.booked') : 'R'}: {bookedCount}
                                                                </Text>
                                                                <Text style={{
                                                                    color: '#454545',
                                                                    textAlign: 'center',
                                                                }}
                                                                    numberOfLines={2}
                                                                >
                                                                    {isTablet ? t('reservation.waiting') : 'W'}: {waitingCount}
                                                                </Text>
                                                                <Text style={{
                                                                    color: '#454545',
                                                                    textAlign: 'center',
                                                                }}
                                                                    numberOfLines={2}
                                                                >
                                                                    {isTablet ? t('reservation.cancelled') : 'C'}: {cancelledCount}
                                                                </Text>
                                                            </TouchableOpacity>}

                                                    </ScrollView>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )

                                }}

                            />
                        </View>

                    }

                    {this.state.isLoading || this.state.calendarMode === 'day' && <View style={[styles.flex(1),]}>

                        {(!!isTablet) ?

                            <ReservationEvent reservations={this.state?.reservationEvents.filter((event) => (event.status !== 'WAITING' && event.status !== 'CANCELLED'))} tablelayouts={tablelayouts} selectedDate={this.state?.selectedDate} refreshScreen={() => this.refreshScreen()} changeSelectedDate={(date) => this.setState({selectedDate: date})} />

                            :

                            <ReservationDayEvent reservations={this.state?.reservationEvents} selectedDate={this.state?.selectedDate} refreshScreen={() => this.refreshScreen()} changeSelectedDate={(date) => this.setState({selectedDate: date})} />
                        }
                    </View>}
                </View>

            </ThemeContainer>
        )
    }
}

const mapStateToProps = state => ({
    currentUser: state.clientuser.data,
    tablelayouts: state.tablelayouts.data.tableLayouts,
    haveData: state.tablelayouts.haveData,
    haveError: state.tablelayouts.haveError,
    isLoading: state.tablelayouts.loading,
})

const mapDispatchToProps = dispatch => ({
    dispatch,
    getTableLayouts: () => dispatch(getTableLayouts()),
    getTableLayout: (id) => dispatch(getTableLayout(id)),
})

const enhance = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withContext
)

export default enhance(ReservationCalendarScreen)

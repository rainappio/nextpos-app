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
import {NavigationEvents} from 'react-navigation'
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

class CalendarScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    static contextType = LocaleContext

    constructor(props, context) {
        super(props, context)
        const timezone = TimeZoneService.getTimeZone()
        this.state = {
            isLoading: true,
            rosterPlansData: [],
            calendarMode: 'month',
            selectedDate: moment(new Date()).tz(timezone).format("YYYY-MM-DD"),

            users: [],
            showRosterFormModal: false,
            isShowModal: false,
            calendarTypeIndex: 0,
            searchTypeIndex: 1,
            isOnlyMyEvent: false,
            modalTasks: [],
            nowYear: new Date().getFullYear(),
            nowMonth: new Date().getMonth() + 1,
            monthLoading: false,
            labels: [],
            selectedLabels: new Set(),
            reservationEvents: [],
            reservationEventsByDate: [],
            showReservationFormModal: false,
        }
        context.localize({
            en: {
                calendar: {
                    monthly: 'Monthly',
                    weekly: 'Weekly',
                    daily: 'Daily',
                    roster: 'Roster',
                    reservation: 'Reservation',
                    showMyEvent: 'Show my event.',
                    noWorkingArea: 'Not Assigned'
                }
            },
            zh: {
                calendar: {
                    monthly: '月曆',
                    weekly: '周曆',
                    daily: '日曆',
                    roster: '排班',
                    reservation: '訂位',
                    showMyEvent: '顯示我的排班',
                    noWorkingArea: '尚未排班'
                }
            }
        })
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

        this.getUsers()
        this.getEvents()
        this.getLabels()
        this.props.getTableLayouts()
        this.getReservationEvents()
        this.getReservationEventsByDate()
    }

    refreshScreen = async () => {

        this.getUsers()
        this.getLabels()
        this.props.getTableLayouts()
        this.getEvents(new Date(this.state?.selectedDate ?? new Date()).getFullYear(), new Date(this.state?.selectedDate ?? new Date()).getMonth() + 1)
        this.getReservationEvents(new Date(this.state?.selectedDate ?? new Date()).getFullYear(), moment(new Date(this.state?.selectedDate ?? new Date())).format('MM'))
        this.getReservationEventsByDate(this.state?.selectedDate, 'BOOKED')
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

    getReservationEventsByDate = async (date = this.state.selectedDate, status = 'BOOKED') => {

        await dispatchFetchRequest(api.reservation.getReservationByDate(date, status), {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }, response => {
            response.json().then(async (data) => {
                this.setState({reservationEventsByDate: data?.results})
            })
        }).then()
    }

    getEvents = async (year = new Date().getFullYear(), month = new Date().getMonth() + 1) => {
        this.setState({isLoading: true})

        await dispatchFetchRequest(api.rosterEvent.getEventsByDate(year, month), {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }, response => {
            response.json().then(async (data) => {
                this.setState({rosterEvents: data?.results, groupedResults: data?.groupedResults})
                this.setState({
                    isLoading: false, nowYear: new Date(this.state?.selectedDate).getFullYear(),
                    nowMonth: new Date(this.state?.selectedDate).getMonth() + 1
                })
            })
        }).then().catch(() => this.setState({isLoading: false}))
    }



    handleChangeCalendarMode = (date = null, modeIndex = 1) => {
        this.refreshScreen()
        this.setState({
            calendarMode: ['month', 'week', 'day']?.[modeIndex], calendarTypeIndex: modeIndex,
            nowYear: new Date(this.state?.selectedDate).getFullYear(),
            nowMonth: new Date(this.state?.selectedDate).getMonth() + 1
        })
    }


    getUsers = async () => {

        this.setState({isLoading: true})

        await dispatchFetchRequest(api.clientUser.getAll, {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }, response => {
            response.json().then(async (data) => {
                this.setState({users: data?.users})

            })
        }).then().catch(() => this.setState({isLoading: false}))

    }

    toggleReservationFormModal = (task, flag) => {
        this.setState({showReservationFormModal: flag, modalTasks: task})
    }
    toggleRosterFormModal = (task, flag) => {
        this.setState({showRosterFormModal: flag, modalTasks: task})
    }

    handleMonthChange = async (year = new Date().getFullYear(), month = new Date().getMonth() + 1, callback) => {
        this.setState({monthLoading: true})
        // await this.getReservationEvents(year, moment(month).format('MM'))
        await dispatchFetchRequest(api.rosterEvent.getEventsByDate(year, month), {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }, response => {
            response.json().then(async (data) => {

                this.setState({rosterEvents: data?.results, groupedResults: data?.groupedResults, isLoading: false, nowYear: year, nowMonth: month, monthLoading: false, selectedDate: `${year}-${month < 10 ? '0' : ''}${month}-01`}, () => callback())
            })
        }).then().catch(() => this.setState({monthLoading: true}))
    }

    getLabels = () => {
        dispatchFetchRequest(`${api.workingarea.getAll}?visibility=ROSTER`, {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }, response => {
            response.json().then(data => {
                let labelsArr = data?.workingAreas?.map((item) => item?.name)
                labelsArr.push('noWorkingArea')
                this.setState({labels: data?.workingAreas?.map((item) => item?.name), selectedLabels: new Set([...labelsArr])})

            })
        }).then()
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
                <NavigationEvents
                    onWillFocus={() => {
                        this.refreshScreen()
                    }}
                />

                <View style={[styles.fullWidthScreen, {marginBottom: 0}]}>
                    <ScreenHeader backNavigation={false}
                        parentFullScreen={true}
                        title={t('calendarEvent.screenTitle')}
                        rightComponent={
                            <View style={{flexDirection: 'row'}}>
                                <View style={{marginRight: 8}}>
                                    <OptionModal
                                        icon={<MaterialCommunityIcons name="filter-variant" size={32} color={customMainThemeColor} />}
                                        toggleModal={(flag) => this.setState({isShowModal: flag})}
                                        isShowModal={this.state?.isShowModal}>
                                        <View style={{maxWidth: 640}}>
                                            <View style={[styles.tableRowContainer]}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this.setState({searchTypeIndex: 0})
                                                    }}
                                                    style={[{flex: 1, borderWidth: 1, borderColor: customMainThemeColor, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, marginRight: 5}, (this.state?.searchTypeIndex === 0 && {backgroundColor: customMainThemeColor})]}>
                                                    <StyledText style={this.state?.searchTypeIndex === 0 && {color: customBackgroundColor}}>{t('calendar.roster')}</StyledText>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this.setState({searchTypeIndex: 1})
                                                    }}
                                                    style={[{flex: 1, borderWidth: 1, borderColor: customMainThemeColor, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, marginLeft: 5}, (this.state?.searchTypeIndex === 1 && {backgroundColor: customMainThemeColor})]}>
                                                    <StyledText style={this.state?.searchTypeIndex === 1 && {color: customBackgroundColor}}>{t('calendar.reservation')}</StyledText>
                                                </TouchableOpacity>

                                            </View>
                                            {this.state?.searchTypeIndex === 0 && <View style={{
                                                flexDirection: 'row',
                                                paddingVertical: 8,
                                                alignItems: 'center'
                                            }}>
                                                <View>
                                                    <CheckBox
                                                        checkedIcon={'check-circle'}
                                                        uncheckedIcon={'circle'}
                                                        checked={this.state?.isOnlyMyEvent}
                                                        containerStyle={{margin: 0, padding: 0, minWidth: 0}}
                                                        onPress={() => {
                                                            this.setState({isOnlyMyEvent: !this.state?.isOnlyMyEvent})
                                                        }}
                                                    >
                                                    </CheckBox>
                                                </View>
                                                <StyledText>{t('calendar.showMyEvent')}</StyledText>
                                            </View>}
                                            <View style={[styles.tableRowContainer]}>
                                                <SegmentedControlTab
                                                    values={[t('calendar.monthly'), t('calendar.weekly'), t('calendar.daily')]}
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
                                            {this.state?.searchTypeIndex === 0 && this.state?.calendarTypeIndex === 1 && <View >
                                                <View style={{
                                                    flexDirection: 'row',
                                                    paddingVertical: 8,
                                                    alignItems: 'center'
                                                }}>
                                                    <Text style={{marginLeft: 10, color: customMainThemeColor, fontSize: 16, fontWeight: 'bold'}}>{t('selectWorkingArea')}</Text>
                                                </View>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    paddingVertical: 8,
                                                    alignItems: 'center'
                                                }}>
                                                    <View>
                                                        <CheckBox
                                                            checkedIcon={'check-circle'}
                                                            uncheckedIcon={'circle'}
                                                            checked={this.state?.selectedLabels?.size === this.state?.labels?.length + 1}
                                                            containerStyle={{margin: 0, padding: 0, minWidth: 0}}
                                                            onPress={() => {
                                                                let tempSet = new Set()
                                                                if (this.state?.selectedLabels?.size === this.state?.labels?.length + 1) {
                                                                    tempSet = new Set()
                                                                } else {
                                                                    let labelsArr = [...this.state?.labels]
                                                                    labelsArr.push('noWorkingArea')
                                                                    tempSet = new Set([...labelsArr])
                                                                }
                                                                this.setState({selectedLabels: tempSet})
                                                            }}
                                                        >
                                                        </CheckBox>
                                                    </View>
                                                    <StyledText>{t('allSelected')}</StyledText>
                                                </View>
                                                {this.state?.labels?.map((workingArea) => {
                                                    return (
                                                        <View key={workingArea} style={{
                                                            flexDirection: 'row',
                                                            paddingVertical: 8,
                                                            alignItems: 'center'
                                                        }}>
                                                            <View>
                                                                <CheckBox
                                                                    checkedIcon={'check-circle'}
                                                                    uncheckedIcon={'circle'}
                                                                    checked={this.state?.selectedLabels?.has(workingArea)}
                                                                    containerStyle={{margin: 0, padding: 0, minWidth: 0}}
                                                                    onPress={() => {
                                                                        let tempSet = new Set(this.state?.selectedLabels)
                                                                        if (this.state?.selectedLabels?.has(workingArea)) {
                                                                            tempSet.delete(workingArea)
                                                                        } else {
                                                                            tempSet.add(workingArea)
                                                                        }
                                                                        this.setState({selectedLabels: tempSet})
                                                                    }}
                                                                >
                                                                </CheckBox>
                                                            </View>
                                                            <StyledText>{workingArea}</StyledText>
                                                        </View>
                                                    )
                                                })}
                                                <View style={{
                                                    flexDirection: 'row',
                                                    paddingVertical: 8,
                                                    alignItems: 'center'
                                                }}>
                                                    <View>
                                                        <CheckBox
                                                            checkedIcon={'check-circle'}
                                                            uncheckedIcon={'circle'}
                                                            checked={this.state?.selectedLabels?.has('noWorkingArea')}
                                                            containerStyle={{margin: 0, padding: 0, minWidth: 0}}
                                                            onPress={() => {
                                                                let tempSet = new Set(this.state?.selectedLabels)
                                                                if (this.state?.selectedLabels?.has('noWorkingArea')) {
                                                                    tempSet.delete('noWorkingArea')
                                                                } else {
                                                                    tempSet.add('noWorkingArea')
                                                                }
                                                                this.setState({selectedLabels: tempSet})
                                                            }}
                                                        >
                                                        </CheckBox>
                                                    </View>
                                                    <StyledText>{t('calendar.noWorkingArea')}</StyledText>
                                                </View>
                                            </View>}

                                        </View>
                                    </OptionModal>
                                </View>
                                {this.state.searchTypeIndex === 0 && this.props?.currentUser?.roles?.includes('MANAGER') && <TouchableOpacity
                                    onPress={() =>
                                        this.props?.navigation.navigate('RostersFormScreen',
                                            {data: {startTime: new Date(this.state?.selectedDate), endTime: moment(new Date(this.state?.selectedDate)).add(1, 'hours'), repeatEndDate: this.state?.selectedDate}, users: this.state?.users, refreshScreen: () => this.refreshScreen(), isManager: this.props?.currentUser?.roles?.includes('MANAGER')})}
                                >
                                    <View>
                                        <Icon name="add" size={32} color={customMainThemeColor} />
                                    </View>
                                </TouchableOpacity>}
                                {this.state.searchTypeIndex === 1 && <TouchableOpacity
                                    onPress={() => {
                                        this.props?.navigation.navigate('ReservationScreen', {
                                            data: {reservationStartDate: new Date(this.state?.selectedDate), people: 0, kid: 0}
                                        })
                                    }}
                                >
                                    <View>
                                        <Icon name="add" size={32} color={customMainThemeColor} />
                                    </View>
                                </TouchableOpacity>}

                            </View>
                        }
                    />
                    <Modal
                        isVisible={this.state?.showRosterFormModal}
                        useNativeDriver
                        hideModalContentWhileAnimating
                        animationIn='fadeInDown'
                        animationOut='fadeOutUp'
                        onBackdropPress={() => this.toggleRosterFormModal([], false)}
                        style={{
                            margin: 0, justifyContent: 'center'
                        }}
                    >
                        <View style={[themeStyle, {maxWidth: 640, alignSelf: 'center', maxHeight: '70%', width: '100%', borderRadius: 16, paddingBottom: 8}]}>
                            <View style={[styles.tableRowContainer, {justifyContent: 'center'}]}>
                                <Text style={[styles?.announcementTitle(customMainThemeColor)]}>{moment(this.state?.selectedDate ?? new Date()).tz(timezone).format("YYYY-MM-DD")}</Text>
                            </View>
                            <ScrollView >
                                {this.state?.modalTasks?.map((task, index) => {
                                    return (
                                        <CalendarEvent key={index} event={task} isManager={this.props?.currentUser?.roles?.includes('MANAGER')}
                                            users={this.state?.users} closeModal={() => this.toggleRosterFormModal([], false)} refreshScreen={() => this.refreshScreen()} />
                                    )
                                })}
                            </ScrollView>
                        </View>
                    </Modal>

                    <Modal
                        isVisible={this.state?.showReservationFormModal}
                        useNativeDriver
                        hideModalContentWhileAnimating
                        animationIn='fadeInDown'
                        animationOut='fadeOutUp'
                        onBackdropPress={() => this.toggleReservationFormModal([], false)}
                        style={{
                            margin: 0, justifyContent: 'center'
                        }}
                    >
                        <View style={[themeStyle, {maxWidth: 640, alignSelf: 'center', maxHeight: '70%', width: '100%', borderRadius: 16, paddingBottom: 8}]}>
                            <View style={[styles.tableRowContainer, {justifyContent: 'center'}]}>
                                <Text style={[styles?.announcementTitle(customMainThemeColor)]}>{moment(this.state?.selectedDate ?? new Date()).tz(timezone).format("YYYY-MM-DD")}</Text>
                            </View>
                            <ScrollView >
                                {this.state?.modalTasks?.map((task, index) => {
                                    return (
                                        <CalendarEvent key={index} event={task}
                                            closeModal={() => this.toggleReservationFormModal([], false)} refreshScreen={() => this.refreshScreen()} />
                                    )
                                })}
                            </ScrollView>
                        </View>
                    </Modal>



                    {this.state.isLoading || this.state.calendarMode === 'month' && <View style={[styles.flex(1)]}>

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
                                height: '100%',
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

                                if (this.state.searchTypeIndex === 0) {
                                    unsortTask = !!this.state?.rosterEvents
                                        ? this.state?.rosterEvents?.filter((event) => {
                                            return moment(event?.startTime ?? new Date()).tz(timezone).format("YYYY-MM-DD") === date.dateString
                                        })
                                        : []

                                    task = unsortTask.length > 0 ? unsortTask.sort(function (a, b) {
                                        return -(new Date(b.startTime) - new Date(a.startTime));
                                    }) : []
                                }
                                if (this.state.searchTypeIndex === 1) {
                                    unsortTask = !!this.state?.reservationEvents
                                        ? this.state?.reservationEvents?.filter((event) => {
                                            return moment(event?.reservationStartDate ?? new Date()).tz(timezone).format("YYYY-MM-DD") === date.dateString
                                        })
                                        : []

                                    task = unsortTask.length > 0 ? unsortTask.sort(function (a, b) {

                                        return -(new Date(b.reservationStartDate) - new Date(a.reservationStartDate));
                                    }) : []

                                    bookedCount = task.length > 0 ? task.map((event) => event.status === 'BOOKED' ? 1 : 0).reduce((a, b) => a + b) : 0
                                    waitingCount = task.length > 0 ? task.map((event) => event.status === 'WAITING' ? 1 : 0).reduce((a, b) => a + b) : 0

                                }

                                return (
                                    this.state.searchTypeIndex === 0 ?
                                        <TouchableOpacity
                                            style={{flex: 1, width: '100%'}}
                                            onPress={() => {
                                                this.setState({selectedDate: date?.dateString})
                                                task?.length > 0 && this.toggleRosterFormModal(task, true)
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
                                                        {task?.map((event) => {
                                                            const i18nMomentFrom = moment(event?.startTime ?? new Date()).tz(timezone).format("HH:mm");
                                                            const phoneI18nMomentFrom = moment(event?.startTime ?? new Date()).tz(timezone).format("HH");
                                                            let resourcesCount = 0
                                                            for (const [key, value] of Object.entries(event?.eventResources)) {
                                                                if (Array.isArray(value)) {
                                                                    resourcesCount += value?.length
                                                                }
                                                            }
                                                            return (isTablet ?
                                                                <TouchableOpacity
                                                                    key={event.id}
                                                                    onPress={() => {
                                                                        this.setState({selectedDate: date?.dateString})
                                                                        task?.length > 0 && this.toggleRosterFormModal(task, true)
                                                                    }}
                                                                    style={{borderWidth: 1, borderColor: (!event?.eventColor || event?.eventColor === '#fff') ? customMainThemeColor : event?.eventColor, backgroundColor: event?.eventColor ?? undefined, margin: 5, marginTop: 0, borderRadius: 5}}>
                                                                    <Text style={{
                                                                        color: '#454545',
                                                                        textAlign: 'center',
                                                                    }}
                                                                        numberOfLines={1}
                                                                    >
                                                                        {event?.eventSeriesMainEvent && <MaterialCommunityIcons
                                                                            name="clock-start"
                                                                            size={20}
                                                                            style={[styles?.buttonIconStyle(customMainThemeColor)]}
                                                                        />}
                                                                        {event?.isolated && <Ionicons
                                                                            name="pin"
                                                                            size={18}
                                                                            style={[styles?.buttonIconStyle(customMainThemeColor)]}
                                                                        />}
                                                                        {event?.eventRepeat === 'WEEKLY' && <Ionicons name="copy" color={customMainThemeColor} />} {event?.eventName?.slice(0, 2)} {i18nMomentFrom} ({resourcesCount})

                                                                </Text>
                                                                </TouchableOpacity> :
                                                                <TouchableOpacity
                                                                    key={event.id}
                                                                    onPress={() => {
                                                                        this.setState({selectedDate: date?.dateString})
                                                                        task?.length > 0 && this.toggleRosterFormModal(task, true)
                                                                    }}
                                                                    style={{borderWidth: 1, borderColor: (!event?.eventColor || event?.eventColor === '#fff') ? customMainThemeColor : event?.eventColor, backgroundColor: event?.eventColor ?? undefined, marginBottom: 5, borderRadius: 5}}>
                                                                    <Text style={[{
                                                                        color: '#454545',
                                                                        textAlign: 'center',
                                                                    }, event?.eventSeriesMainEvent && {fontWeight: 'bold'}, event?.isolated && {fontStyle: 'italic'}]}
                                                                        numberOfLines={1}
                                                                    >
                                                                        {event?.eventName?.slice(0, 1)} {phoneI18nMomentFrom}
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            )
                                                        })}
                                                    </ScrollView>
                                                </View>
                                            </View>
                                        </TouchableOpacity>

                                        :
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
                                                                    task?.length > 0 && this.toggleReservationFormModal(task, true)
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
                                                            </TouchableOpacity>}

                                                    </ScrollView>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                )

                            }}

                        />

                    </View>}

                    {this.state.isLoading || this.state.calendarMode === 'week' && <View style={[styles.flex(1),]}>
                        {this.state.searchTypeIndex === 0 ?

                            <RenderAgenda events={this.state?.rosterEvents} selectedDate={this.state?.selectedDate} isManager={this.props?.currentUser?.roles?.includes('MANAGER')} users={this.state?.users} refreshScreen={() => this.refreshScreen()} toggleRosterFormModal={(task) => this.toggleRosterFormModal(task, true)} changeSelectedDate={(date) => this.setState({selectedDate: date})} selectedLabels={this.state?.selectedLabels} />

                            :
                            (!!isTablet) ?

                                <ReservationEvent reservations={this.state?.reservationEventsByDate} tablelayouts={tablelayouts} selectedDate={this.state?.selectedDate} isManager={this.props?.currentUser?.roles?.includes('MANAGER')} users={this.state?.users} refreshScreen={() => this.refreshScreen()} changeSelectedDate={(date) => this.setState({selectedDate: date})} />

                                :

                                <ReservationDayEvent reservations={this.state?.reservationEvents} selectedDate={this.state?.selectedDate} isManager={this.props?.currentUser?.roles?.includes('MANAGER')} users={this.state?.users} refreshScreen={() => this.refreshScreen()} changeSelectedDate={(date) => this.setState({selectedDate: date})} />
                        }
                    </View>}
                    {this.state.isLoading || this.state.calendarMode === 'day' && <View style={[styles.flex(1),]}>

                        {this.state.searchTypeIndex === 0 ?

                            <DayCalendar events={this.state?.groupedResults} selectedDate={this.state?.selectedDate} isManager={this.props?.currentUser?.roles?.includes('MANAGER')} users={this.state?.users} refreshScreen={() => this.refreshScreen()} changeSelectedDate={(date) => this.setState({selectedDate: date})} />

                            :
                            (!!isTablet) ?

                                <ReservationEvent reservations={this.state?.reservationEventsByDate} tablelayouts={tablelayouts} selectedDate={this.state?.selectedDate} isManager={this.props?.currentUser?.roles?.includes('MANAGER')} users={this.state?.users} refreshScreen={() => this.refreshScreen()} changeSelectedDate={(date) => this.setState({selectedDate: date})} />

                                :

                                <ReservationDayEvent reservations={this.state?.reservationEvents} selectedDate={this.state?.selectedDate} isManager={this.props?.currentUser?.roles?.includes('MANAGER')} users={this.state?.users} refreshScreen={() => this.refreshScreen()} changeSelectedDate={(date) => this.setState({selectedDate: date})} />
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

export default enhance(CalendarScreen)

import React from 'react'
import {View, Text, ScrollView, TouchableOpacity, Alert} from 'react-native'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import styles, {mainThemeColor} from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import MenuButton from "../components/MenuButton";
import {withContext} from "../helpers/contextHelper";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {ThemeContainer} from "../components/ThemeContainer";
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {api, dispatchFetchRequest} from '../constants/Backend'
import {NavigationEvents} from 'react-navigation'
import TimeZoneService from "../helpers/TimeZoneService";
import moment from "moment-timezone";
import {StyledText} from '../components/StyledText'
import {RenderAgenda} from "../components/Calendars";
import UserSelectModal from './UserSelectModal';

class CalendarScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    static contextType = LocaleContext

    constructor(props, context) {
        super(props, context)
        this.state = {
            isLoading: true,
            rosterPlansData: [],
            calendarMode: 'month',
            selectedDate: null,
            isManager: false,
            users: []
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

        this.getPlans()
        this.getUser()
        this.getUsers()
    }

    refreshScreen = async () => {
        this.getPlans()
        this.getUser()
        this.getUsers()
    }

    getPlans = async () => {

        this.setState({isLoading: true})

        await dispatchFetchRequest(api.roster.getAllPlans, {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }, response => {
            response.json().then(async (data) => {
                this.setState({rosterPlansData: data?.results ?? []})
                let rosterEventsArr = []
                for (let index = 0; index < data?.results?.length; index++) {
                    const planId = data?.results?.[index]?.id;
                    await dispatchFetchRequest(api.roster.getEvents(planId), {
                        method: 'GET',
                        withCredentials: true,
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    }, (response) => {
                        response.json().then(data2 => {
                            rosterEventsArr.push(...data2?.results)
                            this.setState({rosterEvents: rosterEventsArr})
                            if (index === data?.results?.length - 1)
                                this.setState({isLoading: false})
                        })
                    }).then()
                }

            })
        }).then().catch(() => this.setState({isLoading: false}))

    }

    handleChangeCalendarMode = (date = null) => {
        this.refreshScreen()
        if (this.state.calendarMode === 'month')
            this.setState({calendarMode: 'week', selectedDate: date})
        else
            this.setState({calendarMode: 'month', selectedDate: date})
    }

    getUser = async () => {

        this.setState({isLoading: true})

        await dispatchFetchRequest(api.clientUser.get('me'), {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }, response => {
            response.json().then(async (data) => {
                console.log('getUser', data)
                this.setState({isManager: data?.roles?.includes('MANAGER')})

            })
        }).then().catch(() => this.setState({isLoading: false}))

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
                console.log('getUsers', JSON.stringify(data))
                this.setState({users: data?.users})

            })
        }).then().catch(() => this.setState({isLoading: false}))

    }



    render() {
        const {themeStyle, handleSubmit} = this.props
        const {t} = this.context
        const timezone = TimeZoneService.getTimeZone()



        return (
            <ThemeContainer>
                <NavigationEvents
                    onWillFocus={() => {
                        this.refreshScreen()
                    }}
                />

                <View style={styles.fullWidthScreen}>
                    <ScreenHeader backNavigation={false}
                        parentFullScreen={true}
                        title={t('calendarEvent.screenTitle')}
                        rightComponent={
                            <TouchableOpacity
                                hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
                                onPress={() => {this.handleChangeCalendarMode()}}
                                style={{borderWidth: 1, borderColor: mainThemeColor, padding: 5, margin: -5, borderRadius: 5}}
                            >
                                <View style={{height: 28, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={[styles.screenTitle, {fontSize: 20}]}>{t(`calendarEvent.${this.state.calendarMode}`)}</Text>
                                    <MCIcon name={this.state.calendarMode === 'month' ? 'calendar-month' : 'calendar-week'}
                                        size={28} color={mainThemeColor} />
                                </View>
                            </TouchableOpacity>
                        }
                    />

                    {this.state.isLoading || this.state.calendarMode === 'month' && <View style={[styles.flex(1), {marginHorizontal: 13}]}>

                        <Calendar
                            current={this.state?.selectedDate}

                            onDayPress={(day) => {console.log('selected day', day)}}
                            onDayLongPress={(day) => {console.log('selected day', day)}}
                            monthFormat={'yyyy MM'}
                            onMonthChange={(month) => {console.log('month changed', month)}}
                            hideExtraDays={false}
                            disableMonthChange={true}
                            firstDay={1}
                            hideDayNames={false}
                            showWeekNumbers={false}
                            onPressArrowLeft={subtractMonth => subtractMonth()}
                            onPressArrowRight={addMonth => addMonth()}
                            disableArrowLeft={false}
                            disableArrowRight={false}
                            disableAllTouchEventsForDisabledDays={true}
                            enableSwipeMonths={false}
                            style={{
                                borderWidth: 1,
                                borderColor: 'gray',
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
                                }
                            }}
                            dayComponent={({date, state}) => {
                                let today = moment(new Date()).tz(timezone).format("YYYY-MM-DD")
                                let isToday = today === date.dateString
                                let task = !!this.state?.rosterEvents
                                    ? this.state?.rosterEvents?.filter((event) => {
                                        return moment(event?.startTime ?? new Date()).tz(timezone).format("YYYY-MM-DD") === date.dateString
                                    })
                                    : []
                                return (
                                    <TouchableOpacity
                                        style={{flex: 1, width: '100%'}}
                                        onPress={() => {this.handleChangeCalendarMode(date.dateString)}}
                                    >
                                        <View style={{flex: 1}}>
                                            <View style={{flex: 1, justifyContent: 'center'}}>
                                                <Text style={{
                                                    textAlign: 'center',
                                                    color: isToday ? '#00adf5' : state === 'disabled' ? 'rgba(128, 128, 128, 0.5)' : 'black',
                                                }}>
                                                    {date.day}
                                                </Text>
                                            </View>
                                            <View style={{flex: 2}}>
                                                <ScrollView style={{flex: 1}}>
                                                    {task?.map((event) => {
                                                        const i18nMomentFrom = moment(event?.startTime ?? new Date()).tz(timezone).format("HH:mm A");
                                                        return (
                                                            <View
                                                                onStartShouldSetResponder={() => true}
                                                                style={{borderWidth: 1, borderColor: mainThemeColor, margin: 5, marginTop: 0, borderRadius: 5}}>
                                                                <Text style={{
                                                                    textAlign: 'center',
                                                                    color: state === 'disabled' ? 'gray' : 'black',
                                                                }}
                                                                    numberOfLines={1}
                                                                >
                                                                    {i18nMomentFrom}
                                                                </Text>
                                                            </View>
                                                        )
                                                    })}
                                                </ScrollView>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            }}

                        />

                    </View>}

                    {this.state.isLoading || this.state.calendarMode === 'week' && <View style={[styles.flex(1), {marginHorizontal: 13}]}>

                        <RenderAgenda events={this.state?.rosterEvents} selectedDate={this.state?.selectedDate} isManager={this.state?.isManager} users={this.state?.users} />
                    </View>}
                </View>
            </ThemeContainer>
        )
    }
}

export default withContext(CalendarScreen)

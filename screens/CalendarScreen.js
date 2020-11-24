import React from 'react'
import {View, Text, ScrollView, TouchableOpacity} from 'react-native'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import Icon from 'react-native-vector-icons/Ionicons'
import styles, {mainThemeColor} from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import MenuButton from "../components/MenuButton";
import {withContext} from "../helpers/contextHelper";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {ThemeContainer} from "../components/ThemeContainer";
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {api, dispatchFetchRequest} from '../constants/Backend'
import {NavigationEvents} from 'react-navigation'
import TimeZoneService from "../helpers/TimeZoneService";
import moment from "moment-timezone";

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
        }
    }

    componentDidMount() {

        this.getPlans()
    }

    refreshScreen = async () => {
        await this.getPlans()
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

    render() {
        const {themeStyle} = this.props
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
                        title={t('settings.roster')}
                    />

                    {this.state.isLoading || <View style={[styles.flex(1), {marginHorizontal: 13}]}>

                        <Calendar
                            // Initially visible month. Default = Date()
                            //current={'2020-11-27'}
                            // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                            minDate={'2012-05-10'}
                            // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                            maxDate={'2100-05-30'}
                            // Handler which gets executed on day press. Default = undefined
                            onDayPress={(day) => {console.log('selected day', day)}}
                            // Handler which gets executed on day long press. Default = undefined
                            onDayLongPress={(day) => {console.log('selected day', day)}}
                            // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                            monthFormat={'yyyy MM'}
                            // Handler which gets executed when visible month changes in calendar. Default = undefined
                            onMonthChange={(month) => {console.log('month changed', month)}}
                            // Hide month navigation arrows. Default = false
                            //hideArrows={true}
                            // Replace default arrows with custom ones (direction can be 'left' or 'right')
                            //renderArrow={(direction) => (<Arrow />)}
                            // Do not show days of other months in month page. Default = false
                            hideExtraDays={false}
                            // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
                            // day from another month that is visible in calendar page. Default = false
                            disableMonthChange={true}
                            // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                            firstDay={1}
                            // Hide day names. Default = false
                            hideDayNames={false}
                            // Show week numbers to the left. Default = false
                            showWeekNumbers={false}
                            // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                            onPressArrowLeft={subtractMonth => subtractMonth()}
                            // Handler which gets executed when press arrow icon right. It receive a callback can go next month
                            onPressArrowRight={addMonth => addMonth()}
                            // Disable left arrow. Default = false
                            disableArrowLeft={false}
                            // Disable right arrow. Default = false
                            disableArrowRight={false}
                            // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
                            disableAllTouchEventsForDisabledDays={true}
                            // Replace default month and year title with custom one. the function receive a date as parameter.
                            //renderHeader={(date) => {/*Return JSX*/}}
                            // Enable the option to swipe between months. Default = false
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

                                let isToday = new Date().toISOString().slice(0, 10) === date.dateString
                                let task = !!this.state?.rosterEvents
                                    ? this.state?.rosterEvents?.filter((event) => {
                                        return moment(event?.startTime ?? new Date()).tz(timezone).format("YYYY-MM-DD") === date.dateString
                                    })
                                    : []
                                return (
                                    <TouchableOpacity style={{flex: 1, width: '100%'}}>
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
                                                        console.log('i18nMomentFrom', moment(event?.startTime ?? new Date()).tz(timezone).format("YYYY-MM-DD"))
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
                </View>
            </ThemeContainer>
        )
    }
}

export default withContext(CalendarScreen)

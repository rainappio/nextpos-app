import React, {Component} from 'react';
import {Platform, Alert, StyleSheet, View, Text, TouchableOpacity, Button, ScrollView} from 'react-native';
import {Agenda, ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar} from 'react-native-calendars';
import TimeZoneService from "../helpers/TimeZoneService";
import moment from "moment-timezone";
import {CalendarEvent} from "./CalendarEvent";
import {withContext} from "../helpers/contextHelper";
import {LocaleContext} from '../locales/LocaleContext'
import styles, {mainThemeColor} from '../styles'
import {api, dispatchFetchRequest} from '../constants/Backend'
import _ from 'lodash';
import {withNavigation} from 'react-navigation';

export class RenderAgendaBase extends Component {
    static contextType = LocaleContext
    constructor(props, context) {
        super(props, context);

        const timezone = TimeZoneService.getTimeZone()
        let itemObj = {}
        let markObj = {}
        props?.events?.forEach((event) => {
            let dateKey = moment(event?.startTime ?? new Date()).tz(timezone).format("YYYY-MM-DD")
            let today = moment(!!props?.selectedDate ? new Date(props?.selectedDate) : new Date()).tz(timezone).format("YYYY-MM-DD")
            if (!itemObj[dateKey]) {
                if (dateKey === today) {
                    itemObj[dateKey] = []
                    itemObj[dateKey].push({
                        ...event,
                        name: event?.id,
                    })
                }
            } else {
                itemObj[dateKey].push({
                    ...event,
                    name: event?.id,
                })
            }
            markObj[dateKey] = {marked: true}
        })
        this.state = {
            items: itemObj,
            markedDates: markObj,
        };
    }

    render() {
        const timezone = TimeZoneService.getTimeZone()
        const {t} = this.context
        return (
            <Agenda
                selected={this.props?.selectedDate}
                items={this.state.items}
                renderItem={this.renderItem.bind(this)}
                rowHasChanged={this.rowHasChanged.bind(this)}
                onDayPress={this.loadItems.bind(this)}
                onRefresh={() => console.log('refreshing...')}
                markedDates={this.state.markedDates}
                renderEmptyData={() => {
                    return (<View style={{alignSelf: 'center', padding: 10}}>
                        <Text style={styles.messageBlock}>{t('order.noOrder')}</Text>
                    </View>);
                }}
                firstDay={1}
            />
        );
    }

    loadItems(day) {

        const timezone = TimeZoneService.getTimeZone()
        let itemObj = {}
        this.props?.events?.forEach((event) => {
            let dateKey = moment(event?.startTime ?? new Date()).tz(timezone).format("YYYY-MM-DD")
            if (!itemObj[dateKey]) {

                if (dateKey === day?.dateString) {
                    itemObj[dateKey] = []
                    itemObj[dateKey].push({
                        ...event,
                        name: event?.id,
                    })
                }

            } else {
                itemObj[dateKey].push({
                    ...event,
                    name: event?.id,
                })
            }

        })
        this.setState({
            items: itemObj
        })
    }

    renderItem(item, firstItemInDay) {
        console.log('renderItem', item, firstItemInDay)
        return (
            <CalendarEvent event={item} theme={{
                text: {
                    color: 'black'
                }
            }} isManager={this.props?.isManager}
                users={this.props?.users} refreshScreen={() => this.props?.refreshScreen()} />
        );
    }

    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }
}

export const RenderAgenda = withContext(RenderAgendaBase)




const themeColor = '#00AAAF';
const lightThemeColor = '#EBF9F9';



class DayCalendarBase extends Component {

    static contextType = LocaleContext
    constructor(props, context) {
        super(props, context);

        const timezone = TimeZoneService.getTimeZone()

        this.state = {
            selectedDate: moment(new Date()).tz(timezone).format("YYYY-MM-DD"),
            events: props?.events ?? {},
            selectedDay: moment(new Date()).tz(timezone).day()
        };
        console.log('selectedDay', this.state.selectedDay)
    }
    onDateChanged = (date, updateSource) => {
        const timezone = TimeZoneService.getTimeZone()
        console.log('ExpandableCalendarScreen onDateChanged: ', date, updateSource);
        let tempDate = date
        if (updateSource === 'weekScroll' || updateSource === 'pageScroll') {
            tempDate = moment(date).tz(timezone).day(this.state?.selectedDay).format("YYYY-MM-DD")
        } else if (updateSource === 'dayPress' || updateSource === 'todayPress') {
            this.setState({selectedDay: moment(date).tz(timezone).day()})
        }
        this.setState({selectedDate: tempDate})
        // fetch and set data for date + week ahead
    };

    onMonthChange = (month, updateSource) => {
        console.log('ExpandableCalendarScreen onMonthChange: ', month, updateSource);
        this.getEvents(month?.year, month?.month)

    };

    getEvents = (year = new Date().getFullYear(), month = new Date().getMonth() + 1) => {


        dispatchFetchRequest(api.rosterEvent.getEventsByDate(year, month), {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }, response => {
            response.json().then(async (data) => {
                this.setState({events: data?.groupedResults})

            })
        }).then()
    }


    render() {
        const timezone = TimeZoneService.getTimeZone()
        const dayEvents = this.state?.events?.[`${this.state?.selectedDate}`]
        const {t} = this.context


        let todayStart = new Date(moment(this.state?.selectedDate).tz(timezone)).getTime()
        let todayEnd = new Date(moment(this.state?.selectedDate).tz(timezone).add(1, 'days')).getTime()

        return (
            <CalendarProvider
                date={this.state?.selectedDate}
                onDateChanged={this.onDateChanged}
                onMonthChange={this.onMonthChange}
                showTodayButton
                disabledOpacity={0.6}

                theme={{
                    todayButtonTextColor: mainThemeColor,
                }}
                todayBottomMargin={16}
            >

                <ExpandableCalendar
                    hideArrows
                    disableAllTouchEventsForDisabledDays
                    firstDay={1}

                />

                <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
                    <View style={{flexDirection: 'column'}}>
                        <View style={{flexDirection: 'row', borderBottomWidth: 1, borderColor: '#c7c7c7'}}>
                            <View style={{flex: 1, alignItems: 'center', borderRightWidth: 1, paddingVertical: 10, borderColor: '#c7c7c7'}}>
                                <Text>{t('roster.resources')}</Text>
                            </View>
                            <View style={{flex: 2, alignItems: 'center', borderRightWidth: 1, paddingVertical: 10, borderColor: '#c7c7c7'}}>
                                <Text>00-08</Text>
                            </View>
                            <View style={{flex: 2, alignItems: 'center', borderRightWidth: 1, paddingVertical: 10, borderColor: '#c7c7c7'}}>
                                <Text>08-16</Text>
                            </View>

                            <View style={{flex: 2, alignItems: 'center', paddingVertical: 10, borderColor: '#c7c7c7'}}>
                                <Text>16-24</Text>
                            </View>
                        </View>
                        {dayEvents?.map((staff) => {
                            let formatDayEvents = staff?.events?.map((item) => {return {...item, start: new Date(item?.startTime).getTime(), end: new Date(item?.endTime).getTime(), line: 1}})
                            let [renderEvent, maxLine] = getLine(formatDayEvents)
                            return (
                                <View style={{flexDirection: 'row', height: (30 * (maxLine) + 15), borderBottomWidth: 1, borderColor: '#c7c7c7'}}>
                                    <View style={{flex: 1, alignItems: 'center', borderRightWidth: 1, borderColor: '#c7c7c7', justifyContent: 'center'}}>
                                        <Text>{staff?.resource}</Text>
                                    </View>
                                    <View style={{flex: 6}}>
                                        {renderEvent?.map((event) => {
                                            let startAt = new Date(moment(event?.startTime).tz(timezone)).getTime()
                                            let endAt = new Date(moment(event?.endTime).tz(timezone)).getTime()
                                            let startDuration = (startAt - todayStart) / 86400000
                                            let endDuration = (todayEnd - endAt) / 86400000
                                            let widthDuration = (endAt - startAt) / 86400000

                                            return (

                                                <TouchableOpacity style={{position: 'absolute', borderWidth: 1, borderColor: (!event?.eventColor || event?.eventColor === '#fff') ? mainThemeColor : event?.eventColor, backgroundColor: event?.eventColor ?? undefined, height: 25, left: `${100 * startDuration}%`, width: `${100 * widthDuration}%`, top: (30 * (event?.line - 1) + 10), overflow: 'hidden', borderRadius: 5, paddingHorizontal: 5, justifyContent: 'center'}}
                                                    onPress={() => {
                                                        this.props.navigation.navigate('RostersFormScreen', {
                                                            data: event,
                                                            users: this.props?.users,
                                                            refreshScreen: () => {
                                                                this.getEvents(new Date(this.state?.selectedDate).getFullYear(), new Date(this.state?.selectedDate).getMonth() + 1)
                                                            },
                                                            isManager: this.props?.isManager
                                                        })
                                                    }}
                                                >
                                                    <Text numberOfLines={1}>{event?.eventName}: {moment(event?.startTime).tz(timezone).format("M/DD HH:mm")}-{moment(event?.endTime).tz(timezone).format("M/DD HH:mm")} {event?.myEventResources?.map((myArea) => {return myArea?.workingArea}).join(', ')}</Text>
                                                </TouchableOpacity>

                                            )
                                        })
                                        }
                                    </View>

                                </View>
                            )
                        })

                        }

                    </View>
                </ScrollView>
            </CalendarProvider>
        );
    }
}


const styles_2 = StyleSheet.create({

    section: {
        backgroundColor: lightThemeColor,
        color: 'grey',
        textTransform: 'capitalize'
    },
    item: {
        padding: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
        flexDirection: 'row'
    },
    itemHourText: {
        color: 'black'
    },
    itemDurationText: {
        color: 'grey',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4
    },
    itemTitleText: {
        color: 'black',
        marginLeft: 16,
        fontWeight: 'bold',
        fontSize: 16
    },
    itemButtonContainer: {
        flex: 1,
        alignItems: 'flex-end'
    },
    emptyItem: {
        paddingLeft: 20,
        height: 52,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey'
    },
    emptyItemText: {
        color: 'lightgrey',
        fontSize: 14
    }
});

export const DayCalendar = withNavigation(withContext(DayCalendarBase))


const getLine = (testEvents) => {
    let sortedEvents = testEvents.sort(function (a, b) {

        return -(new Date(b.start) - new Date(a.start));
    });
    let answer = []
    let maxLine = 1
    sortedEvents?.forEach((task) => {
        let tempTask = {...task}
        let flag = 'add'
        let tempAns = [...answer]
        while (flag === 'add') {
            flag = 'no'
            tempAns?.forEach((event) => {
                if ((tempTask?.start >= event?.start && tempTask?.start <= event?.end) ||
                    (tempTask?.end >= event?.start && tempTask?.end <= event?.end) ||
                    (tempTask?.start <= event?.start && tempTask?.end >= event?.start) ||
                    (tempTask?.start <= event?.end && tempTask?.end >= event?.end)) {
                    if (tempTask?.line === event?.line) {
                        flag = 'add'
                    }
                }

            })
            if (flag === 'add') {
                tempTask.line++
                maxLine = tempTask.line
            }
        }

        answer.push(tempTask)

    })
    return [answer, maxLine]
}
import React, {Component} from 'react';
import {Platform, Alert, StyleSheet, View, Text, TouchableOpacity, Button, ScrollView} from 'react-native';
import {Agenda, ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar} from 'react-native-calendars';
import TimeZoneService from "../helpers/TimeZoneService";
import moment from "moment-timezone";
import {CalendarEvent} from "./CalendarEvent";
import {withContext} from "../helpers/contextHelper";
import {LocaleContext} from '../locales/LocaleContext'
import styles from '../styles'
import {api, dispatchFetchRequest} from '../constants/Backend'
import _ from 'lodash';
import {withNavigation} from 'react-navigation';
import {StyledText} from './StyledText';
import Modal from 'react-native-modal';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import {FontAwesome} from '@expo/vector-icons';
import {Ionicons} from '@expo/vector-icons';


class RenderAgendaBase extends Component {
    static contextType = LocaleContext
    constructor(props, context) {
        super(props, context);

        const timezone = TimeZoneService.getTimeZone()

        this.state = {
            selectedDate: moment(props?.selectedDate ?? new Date()).tz(timezone).format("YYYY-MM-DD"),
            events: props?.events ?? {},
            selectedDay: moment(props?.selectedDate ?? new Date()).tz(timezone).day(),
            eventDetail: null,
            showEventDetail: false
        };
    }
    onDateChanged = (date, updateSource) => {
        const timezone = TimeZoneService.getTimeZone()
        let tempDate = date
        if (updateSource === 'weekScroll' || updateSource === 'pageScroll') {
            tempDate = moment(date).tz(timezone).day(this.state?.selectedDay).format("YYYY-MM-DD")
        } else if (updateSource === 'dayPress' || updateSource === 'todayPress') {
            this.setState({selectedDay: moment(date).tz(timezone).day()})
        }
        this.setState({selectedDate: tempDate})
        this.props?.changeSelectedDate(tempDate)
    };

    onMonthChange = (month, updateSource) => {
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
                this.setState({events: data?.results})

            })
        }).then()
    }

    handleShowEventDetail = (eventDetail) => {
        this.setState({showEventDetail: true, eventDetail: eventDetail})
    }


    render() {
        const timezone = TimeZoneService.getTimeZone()
        const {t, customMainThemeColor, customBackgroundColor, themeStyle, complexTheme} = this.context
        let weekStart = moment(this.state?.selectedDate).startOf('isoWeek').tz(timezone)
        let weekEnd = moment(this.state?.selectedDate).endOf('isoWeek').tz(timezone)
        const weekEvents = this.state?.events?.filter((event) =>
            (moment(event?.startTime).isBetween(weekStart, weekEnd) &&
                ((this.props?.selectedLabels.has('noWorkingArea') && Object.keys(event?.eventResources).length === 0) || (Object.keys(event?.eventResources).some((area) => this.props?.selectedLabels.has(area))))
            ))
        const customCalendarTheme = {
            calendarBackground: customBackgroundColor,
            monthTextColor: customMainThemeColor,
            textMonthFontWeight: 'bold',
            arrowColor: customMainThemeColor,
            dayTextColor: themeStyle?.color,
            textDisabledColor: complexTheme?.invalid?.color,
            selectedDayBackgroundColor: customMainThemeColor
        }




        return (
            <View style={{width: '100%', flex: 1, alignSelf: 'flex-end'}}>
                <CalendarProvider
                    date={this.state?.selectedDate}
                    onDateChanged={this.onDateChanged}
                    onMonthChange={this.onMonthChange}
                    disabledOpacity={0.6}

                    theme={{
                        todayButtonTextColor: customMainThemeColor,
                    }}
                    todayBottomMargin={16}
                >

                    <ExpandableCalendar
                        hideArrows
                        disableAllTouchEventsForDisabledDays
                        firstDay={1}

                        calendarStyle={{
                            paddingLeft: 120,
                        }}
                        headerStyle={{
                            paddingLeft: 120,
                        }}
                        theme={{...customCalendarTheme}}
                    />

                    <ScrollView style={{flex: 1, backgroundColor: customBackgroundColor}}>
                        {[0].map(() => {
                            let eventSeriesIdArr = []
                            return (
                                <View>
                                    {weekEvents.map((event) => {
                                        let renderFlag = false
                                        if (!!event?.eventSeriesId && !eventSeriesIdArr.includes(event?.eventSeriesId)) {
                                            eventSeriesIdArr.push(event?.eventSeriesId)
                                            renderFlag = true
                                        }
                                        if (renderFlag) {
                                            return (
                                                <View style={{flexDirection: 'column', flex: 1, borderBottomWidth: 1, borderColor: '#c7c7c7'}}>
                                                    <View style={{flex: 1, flexDirection: 'row'}}>
                                                        <View style={{padding: 5, width: 120, minHeight: 80, borderRightWidth: 1, borderColor: '#c7c7c7', alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: event?.eventColor}}>
                                                            <Text style={{color: '#454545'}}>{event?.eventName}</Text>
                                                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text style={{color: '#454545'}}>{moment(event?.startTime).tz(timezone).format('HH:mm')} - {moment(event?.endTime).tz(timezone).format('HH:mm')}</Text>
                                                            </View>
                                                        </View>
                                                        {[1, 2, 3, 4, 5, 6, 7].map((dayOfWeek) => {
                                                            let taskDayOfWeek = moment(event?.startTime).tz(timezone).isoWeekday()
                                                            let sameEventSeriesIdEvent = weekEvents.find((item) => ((item.eventSeriesId === event.eventSeriesId) && (item.id !== event.id) && (moment(item?.startTime).tz(timezone).isoWeekday() === dayOfWeek)))

                                                            return (
                                                                <TouchableOpacity
                                                                    disabled={((taskDayOfWeek !== dayOfWeek) && !sameEventSeriesIdEvent)}
                                                                    onPress={() => this.handleShowEventDetail(sameEventSeriesIdEvent ?? event)}
                                                                    style={[{flex: 1, borderRightWidth: 1, borderColor: '#c7c7c7', backgroundColor: ((taskDayOfWeek !== dayOfWeek) && !sameEventSeriesIdEvent) ? undefined : event?.eventColor, }]}>
                                                                    {taskDayOfWeek === dayOfWeek && <View style={[(event?.id === this.state?.eventDetail?.id ? {borderColor: customMainThemeColor, borderWidth: 3, flex: 1} : {flex: 1})]}>{
                                                                        Object.keys(event?.eventResources)?.length > 0 ?
                                                                            Object.keys(event?.eventResources)?.map((workingArea) => {
                                                                                return (
                                                                                    <Text numberOfLines={1} style={{color: '#454545', padding: 5, }}>{workingArea}: {event?.eventResources?.[`${workingArea}`]?.map((staff) => staff?.resourceName).join(', ')}</Text>
                                                                                )
                                                                            }) :
                                                                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                                                                <Text style={{color: '#454545', padding: 5, }}>{t('calendar.noWorkingArea')}</Text>
                                                                            </View>
                                                                    }</View>}
                                                                    {!!sameEventSeriesIdEvent && <View style={[(sameEventSeriesIdEvent?.id === this.state?.eventDetail?.id ? {borderColor: customMainThemeColor, borderWidth: 3, flex: 1} : {flex: 1})]}>{
                                                                        Object.keys(sameEventSeriesIdEvent?.eventResources)?.length > 0 ?
                                                                            Object.keys(sameEventSeriesIdEvent?.eventResources)?.map((workingArea) => {
                                                                                return (
                                                                                    <Text numberOfLines={1} style={{color: '#454545', padding: 5, }}>{workingArea}: {sameEventSeriesIdEvent?.eventResources?.[`${workingArea}`]?.map((staff) => staff?.resourceName).join(', ')}</Text>
                                                                                )
                                                                            }) : <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                                                                <Text style={{color: '#454545', padding: 5, }}>{t('calendar.noWorkingArea')}</Text>
                                                                            </View>
                                                                    }</View>}
                                                                </TouchableOpacity>
                                                            )
                                                        })}
                                                    </View>

                                                </View>
                                            )
                                        } else {
                                            return null
                                        }

                                    })}
                                </View>
                            )
                        })}



                    </ScrollView>
                    {this.state?.showEventDetail &&
                        <View style={{height: 120, backgroundColor: customBackgroundColor, borderTopWidth: 1, borderColor: customMainThemeColor}}>
                            <TouchableOpacity style={{position: 'absolute', right: 10, top: 8, zIndex: 100}}
                                onPress={() => this.setState({showEventDetail: false})}
                            >
                                <Ionicons name="close" size={32} color={customMainThemeColor} />

                            </TouchableOpacity>
                            <TouchableOpacity style={{position: 'absolute', right: 52, top: 10, zIndex: 100}}
                                onPress={() => {
                                    this.props.navigation.navigate('RostersFormScreen', {
                                        data: this.state?.eventDetail,
                                        users: this.props?.users,
                                        refreshScreen: () => {
                                            this.setState({showEventDetail: false})
                                            this.getEvents(new Date(this.state?.selectedDate).getFullYear(), new Date(this.state?.selectedDate).getMonth() + 1)
                                        },
                                        isManager: this.props?.isManager
                                    })
                                }}
                            >
                                <FontAwesome name="edit" size={32} color={customMainThemeColor} />
                            </TouchableOpacity>
                            <ScrollView >
                                <View key={this.state?.eventDetail?.id} style={{flexDirection: 'row', margin: 10, alignSelf: 'center', padding: 10}}

                                >


                                    <View style={{flexDirection: 'column', alignItems: 'center', flex: 1, maxWidth: 120}}>
                                        <FontAwesome5Icon
                                            name={this.state?.eventDetail?.eventType === 'ROSTER' ? "business-time" : 'utensils'}
                                            size={36}
                                            style={[styles?.buttonIconStyle(customMainThemeColor)]}
                                        />
                                        <StyledText style={{marginTop: 10}}>{this.state?.eventDetail?.eventName}</StyledText>

                                    </View>
                                    <View style={{flexDirection: 'column', alignItems: 'flex-start', flex: 3}}>

                                        <View style={{flexWrap: 'wrap', flexDirection: 'row', marginTop: 5}}>
                                            <Text style={{fontSize: 16, color: customMainThemeColor, fontWeight: 'bold'}}>{t(`calendarEvent.eventResources`)}</Text>
                                        </View>
                                        {
                                            Object.keys(this.state?.eventDetail?.eventResources)?.map((workingArea) => {
                                                return (
                                                    <StyledText style={{padding: 5}}>{workingArea}: {this.state?.eventDetail?.eventResources[`${workingArea}`]?.map((staff) => staff?.resourceName).join(', ')}</StyledText>
                                                )
                                            })
                                        }


                                    </View>

                                </View>

                            </ScrollView></View>}
                </CalendarProvider >
            </View >
        );
    }
}

export const RenderAgenda = withNavigation(withContext(RenderAgendaBase))




const themeColor = '#00AAAF';
const lightThemeColor = '#EBF9F9';



class DayCalendarBase extends Component {

    static contextType = LocaleContext
    constructor(props, context) {
        super(props, context);

        const timezone = TimeZoneService.getTimeZone()

        this.state = {
            selectedDate: moment(props?.selectedDate ?? new Date()).tz(timezone).format("YYYY-MM-DD"),
            events: props?.events ?? {},
            selectedDay: moment(props?.selectedDate ?? new Date()).tz(timezone).day(),
        };
    }
    onDateChanged = (date, updateSource) => {
        const timezone = TimeZoneService.getTimeZone()
        let tempDate = date
        if (updateSource === 'weekScroll' || updateSource === 'pageScroll') {
            tempDate = moment(date).tz(timezone).day(this.state?.selectedDay).format("YYYY-MM-DD")
        } else if (updateSource === 'dayPress' || updateSource === 'todayPress') {
            this.setState({selectedDay: moment(date).tz(timezone).day()})
        }
        this.setState({selectedDate: tempDate})
        this.props?.changeSelectedDate(tempDate)
    };

    onMonthChange = (month, updateSource) => {
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
        const {t, themeStyle, complexTheme, customMainThemeColor, customBackgroundColor} = this.context


        let todayStart = new Date(moment(this.state?.selectedDate).tz(timezone)).getTime()
        let todayEnd = new Date(moment(this.state?.selectedDate).tz(timezone).add(1, 'days')).getTime()

        const customCalendarTheme = {
            calendarBackground: customBackgroundColor,
            monthTextColor: customMainThemeColor,
            textMonthFontWeight: 'bold',
            arrowColor: customMainThemeColor,
            dayTextColor: themeStyle?.color,
            textDisabledColor: complexTheme?.invalid?.color,
            selectedDayBackgroundColor: customMainThemeColor
        }

        return (
            <CalendarProvider
                date={this.state?.selectedDate}
                onDateChanged={this.onDateChanged}
                onMonthChange={this.onMonthChange}
                showTodayButton={false}
                disabledOpacity={0.6}

                theme={{
                    todayButtonTextColor: customMainThemeColor,
                }}
                todayBottomMargin={16}
            >

                <ExpandableCalendar
                    hideArrows
                    disableAllTouchEventsForDisabledDays
                    firstDay={1}
                    theme={customCalendarTheme}
                />

                <ScrollView style={{flex: 1, backgroundColor: customBackgroundColor}}>
                    <View style={{flexDirection: 'column'}}>
                        <View style={{flexDirection: 'row', borderBottomWidth: 1, borderColor: '#c7c7c7'}}>
                            <View style={{flex: 1, alignItems: 'center', borderRightWidth: 1, paddingVertical: 10, borderColor: '#c7c7c7'}}>
                                <StyledText>{t('roster.resources')}</StyledText>
                            </View>
                            <View style={{flex: 2, alignItems: 'center', borderRightWidth: 1, paddingVertical: 10, borderColor: '#c7c7c7'}}>
                                <StyledText>00-08</StyledText>
                            </View>
                            <View style={{flex: 2, alignItems: 'center', borderRightWidth: 1, paddingVertical: 10, borderColor: '#c7c7c7'}}>
                                <StyledText>08-16</StyledText>
                            </View>

                            <View style={{flex: 2, alignItems: 'center', paddingVertical: 10, borderColor: '#c7c7c7'}}>
                                <StyledText>16-24</StyledText>
                            </View>
                        </View>
                        {dayEvents?.map((staff) => {
                            let formatDayEvents = staff?.events?.map((item) => {return {...item, start: new Date(item?.startTime).getTime(), end: new Date(item?.endTime).getTime(), line: 1}})
                            let [renderEvent, maxLine] = getLine(formatDayEvents)
                            return (
                                <View style={{flexDirection: 'row', height: (30 * (maxLine) + 15), borderBottomWidth: 1, borderColor: '#c7c7c7'}}>
                                    <View style={{flex: 1, alignItems: 'center', borderRightWidth: 1, borderColor: '#c7c7c7', justifyContent: 'center'}}>
                                        <StyledText>{staff?.resource}</StyledText>
                                    </View>
                                    <View style={{flex: 6}}>
                                        {renderEvent?.map((event) => {
                                            let startAt = new Date(moment(event?.startTime).tz(timezone)).getTime()
                                            let endAt = new Date(moment(event?.endTime).tz(timezone)).getTime()
                                            let startDuration = (startAt - todayStart) / 86400000
                                            let endDuration = (todayEnd - endAt) / 86400000
                                            let widthDuration = (endAt - startAt) / 86400000

                                            return (

                                                <TouchableOpacity style={{position: 'absolute', borderWidth: 1, borderColor: (!event?.eventColor || event?.eventColor === '#fff') ? customMainThemeColor : event?.eventColor, backgroundColor: event?.eventColor ?? undefined, height: 25, left: `${100 * startDuration}%`, width: `${100 * widthDuration}%`, top: (30 * (event?.line - 1) + 10), overflow: 'hidden', borderRadius: 5, paddingHorizontal: 5, justifyContent: 'center'}}
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
                                                    <Text numberOfLines={1} style={{color: '#454545', }}>{event?.eventName}: {moment(event?.startTime).tz(timezone).format("HH:mm")}-{moment(event?.endTime).tz(timezone).format("HH:mm")} {event?.myEventResources?.map((myArea) => {return myArea?.workingArea}).join(', ')}</Text>
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
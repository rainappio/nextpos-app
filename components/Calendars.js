import React, {Component} from 'react';
import {Alert, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Agenda, LocaleConfig} from 'react-native-calendars';
import TimeZoneService from "../helpers/TimeZoneService";
import moment from "moment-timezone";
import {CalendarEvent} from "./CalendarEvent";
import {withContext} from "../helpers/contextHelper";
import {LocaleContext} from '../locales/LocaleContext'
import styles, {mainThemeColor} from '../styles'

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
                        height: 100
                    })
                }
            } else {
                itemObj[dateKey].push({
                    ...event,
                    name: event?.id,
                    height: 100
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
                        height: 100
                    })
                }

            } else {
                itemObj[dateKey].push({
                    ...event,
                    name: event?.id,
                    height: 100
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
                users={this.props?.users} />
        );
    }

    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }
}

export const RenderAgenda = withContext(RenderAgendaBase)


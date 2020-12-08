import React, {useState, useContext, useEffect} from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native'
import {StyledText} from "./StyledText";
import {LocaleContext} from '../locales/LocaleContext'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles, {mainThemeColor} from '../styles'
import {Button} from 'react-native-elements';
import {api, dispatchFetchRequest} from '../constants/Backend'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import TimeZoneService from "../helpers/TimeZoneService";
import moment from "moment-timezone";
import {MainActionFlexButton, DeleteFlexButton} from "../components/ActionButtons";

/*
   Date   : 2020-12-03
   Author : GGGODLIN
   Content: props
            event={{}}
            theme={{
                text:{}
            }}

            
*/
export const CalendarEvent = (props) => {
    const localeContext = useContext(LocaleContext);
    const timezone = TimeZoneService.getTimeZone()

    const [event, setEvent] = useState(props?.event ?? null);

    useEffect(() => {
        setEvent(props?.event ?? null)
    }, [props?.event])


    const handleAssign = (pid, eid) => {
        dispatchFetchRequest(api.roster.assign(pid, eid), {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }, response => {
            response.json().then(data => {
                setEvent(data)
            })
        }).then()
    }

    const handleRemove = (pid, eid) => {
        dispatchFetchRequest(api.roster.remove(pid, eid), {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }, response => {
            response.json().then(data => {
                setEvent(data)
            })
        }).then()
    }

    return (
        <View key={event?.id} style={{flexDirection: 'row', borderWidth: 1, borderRadius: 10, borderColor: mainThemeColor, margin: 10, maxWidth: 640, alignSelf: 'center', padding: 10}}>
            <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1}}>
                <FontAwesome5Icon
                    name={event?.eventType === 'ROSTER' ? "business-time" : 'utensils'}
                    size={36}
                    style={[styles.buttonIconStyle]}
                />
                <StyledText style={{...props?.theme?.text, marginTop: 10}}>{localeContext.t(`calendarEvent.status.${event?.status}`)}</StyledText>

            </View>
            <View style={{flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', flex: 3}}>
                <View style={{flexWrap: 'wrap', flex: 1, flexDirection: 'row'}}>
                    <StyledText style={{...props?.theme?.text, }}>{localeContext.t(`calendarEvent.startTime`)}: </StyledText>
                    <StyledText style={{...props?.theme?.text, }}>{moment(event?.startTime ?? new Date()).tz(timezone).format("YYYY-MM-DD HH:mm")}</StyledText>
                </View>
                <View style={{flexWrap: 'wrap', flex: 1, flexDirection: 'row'}}>
                    <StyledText style={{...props?.theme?.text, }}>{localeContext.t(`calendarEvent.endTime`)}: </StyledText>
                    <StyledText style={{...props?.theme?.text, }}>{moment(event?.endTime ?? new Date()).tz(timezone).format("YYYY-MM-DD HH:mm")}</StyledText>
                </View>
                <View style={{flexWrap: 'wrap', flex: 1, flexDirection: 'row'}}>
                    <StyledText style={{...props?.theme?.text, }}>{localeContext.t(`calendarEvent.eventResources`)}: </StyledText>
                    <StyledText style={{...props?.theme?.text, }}>{event?.eventResources?.map((item) => item?.resourceName)?.join(', ')}</StyledText>
                </View>


            </View>
            <View style={{flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center', flex: 1}}>
                <View style={{flex: 1, minHeight: 48}}>
                    <MainActionFlexButton
                        title={localeContext.t('calendarEvent.assign')}
                        onPress={() => {handleAssign(event?.eventOwner?.ownerId, event?.id)}} />
                </View>
                <View style={{flex: 1, minHeight: 48, marginTop: 5}}>
                    <DeleteFlexButton
                        title={localeContext.t('calendarEvent.remove')}
                        onPress={() => {handleRemove(event?.eventOwner?.ownerId, event?.id)}} />
                </View>
            </View>
        </View>
    );
}
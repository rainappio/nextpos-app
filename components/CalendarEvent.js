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
import UserSelectModal from "../screens/UserSelectModal";
import {withNavigation} from 'react-navigation';

/*
   Date   : 2020-12-03
   Author : GGGODLIN
   Content: props
            event={{}}
            theme={{
                text:{}
            }}

            
*/
const CalendarEventBase = (props) => {
    const localeContext = useContext(LocaleContext);
    const timezone = TimeZoneService.getTimeZone()

    const [event, setEvent] = useState(props?.event ?? null);
    const [modalVisible, setModalVisible] = useState(false);
    const [labels, setLabels] = useState([])

    useEffect(() => {
        setEvent(props?.event ?? null)
    }, [props?.event])

    useEffect(() => {
        dispatchFetchRequest(`${api.workingarea.getAll}?visibility=ROSTER`, {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }, response => {
            response.json().then(data => {
                setLabels(data?.workingAreas)
            })
        }).then()
    }, []);




    const handleAssignUsers = (request) => {
        dispatchFetchRequest(api.rosterEvent.updateEventResources(event?.id), {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        }, response => {
            response.json().then(data => {
                !!props?.refreshScreen && props?.refreshScreen()
                setEvent(data)
            })
        }).then()
    }



    return (
        <TouchableOpacity key={event?.id} style={{flexDirection: 'row', borderWidth: 1, borderRadius: 10, borderColor: mainThemeColor, margin: 10, maxWidth: 640, alignSelf: 'center', padding: 10}}
            onPress={() => {
                !!props?.closeModal && props?.closeModal()
                props.navigation.navigate('RostersFormScreen', {
                    users: props?.users,
                    data: event,
                    refreshScreen: () => {props?.refreshScreen()},
                    isManager: props?.isManager
                })
            }}
        >
            {/* remove it if calendar done but no used */}
            {/* <UserSelectModal
                modalVisible={modalVisible}
                submitOrder={(data) => {
                    setModalVisible(false)
                    handleAssignUsers(data)
                }}
                closeModal={() => {setModalVisible(false)}}
                eventData={event}
                data={props?.users}
                labels={labels} /> */}

            <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1}}>
                <FontAwesome5Icon
                    name={event?.eventType === 'ROSTER' ? "business-time" : 'utensils'}
                    size={36}
                    style={[styles.buttonIconStyle]}
                />
                <StyledText style={{...props?.theme?.text, marginTop: 10}}>{event?.eventName}</StyledText>

            </View>
            <View style={{flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', flex: 3}}>
                <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
                    <StyledText style={{...props?.theme?.text, flexWrap: 'wrap', }}>{localeContext.t(`calendarEvent.startTime`)}: </StyledText>
                    <StyledText style={{...props?.theme?.text, flexWrap: 'wrap', }}>{moment(event?.startTime ?? new Date()).tz(timezone).format("YYYY-MM-DD HH:mm")}</StyledText>
                </View>
                <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
                    <StyledText style={{...props?.theme?.text, flexWrap: 'wrap', }}>{localeContext.t(`calendarEvent.endTime`)}: </StyledText>
                    <StyledText style={{...props?.theme?.text, flexWrap: 'wrap', }}>{moment(event?.endTime ?? new Date()).tz(timezone).format("YYYY-MM-DD HH:mm")}</StyledText>
                </View>
                <View style={{flexWrap: 'wrap', flexDirection: 'row', marginTop: 5}}>
                    <StyledText style={{...props?.theme?.text, }}>{localeContext.t(`calendarEvent.eventResources`)}: </StyledText>
                </View>
                {labels?.map((label) => {
                    return (
                        <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
                            <StyledText style={{...props?.theme?.text, flexWrap: 'wrap', marginLeft: 5}}>{label?.name}: {event?.eventResources?.[`${label?.name}`]?.map((item) => item?.resourceName)?.join(', ')}</StyledText>
                        </View>
                    )
                })}


            </View>

        </TouchableOpacity>
    );
}

export const CalendarEvent = withNavigation(CalendarEventBase);
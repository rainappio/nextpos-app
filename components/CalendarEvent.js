import React, {useState, useContext, useEffect} from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native'
import {StyledText} from "./StyledText";
import {LocaleContext} from '../locales/LocaleContext'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles'
import {Button} from 'react-native-elements';
import {api, dispatchFetchRequest} from '../constants/Backend'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import TimeZoneService from "../helpers/TimeZoneService";
import moment from "moment-timezone";
import {MainActionFlexButton, DeleteFlexButton} from "../components/ActionButtons";
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
    const {t, customMainThemeColor, customBackgroundColor, customSecondThemeColor} = localeContext
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


    if (event?.eventType === 'ROSTER') {
        return (
            <TouchableOpacity key={event?.id} style={{flexDirection: 'row', borderWidth: 1, borderRadius: 10, borderColor: event?.eventColor === '#fff' ? customMainThemeColor : event?.eventColor, margin: 10, maxWidth: 640, alignSelf: 'center', padding: 10}}
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

                <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1}}>
                    <FontAwesome5Icon
                        name={event?.eventType === 'ROSTER' ? "business-time" : 'utensils'}
                        size={36}
                        style={[styles?.buttonIconStyle(customMainThemeColor), {color: event?.eventColor === '#fff' ? customMainThemeColor : event?.eventColor}]}
                    />
                    <StyledText style={{...props?.theme?.text, marginTop: 10}}>{event?.eventName}</StyledText>

                </View>
                <View style={{flexDirection: 'column', justifyContent: 'space-between', flex: 3}}>
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>

                        <StyledText style={{flexWrap: 'wrap', fontSize: 16, marginBottom: 16}}>{moment(event?.startTime ?? new Date()).tz(timezone).format("HH:mm")} - {moment(event?.endTime ?? new Date()).tz(timezone).format("HH:mm")}</StyledText>

                    </View>


                    {labels?.map((label, index) => {
                        return (
                            <View style={{flexDirection: 'row'}} key={index}>
                                <StyledText style={{...props?.theme?.textm, marginVertical: 5, fontWeight: 'bold'}}>{label?.name} </StyledText>
                                <View style={{flexDirection: 'row', flex: 1, flexWrap: 'wrap', }}>
                                    {event?.eventResources?.[`${label?.name}`]?.map((item) => {
                                        return (
                                            <View key={item?.resourceName} style={{...localeContext?.complexTheme?.shade, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 10, marginHorizontal: 5, marginVertical: 5}}>
                                                <StyledText style={{...props?.theme?.text, flexWrap: 'wrap', }}>{item?.resourceName}</StyledText>
                                            </View>
                                        )
                                    })}
                                </View>
                            </View>
                        )
                    })}
                </View>
            </TouchableOpacity>
        )
    } else {
        return (
            <TouchableOpacity key={event?.id} style={{flexDirection: 'row', borderWidth: 1, borderRadius: 10, borderColor: customMainThemeColor, margin: 10, maxWidth: 640, alignSelf: 'center', padding: 10}}
                onPress={() => {
                    !!props?.closeModal && props?.closeModal()
                    props.navigation.navigate('ReservationViewScreen', {
                        reservationId: event.id,
                    })

                }}
            >

                <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1}}>
                    <FontAwesome5Icon
                        name={'utensils'}
                        size={36}
                        style={[styles?.buttonIconStyle(customMainThemeColor), {color: customMainThemeColor}]}
                    />


                </View>
                <View style={{flexDirection: 'column', justifyContent: 'space-between', flex: 4}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        {/* <View styles={[styles.flex(2)]}></View> */}
                        <View style={{flexDirection: 'row', flex: 1.2, justifyContent: 'flex-start'}}>
                            <StyledText style={{...props?.theme?.text, marginTop: 10, paddingHorizontal: 4}}>
                                <FontAwesome5Icon
                                    name={'user-check'}
                                    size={18}
                                    style={[styles?.buttonIconStyle(customMainThemeColor)]}
                                /></StyledText>
                            <StyledText style={{...props?.theme?.text, marginTop: 12, fontSize: 16}}>
                                {event?.name}</StyledText>

                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-start', flex: 1.5}}>
                            <StyledText style={{...props?.theme?.text, marginTop: 12, paddingHorizontal: 4}}>
                                <FontAwesome5Icon
                                    name={'phone'}
                                    size={18}
                                    style={[styles?.buttonIconStyle(customMainThemeColor)]}
                                />

                            </StyledText>
                            <StyledText style={{...props?.theme?.text, marginTop: 12, fontSize: 16}}>
                                {event?.phoneNumber}</StyledText>
                        </View>
                    </View>


                    <View style={{flexDirection: 'row'}}>

                        <View style={{justifyContent: 'flex-start', flex: 1.5}}>
                            <StyledText style={{flexWrap: 'wrap', fontSize: 16, marginBottom: 16, marginTop: 12}}>{moment(event?.reservationStartDate ?? new Date()).tz(timezone).format("HH:mm")} - {moment(event?.reservationEndDate ?? new Date()).tz(timezone).format("HH:mm")}
                            </StyledText>

                        </View>
                        <View style={{flex: 1.5}}>
                            <StyledText style={{...props?.theme?.text, fontSize: 16, marginTop: 12}}>{t('reservation.adult')} {event?.people}, {t('reservation.kid')} {event?.kid}</StyledText>
                        </View>

                        <View style={[styles.flexButton(customMainThemeColor), {flexDirection: 'row', flex: 0.8}, (event?.status == 'WAITING') && {backgroundColor: customBackgroundColor}, (event?.status == 'CANCELLED') && {backgroundColor: '#f75336', borderColor: '#f75336'}]}>
                            <StyledText style={[(event?.status !== 'WAITING') && {color: customBackgroundColor}]}>
                                {event?.status}
                            </StyledText>
                        </View>

                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

export const CalendarEvent = withNavigation(CalendarEventBase);
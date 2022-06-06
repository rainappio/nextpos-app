import React, {useState, useContext, useEffect} from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native'
import {StyledText} from "./StyledText";
import {LocaleContext} from '../locales/LocaleContext'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles'
import {Button} from 'react-native-elements';
import {api, dispatchFetchRequest} from '../constants/Backend'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import TimeZoneService from "../helpers/TimeZoneService";
import moment from "moment-timezone";
import {MainActionFlexButton, DeleteFlexButton} from "../components/ActionButtons";
import {withNavigation} from '@react-navigation/compat';

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
      // reservation popup
      return (
        <TouchableOpacity key={event?.id}
                          style={{
                            flexDirection: 'row',
                            borderWidth: 1,
                            borderRadius: 10,
                            borderColor: customMainThemeColor,
                            margin: 10,
                            maxWidth: 640,
                            alignSelf: 'center',
                            padding: 10
                          }}
                          onPress={() => {
                            !!props?.closeModal && props?.closeModal()
                            props.navigation.navigate('ReservationViewScreen', {
                              reservationId: event.id,
                            })
                          }}
        >
          <View style={[{flex: 1, flexDirection: 'row', minHeight: 70}]}>
            <View style={{flexDirection: 'column', flex: 0.5, justifyContent: 'center'}}>
              <MCIcon
                name={event?.sourceOfOrigin === 'APP' ? 'tablet-cellphone' : 'web'}
                size={30}
                style={[styles?.buttonIconStyle(customMainThemeColor)]}
              />
            </View>
            <View style={{flexDirection: 'column', flex: 2, justifyContent: 'space-around'}}>
              <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
                <StyledText style={{...props?.theme?.text, paddingHorizontal: 4}}>
                  <FontAwesome5Icon
                    name={'user-check'}
                    size={18}
                    style={[styles?.buttonIconStyle(customMainThemeColor)]}
                  /></StyledText>
                <StyledText style={{...props?.theme?.text, fontSize: 16, flex: 1, textAlign: 'center'}}>
                  {event?.name}
                </StyledText>
              </View>
              <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
                <StyledText style={{...props?.theme?.text, paddingHorizontal: 4}}>
                  <FontAwesome5Icon
                    name={'info-circle'}
                    size={18}
                    style={[styles?.buttonIconStyle(customMainThemeColor)]}
                  /></StyledText>
                <StyledText style={{...props?.theme?.text, fontSize: 16, flex: 1, textAlign: 'center'}}>
                  {event?.tables[0]?.tableName}
                </StyledText>
              </View>
              <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
                <StyledText style={{...props?.theme?.text, paddingHorizontal: 4}}>
                  <FontAwesome5Icon
                    name={'clock'}
                    size={18}
                    style={[styles?.buttonIconStyle(customMainThemeColor)]}
                  /></StyledText>
                <StyledText style={{...props?.theme?.text, fontSize: 16, flex: 1, textAlign: 'center'}}>
                  {moment(event?.reservationStartDate ?? new Date()).tz(timezone).format("HH:mm")} - {moment(event?.reservationEndDate ?? new Date()).tz(timezone).format("HH:mm")}
                </StyledText>
              </View>
            </View>
            <View style={{flexDirection: 'column', justifyContent: 'space-around', flex: 2}}>
              <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                  <View style={{...props?.theme?.text, paddingHorizontal: 4}}>
                    <FontAwesome5Icon
                      name={'phone'}
                      size={18}
                      style={[styles?.buttonIconStyle(customMainThemeColor)]}
                    />
                  </View>
                  <StyledText style={{...props?.theme?.text, fontSize: 16}}>
                    {event?.phoneNumber}
                  </StyledText>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{...props?.theme?.text, paddingHorizontal: 4}}>
                  <FontAwesome5Icon
                    name={'user-alt'}
                    size={18}
                    style={[styles?.buttonIconStyle(customMainThemeColor)]}
                  />
                </View>
                <StyledText style={{
                  ...props?.theme?.text, fontSize: 16
                  }}>
                  {t('reservation.adult')} {event?.people}
                </StyledText>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{...props?.theme?.text, paddingHorizontal: 4}}>
                  <FontAwesome5Icon
                    name={'user-alt'}
                    size={18}
                    style={[styles?.buttonIconStyle(customMainThemeColor)]}
                  />
                </View>
                <StyledText style={{
                  ...props?.theme?.text, fontSize: 16
                }}>
                  {t('reservation.kid')} {event?.kid}
                </StyledText>
              </View>
            </View>
            <View style={{flexDirection: 'column', flex: 1}}>
              <View style={[styles.flexButton(customMainThemeColor), {
                flexDirection: 'row',
                flex: 1,
                marginVertical: 4
              }, (event?.status == 'WAITING' || event?.status == 'WAITING_CONFIRMED') && {backgroundColor: customBackgroundColor}, (event?.status == 'CANCELLED') && {
                backgroundColor: '#f75336',
                borderColor: '#f75336'
              }]}>
                <StyledText
                  style={[(event?.status !== 'WAITING' || event?.status == 'WAITING_CONFIRMED') && {color: customBackgroundColor}]}>
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

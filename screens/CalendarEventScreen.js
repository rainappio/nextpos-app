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
import {StyledText} from '../components/StyledText'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import {CalendarEvent} from "../components/CalendarEvent";

class CalendarEventScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    static contextType = LocaleContext

    constructor(props, context) {
        super(props, context)
        this.state = {
            isLoading: true,
            rosterPlansData: [],
            events: props.navigation?.state?.params?.events ?? []
        }

    }


    refreshScreen = async () => {
    }

    handleAssign = (pid, eid) => {
        //if need loading pending
        //this.setState({isLoading: true})

        dispatchFetchRequest(api.roster.assign(pid, eid), {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }, response => {
            response.json().then(data => {
                let eventsArr = [...this.state.events]
                let spliceIndex = eventsArr.findIndex((item) => item?.id === data?.id)
                if (spliceIndex > -1) {
                    eventsArr.splice(spliceIndex, 1, data)
                }
                this.setState({isLoading: false, events: eventsArr})
            })
        }).then()
    }

    handleRemove = (pid, eid) => {
        //if need loading pending
        //this.setState({isLoading: true})

        dispatchFetchRequest(api.roster.remove(pid, eid), {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }, response => {
            response.json().then(data => {
                let eventsArr = [...this.state.events]
                let spliceIndex = eventsArr.findIndex((item) => item?.id === data?.id)
                if (spliceIndex > -1) {
                    eventsArr.splice(spliceIndex, 1, data)
                }
                this.setState({isLoading: false, events: eventsArr})
            })
        }).then()
    }



    render() {
        const {themeStyle} = this.props
        const {t} = this.context
        const events = this.state.events

        return (
            <ThemeContainer>
                <NavigationEvents
                    onWillFocus={() => {
                        this.refreshScreen()
                    }}
                />
                <View style={styles.fullWidthScreen}>
                    <ScreenHeader
                        parentFullScreen={true}
                        title={t('calendarEvent.screenTitle')}
                    />
                    <ThemeScrollView style={{flex: 1}}>
                        {events?.map((event) => {
                            return (
                                <CalendarEvent event={event} />
                            )
                        })}
                    </ThemeScrollView>

                </View>
            </ThemeContainer>
        )
    }
}

export default withContext(CalendarEventScreen)

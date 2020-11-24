import React from 'react'
import {FlatList, TouchableOpacity, View} from 'react-native'
import {connect} from 'react-redux'
import ScreenHeader from "../components/ScreenHeader"
import {LocaleContext} from '../locales/LocaleContext'
import AddBtn from '../components/AddBtn'
import {getCurrentClient} from '../actions/client'
import LoadingScreen from "./LoadingScreen"
import styles from '../styles'
import {ThemeScrollView} from "../components/ThemeScrollView";
import {StyledText} from "../components/StyledText";
import {api, dispatchFetchRequest} from '../constants/Backend'
import {NavigationEvents} from 'react-navigation'
import {MainActionFlexButton, DeleteFlexButton} from "../components/ActionButtons";
import DeleteBtn from '../components/DeleteBtn'

class RostersScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    static contextType = LocaleContext

    constructor(props, context) {
        super(props, context)
        this.state = {
            isLoading: false
        }
    }

    componentDidMount() {

        this.props.getCurrentClient()
        this.getPlans()
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props?.client !== prevProps?.client) {
            this.refreshScreen()
        }
    }

    refreshScreen = () => {
        this.getPlans()
    }

    getPlans = async () => {
        //if need loading pending
        //this.setState({isLoading: true})

        await dispatchFetchRequest(api.roster.getAllPlans, {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }, response => {
            response.json().then(data => {
                this.setState({rosterPlansData: data?.results ?? [], isLoading: false})
            })
        }).then()
    }

    handleCreatEvent = (id) => {
        dispatchFetchRequest(api.roster.createEvents(id), {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }, response => {
            this.refreshScreen()
        }).then()
    }

    handleDeleteEvent = (id) => {
        dispatchFetchRequest(api.roster.createEvents(id), {
            method: 'DELETE',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }, response => {

            this.refreshScreen()
        }).then()
    }

    Item = (item) => {
        return (
            <View style={styles.rowFront}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate('RostersFormScreen', {
                            data: item,
                            refreshScreen: () => {this.refreshScreen()},
                        })
                    }}
                    style={{flexDirection: 'row', justifyContent: 'space-between'}}
                >
                    <StyledText style={styles.rowFrontText}>{item?.rosterMonth}</StyledText>
                    <View style={{width: 160, padding: 4}}>
                        {item?.status === 'ACTIVE'
                            ? <MainActionFlexButton
                                title={this.context.t('roster.createEvent')}
                                onPress={() => {this.handleCreatEvent(item?.id)}} />
                            : <DeleteFlexButton
                                title={this.context.t('roster.deleteEvent')}
                                onPress={() => {this.handleDeleteEvent(item?.id)}} />
                        }
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        const {navigation, offers, isLoading} = this.props
        const {t} = this.context

        if (isLoading || this.state.isLoading) {
            return (
                <LoadingScreen />
            )
        }
        return (
            <ThemeScrollView>
                <View style={[styles.fullWidthScreen]}>
                    <NavigationEvents
                        onWillFocus={() => {
                            this.refreshScreen()
                        }}
                    />
                    <ScreenHeader title={t('settings.roster')}
                        parentFullScreen={true}
                        rightComponent={
                            <AddBtn
                                onPress={() => navigation.navigate('RostersFormScreen', {data: null, refreshScreen: this.refreshScreen, })}
                            />}
                    />
                    <FlatList
                        data={this?.state?.rosterPlansData ?? []}
                        renderItem={({item}) => this.Item(item)}
                        keyExtractor={(item) => item?.rangeIdentifier}
                        ListEmptyComponent={
                            <View>
                                <StyledText style={styles.messageBlock}>{t('general.noData')}</StyledText>
                            </View>
                        }
                    />
                </View>
            </ThemeScrollView>
        )
    }
}

const mapStateToProps = state => ({
    isLoading: state.offers.loading,
    client: state.client.data,
})

const mapDispatchToProps = dispatch => ({
    dispatch,
    getCurrentClient: () => dispatch(getCurrentClient())
})

export default connect(mapStateToProps, mapDispatchToProps)(RostersScreen)

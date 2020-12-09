import React from 'react'
import {FlatList, TouchableOpacity, View} from 'react-native'
import {connect} from 'react-redux'
import ScreenHeader from "../components/ScreenHeader"
import {LocaleContext} from '../locales/LocaleContext'
import AddBtn from '../components/AddBtn'
import {getCurrentClient} from '../actions/client'
import LoadingScreen from "./LoadingScreen"
import styles, {mainThemeColor} from '../styles'
import {ThemeScrollView} from "../components/ThemeScrollView";
import {StyledText} from "../components/StyledText";
import {api, dispatchFetchRequest} from '../constants/Backend'
import {BottomMainActionButton, MainActionButton} from "../components/ActionButtons"
import {NavigationEvents} from 'react-navigation'
import Icon from "react-native-vector-icons/Ionicons";
import {Field, reduxForm} from 'redux-form'
import InputText from '../components/InputText'
import {isRequired} from '../validators'
import StepIndicator from 'react-native-step-indicator';
import {Pages} from 'react-native-pages'
import Item from '@ant-design/react-native/lib/list/ListItem'
import {MainActionFlexButton} from "../components/ActionButtons";

class SubscriptionScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    static contextType = LocaleContext

    constructor(props, context) {
        super(props, context)
        this.state = {
            currentPosition: this.props.clientStatus?.subscription?.status === 'SUBMITTED' ? 0 : 1,
            subscription: this.props.clientStatus?.subscription,
            plans: null
        }
    }

    getCurrentSubscriptionStatus = () => {
        this.props.getCurrentClient()
        this.setState({
            subscription: this.props.clientStatus?.subscription,
            currentPosition: this.props.clientStatus?.subscription?.status === 'SUBMITTED' ? 0 : 1,
        })
    }

    getAllPlans = (country) => {
        dispatchFetchRequest(api.subscription.getAllPlans(country), {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }, response => {
            response.json().then(data => {
                this.setState({plans: data?.results})
            })
        }).then()
    }

    handleSubmit = (subscriptionPlanId) => {
        const bodyObj = {
            subscriptionPlanId: subscriptionPlanId,
            planPeriod: 'MONTHLY'
        }
        dispatchFetchRequest(api.subscription.selectPlan, {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyObj)
        }, response => {
            response.json().then(data => {
                this.refreshScreen()
            })
        }).then()
    }

    componentDidMount() {
        this.refreshScreen()
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props?.clientStatus !== prevProps?.clientStatus) {
            this.setState({
                subscription: this.props.clientStatus?.subscription,
                currentPosition: this.props.clientStatus?.subscription?.status === 'SUBMITTED' ? 0 : 1,
            })
        }
    }

    refreshScreen = () => {
        this.getCurrentSubscriptionStatus()
        this.getAllPlans(this.props?.client?.country)
    }


    render() {
        const {isLoading} = this.props
        const {themeStyle, t} = this.context
        const labels = [t('subscription.submitted'), t('subscription.activated')];
        console.log('this.state?.plans', this.state?.plans)

        if (isLoading) {
            return (
                <LoadingScreen />
            )
        }
        return (
            <ThemeScrollView>
                <View style={[styles.fullWidthScreen]}>

                    <ScreenHeader title={t('settings.subscription')}
                        parentFullScreen={true}

                    />
                    <View style={[styles.container, {justifyContent: 'flex-start'}]}>
                        <View style={{flexDirection: 'row', marginBottom: 16}}>
                            <StyledText style={{flex: 1, textAlign: 'left'}}>{t('subscription.currentPlan')}</StyledText>
                            <StyledText style={{flex: 1, textAlign: 'right'}}>{this.state?.subscription?.planName === 'FREE' ? t('subscription.planCode.FREE') : this.state?.subscription?.planName}</StyledText>
                        </View>
                        <View style={{flexDirection: 'row', marginBottom: 16}}>
                            <StyledText style={{flex: 1, textAlign: 'left'}}>{t('subscription.status')}</StyledText>
                            <StyledText style={{flex: 1, textAlign: 'right'}}>{t(`subscription.statusCode.${this.state?.subscription?.status}`)}</StyledText>
                        </View>
                        <StepIndicator
                            currentPosition={this.state.currentPosition}
                            labels={labels}
                            stepCount={2}
                            customStyles={{
                                labelColor: themeStyle.color
                            }}
                        />
                        <View style={{flex: 1}}>
                            <Pages indicatorColor={mainThemeColor} >
                                {this.state?.plans?.map((item, index) => {
                                    return (
                                        <View key={`Plan${index}`} style={{flex: 1, alignItems: 'center'}}>
                                            <View
                                                style={{flex: 1, alignItems: 'center', maxWidth: 640, borderColor: mainThemeColor, borderWidth: 1, marginVertical: 30, borderRadius: 30, padding: 15}}
                                            >
                                                <View style={{flexDirection: 'row', borderBottomWidth: 1, borderColor: mainThemeColor, paddingBottom: 15, marginBottom: 15}}>
                                                    <StyledText style={{flex: 1, textAlign: 'left'}}>{item?.planName}</StyledText>
                                                    <StyledText style={{flex: 1, textAlign: 'right'}}>${item?.planPrices?.MONTHLY}</StyledText>
                                                </View>
                                                <View style={{flexDirection: 'row', flex: 1}}>
                                                    <View style={{flex: 2, flexDirection: 'column', paddingRight: 15}}>
                                                        <StyledText style={{textAlign: 'left'}}>{item?.description}</StyledText>
                                                    </View>
                                                    <View style={{flex: 1, alignSelf: 'flex-end'}}>
                                                        <View style={{flex: 1, maxHeight: 64}}>
                                                            <MainActionFlexButton
                                                                title={t('subscription.select')}
                                                                onPress={() => {this.handleSubmit(item?.id)}} />
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })}
                            </Pages>
                        </View>
                    </View>





                </View>
            </ThemeScrollView>
        )
    }
}

const mapStateToProps = state => ({
    isLoading: state.offers.loading,
    clientStatus: state.client.data?.localClientStatus,
    client: state.client.data,
})

const mapDispatchToProps = dispatch => ({
    dispatch,
    getCurrentClient: () => dispatch(getCurrentClient())
})


export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionScreen)

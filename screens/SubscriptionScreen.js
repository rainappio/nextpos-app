import React from 'react'
import {FlatList, TouchableOpacity, View, Text} from 'react-native'
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
import Modal from 'react-native-modal';
import {ThemeContainer} from "../components/ThemeContainer";
import {MaterialCommunityIcons, FontAwesome, FontAwesome5} from '@expo/vector-icons'
import {formatDateOnly} from "../actions";

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
            plans: null,
            modalVisible: this.props?.navigation?.state?.params?.isRedirected ?? false
        }
    }

    getCurrentSubscriptionStatus = () => {
        this.props.getCurrentClient()
        dispatchFetchRequest(api.subscription.getCurrent, {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }, response => {
            response.json().then(data => {
                this.setState({
                    subscription: data,
                    currentPosition: data?.status === 'SUBMITTED' ? 0 : 1,
                })
            })
        }).then()
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
        this.context.localize({
            en: {
                subscriptionAd: {
                    firstText: '升級至進階版以解鎖更多功能',
                    secondText: '每日 $48.3 元',
                    thirdText: '$1450元 / 月',
                    part1Text: '人事管理',
                    part2Text: '進階銷售功能',
                    part3Text: '特色功能',
                }
            },
            zh: {
                subscriptionAd: {
                    firstText: '升級至進階版以解鎖更多功能',
                    secondText: '每日 $48.3 元',
                    thirdText: '$1450元 / 月',
                    part1Text: '人事管理',
                    part2Text: '進階銷售功能',
                    part3Text: '特色功能',
                }
            }
        })
    }

    refreshScreen = () => {
        this.getCurrentSubscriptionStatus()
        this.getAllPlans(this.props?.client?.country)
    }


    render() {
        const {isLoading, client} = this.props
        const {themeStyle, t} = this.context
        const labels = [t('subscription.submitted'), t('subscription.activated')]

        if (isLoading) {
            return (
                <LoadingScreen />
            )
        }
        return (
            <ThemeScrollView>
                <NavigationEvents
                    onWillFocus={() => {
                        this.refreshScreen()
                    }}
                />
                <View style={[styles.fullWidthScreen]}>

                    <ScreenHeader title={t('settings.subscription')}
                        parentFullScreen={true}

                    />
                    <Modal
                        isVisible={this.state.modalVisible}
                        backdropOpacity={0.7}
                        onBackdropPress={() => this.setState({modalVisible: false})}
                        useNativeDriver
                        hideModalContentWhileAnimating
                        animationIn='bounceIn'
                        animationOut='bounceOut'
                        style={{alignSelf: 'center', maxWidth: 640, width: '80%'}}
                    >
                        <View style={[themeStyle, {borderRadius: 20, flex: 1}]}>
                            <Pages indicatorColor={mainThemeColor}>
                                <View style={{flex: 1, borderColor: mainThemeColor, borderBottomWidth: 1, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', alignContent: 'center', paddingBottom: 16}}>
                                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
                                        <StyledText style={{fontSize: 20}}>{t('subscriptionAd.part1Text')}</StyledText>
                                    </View>
                                    <View style={{flex: 3, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center'}}>
                                        {client?.clientSubscriptionAccess?.restrictedFeatures?.includes('timeCard') &&
                                            <View style={{flexDirection: 'column', margin: 16}}><FontAwesome
                                                name="clock-o"
                                                size={40}
                                                style={[styles.buttonIconStyle, {marginBottom: 8}]}
                                            />
                                                <StyledText>{t('menu.timecard')}</StyledText>
                                            </View>}
                                        {client?.clientSubscriptionAccess?.restrictedFeatures?.includes('timeCardReport') &&
                                            <View style={{flexDirection: 'column', margin: 16}}><Icon
                                                name="md-time"
                                                size={40}
                                                style={[styles.buttonIconStyle, {marginBottom: 8}]}
                                            />
                                                <StyledText>{t('staffTimeCardReport')}</StyledText>
                                            </View>}
                                        {client?.clientSubscriptionAccess?.restrictedFeatures?.includes('staff') &&
                                            <View style={{flexDirection: 'column', margin: 16}}><Icon
                                                name="ios-people"
                                                size={40}
                                                style={[styles.buttonIconStyle, {marginBottom: 8}]}
                                            />
                                                <StyledText>{t('settings.staff')}</StyledText>
                                            </View>}

                                    </View>
                                </View>

                                <View style={{flex: 1, borderColor: mainThemeColor, borderBottomWidth: 1, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', alignContent: 'center', paddingBottom: 16}}>
                                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
                                        <StyledText style={{fontSize: 20}}>{t('subscriptionAd.part2Text')}</StyledText>
                                    </View>
                                    <View style={{flex: 3, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center'}}>

                                        {client?.clientSubscriptionAccess?.restrictedFeatures?.includes('orderDisplay') && <View style={{flexDirection: 'column', margin: 16}}>
                                            <MaterialCommunityIcons
                                                name="pot-steam"
                                                size={40}
                                                style={[styles.buttonIconStyle, {marginBottom: 8}]}
                                            />
                                            <StyledText>{t('menu.orderDisplay')}</StyledText>
                                        </View>}
                                        {client?.clientSubscriptionAccess?.restrictedFeatures?.includes('salesReport') &&
                                            <View style={{flexDirection: 'column', margin: 16}}><FontAwesome
                                                name="bar-chart"
                                                size={40}
                                                style={[styles.buttonIconStyle, {marginBottom: 8}]}
                                            />
                                                <StyledText>{t('salesReport')}</StyledText>
                                            </View>}
                                        {client?.clientSubscriptionAccess?.restrictedFeatures?.includes('customerStats') &&
                                            <View style={{flexDirection: 'column', margin: 16}}><Icon
                                                name="md-trending-up"
                                                size={40}
                                                style={[styles.buttonIconStyle, {marginBottom: 8}]}
                                            />
                                                <StyledText>{t('customerStatsReport')}</StyledText>
                                            </View>}

                                        {client?.clientSubscriptionAccess?.restrictedFeatures?.includes('einvoice') &&
                                            <View style={{flexDirection: 'column', margin: 16}}><FontAwesome5
                                                name="file-invoice-dollar"
                                                size={40}
                                                style={[styles.buttonIconStyle, {marginBottom: 8}]}
                                            />
                                                <StyledText>{t('settings.eInvoice')}</StyledText>
                                            </View>}

                                    </View>
                                </View>

                                <View style={{flex: 1, borderColor: mainThemeColor, borderBottomWidth: 1, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', alignContent: 'center', paddingBottom: 16}}>
                                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
                                        <StyledText style={{fontSize: 20}}>{t('subscriptionAd.part3Text')}</StyledText>
                                    </View>
                                    <View style={{flex: 3, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center'}}>

                                        {client?.clientSubscriptionAccess?.restrictedFeatures?.includes('membership') &&
                                            <View style={{flexDirection: 'column', margin: 16}}><FontAwesome5
                                                name="user-cog"
                                                size={40}
                                                style={[styles.buttonIconStyle, {marginBottom: 8}]}
                                            />
                                                <StyledText>{t('settings.member')}</StyledText>
                                            </View>}
                                        {client?.clientSubscriptionAccess?.restrictedFeatures?.includes('calendar') &&
                                            <View style={{flexDirection: 'column', margin: 16}}><Icon
                                                name="md-calendar"
                                                size={40}
                                                style={[styles.buttonIconStyle, {marginBottom: 8}]}
                                            />
                                                <StyledText>{t('calendarEvent.screenTitle')}</StyledText>
                                            </View>}

                                        {client?.clientSubscriptionAccess?.restrictedFeatures?.includes('roster') &&
                                            <View style={{flexDirection: 'column', margin: 16}}><FontAwesome5
                                                name="business-time"
                                                size={40}
                                                style={[styles.buttonIconStyle, {marginBottom: 8}]}
                                            />
                                                <StyledText>{t('settings.roster')}</StyledText>
                                            </View>}

                                    </View>
                                </View>
                            </Pages>
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-evenly', flexWrap: 'wrap', alignContent: 'center'}}>
                                <StyledText>{t('subscriptionAd.firstText')}</StyledText>
                                <View style={{alignItems: 'center', }}>
                                    <StyledText style={{fontSize: 40, fontWeight: 'bold'}}>{t('subscriptionAd.secondText')}</StyledText>
                                    <StyledText>{t('subscriptionAd.thirdText')}</StyledText>
                                </View>
                                <TouchableOpacity
                                    onPress={() => this.setState({modalVisible: false})}
                                    style={{width: '100%', maxWidth: 250}}
                                >
                                    <Text style={[styles.bottomActionButton, styles.actionButton]}>
                                        {t('action.ok')}
                                    </Text>

                                </TouchableOpacity>
                            </View>

                        </View>
                    </Modal>
                    <View style={[styles.container, {justifyContent: 'flex-start', marginTop: 0, marginBottom: 0}]}>
                        <View style={{flexDirection: 'row', marginBottom: 16, maxWidth: 640, alignSelf: 'center'}}>
                            <StyledText style={{flex: 1, textAlign: 'left'}}>{t('subscription.currentPlan')}</StyledText>
                            <StyledText style={{flex: 1, textAlign: 'right'}}>{this.state?.subscription?.planName === 'FREE' ? t('subscription.planCode.FREE') : this.state?.subscription?.planName}</StyledText>
                        </View>
                        <View style={{flexDirection: 'row', marginBottom: 16, maxWidth: 640, alignSelf: 'center'}}>
                            <StyledText style={{flex: 1, textAlign: 'left'}}>{t('subscription.status')}</StyledText>
                            <StyledText style={{flex: 1, textAlign: 'right'}}>{t(`subscription.statusCode.${this.state?.subscription?.status}`)}</StyledText>
                        </View>
                        <View style={{flexDirection: 'row', marginBottom: 16, maxWidth: 640, alignSelf: 'center'}}>
                            <StyledText style={{flex: 1, textAlign: 'left'}}>{t('subscription.planStartDate')}</StyledText>
                            <StyledText style={{flex: 1, textAlign: 'right'}}>{formatDateOnly(this.state?.subscription?.planStartDate)}</StyledText>
                        </View>
                        <View style={{flexDirection: 'row', marginBottom: 16, maxWidth: 640, alignSelf: 'center'}}>
                            <StyledText style={{flex: 1, textAlign: 'left'}}>{t('subscription.planEndDate')}</StyledText>
                            <StyledText style={{flex: 1, textAlign: 'right'}}>{formatDateOnly(this.state?.subscription?.planEndDate)}</StyledText>
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

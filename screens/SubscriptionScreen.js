import React from 'react'
import {FlatList, TouchableOpacity, View, Text, ScrollView} from 'react-native'
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
import {BottomMainActionButton, MainActionButton} from "../components/ActionButtons"
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
import {PurePopUp} from '../components/PopUp'
import {WebView} from 'react-native-webview'
import {CheckBox} from 'react-native-elements'


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
            modalVisible: this.props?.route?.params?.isRedirected ?? false,
            agreeModalVisible: false,
            agreeModalId: null,
            changeStatusModalVisible: false,
            isAgreeTerms: false,
            isAgreeTipVisible: false
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
                'Content-Type': 'application/json',
                'x-api-key': 'Sjl5KBZFV1qurEHjVlKZKG5z6aeYR8yd'
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

    handleLapse = () => {
        dispatchFetchRequest(api.subscription.lapse, {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        }, response => {
            response.json().then(data => {
                this.refreshScreen()
            })
        }).then()
    }

    handleCancel = () => {
        dispatchFetchRequest(api.subscription.cancel, {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
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
                    agreeSub: '同意接受服務條款'
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
                    agreeSub: '同意接受服務條款'
                }
            }
        })

        this._refreshScreen = this.props.navigation.addListener('focus', () => {
            this.refreshScreen()
        })
    }
    componentWillUnmount() {
        this._refreshScreen()
    }

    refreshScreen = () => {
        this.getCurrentSubscriptionStatus()
        this.getAllPlans(this.props?.client?.country)
    }



    render() {
        const {isLoading, client, clientStatus} = this.props
        const {themeStyle, t, customMainThemeColor, customBackgroundColor} = this.context
        const labels = [t('subscription.submitted'), t('subscription.activated')]

        if (isLoading) {
            return (
                <LoadingScreen />
            )
        }
        return (
            <ThemeContainer>
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
                            <Pages indicatorColor={customMainThemeColor}>
                                <View style={{flex: 1, borderColor: customMainThemeColor, borderBottomWidth: 1, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', alignContent: 'center', paddingBottom: 16}}>
                                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
                                        <StyledText style={{fontSize: 20}}>{t('subscriptionAd.part1Text')}</StyledText>
                                    </View>
                                    <View style={{flex: 3, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center'}}>
                                        {client?.clientSubscriptionAccess?.restrictedFeatures?.includes('timeCard') &&
                                            <View style={{flexDirection: 'column', margin: 16}}><FontAwesome
                                                name="clock-o"
                                                size={40}
                                                style={[styles?.buttonIconStyle(customMainThemeColor), {marginBottom: 8}]}
                                            />
                                                <StyledText>{t('menu.timecard')}</StyledText>
                                            </View>}
                                        {client?.clientSubscriptionAccess?.restrictedFeatures?.includes('timeCardReport') &&
                                            <View style={{flexDirection: 'column', margin: 16}}><Icon
                                                name="md-time"
                                                size={40}
                                                style={[styles?.buttonIconStyle(customMainThemeColor), {marginBottom: 8}]}
                                            />
                                                <StyledText>{t('staffTimeCardReport')}</StyledText>
                                            </View>}
                                        {client?.clientSubscriptionAccess?.restrictedFeatures?.includes('staff') &&
                                            <View style={{flexDirection: 'column', margin: 16}}><Icon
                                                name="ios-people"
                                                size={40}
                                                style={[styles?.buttonIconStyle(customMainThemeColor), {marginBottom: 8}]}
                                            />
                                                <StyledText>{t('settings.staff')}</StyledText>
                                            </View>}

                                    </View>
                                </View>

                                <View style={{flex: 1, borderColor: customMainThemeColor, borderBottomWidth: 1, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', alignContent: 'center', paddingBottom: 16}}>
                                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
                                        <StyledText style={{fontSize: 20}}>{t('subscriptionAd.part2Text')}</StyledText>
                                    </View>
                                    <View style={{flex: 3, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center'}}>

                                        {client?.clientSubscriptionAccess?.restrictedFeatures?.includes('orderDisplay') && <View style={{flexDirection: 'column', margin: 16}}>
                                            <MaterialCommunityIcons
                                                name="pot-steam"
                                                size={40}
                                                style={[styles?.buttonIconStyle(customMainThemeColor), {marginBottom: 8}]}
                                            />
                                            <StyledText>{t('menu.orderDisplay')}</StyledText>
                                        </View>}
                                        {client?.clientSubscriptionAccess?.restrictedFeatures?.includes('salesReport') &&
                                            <View style={{flexDirection: 'column', margin: 16}}><FontAwesome
                                                name="bar-chart"
                                                size={40}
                                                style={[styles?.buttonIconStyle(customMainThemeColor), {marginBottom: 8}]}
                                            />
                                                <StyledText>{t('salesReport')}</StyledText>
                                            </View>}
                                        {client?.clientSubscriptionAccess?.restrictedFeatures?.includes('customerStats') &&
                                            <View style={{flexDirection: 'column', margin: 16}}><Icon
                                                name="md-trending-up"
                                                size={40}
                                                style={[styles?.buttonIconStyle(customMainThemeColor), {marginBottom: 8}]}
                                            />
                                                <StyledText>{t('customerStatsReport')}</StyledText>
                                            </View>}

                                        {client?.clientSubscriptionAccess?.restrictedFeatures?.includes('einvoice') &&
                                            <View style={{flexDirection: 'column', margin: 16}}><FontAwesome5
                                                name="file-invoice-dollar"
                                                size={40}
                                                style={[styles?.buttonIconStyle(customMainThemeColor), {marginBottom: 8}]}
                                            />
                                                <StyledText>{t('settings.eInvoice')}</StyledText>
                                            </View>}

                                    </View>
                                </View>

                                <View style={{flex: 1, borderColor: customMainThemeColor, borderBottomWidth: 1, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', alignContent: 'center', paddingBottom: 16}}>
                                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
                                        <StyledText style={{fontSize: 20}}>{t('subscriptionAd.part3Text')}</StyledText>
                                    </View>
                                    <View style={{flex: 3, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center'}}>

                                        {client?.clientSubscriptionAccess?.restrictedFeatures?.includes('membership') &&
                                            <View style={{flexDirection: 'column', margin: 16}}><FontAwesome5
                                                name="user-cog"
                                                size={40}
                                                style={[styles?.buttonIconStyle(customMainThemeColor), {marginBottom: 8}]}
                                            />
                                                <StyledText>{t('settings.member')}</StyledText>
                                            </View>}
                                        {client?.clientSubscriptionAccess?.restrictedFeatures?.includes('calendar') &&
                                            <View style={{flexDirection: 'column', margin: 16}}><Icon
                                                name="md-calendar"
                                                size={40}
                                                style={[styles?.buttonIconStyle(customMainThemeColor), {marginBottom: 8}]}
                                            />
                                                <StyledText>{t('calendarEvent.screenTitle')}</StyledText>
                                            </View>}

                                        {client?.clientSubscriptionAccess?.restrictedFeatures?.includes('roster') &&
                                            <View style={{flexDirection: 'column', margin: 16}}><FontAwesome5
                                                name="business-time"
                                                size={40}
                                                style={[styles?.buttonIconStyle(customMainThemeColor), {marginBottom: 8}]}
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
                                    <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                                        {t('action.ok')}
                                    </Text>

                                </TouchableOpacity>
                            </View>

                        </View>
                    </Modal>
                    <Modal
                        isVisible={this.state.agreeModalVisible}
                        backdropOpacity={0.7}
                        onBackdropPress={() => this.setState({agreeModalVisible: false})}
                        useNativeDriver
                        hideModalContentWhileAnimating
                        animationIn='bounceIn'
                        animationOut='bounceOut'
                        style={{alignSelf: 'center', maxWidth: 640, width: '80%'}}
                    >
                        <View style={[{backgroundColor: customBackgroundColor, borderRadius: 20, flex: 8, flexDirection: 'column'}]}>
                            <View style={{flex: 6.5}}>
                                <WebView style={{borderTopLeftRadius: 20, borderTopRightRadius: 20}} source={{uri: 'https://www.rain-app.io/privacy-1'}} />

                            </View>
                            <View style={{flex: 1, paddingHorizontal: 10, justifyContent: 'center', alignContent: 'center'}}>
                                <View style={[styles.list, {alignContent: 'center', paddingTop: 0}]}>
                                    <View>

                                        <CheckBox
                                            checkedIcon={'check-circle'}
                                            uncheckedIcon={'circle'}
                                            checked={this.state?.isAgreeTerms}
                                            containerStyle={{margin: 0, padding: 0, minWidth: 0}}
                                            onPress={() => {
                                                this.setState({isAgreeTerms: !this.state?.isAgreeTerms, isAgreeTipVisible: !this.state?.isAgreeTipVisible})
                                            }}
                                        >
                                        </CheckBox>
                                    </View>
                                    <View style={[styles.list]}>
                                        <StyledText style={[styles.screenSubTitle(customMainThemeColor), {lineHeight: 24}]}>
                                            {t('subscriptionAd.agreeSub')}
                                        </StyledText>
                                        {!!this.state.isAgreeTipVisible && <StyledText style={[styles.rootError, {textAlign: 'left', marginTop: 8}]}>
                                            {t('errors.required')}
                                        </StyledText>}

                                    </View>
                                </View>
                            </View>
                            <View style={{justifyContent: 'flex-end', flex: 0.5}}>
                                <View style={{height: 64, padding: 10, margin: 10}}>
                                    <MainActionFlexButton
                                        title={t('action.submit')}
                                        onPress={() => {
                                            if (!this.state?.isAgreeTerms) {
                                                this.setState({isAgreeTipVisible: true})

                                            } else {
                                                this.setState({agreeModalVisible: false, isAgreeTipVisible: false})
                                                this.handleSubmit(this.state?.agreeModalId)
                                            }
                                        }} />
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <View style={[styles.container, {justifyContent: 'flex-start', marginTop: 0, marginBottom: 0}]}>
                        <View style={{flexDirection: 'row', marginBottom: 16, maxWidth: 640, alignSelf: 'center'}}>
                            <StyledText style={{flex: 1, textAlign: 'left'}}>{t('subscription.currentPlan')}</StyledText>
                            <StyledText style={{flex: 1, textAlign: 'right'}}>{this.state?.subscription?.planName === 'planName.free' ? t('subscription.planCode.FREE') : this.state?.subscription?.planName}</StyledText>
                        </View>
                        <View style={{flexDirection: 'row', marginBottom: 16, maxWidth: 640, alignSelf: 'center'}}>
                            <StyledText style={{flex: 1, textAlign: 'left'}}>{t('subscription.status')}</StyledText>
                            <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
                                {['SUBMITTED', 'ACTIVE_RENEWING', 'ACTIVE'].includes(this.state?.subscription?.status) && <PurePopUp
                                    title={t('subscription.changeStatus')}
                                    icon={<Icon name="md-create" size={20} color={customMainThemeColor} />}
                                    isVisible={this.state.changeStatusModalVisible}
                                    toggleModal={(visible) => this.setState({changeStatusModalVisible: visible})}
                                >
                                    <View
                                        style={{width: '100%', paddingHorizontal: 5}}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (this.state?.subscription?.status === 'SUBMITTED') {
                                                    this.handleCancel()
                                                    this.setState({changeStatusModalVisible: false})
                                                } else {
                                                    this.handleLapse()
                                                    this.setState({changeStatusModalVisible: false})
                                                }
                                            }}
                                        >
                                            <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                                                {this.state?.subscription?.status === 'SUBMITTED' ? t('subscription.action.cancel') : t('subscription.action.lapse')}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </PurePopUp>}
                                <StyledText style={{textAlign: 'right'}}>{t(`subscription.statusCode.${this.state?.subscription?.status}`)}</StyledText>
                            </View>
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
                            <Pages indicatorColor={customMainThemeColor} >
                                {this.state?.plans?.map((item, index) => {
                                    return (
                                        <View key={`Plan${index}`} style={{flex: 1, alignItems: 'center'}}>
                                            <View
                                                style={{flex: 1, alignItems: 'center', maxWidth: 640, borderColor: customMainThemeColor, borderWidth: 1, marginVertical: 30, borderRadius: 30, padding: 15}}
                                            >
                                                <View style={{flexDirection: 'row', borderBottomWidth: 1, borderColor: customMainThemeColor, paddingBottom: 15, marginBottom: 15}}>
                                                    <StyledText style={{flex: 1, textAlign: 'left'}}>{item?.planName}</StyledText>
                                                    <StyledText style={{flex: 1, textAlign: 'right'}}>${item?.planPrices?.MONTHLY}</StyledText>
                                                </View>
                                                <View style={{flexDirection: 'row', flex: 1}}>
                                                    <View style={{flex: 2, flexDirection: 'column', paddingRight: 15}}><ScrollView>
                                                        <StyledText style={{textAlign: 'left'}}>{item?.description}</StyledText>
                                                    </ScrollView>
                                                    </View>
                                                    {(this.state?.subscription?.status === 'ACTIVE' && this.state?.subscription?.subscriptionPlanId === item?.id) || <View style={{flex: 1, alignSelf: 'flex-end'}}>
                                                        <View style={{flex: 1, maxHeight: 64}}>
                                                            <MainActionFlexButton
                                                                title={t('subscription.select')}
                                                                onPress={() => {
                                                                    this.setState({agreeModalVisible: true, agreeModalId: item?.id})
                                                                }} />
                                                        </View>
                                                    </View>}
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })}
                            </Pages>
                        </View>
                    </View>





                </View>
            </ThemeContainer>
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

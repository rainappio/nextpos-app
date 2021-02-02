import React from 'react'
import {FlatList, TouchableOpacity, View, Text, Dimensions} from 'react-native'
import {connect} from 'react-redux'
import {Field, reduxForm} from 'redux-form'
import ScreenHeader from "../components/ScreenHeader"
import {LocaleContext} from '../locales/LocaleContext'
import AddBtn from '../components/AddBtn'
import {getCurrentClient} from '../actions/client'
import LoadingScreen from "./LoadingScreen"
import styles, {mainThemeColor} from '../styles'
import {ThemeScrollView} from "../components/ThemeScrollView";
import {StyledText} from "../components/StyledText";
import {api, dispatchFetchRequest, dispatchFetchRequestWithOption, successMessage, warningMessage} from '../constants/Backend'
import {NavigationEvents} from 'react-navigation'
import {MainActionFlexButton, DeleteFlexButton} from "../components/ActionButtons";
import DeleteBtn from '../components/DeleteBtn'
import {ThemeContainer} from "../components/ThemeContainer";
import {SearchBar, Button} from "react-native-elements";
import Icon from 'react-native-vector-icons/Ionicons'
import InputText from '../components/InputText'
import {isRequired} from '../validators'
import SegmentedControl from "../components/SegmentedControl";
import {RenderDatePicker} from '../components/DateTimePicker'
import moment from 'moment-timezone'
import TimeZoneService from "../helpers/TimeZoneService";
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";
import {Accordion} from '@ant-design/react-native'
import {formatDate} from '../actions'
import Modal from 'react-native-modal';
import OrderDetail from './OrderDetail';

class MemberFormScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    static contextType = LocaleContext

    constructor(props, context) {
        super(props, context)


        this.state = {
            data: props.navigation?.state?.params?.data ?? null,
            showDatePicker: false,
            activeSections: [],
            modalVisible: false,
            modalOrderId: null,
        }
    }


    onActiveSectionsChange = activeSections => {
        this.setState({activeSections})
    }




    handleSubmit = (values, memId = null) => {

        const timezone = TimeZoneService.getTimeZone()
        const i18nMoment = moment(values?.birthday).tz(timezone)
        if (!!memId) {
            let request = {
                name: values?.name,
                phoneNumber: values?.phoneNumber,
                birthday: i18nMoment.tz(timezone).format("YYYY-MM-DD"),
                gender: values?.gender === 0 ? 'MALE' : 'FEMALE',
                tags: [values?.tags],
            }
            dispatchFetchRequestWithOption(api.membership.update(memId), {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request)
            }, {
                defaultMessage: true
            }, response => {

                response.json().then(data => {
                    this.props.navigation?.state?.params?.refreshScreen()
                    this.props.navigation.goBack()
                })
            }).then()
        } else {
            let request = {
                name: values?.name,
                phoneNumber: values?.phoneNumber,
                birthday: i18nMoment.tz(timezone).format("YYYY-MM-DD"),
                gender: values?.gender === 0 ? 'MALE' : 'FEMALE',
                tags: [values?.tags],
            }
            dispatchFetchRequestWithOption(api.membership.creat, {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request)
            }, {
                defaultMessage: true
            }, response => {
                response.json().then(data => {
                    this.props.navigation?.state?.params?.refreshScreen()
                    this.props.navigation.goBack()
                })

            }).then()
        }


    }

    handleDeleteMember = (id) => {
        dispatchFetchRequestWithOption(api.membership.deleteById(id), {
            method: 'DELETE',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }, {
            defaultMessage: true
        }, response => {

            this.props.navigation?.state?.params?.refreshScreen()
            this.props.navigation.goBack()
        }).then()
    }


    render() {
        const {t, themeStyle} = this.context
        const {handleSubmit} = this.props


        return (

            <ThemeContainer>
                <View style={styles.container}>
                    <View style={{flex: 7, }}>
                        <ScreenHeader title={t('settings.member')} />
                        <Modal
                            isVisible={this.state.modalVisible}
                            backdropOpacity={0.7}
                            onBackdropPress={() => this.setState({modalVisible: false})}
                            useNativeDriver
                            hideModalContentWhileAnimating
                        >
                            <OrderDetail orderId={this.state?.modalOrderId} closeModal={() => this.setState({modalVisible: false})} />
                        </Modal>
                        <ThemeKeyboardAwareScrollView style={{flex: 1}}>

                            <View style={{flex: 3, paddingHorizontal: 10, justifyContent: 'flex-start'}}>
                                <View style={{minHeight: 200, flex: 1}}>
                                    <View style={styles.fieldContainer}>
                                        <View style={[styles.tableCellView, {flex: 1}]}>
                                            <StyledText style={styles.fieldTitle}>{t('member.name')}</StyledText>
                                        </View>
                                        <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                                            <Field
                                                name="name"
                                                component={InputText}
                                                placeholder={t('member.name')}
                                                editable={true}
                                                validate={[isRequired]}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.fieldContainer}>
                                        <View style={[styles.tableCellView, {flex: 1}]}>
                                            <StyledText style={styles.fieldTitle}>{t('member.phoneNumber')}</StyledText>
                                        </View>
                                        <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                                            <Field
                                                name="phoneNumber"
                                                component={InputText}
                                                placeholder={t('member.phoneNumber')}
                                                editable={!this.state?.data}
                                                validate={[isRequired]}
                                            />
                                        </View>
                                    </View>


                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <View style={{flex: 1}}>
                                            <StyledText style={styles.fieldTitle}>{t('member.gender')}</StyledText>
                                        </View>
                                        <View style={{flexDirection: 'column', flex: 3, maxWidth: 640, paddingVertical: 10, }}>
                                            <Field
                                                name="gender"
                                                component={SegmentedControl}
                                                values={[t(`member.MALE`), t(`member.FEMALE`)]}
                                                validate={[isRequired]}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.fieldContainer}>
                                        <View style={[styles.tableCellView, {flex: 1}]}>
                                            <StyledText style={styles.fieldTitle}>{t('member.birthday')}</StyledText>
                                        </View>
                                        <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>

                                            <Field
                                                name={`birthday`}
                                                component={RenderDatePicker}
                                                mode='date'
                                                onChange={(date) => {}}
                                                placeholder={t('order.fromDate')}
                                                isShow={this.state.showDatePicker ?? false}
                                                showDatepicker={() => this.setState({showDatePicker: !this.state?.showDatePicker})}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.fieldContainer}>
                                        <View style={[styles.tableCellView, {flex: 1}]}>
                                            <StyledText style={styles.fieldTitle}>{t('member.tags')}</StyledText>
                                        </View>
                                        <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                                            <Field
                                                name="tags"
                                                component={InputText}
                                                placeholder={t('member.tags')}
                                                editable={true}
                                            />
                                        </View>
                                    </View>

                                    {!!this.state?.data && <View style={styles.fieldContainer}>
                                        <Accordion
                                            onChange={this.onActiveSectionsChange}
                                            activeSections={this.state.activeSections}
                                            style={[styles.childContainer, {borderWidth: 0}]}
                                            sectionContainerStyle={{
                                                borderWidth: 1, ...themeStyle,
                                                marginBottom: 8
                                            }}
                                            expandMultiple
                                        >
                                            <Accordion.Panel
                                                header={<View style={[styles.sectionTitleContainer, {flex: 1}]}>
                                                    <StyledText style={[styles.sectionTitleText]}>
                                                        {t('member.recentOrders')}
                                                    </StyledText>
                                                </View>}
                                            >
                                                <View>
                                                    {this.state?.data?.recentOrders?.map((order) => {
                                                        return (
                                                            <TouchableOpacity
                                                                onPress={() => this.setState({modalVisible: true, modalOrderId: order?.orderId})}
                                                                style={[styles.tableRowContainer, {borderColor: mainThemeColor, borderWidth: 1, borderRadius: 10, margin: 5}]}>

                                                                <View style={[styles.tableCellView, {flex: 1}]}>
                                                                    <StyledText>{formatDate(order.orderDate)}</StyledText>
                                                                </View>
                                                                <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                                                                    <StyledText>${order.orderTotal}</StyledText>
                                                                </View>

                                                            </TouchableOpacity>
                                                        )
                                                    })}
                                                </View>
                                            </Accordion.Panel>
                                            <Accordion.Panel
                                                header={<View style={[styles.sectionTitleContainer, {flex: 1}]}>
                                                    <StyledText style={[styles.sectionTitleText]}>
                                                        {t('member.topRankings')}
                                                    </StyledText>
                                                </View>}
                                            >
                                                <View>
                                                    <View style={styles.sectionContainer}>
                                                        {this.state?.data?.topRankings?.map((item) => {
                                                            return (
                                                                <View style={[styles.tableRowContainer]}>

                                                                    <View style={[styles.tableCellView, {flex: 1}]}>
                                                                        <StyledText>{item.productName}</StyledText>
                                                                    </View>
                                                                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                                                                        <StyledText>x {item.quantity}</StyledText>
                                                                    </View>

                                                                </View>
                                                            )
                                                        })}
                                                    </View>
                                                </View>
                                            </Accordion.Panel>
                                        </Accordion>
                                    </View>}



                                </View>

                            </View>
                            <View style={[{flex: 1, justifyContent: 'flex-end', }]}>
                                <TouchableOpacity
                                    onPress={handleSubmit(data => {
                                        this.handleSubmit(data, this.state?.data?.id)
                                    })}
                                >
                                    <Text style={[styles.bottomActionButton, styles.actionButton]}>
                                        {t('action.save')}
                                    </Text>

                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.goBack()
                                    }}
                                >
                                    <Text style={[styles.bottomActionButton, styles.cancelButton]}>
                                        {t('action.cancel')}
                                    </Text>
                                </TouchableOpacity>

                                {!!this.state?.data && <DeleteBtn handleDeleteAction={() => this.handleDeleteMember(this.state?.data?.id)} />}
                            </View>

                        </ThemeKeyboardAwareScrollView>
                    </View>



                </View>
            </ThemeContainer>

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

MemberFormScreen = reduxForm({
    form: 'memberForm'
})(MemberFormScreen)

export default connect(mapStateToProps, mapDispatchToProps)(MemberFormScreen)

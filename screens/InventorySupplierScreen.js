import React from 'react'
import {FlatList, TouchableOpacity, View, Text, Dimensions} from 'react-native'
import {connect} from 'react-redux'
import {Field, reduxForm} from 'redux-form'
import ScreenHeader from "../components/ScreenHeader"
import {LocaleContext} from '../locales/LocaleContext'
import AddBtn from '../components/AddBtn'
import {getCurrentClient} from '../actions/client'
import LoadingScreen from "./LoadingScreen"
import styles from '../styles'
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
import {Accordion} from '@ant-design/react-native'
import {formatDate} from '../actions'
import Modal from 'react-native-modal';
import OrderDetail from './OrderDetail';

class InventoryOrderScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    static contextType = LocaleContext

    constructor(props, context) {
        super(props, context)
        this.state = {
            isLoading: false,
            screenMode: 'normal',
            membersData: [],
            searchKeyword: null,
            searching: false,
            searchResults: [],
            itemData: null,
            showDatePicker: false,
            activeSections: [],
            modalVisible: false,
            modalOrderId: null,
        }

    }

    componentDidMount() {

        this.props.getCurrentClient()
        this.getMembers()
    }



    refreshScreen = () => {
        this.setState({
            screenMode: 'normal',
            itemData: null,
            showDatePicker: false,
        })
        this.getMembers()
        this.props?.reset()
    }


    getMembers = async () => {
        //if need loading pending


        await dispatchFetchRequest(api.membership.getMembers, {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }, response => {
            response.json().then(data => {
                this.setState({membersData: data?.results ?? [], isLoading: false})
            })
        }).then()
    }

    searchMember = (keyword) => {
        if (keyword !== '') {
            this.setState({searching: true})

            dispatchFetchRequest(api.membership.getByPhone(keyword), {
                method: 'GET',
                withCredentials: true,
                credentials: 'include',
                headers: {}
            }, response => {
                response.json().then(data => {
                    this.setState({
                        searchResults: data.results,
                        searching: false
                    })
                })
            }).then()
        }

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
                    this.refreshScreen()
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
                    this.refreshScreen()
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

            this.refreshScreen()
        }).then()
    }

    handleGetMember = (id) => {
        dispatchFetchRequest(api.membership.get(id), {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {}
        }, response => {
            response.json().then(data => {
                if (this.context.isTablet) {

                    this.setState({screenMode: 'editForm', itemData: data})
                }
                else {
                    this.props.navigation.navigate('MemberFormScreen', {
                        data: data,
                        refreshScreen: () => {this.refreshScreen()},
                    })
                }
            })
        }).then()
    }
    onActiveSectionsChange = activeSections => {
        this.setState({activeSections})
    }



    Item = (item, isSearch = false) => {
        return (
            <View style={[styles.rowFront, isSearch && {borderBottomColor: this.contetx?.customMainThemeColor}]}>
                <TouchableOpacity
                    onPress={() => {
                        this.props?.change(`name`, item?.name)
                        this.props?.change(`phoneNumber`, item?.phoneNumber)
                        this.props?.change(`birthday`, new Date(item?.birthday))
                        this.props?.change(`gender`, item?.gender === 'FEMALE' ? 1 : 0)
                        this.props?.change(`tags`, item?.tags?.[0])
                        this.handleGetMember(item?.id)

                    }}
                    style={{flexDirection: 'row', justifyContent: 'space-between'}}
                >
                    <StyledText style={styles.rowFrontText}>{item?.name}</StyledText>

                </TouchableOpacity>
            </View >
        );
    }

    render() {
        const {navigation, offers, isLoading, handleSubmit} = this.props
        const {t, isTablet, themeStyle, customMainThemeColor, customBackgroundColor} = this.context

        if (isLoading || this.state.isLoading) {
            return (
                <LoadingScreen />
            )
        } else {
            if (isTablet) {
                return (
                    <ThemeContainer>
                        <View style={[styles.fullWidthScreen]}>
                            <NavigationEvents
                                onWillFocus={() => {
                                    this.refreshScreen()
                                }}
                            />
                            <ScreenHeader title={t('settings.member')}
                                parentFullScreen={true}

                            />
                            <Modal
                                isVisible={this.state.modalVisible}
                                backdropOpacity={0.7}
                                onBackdropPress={() => this.setState({modalVisible: false})}
                                useNativeDriver
                                hideModalContentWhileAnimating
                            >
                                <OrderDetail orderId={this.state?.modalOrderId} closeModal={() => this.setState({modalVisible: false})} />
                            </Modal>
                            <View style={{flexDirection: 'row', flex: 1}}>
                                <View style={{flex: 1, borderRightWidth: 1, borderColor: customMainThemeColor, paddingRight: 3}}>
                                    <SearchBar placeholder={t('member.searchPrompt')}
                                        onChangeText={this.searchMember}
                                        onClear={() => {
                                            this.setState({searchResults: []})
                                        }}
                                        value={this.state.searchKeyword}
                                        showLoading={this.state.searching}
                                        lightTheme={false}
                                        // reset the container style.
                                        containerStyle={{
                                            padding: 4,
                                            borderRadius: 0,
                                            borderWidth: 0,
                                            borderTopWidth: 0,
                                            borderBottomWidth: 0,
                                            backgroundColor: customMainThemeColor
                                        }}
                                        inputStyle={{backgroundColor: customBackgroundColor}}
                                        inputContainerStyle={{borderRadius: 0, backgroundColor: customBackgroundColor}}
                                    />

                                    {this.state.searchResults?.length === 0 || <FlatList
                                        style={{maxHeight: Dimensions.get('window').height / 3, paddingBottom: 1}}
                                        data={this.state.searchResults}
                                        renderItem={({item}) => this.Item(item, true)}
                                    />}

                                    {this.state.searchResults?.length === 0 && <FlatList
                                        data={this?.state?.membersData ?? []}
                                        renderItem={({item}) => this.Item(item)}
                                        keyExtractor={(item) => item?.id}
                                        ListEmptyComponent={
                                            <View>
                                                <StyledText style={styles.messageBlock}>{t('general.noData')}</StyledText>
                                            </View>
                                        }
                                    />}

                                </View>

                                {this.state.screenMode === 'normal' && <View style={{flex: 3, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center'}}>
                                    <Button
                                        icon={
                                            <Icon name="md-add" size={32} color={customMainThemeColor} />
                                        }
                                        type='outline'
                                        raised
                                        onPress={() => this.setState({screenMode: 'newForm'})}
                                        buttonStyle={{minWidth: 320, borderColor: customMainThemeColor, backgroundColor: customBackgroundColor}}
                                        title={t('member.createMember')}
                                        titleStyle={{marginLeft: 10, color: customMainThemeColor}}
                                    />
                                </View>}

                                {(this.state.screenMode === 'newForm' || this.state.screenMode === 'editForm') && <View style={{flex: 3, paddingHorizontal: 10, justifyContent: 'flex-start'}}>
                                    <ThemeScrollView style={{minHeight: 200, flex: 1}}>
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
                                                    editable={this.state.screenMode !== 'editForm'}
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

                                        {this.state.screenMode === 'editForm' && <View style={styles.fieldContainer}>
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

                                                        {this.state?.itemData?.recentOrders?.map((order) => {
                                                            return (
                                                                <TouchableOpacity
                                                                    onPress={() => this.setState({modalVisible: true, modalOrderId: order?.orderId})}
                                                                    style={[styles.tableRowContainer, {borderColor: customMainThemeColor, borderWidth: 1, borderRadius: 10, margin: 5}]}>

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
                                                            {this.state?.itemData?.topRankings?.map((item) => {
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



                                    </ThemeScrollView>
                                    <View style={[{justifyContent: 'flex-end', paddingHorizontal: '20%'}]}>
                                        <TouchableOpacity
                                            onPress={handleSubmit(data => {
                                                this.handleSubmit(data, this.state?.itemData?.id)
                                            })}
                                        >
                                            <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                                                {t('action.save')}
                                            </Text>

                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.props?.reset()
                                                this.setState({screenMode: 'normal'})
                                            }}
                                        >
                                            <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>
                                                {t('action.cancel')}
                                            </Text>
                                        </TouchableOpacity>

                                        {this.state.screenMode === 'editForm' && <DeleteBtn handleDeleteAction={() => this.handleDeleteMember(this.state?.itemData?.id)} />}
                                    </View>
                                </View>}
                            </View>
                        </View>
                    </ThemeContainer >
                )
            } else {
                return (
                    <ThemeContainer>
                        <View style={[styles.fullWidthScreen]}>
                            <NavigationEvents
                                onWillFocus={() => {
                                    this.refreshScreen()
                                }}
                            />
                            <ScreenHeader title={t('settings.member')}
                                parentFullScreen={true}
                                rightComponent={
                                    <AddBtn
                                        onPress={() => navigation.navigate('MemberFormScreen', {data: null, refreshScreen: this.refreshScreen, })}
                                    />}

                            />
                            <View style={{flexDirection: 'row', flex: 1}}>
                                <View style={{flex: 1}}>
                                    <SearchBar placeholder={t('member.searchPrompt')}
                                        onChangeText={this.searchMember}
                                        onClear={() => {
                                            this.setState({searchResults: []})
                                        }}
                                        value={this.state.searchKeyword}
                                        showLoading={this.state.searching}
                                        lightTheme={false}
                                        containerStyle={{
                                            padding: 4,
                                            borderRadius: 0,
                                            borderWidth: 0,
                                            borderTopWidth: 0,
                                            borderBottomWidth: 0,
                                            backgroundColor: customMainThemeColor
                                        }}
                                        inputStyle={{backgroundColor: customBackgroundColor}}
                                        inputContainerStyle={{borderRadius: 0, backgroundColor: customBackgroundColor}}
                                    />

                                    {this.state.searchResults?.length === 0 || <FlatList
                                        style={{maxHeight: Dimensions.get('window').height / 3, paddingBottom: 24}}
                                        data={this.state.searchResults}
                                        renderItem={({item}) => this.Item(item, true)}
                                    />}

                                    {this.state.searchResults?.length === 0 && <FlatList
                                        data={this?.state?.membersData ?? []}
                                        renderItem={({item}) => this.Item(item)}
                                        keyExtractor={(item) => item?.id}
                                        ListEmptyComponent={
                                            <View>
                                                <StyledText style={styles.messageBlock}>{t('general.noData')}</StyledText>
                                            </View>
                                        }
                                    />}

                                </View>




                            </View>
                        </View>
                    </ThemeContainer >
                )
            }
        }

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

InventoryOrderScreen = reduxForm({
    form: 'inventoryOrderForm'
})(InventoryOrderScreen)

export default connect(mapStateToProps, mapDispatchToProps)(InventoryOrderScreen)

import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {connect} from 'react-redux'
import {ScrollView, Text, TouchableOpacity, View, Platform, Alert} from 'react-native'
import {isNDigitsNumber, isRequired, isTwoBigWords} from '../validators'
import DropDownInputText from '../components/DropDownInputText'
import styles from '../styles'
import Icon from 'react-native-vector-icons/AntDesign'
import {LocaleContext} from '../locales/LocaleContext'
import SegmentedControl from "../components/SegmentedControl";
import ScreenHeader from "../components/ScreenHeader";
import moment from "moment-timezone";
import DropDown from "../components/DropDown";
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";
import {ThemeContainer} from "../components/ThemeContainer";
import {StyledText} from "../components/StyledText";
import ThemeToggleButton from "../themes/ThemeToggleButton";
import {api, dispatchFetchRequest} from '../constants/Backend'
import {number} from 'prop-types'
import DeleteBtn from '../components/DeleteBtn'
import RenderDateTimePicker, {RenderTimePicker, RenderDatePicker} from '../components/DateTimePicker'
import TimeZoneService from "../helpers/TimeZoneService";
import {Accordion, List} from '@ant-design/react-native'
import {ThemeScrollView} from "../components/ThemeScrollView";
import {ListItem} from "react-native-elements";
import {CheckBox} from 'react-native-elements'
import {lab} from 'd3'
import RNSwitch from '../components/RNSwitch'


class RostersFormScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    static contextType = LocaleContext

    constructor(props, context) {
        super(props, context)

        let entriesArr = []
        if (!!props.navigation?.state?.params?.data?.rosterEntries) {

            Object.values(props.navigation?.state?.params?.data?.rosterEntries)?.forEach((day) => {
                day?.forEach((entry) => {
                    entriesArr.push(entry)
                })
            })
        }

        this.state = {
            data: props.navigation?.state?.params?.data ?? null,
            uneditable: props.navigation?.state?.params?.data?.status === 'LOCKED',
            showFromDate: !!props.navigation?.state?.params?.data?.rosterEntries
                ? new Array(entriesArr?.length).fill(false)
                : [false],
            showToDate: !!props.navigation?.state?.params?.data?.rosterEntries
                ? new Array(entriesArr?.length).fill(false)
                : [false],
            showEndDate: false,
            rosterEntries: !!props.navigation?.state?.params?.data?.rosterEntries
                ? entriesArr
                : [{
                    dayOfWeek: null,
                    startTime: null,
                    endTime: null,
                }],
            rosterEntriesLength: !!props.navigation?.state?.params?.data?.rosterEntries ? entriesArr?.length : 0,
            selectedYear: [
                {label: String(new Date().getFullYear()), value: new Date().getFullYear()},
                {label: String(new Date().getFullYear() + 1), value: new Date().getFullYear() + 1},
            ],
            selectedMonth: [
                {label: context.t('monthPicker.January'), value: 1},
                {label: context.t('monthPicker.February'), value: 2},
                {label: context.t('monthPicker.March'), value: 3},
                {label: context.t('monthPicker.April'), value: 4},
                {label: context.t('monthPicker.May'), value: 5},
                {label: context.t('monthPicker.June'), value: 6},
                {label: context.t('monthPicker.July'), value: 7},
                {label: context.t('monthPicker.August'), value: 8},
                {label: context.t('monthPicker.September'), value: 9},
                {label: context.t('monthPicker.October'), value: 10},
                {label: context.t('monthPicker.November'), value: 11},
                {label: context.t('monthPicker.December'), value: 12},
            ],
            dayOfWeek: [
                {label: context.t('dayPicker.Sunday'), value: 'SUNDAY'},
                {label: context.t('dayPicker.Monday'), value: 'MONDAY'},
                {label: context.t('dayPicker.Tuesday'), value: 'TUESDAY'},
                {label: context.t('dayPicker.Wednesday'), value: 'WEDNESDAY'},
                {label: context.t('dayPicker.Thursday'), value: 'THURSDAY'},
                {label: context.t('dayPicker.Friday'), value: 'FRIDAY'},
                {label: context.t('dayPicker.Saturday'), value: 'SATURDAY'},
            ],
            repeatType: props.navigation?.state?.params?.data?.eventRepeat === 'WEEKLY' ? 2
                : props.navigation?.state?.params?.data?.eventRepeat === 'DAILY' ? 1 : 0,
            eventColor: props.navigation?.state?.params?.data?.eventColor ?? '#fff',
            activeSections: [],
            labels: [],
            isManager: props?.currentUser?.roles?.includes('MANAGER') ?? false,
            hasWorkingAreaDistribute: false,
            hasCrossDate: (new Date(props.navigation?.state?.params?.data?.startTime).getDate() < new Date(props.navigation?.state?.params?.data?.endTime).getDate()) ?? false,
            showStartDatePicker: false,
            formStartTime: props.navigation?.state?.params?.data?.startTime ?? null,
            formEndTime: props.navigation?.state?.params?.data?.endTime ?? null,
            formRepeatEndDate: props.navigation?.state?.params?.data?.repeatEndDate ?? null,
        }

        context.localize({
            en: {
                rostersForm: {
                    shift: 'Shift',
                    morningShift: 'Morning',
                    afternoonShift: 'Afternoon',
                    nightShift: 'Night',
                    midnightShift: 'Midnight',
                    repeat: 'Repeat',
                    NONE: 'None',
                    WEEKLY: 'Weekly',
                    DAILY: 'Daily',
                    confirmEditAll: 'Apply changes to event series?',
                    confirmDeleteAll: 'Delete all events in the series?',
                    eventColor: 'Event Color',
                    workingAreaDistribute: 'Select Working Area',
                    repeatEndDate: 'Repeat End Date',
                    crossDateShift: 'Next Day',
                    date: 'Date',
                    time: 'Time',
                },
            },
            zh: {
                rostersForm: {
                    shift: '班別',
                    morningShift: '早班',
                    afternoonShift: '午班',
                    nightShift: '晚班',
                    midnightShift: '夜班',
                    repeat: '重複',
                    NONE: '不重複',
                    WEEKLY: '每週',
                    DAILY: '每日',
                    confirmEditAll: '是否將此變更套用至同週期排班?',
                    confirmDeleteAll: '是否刪除同週期排班?',
                    eventColor: '排程顏色',
                    workingAreaDistribute: '工作區選擇',
                    repeatEndDate: '重複至',
                    crossDateShift: '跨日班',
                    date: '日期',
                    time: '時間',
                },
            }
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState !== this.state;
    }

    componentDidMount() {
        if (!!this.props.navigation?.state?.params?.data) {
            this.props?.change(`startDate`, new Date(this.props.navigation?.state?.params?.data?.startTime))
            this.props?.change(`startTime`, new Date(this.props.navigation?.state?.params?.data?.startTime))
            this.props?.change(`endTime`, new Date(this.props.navigation?.state?.params?.data?.endTime))
            this.props?.change(`repeatEndDate`, new Date(this.props.navigation?.state?.params?.data?.repeatEndDate ?? new Date()))
        }
        if (!!this.state?.hasCrossDate) {
            console.log("orgin hasCrossDate=", this.state?.hasCrossDate)
            this.props?.change(`isCrossDate`, this.state?.hasCrossDate)
        }
        this.getLabels()
    }

    getLabels = () => {
        dispatchFetchRequest(`${api.workingarea.getAll}?visibility=ROSTER`, {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }, response => {
            response.json().then(data => {
                console.log('getLabels', JSON.stringify(this.props.navigation?.state?.params?.data?.eventResources))
                this.setState({
                    labels: (data?.workingAreas?.map((label) => {
                        return ({
                            labelName: label?.name,
                            resources: this.props.navigation?.state?.params?.users?.map((user) => {return {...user, isSelected: this.props.navigation?.state?.params?.data?.eventResources?.[`${label?.name}`]?.some((eventResource) => eventResource?.resourceId === user?.id)}}),
                            labelIsSelected: this.props.navigation?.state?.params?.data?.eventResources?.[`${label?.name}`]?.some((eventResource) => eventResource?.resourceId === this.props?.currentUser?.id)
                        })
                    }))
                })

            })
        }).then()
    }


    handleSubmit = async (values, isEdit) => {
        const timezone = TimeZoneService.getTimeZone()

        let rosterEntriesArr = []
        this.state.rosterEntries.forEach((item, index) => {
            if (item !== undefined && index >= this.state.rosterEntriesLength) {
                const i18nMomentFrom = moment(!!values[`startTime${index}`] ? values[`startTime${index}`] : new Date()).tz(timezone);
                const i18nMomentTo = moment(!!values[`endTime${index}`] ? values[`endTime${index}`] : new Date()).tz(timezone);
                rosterEntriesArr.push({
                    "dayOfWeek": values[`dayOfWeek${index}`] ?? '',
                    "startTime": !!values[`startTime${index}`] ? i18nMomentFrom.tz(timezone).format("HH:mm:ss") : '',
                    "endTime": !!values[`endTime${index}`] ? i18nMomentTo.tz(timezone).format("HH:mm:ss") : '',
                })
            }
        })

        let crossTime = moment(values[`endTime`]).tz(timezone)
        console.log("origin crossTime = ", crossTime)
        let isCrossState = Date.parse(moment(values[`startTime`])).valueOf() > Date.parse(moment(values[`endTime`])).valueOf()
        let isInitialCross = new Date(values[`startTime`]).getDate() < new Date(values[`endTime`]).getDate()

        if (isCrossState && !isInitialCross) {
            crossTime.add(1, 'days').add(8, 'hours') // UTC+0 & GMT+8
            console.log("crossTime = ", crossTime)
        }
        if (!isEdit) {
            let request = {
                eventName: values?.title,
                eventRepeat: ['NONE', 'DAILY', 'WEEKLY'][this.state?.repeatType ?? 0],
                repeatEndDate: moment(!!values[`repeatEndDate`] ? values[`repeatEndDate`] : new Date()).format("YYYY-MM-DDTHH:mm:ss"),
                startTime: moment(!!values[`startTime`] ? values[`startTime`] : new Date()).format("YYYY-MM-DDTHH:mm:ss"),
                endTime: (isCrossState) ? moment(crossTime) : moment(values[`endTime`] ? values[`endTime`] : new Date()).format("YYYY-MM-DDTHH:mm:ss"),
                eventColor: this.state?.eventColor,
                workingAreaToUsernames: {}
            }
            this.state?.labels.forEach((label) => {
                let users = label?.resources?.filter((user, userIndex) => user?.isSelected)
                if (users?.length > 0) {
                    request.workingAreaToUsernames[`${label?.labelName}`] = users?.map((item) => {return item?.username})
                }
            })
            console.log('request not Edit', JSON.stringify(request))
            dispatchFetchRequest(api.rosterEvent.createEvents, {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request)
            }, response => {
                response.json().then(data => {
                    console.log('res', JSON.stringify(data))
                    this.props.navigation?.state?.params?.refreshScreen()
                    this.props.navigation.goBack()
                })
            }).then()
        } else {
            let request = {
                eventName: values?.title,
                eventRepeat: ['NONE', 'DAILY', 'WEEKLY'][this.state?.repeatType ?? 0],
                repeatEndDate: moment(!!values[`repeatEndDate`] ? values[`repeatEndDate`] : new Date()).format("YYYY-MM-DDTHH:mm:ss"),
                applyToSeries: false,
                startTime: moment(!!values[`startTime`] ? values[`startTime`] : new Date()).format("YYYY-MM-DDTHH:mm:ss"),
                endTime: (isCrossState) ? moment(crossTime) : moment(values[`endTime`] ? values[`endTime`] : new Date()).format("YYYY-MM-DDTHH:mm:ss"),
                eventColor: this.state?.eventColor,
                workingAreaToUsernames: !!values?.workingAreaDistribute ? {} : null
            }
            if (values?.workingAreaDistribute) {
                this.state?.labels.forEach((label) => {
                    let users = label?.resources?.filter((user, userIndex) => user?.isSelected)
                    if (users?.length > 0) {
                        request.workingAreaToUsernames[`${label?.labelName}`] = users?.map((item) => {return item?.username})
                    }
                })
            }

            if ((this.state?.data?.eventRepeat === 'WEEKLY' || this.state?.data?.eventRepeat === 'DAILY') && (this.state?.data?.eventRepeat === request.eventRepeat) && (!this.state?.data?.isolated)) {
                Alert.alert(
                    ``,
                    `${this.context.t('rostersForm.confirmEditAll')}`,
                    [
                        {
                            text: `${this.context.t('action.yes')}`,
                            onPress: () => {
                                request.applyToSeries = true
                                console.log('request', JSON.stringify(request))
                                dispatchFetchRequest(api.rosterEvent.getEventsById(this.state?.data?.id), {
                                    method: 'POST',
                                    withCredentials: true,
                                    credentials: 'include',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(request)
                                }, response => {
                                    response.json().then(data => {
                                        console.log('res', JSON.stringify(data))
                                        this.props.navigation?.state?.params?.refreshScreen()
                                        this.props.navigation.goBack()
                                    })
                                }).then()
                            }
                        },
                        {
                            text: `${this.context.t('action.no')}`,
                            onPress: () => {
                                console.log('request', JSON.stringify(request))
                                dispatchFetchRequest(api.rosterEvent.getEventsById(this.state?.data?.id), {
                                    method: 'POST',
                                    withCredentials: true,
                                    credentials: 'include',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(request)
                                }, response => {
                                    response.json().then(data => {
                                        console.log('res', JSON.stringify(data))
                                        this.props.navigation?.state?.params?.refreshScreen()
                                        this.props.navigation.goBack()
                                    })
                                }).then()
                            },
                            style: 'cancel'
                        }
                    ]
                )
            } else {
                console.log('request is edit', JSON.stringify(request))
                dispatchFetchRequest(api.rosterEvent.getEventsById(this.state?.data?.id), {
                    method: 'POST',
                    withCredentials: true,
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(request)
                }, response => {
                    response.json().then(data => {
                        console.log('res', JSON.stringify(data))
                        this.props.navigation?.state?.params?.refreshScreen()
                        this.props.navigation.goBack()
                    })
                }).then()
            }

        }

    }

    handleStaffSubmit = () => {

        let selectedLabels = this.state?.labels?.filter((label) => label?.labelIsSelected)
        let request = {
            workingAreas: selectedLabels.length > 0
                ? selectedLabels?.map((item) => {return item?.labelName})
                : []
        }
        dispatchFetchRequest(api.rosterEvent.updateEventResources(this.state?.data?.id), {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        }, response => {
            response.json().then(data => {
                this.props.navigation?.state?.params?.refreshScreen()
                this.props.navigation.goBack()
            })
        }).then()
    }
    handleDelete = async () => {
        if (this.state?.data?.eventRepeat === 'WEEKLY' || this.state?.data?.eventRepeat === 'DAILY') {
            Alert.alert(
                ``,
                `${this.context.t('rostersForm.confirmDeleteAll')}`,
                [
                    {
                        text: `${this.context.t('action.yes')}`,
                        onPress: () => {
                            dispatchFetchRequest(`${api.rosterEvent.getEventsById(this.state?.data?.id)}/all`, {
                                method: 'DELETE',
                                withCredentials: true,
                                credentials: 'include',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                            }, response => {
                                this.props.navigation?.state?.params?.refreshScreen()
                                this.props.navigation.goBack()

                            }).then()
                        }
                    },
                    {
                        text: `${this.context.t('action.no')}`,
                        onPress: () => {
                            dispatchFetchRequest(`${api.rosterEvent.getEventsById(this.state?.data?.id)}`, {
                                method: 'DELETE',
                                withCredentials: true,
                                credentials: 'include',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                            }, response => {
                                this.props.navigation?.state?.params?.refreshScreen()
                                this.props.navigation.goBack()

                            }).then()
                        },
                        style: 'cancel'
                    }
                ]
            )
        } else {
            dispatchFetchRequest(`${api.rosterEvent.getEventsById(this.state?.data?.id)}`, {
                method: 'DELETE',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
            }, response => {
                this.props.navigation?.state?.params?.refreshScreen()
                this.props.navigation.goBack()

            }).then()
        }
    }

    addForm = () => {

        let arr = [...this.state.rosterEntries]
        let showFromDateArr = [...this.state.showFromDate]
        let showToDateArr = [...this.state.showToDate]
        arr.push({
            dayOfWeek: null,
            startTime: null,
            endTime: null,
            remainingInvoiceNumbers: null,
        })
        showFromDateArr.push(false)
        showToDateArr.push(false)
        this.setState({
            rosterEntries: arr,
            showFromDate: showFromDateArr,
            showToDate: showToDateArr
        })

    }


    handleGetStartDate = (event, selectedDate) => {
        console.log(`selected start day: ${selectedDate}`)
        this.setState({formStartTime: new Date(selectedDate), formEndTime: new Date(selectedDate)})
        this.props?.change(`startTime`, new Date(selectedDate))
        this.props?.change(`endTime`, new Date(selectedDate))

        if (new Date(selectedDate).getDate() > new Date(this.state?.formRepeatEndDate).getDate()) {
            this.props?.change(`repeatEndDate`, new Date(selectedDate))
            this.setState({formRepeatEndDate: new Date(selectedDate)})
        }
    }
    handleGetRepeatDate = (event, selectedDate) => {
        this.setState({formRepeatEndDate: new Date(selectedDate)})
        console.log(`selected date: ${selectedDate}`)
    }

    handleGetFromDate = (event, selectedDate) => {
        console.log(`selected start time: ${selectedDate}`)

        let minTime = new Date(selectedDate)
        let maxTime = minTime.setHours(minTime.getHours() + 1)

        if (moment(selectedDate) > moment(this.state?.formEndTime)) {
            this.props?.change(`endTime`, new Date(maxTime))
            this.setState({formStartTime: minTime, formEndTime: new Date(maxTime)})

        } else {
            this.setState({formStartTime: minTime})
        }
    }
    handleGetToDate = (event, selectedDate) => {
        console.log(`selected end time: ${selectedDate}`)

        if (moment(this.state?.formStartTime) > moment(selectedDate) || (new Date(this.state?.formStartTime).getDate() < new Date(selectedDate).getDate())) {
            this.setState({hasCrossDate: true})
            this.props?.change(`isCrossDate`, true)
        } else {
            this.setState({hasCrossDate: false})
            this.props?.change(`isCrossDate`, false)
        }

        this.setState({formEndTime: new Date(selectedDate)})

    }

    showStartDatePicker = () => {
        this.setState({
            showStartDatePicker: !this.state?.showStartDatePicker
        })
    };

    showFromDatePicker = (index) => {
        let showFromDateArr = [...this.state.showFromDate]
        showFromDateArr[index] = !showFromDateArr[index]
        this.setState({
            showFromDate: showFromDateArr
        })
    };

    showToDatePicker = (index) => {
        let showToDateArr = [...this.state.showToDate]
        showToDateArr[index] = !showToDateArr[index]
        this.setState({
            showToDate: showToDateArr
        })
    };

    showEndDatePicker = () => {
        this.setState({
            showEndDate: !this.state?.showEndDate
        })
    };

    render() {
        const {t, themeStyle, isTablet, customMainThemeColor, customBackgroundColor} = this.context
        const {handleSubmit} = this.props
        const timezone = TimeZoneService.getTimeZone()
        console.log('data', JSON.stringify(this.state?.data))
        if (isTablet) {
            return (

                <ThemeContainer>
                    <View style={styles.container}>
                        <ScreenHeader title={t('settings.roster')} />
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                            <View style={{flex: 7, maxWidth: 640, justifyContent: 'space-between', }}>
                                <View >

                                    {this.state.rosterEntries?.map((item, index) => {
                                        if (item === undefined)
                                            return null
                                        return (<View style={{
                                            flexDirection: 'row'
                                        }}>

                                            <View style={{flex: 15, flexDirection: 'column'}}>

                                                <View style={[styles.fieldContainer, {...(Platform.OS !== 'android' && {zIndex: 10})}]}>
                                                    <View style={[styles.tableCellView, {flex: 1}]}>
                                                        <StyledText style={styles.fieldTitle}>{t('rostersForm.shift')}</StyledText>
                                                    </View>
                                                    <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-end'}]}>

                                                        {this.state?.isManager ? <Field
                                                            component={DropDownInputText}
                                                            name="title"
                                                            validate={isRequired}
                                                            alignLeft={true}
                                                            pickerLabels={[
                                                                {label: t('rostersForm.morningShift'), value: 'morningShift'},
                                                                {label: t('rostersForm.afternoonShift'), value: 'afternoonShift'},
                                                                {label: t('rostersForm.nightShift'), value: 'nightShift'},
                                                                {label: t('rostersForm.midnightShift'), value: 'midnightShift'},
                                                            ]}
                                                            defaultValue={this.props.navigation?.state?.params?.data?.eventName ?? t('rostersForm.morningShift')}
                                                        /> :
                                                            <StyledText>{this.props.navigation?.state?.params?.data?.eventName ?? t('rostersForm.morningShift')}</StyledText>}
                                                    </View>
                                                </View>
                                                <View style={[styles.fieldContainer]}>
                                                    <View style={[styles.tableCellView, {flex: 1}]}>
                                                        <StyledText style={styles.fieldTitle}>{t('rostersForm.date')}</StyledText>
                                                    </View>
                                                    <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-end'}]}>
                                                        {this.state?.isManager ? <Field
                                                            name={`startDate`}
                                                            component={RenderDatePicker}
                                                            onChange={this.handleGetStartDate}
                                                            defaultValue={this.state?.data?.startTime ?? new Date()}
                                                            placeholder={t('order.fromDate')}
                                                            isShow={this.state?.showStartDatePicker ?? false}
                                                            showDatepicker={() => this.showStartDatePicker()}
                                                            readonly={index <= this.state.rosterEntriesLength - 1 ? true : false}
                                                        /> :
                                                            <StyledText>{moment(this.state?.data?.startTime ?? new Date()).tz(timezone).format("YYYY-MM-DD")}</StyledText>}
                                                    </View>
                                                </View>
                                                <View style={styles.fieldContainer}>
                                                    <View style={[styles.tableCellView, {flex: 1}]}>
                                                        <StyledText style={styles.fieldTitle}>{t('rostersForm.time')}</StyledText>
                                                    </View>
                                                    {this.state?.isManager ? <View style={[styles.tableCellView, {flex: 0.95, justifyContent: 'flex-end'}]}>
                                                        <Field
                                                            name={`startTime`}
                                                            component={RenderTimePicker}
                                                            onChange={this.handleGetFromDate}
                                                            defaultValue={this.state?.data?.startTime ?? new Date()}
                                                            placeholder={t('order.fromDate')}
                                                            isShow={this.state.showFromDate?.[index] ?? false}
                                                            showDatepicker={() => this.showFromDatePicker(index)}
                                                            readonly={index <= this.state.rosterEntriesLength - 1 ? true : false}
                                                        /></View> : <View style={[styles.tableCellView, {justifyContent: 'flex-end'}]}>
                                                            <StyledText>{moment(this.state?.data?.startTime ?? new Date()).tz(timezone).format("HH:mm")}</StyledText>
                                                        </View>}
                                                    {this.state?.isManager ?
                                                        <View style={[styles.tableCellView, {flex: 0.1, justifyContent: 'flex-end'}]}>
                                                            <StyledText> ~ </StyledText>
                                                        </View> : <View style={[styles.tableCellView, {justifyContent: 'flex-end'}]}>
                                                            <StyledText> ~ </StyledText>
                                                        </View>}
                                                    {this.state?.isManager ? <View style={[styles.tableCellView, {flex: 0.95, justifyContent: 'flex-end'}]}><Field
                                                        name={`endTime`}
                                                        component={RenderTimePicker}
                                                        onChange={this.handleGetToDate}
                                                        defaultValue={this.state?.data?.endTime ?? new Date()}
                                                        isShow={this.state.showToDate?.[index] ?? false}
                                                        showDatepicker={() => this.showToDatePicker(index)}
                                                        readonly={index <= this.state.rosterEntriesLength - 1 ? true : false}
                                                    />
                                                    </View> :
                                                        <View style={[styles.tableCellView, {justifyContent: 'flex-end'}]}>
                                                            <StyledText>{moment(this.state?.data?.endTime ?? new Date()).tz(timezone).format("HH:mm")}</StyledText>
                                                        </View>}
                                                </View>
                                                <View style={styles.fieldContainer}>
                                                    <View style={[styles.tableCellView, {flex: 1}]}>
                                                        <StyledText style={styles.fieldTitle}>{t('rostersForm.crossDateShift')}</StyledText>
                                                    </View>
                                                    {this.state?.isManager ?
                                                        <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-start'}]}>
                                                            <Field
                                                                name="isCrossDate"
                                                                component={RNSwitch}
                                                                onChange={(flag) => this.setState({hasCrossDate: flag})}
                                                            />
                                                        </View> : <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-end'}]}>
                                                            <StyledText>{this.state?.hasCrossDate ? t('action.yes') : t('action.no')}</StyledText>
                                                        </View>
                                                    }
                                                </View>
                                                {this.state?.isManager && <><View style={styles.fieldContainer}>
                                                    <View style={[styles.tableCellView, {flex: 1}]}>
                                                        <StyledText style={styles.fieldTitle}>{t('rostersForm.repeat')}</StyledText>
                                                    </View>
                                                    <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-end', flexDirection: 'column'}]}>
                                                        <Field
                                                            name="repeatType"
                                                            component={SegmentedControl}
                                                            onChange={(val) => {this.setState({repeatType: val})}}
                                                            values={[t('rostersForm.NONE'), t('rostersForm.DAILY'), t('rostersForm.WEEKLY')]}
                                                            selectedIndex={this.state?.repeatType}
                                                            enabled={!!this.state.data?.eventName ? (this.state?.data?.eventSeriesMainEvent) : true}
                                                        />
                                                    </View>
                                                </View>
                                                    {this.state?.repeatType !== 0 && <View style={styles.fieldContainer}>
                                                        <View style={[styles.tableCellView, {flex: 1}]}>
                                                            <StyledText style={styles.fieldTitle}>{t('rostersForm.repeatEndDate')}</StyledText>
                                                        </View>
                                                        <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-end'}]}>

                                                            {this.state?.isManager ? <Field
                                                                name={`repeatEndDate`}
                                                                component={RenderDatePicker}
                                                                onChange={this.handleGetRepeatDate}
                                                                isShow={this.state?.showEndDate ?? false}
                                                                showDatepicker={() => this.showEndDatePicker()}
                                                                defaultValue={this.state?.data?.repeatEndDate ?? new Date()}
                                                                readonly={!!this.state.data?.eventName ? (!this.state?.data?.eventSeriesMainEvent) : false}
                                                                validate={(value, allValues, props, name) => {
                                                                    if (!!allValues?.startTime && !!value && (new Date(allValues?.startTime).getMonth() !== new Date(value).getMonth())) {
                                                                        console.log('validate', value, allValues)
                                                                        this.props?.change(`repeatEndDate`, new Date(moment(allValues?.startTime).endOf('month').tz(timezone)))
                                                                    }
                                                                }}
                                                            /> :
                                                                <StyledText>{moment(this.state?.data?.repeatEndDate ?? new Date()).tz(timezone).format("YYYY-MM-DD")}</StyledText>}
                                                        </View>
                                                    </View>}
                                                </>}
                                                <View style={styles.fieldContainer}>
                                                    <View style={[styles.tableCellView, {flex: 1}]}>
                                                        <StyledText style={styles.fieldTitle}>{t('rostersForm.eventColor')}</StyledText>
                                                    </View>
                                                    {this.state?.isManager ? <View style={[styles.tableCellView, {flex: 2, justifyContent: 'space-between'}]}>

                                                        <TouchableOpacity
                                                            onPress={() => this.setState({eventColor: '#fff'})}
                                                            style={[{backgroundColor: '#fff'}, this.state?.eventColor === '#fff' ? {width: 40, height: 40, borderRadius: 40, borderColor: customMainThemeColor, borderWidth: 3} : {width: 30, height: 30, borderRadius: 30, borderColor: customMainThemeColor, borderWidth: 1}]} ></TouchableOpacity>
                                                        <TouchableOpacity
                                                            onPress={() => this.setState({eventColor: '#CCDDFF'})}
                                                            style={[{backgroundColor: '#CCDDFF'}, this.state?.eventColor === '#CCDDFF' ? {width: 40, height: 40, borderRadius: 40, borderColor: customMainThemeColor, borderWidth: 3} : {width: 30, height: 30, borderRadius: 30}]} ></TouchableOpacity>
                                                        <TouchableOpacity
                                                            onPress={() => this.setState({eventColor: '#AAFFEE'})}
                                                            style={[{backgroundColor: '#AAFFEE'}, this.state?.eventColor === '#AAFFEE' ? {width: 40, height: 40, borderRadius: 40, borderColor: customMainThemeColor, borderWidth: 3} : {width: 30, height: 30, borderRadius: 30}]} ></TouchableOpacity>
                                                        <TouchableOpacity
                                                            onPress={() => this.setState({eventColor: '#DEB887'})}
                                                            style={[{backgroundColor: '#DEB887'}, this.state?.eventColor === '#DEB887' ? {width: 40, height: 40, borderRadius: 40, borderColor: customMainThemeColor, borderWidth: 3} : {width: 30, height: 30, borderRadius: 30}]} ></TouchableOpacity>
                                                        <TouchableOpacity
                                                            onPress={() => this.setState({eventColor: '#FFC8B4'})}
                                                            style={[{backgroundColor: '#FFC8B4'}, this.state?.eventColor === '#FFC8B4' ? {width: 40, height: 40, borderRadius: 40, borderColor: customMainThemeColor, borderWidth: 3} : {width: 30, height: 30, borderRadius: 30}]} ></TouchableOpacity>
                                                        <TouchableOpacity
                                                            onPress={() => this.setState({eventColor: '#FFB7DD'})}
                                                            style={[{backgroundColor: '#FFB7DD'}, this.state?.eventColor === '#FFB7DD' ? {width: 40, height: 40, borderRadius: 40, borderColor: customMainThemeColor, borderWidth: 3} : {width: 30, height: 30, borderRadius: 30}]} ></TouchableOpacity>


                                                    </View> :
                                                        <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-end'}]}>
                                                            <TouchableOpacity
                                                                style={[{backgroundColor: this.state?.eventColor}, this.state?.eventColor === '#fff' ? {width: 30, height: 30, borderRadius: 30, borderColor: customMainThemeColor, borderWidth: 1} : {width: 30, height: 30, borderRadius: 30}]}></TouchableOpacity>
                                                        </View>}
                                                </View>
                                            </View>

                                        </View>)
                                    })}
                                </View>
                                {!!this.state?.data?.eventName && <View style={[styles.fieldContainer, {alignItems: 'center', paddingVertical: 10}]}>

                                    <View style={{marginRight: 10}}>
                                        <Field
                                            name="workingAreaDistribute"
                                            component={RNSwitch}
                                            onChange={(flag) => this.setState({hasWorkingAreaDistribute: flag})}
                                        />
                                    </View>
                                    <StyledText style={{fontWeight: 'bold'}}>{t('rostersForm.workingAreaDistribute')}</StyledText>
                                </View>}
                                {(!!this.state?.data?.eventName && this.state?.hasWorkingAreaDistribute) ? <ThemeScrollView style={{flex: 1}}>
                                    {this.state?.isManager ? <Accordion
                                        onChange={(activeSections) => this.setState({activeSections: activeSections})}
                                        activeSections={this.state?.activeSections}
                                        expandMultiple
                                    //duration={300}
                                    >
                                        {this.state?.labels.map((label, labelIndex) => {
                                            return (
                                                <Accordion.Panel

                                                    header={
                                                        <View style={[styles.listPanel]}>
                                                            <View style={[styles.tableCellView, styles.flex(1)]}>
                                                                <StyledText style={[{color: customMainThemeColor, fontWeight: 'bold'}, styles.listPanelText]}>{label?.labelName} ({label?.resources?.filter((item) => item?.isSelected).length})</StyledText>
                                                            </View>

                                                        </View>
                                                    }
                                                >

                                                    <List>
                                                        {label?.resources?.map((user, userIndex) => (
                                                            <ListItem
                                                                title={
                                                                    <View style={[styles.tableRowContainer]}>
                                                                        <View style={[styles.tableCellView]}>
                                                                            <CheckBox
                                                                                containerStyle={{margin: 0, padding: 0}}
                                                                                checkedIcon={'check-circle'}
                                                                                uncheckedIcon={'circle'}
                                                                                checked={user?.isSelected}
                                                                                onPress={() => {
                                                                                    let tempLabels = [...this.state?.labels]
                                                                                    tempLabels[labelIndex].resources[userIndex].isSelected = !tempLabels[labelIndex].resources[userIndex].isSelected
                                                                                    this.setState({labels: tempLabels})
                                                                                }}
                                                                            >
                                                                            </CheckBox>
                                                                        </View>
                                                                        <View style={[styles.tableCellView]}>
                                                                            <StyledText>{user?.displayName}</StyledText>
                                                                        </View>

                                                                    </View>
                                                                }
                                                                onPress={() => {
                                                                    let tempLabels = [...this.state?.labels]
                                                                    tempLabels[labelIndex].resources[userIndex].isSelected = !tempLabels[labelIndex].resources[userIndex].isSelected
                                                                    this.setState({labels: tempLabels})
                                                                }}
                                                                bottomDivider
                                                                containerStyle={[styles.dynamicVerticalPadding(5), {backgroundColor: customBackgroundColor},]}
                                                            />
                                                        ))}
                                                        {label?.resources?.length === 0 && (
                                                            <ListItem
                                                                title={
                                                                    <View style={[styles.tableRowContainer]}>
                                                                        <View style={[styles.tableCellView]}>
                                                                            <StyledText>({t('empty')})</StyledText>
                                                                        </View>
                                                                    </View>
                                                                }
                                                                onPress={() => {

                                                                }}
                                                                bottomDivider
                                                                containerStyle={[styles.dynamicVerticalPadding(10), {backgroundColor: customBackgroundColor},]}
                                                            />
                                                        )}
                                                    </List>

                                                </Accordion.Panel>
                                            )
                                        })}
                                    </Accordion> :
                                        <View>
                                            {this.state?.labels.map((label, labelIndex) => {
                                                return (
                                                    <ListItem
                                                        title={
                                                            <View style={[styles.tableRowContainer, {paddingHorizontal: 0}]}>
                                                                <View style={[styles.tableCellView]}>
                                                                    <CheckBox
                                                                        containerStyle={{margin: 0, padding: 0}}
                                                                        checkedIcon={'check-circle'}
                                                                        uncheckedIcon={'circle'}
                                                                        checked={label?.labelIsSelected}
                                                                        onPress={() => {
                                                                            let tempLabels = [...this.state?.labels]
                                                                            tempLabels[labelIndex].labelIsSelected = !tempLabels[labelIndex].labelIsSelected
                                                                            this.setState({labels: tempLabels})
                                                                        }}
                                                                    >
                                                                    </CheckBox>
                                                                </View>
                                                                <View style={[styles.tableCellView]}>
                                                                    <StyledText>{label?.labelName}</StyledText>
                                                                </View>

                                                            </View>
                                                        }
                                                        onPress={() => {
                                                            let tempLabels = [...this.state?.labels]
                                                            tempLabels[labelIndex].labelIsSelected = !tempLabels[labelIndex].labelIsSelected
                                                            this.setState({labels: tempLabels})
                                                        }}
                                                        bottomDivider
                                                        containerStyle={[styles.dynamicVerticalPadding(5), {backgroundColor: customBackgroundColor},]}
                                                    />
                                                )
                                            })}
                                        </View>}
                                </ThemeScrollView> : <View style={{flex: 1}}></View>}
                                <View style={[{marginTop: 30, justifyContent: 'flex-end', flexDirection: 'row', flex: 1, maxHeight: 50}]}>

                                    {!!this.state.data?.eventName && this.state?.isManager && <DeleteBtn
                                        containerStyle={[styles?.flexButton(customMainThemeColor), styles.deleteButton]}
                                        textStyle={styles.flexButtonText}
                                        handleDeleteAction={() => this.handleDelete()} />}
                                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={[styles?.flexButtonSecondAction(this.context), {marginHorizontal: 10}]}>
                                        <Text style={[styles?.flexButtonSecondActionText(customMainThemeColor)]}>
                                            {t('action.cancel')}
                                        </Text>
                                    </TouchableOpacity>

                                    {this.state.uneditable || <TouchableOpacity
                                        style={styles?.flexButton(customMainThemeColor)}
                                        onPress={
                                            this.state?.isManager ?
                                                handleSubmit(data => {
                                                    this.handleSubmit(data, !!this.state.data?.eventName)
                                                }) :
                                                () => this.handleStaffSubmit()}>
                                        <Text style={[styles.flexButtonText]}>
                                            {t('action.save')}
                                        </Text>
                                    </TouchableOpacity>}
                                </View>

                            </View>


                        </View>
                    </View>
                </ThemeContainer >

            )
        }

        return (

            <ThemeScrollView>
                <View style={styles.container}>
                    <ScreenHeader title={t('settings.roster')} />
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                        <View style={{flex: 7, maxWidth: 640, justifyContent: 'space-between', }}>
                            <View >

                                {this.state.rosterEntries?.map((item, index) => {
                                    if (item === undefined)
                                        return null
                                    return (<View style={{
                                        flexDirection: 'row'
                                    }}
                                        key={index}
                                    >

                                        <View style={{flex: 15, flexDirection: 'column'}}>

                                            <View style={[styles.fieldContainer, {...(Platform.OS !== 'android' && {zIndex: 10})}]}>
                                                <View style={[styles.tableCellView, {flex: 1}]}>
                                                    <StyledText style={styles.fieldTitle}>{t('rostersForm.shift')}</StyledText>
                                                </View>
                                                <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-end'}]}>

                                                    {this.state?.isManager ? <Field
                                                        component={DropDownInputText}
                                                        name="title"
                                                        validate={isRequired}
                                                        alignLeft={true}
                                                        pickerLabels={[
                                                            {label: t('rostersForm.morningShift'), value: 'morningShift'},
                                                            {label: t('rostersForm.afternoonShift'), value: 'afternoonShift'},
                                                            {label: t('rostersForm.nightShift'), value: 'nightShift'},
                                                            {label: t('rostersForm.midnightShift'), value: 'midnightShift'},
                                                        ]}
                                                        defaultValue={this.props.navigation?.state?.params?.data?.eventName ?? t('rostersForm.morningShift')}
                                                    /> :
                                                        <StyledText>{this.props.navigation?.state?.params?.data?.eventName ?? t('rostersForm.morningShift')}</StyledText>}
                                                </View>
                                            </View>
                                            <View style={[styles.fieldContainer]}>
                                                <View style={[styles.tableCellView, {flex: 1}]}>
                                                    <StyledText style={styles.fieldTitle}>{t('rostersForm.date')}</StyledText>
                                                </View>
                                                <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-end'}]}>

                                                    {this.state?.isManager ? <Field
                                                        name={`startDate`}
                                                        component={RenderDatePicker}
                                                        onChange={this.handleGetStartDate}
                                                        defaultValue={this.state?.data?.startTime ?? new Date()}
                                                        placeholder={t('order.fromDate')}
                                                        isShow={this.state.showStartDatePicker ?? false}
                                                        showDatepicker={() => this.showStartDatePicker()}
                                                        readonly={index <= this.state.rosterEntriesLength - 1 ? true : false}
                                                    /> :
                                                        <StyledText>{moment(this.state?.data?.startTime ?? new Date()).tz(timezone).format("YYYY-MM-DD")}</StyledText>}
                                                </View>
                                            </View>
                                            <View style={styles.fieldContainer}>
                                                <View style={[styles.tableCellView, {flex: 1}]}>
                                                    <StyledText style={styles.fieldTitle}>{t('rostersForm.time')}</StyledText>
                                                </View>
                                                {this.state?.isManager ? <View style={[styles.tableCellView, {flex: 0.9, justifyContent: 'flex-end'}]}>
                                                    <Field
                                                        name={`startTime`}
                                                        component={RenderTimePicker}
                                                        onChange={this.handleGetFromDate}
                                                        defaultValue={this.state?.data?.startTime ?? new Date()}
                                                        placeholder={t('order.fromDate')}
                                                        isShow={this.state.showFromDate?.[index] ?? false}
                                                        showDatepicker={() => this.showFromDatePicker(index)}
                                                        readonly={index <= this.state.rosterEntriesLength - 1 ? true : false}
                                                    />
                                                </View> : <View style={[styles.tableCellView, {justifyContent: 'flex-end'}]}>
                                                        <StyledText>{moment(this.state?.data?.startTime ?? new Date()).tz(timezone).format("HH:mm")}</StyledText>
                                                    </View>
                                                }
                                                {this.state?.isManager ? <View style={[styles.tableCellView, styles.jc_alignIem_center, {flex: 0.2}]}>
                                                    <StyledText> ~ </StyledText>
                                                </View> : <View>
                                                        <StyledText> ~ </StyledText>
                                                    </View>
                                                }
                                                {this.state?.isManager ? <View style={[styles.tableCellView, {flex: 0.9, justifyContent: 'flex-end'}]}>
                                                    <Field
                                                        name={`endTime`}
                                                        component={RenderTimePicker}
                                                        onChange={this.handleGetToDate}
                                                        defaultValue={this.state?.data?.endTime ?? new Date()}
                                                        isShow={this.state.showToDate?.[index] ?? false}
                                                        showDatepicker={() => this.showToDatePicker(index)}
                                                        readonly={index <= this.state.rosterEntriesLength - 1 ? true : false}
                                                    />
                                                </View>
                                                    :
                                                    <View style={[{justifyContent: 'flex-end'}]}>
                                                        <StyledText>{moment(this.state?.data?.endTime ?? new Date()).tz(timezone).format("HH:mm")}</StyledText>
                                                    </View>}
                                            </View>
                                            <View style={styles.fieldContainer}>
                                                <View style={[styles.tableCellView, {flex: 1}]}>
                                                    <StyledText style={styles.fieldTitle}>{t('rostersForm.crossDateShift')}</StyledText>
                                                </View>
                                                {this.state?.isManager ?
                                                    <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-start'}]}>
                                                        <Field
                                                            name="isCrossDate"
                                                            component={RNSwitch}
                                                            onChange={(flag) => this.setState({hasCrossDate: flag})}

                                                        />
                                                    </View> : <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-end'}]}>
                                                        <StyledText>{this.state?.hasCrossDate ? t('action.yes') : t('action.no')}</StyledText>
                                                    </View>
                                                }
                                            </View>
                                            {this.state?.isManager && <><View style={styles.fieldContainer}>
                                                <View style={[styles.tableCellView, {flex: 1}]}>
                                                    <StyledText style={styles.fieldTitle}>{t('rostersForm.repeat')}</StyledText>
                                                </View>
                                                <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-end', flexDirection: 'column'}]}>
                                                    <Field
                                                        name="repeatType"
                                                        component={SegmentedControl}
                                                        onChange={(val) => {this.setState({repeatType: val})}}
                                                        values={[t('rostersForm.NONE'), t('rostersForm.DAILY'), t('rostersForm.WEEKLY')]}
                                                        selectedIndex={this.state?.repeatType}
                                                        enabled={!!this.state.data?.eventName ? (this.state?.data?.eventSeriesMainEvent) : true}
                                                    />
                                                </View>
                                            </View>
                                                {this.state?.repeatType !== 0 && <View style={styles.fieldContainer}>
                                                    <View style={[styles.tableCellView, {flex: 1}]}>
                                                        <StyledText style={styles.fieldTitle}>{t('rostersForm.repeatEndDate')}</StyledText>
                                                    </View>
                                                    <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-end'}]}>

                                                        {this.state?.isManager ? <Field
                                                            name={`repeatEndDate`}
                                                            component={RenderDatePicker}
                                                            onChange={this.handleGetRepeatDate}
                                                            isShow={this.state?.showEndDate ?? false}
                                                            showDatepicker={() => this.showEndDatePicker()}
                                                            defaultValue={this.state?.data?.repeatEndDate ?? new Date()}
                                                            readonly={!!this.state.data?.eventName ? (!this.state?.data?.eventSeriesMainEvent) : false}
                                                            validate={(value, allValues, props, name) => {
                                                                if (!!allValues?.startTime && !!value && (new Date(allValues?.startTime).getMonth() !== new Date(value).getMonth())) {
                                                                    console.log('validate', value, allValues)
                                                                    this.props?.change(`repeatEndDate`, new Date(moment(allValues?.startTime).endOf('month').tz(timezone)))
                                                                }
                                                            }}
                                                        /> :
                                                            <StyledText>{moment(this.state?.data?.repeatEndDate ?? new Date()).tz(timezone).format("YYYY-MM-DD")}</StyledText>}
                                                    </View>
                                                </View>}
                                            </>}
                                            <View style={styles.fieldContainer}>
                                                <View style={[styles.tableCellView, {flex: 1}]}>
                                                    <StyledText style={styles.fieldTitle}>{t('rostersForm.eventColor')}</StyledText>
                                                </View>
                                                {this.state?.isManager ? <View style={[styles.tableCellView, {flex: 2, justifyContent: 'space-between'}]}>

                                                    <TouchableOpacity
                                                        onPress={() => this.setState({eventColor: '#fff'})}
                                                        style={[{backgroundColor: '#fff'}, this.state?.eventColor === '#fff' ? {width: 40, height: 40, borderRadius: 40, borderColor: customMainThemeColor, borderWidth: 3} : {width: 30, height: 30, borderRadius: 30, borderColor: customMainThemeColor, borderWidth: 1}]} ></TouchableOpacity>
                                                    <TouchableOpacity
                                                        onPress={() => this.setState({eventColor: '#CCDDFF'})}
                                                        style={[{backgroundColor: '#CCDDFF'}, this.state?.eventColor === '#CCDDFF' ? {width: 40, height: 40, borderRadius: 40, borderColor: customMainThemeColor, borderWidth: 3} : {width: 30, height: 30, borderRadius: 30}]} ></TouchableOpacity>
                                                    <TouchableOpacity
                                                        onPress={() => this.setState({eventColor: '#AAFFEE'})}
                                                        style={[{backgroundColor: '#AAFFEE'}, this.state?.eventColor === '#AAFFEE' ? {width: 40, height: 40, borderRadius: 40, borderColor: customMainThemeColor, borderWidth: 3} : {width: 30, height: 30, borderRadius: 30}]} ></TouchableOpacity>
                                                    <TouchableOpacity
                                                        onPress={() => this.setState({eventColor: '#DEB887'})}
                                                        style={[{backgroundColor: '#DEB887'}, this.state?.eventColor === '#DEB887' ? {width: 40, height: 40, borderRadius: 40, borderColor: customMainThemeColor, borderWidth: 3} : {width: 30, height: 30, borderRadius: 30}]} ></TouchableOpacity>
                                                    <TouchableOpacity
                                                        onPress={() => this.setState({eventColor: '#FFC8B4'})}
                                                        style={[{backgroundColor: '#FFC8B4'}, this.state?.eventColor === '#FFC8B4' ? {width: 40, height: 40, borderRadius: 40, borderColor: customMainThemeColor, borderWidth: 3} : {width: 30, height: 30, borderRadius: 30}]} ></TouchableOpacity>
                                                    <TouchableOpacity
                                                        onPress={() => this.setState({eventColor: '#FFB7DD'})}
                                                        style={[{backgroundColor: '#FFB7DD'}, this.state?.eventColor === '#FFB7DD' ? {width: 40, height: 40, borderRadius: 40, borderColor: customMainThemeColor, borderWidth: 3} : {width: 30, height: 30, borderRadius: 30}]} ></TouchableOpacity>


                                                </View> :
                                                    <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-end'}]}>
                                                        <TouchableOpacity
                                                            style={[{backgroundColor: this.state?.eventColor}, this.state?.eventColor === '#fff' ? {width: 30, height: 30, borderRadius: 30, borderColor: customMainThemeColor, borderWidth: 1} : {width: 30, height: 30, borderRadius: 30}]}>
                                                        </TouchableOpacity>
                                                    </View>}
                                            </View>
                                        </View>

                                    </View>)
                                })}
                            </View>
                            {!!this.state?.data && <View style={[styles.fieldContainer, {alignItems: 'center', paddingVertical: 10}]}>
                                <View style={{marginRight: 10}}>
                                    <Field
                                        name="workingAreaDistribute"
                                        component={RNSwitch}
                                        onChange={(flag) => this.setState({hasWorkingAreaDistribute: flag})}
                                    />
                                </View>
                                <StyledText style={{fontWeight: 'bold'}}>{t('rostersForm.workingAreaDistribute')}</StyledText>
                            </View>}
                            {(!!this.state?.data && this.state?.hasWorkingAreaDistribute) ? <View style={{flex: 1}}>
                                {this.state?.isManager ? <Accordion
                                    onChange={(activeSections) => this.setState({activeSections: activeSections})}
                                    activeSections={this.state?.activeSections}
                                    expandMultiple
                                //duration={300}
                                >
                                    {this.state?.labels.map((label, labelIndex) => {
                                        return (
                                            <Accordion.Panel

                                                header={
                                                    <View style={[styles.listPanel]}>
                                                        <View style={[styles.tableCellView, styles.flex(1)]}>
                                                            <StyledText style={[{color: customMainThemeColor, fontWeight: 'bold'}, styles.listPanelText]}>{label?.labelName} ({label?.resources?.filter((item) => item?.isSelected).length})</StyledText>
                                                        </View>

                                                    </View>
                                                }
                                            >

                                                <List>
                                                    {label?.resources?.map((user, userIndex) => (
                                                        <ListItem
                                                            title={
                                                                <View style={[styles.tableRowContainer]}>
                                                                    <View style={[styles.tableCellView]}>
                                                                        <CheckBox
                                                                            containerStyle={{margin: 0, padding: 0}}
                                                                            checkedIcon={'check-circle'}
                                                                            uncheckedIcon={'circle'}
                                                                            checked={user?.isSelected}
                                                                            onPress={() => {
                                                                                let tempLabels = [...this.state?.labels]
                                                                                tempLabels[labelIndex].resources[userIndex].isSelected = !tempLabels[labelIndex].resources[userIndex].isSelected
                                                                                this.setState({labels: tempLabels})
                                                                            }}
                                                                        >
                                                                        </CheckBox>
                                                                    </View>
                                                                    <View style={[styles.tableCellView]}>
                                                                        <StyledText>{user?.displayName}</StyledText>
                                                                    </View>

                                                                </View>
                                                            }
                                                            onPress={() => {
                                                                let tempLabels = [...this.state?.labels]
                                                                tempLabels[labelIndex].resources[userIndex].isSelected = !tempLabels[labelIndex].resources[userIndex].isSelected
                                                                this.setState({labels: tempLabels})
                                                            }}
                                                            bottomDivider
                                                            containerStyle={[styles.dynamicVerticalPadding(5), {backgroundColor: customBackgroundColor},]}
                                                        />
                                                    ))}
                                                    {label?.resources?.length === 0 && (
                                                        <ListItem
                                                            title={
                                                                <View style={[styles.tableRowContainer]}>
                                                                    <View style={[styles.tableCellView]}>
                                                                        <StyledText>({t('empty')})</StyledText>
                                                                    </View>
                                                                </View>
                                                            }
                                                            onPress={() => {

                                                            }}
                                                            bottomDivider
                                                            containerStyle={[styles.dynamicVerticalPadding(10), {backgroundColor: customBackgroundColor},]}
                                                        />
                                                    )}
                                                </List>

                                            </Accordion.Panel>
                                        )
                                    })}
                                </Accordion> :
                                    <View>
                                        {this.state?.labels.map((label, labelIndex) => {
                                            return (
                                                <ListItem
                                                    title={
                                                        <View style={[styles.tableRowContainer, {paddingHorizontal: 0}]}>
                                                            <View style={[styles.tableCellView]}>
                                                                <CheckBox
                                                                    containerStyle={{margin: 0, padding: 0}}
                                                                    checkedIcon={'check-circle'}
                                                                    uncheckedIcon={'circle'}
                                                                    checked={label?.labelIsSelected}
                                                                    onPress={() => {
                                                                        let tempLabels = [...this.state?.labels]
                                                                        tempLabels[labelIndex].labelIsSelected = !tempLabels[labelIndex].labelIsSelected
                                                                        this.setState({labels: tempLabels})
                                                                    }}
                                                                >
                                                                </CheckBox>
                                                            </View>
                                                            <View style={[styles.tableCellView]}>
                                                                <StyledText>{label?.labelName}</StyledText>
                                                            </View>

                                                        </View>
                                                    }
                                                    onPress={() => {
                                                        let tempLabels = [...this.state?.labels]
                                                        tempLabels[labelIndex].labelIsSelected = !tempLabels[labelIndex].labelIsSelected
                                                        this.setState({labels: tempLabels})
                                                    }}
                                                    bottomDivider
                                                    containerStyle={[styles.dynamicVerticalPadding(5), {backgroundColor: customBackgroundColor},]}
                                                />
                                            )
                                        })}
                                    </View>}
                            </View> : <View style={{flex: 1}}></View>}
                            <View style={[{marginTop: 30, justifyContent: 'flex-end'}]}>
                                {this.state.uneditable || <TouchableOpacity onPress={
                                    this.state?.isManager ?
                                        handleSubmit(data => {
                                            this.handleSubmit(data, !!this.state.data?.eventName)
                                        }) :
                                        () => this.handleStaffSubmit()}>
                                    <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                                        {t('action.save')}
                                    </Text>
                                </TouchableOpacity>}

                                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                    <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>
                                        {t('action.cancel')}
                                    </Text>
                                </TouchableOpacity>
                                {!!this.state.data && this.state?.isManager && <DeleteBtn handleDeleteAction={() => this.handleDelete()} />}
                            </View>

                        </View>


                    </View>
                </View>
            </ThemeScrollView>

        )
    }
}

const mapStateToProps = state => ({
    isLoading: state.offers.loading,
    client: state.client.data,
    currentUser: state.clientuser.data,
})

const mapDispatchToProps = dispatch => ({
    dispatch,
    getCurrentClient: () => dispatch(getCurrentClient())
})

RostersFormScreen = reduxForm({
    form: 'rosterForm'
})(RostersFormScreen)

export default connect(mapStateToProps, mapDispatchToProps)(RostersFormScreen)

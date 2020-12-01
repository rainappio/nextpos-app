import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {connect} from 'react-redux'
import {ScrollView, Text, TouchableOpacity, View} from 'react-native'
import {isNDigitsNumber, isRequired, isTwoBigWords} from '../validators'
import InputText from '../components/InputText'
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
import {RenderTimePicker} from '../components/DateTimePicker'
import TimeZoneService from "../helpers/TimeZoneService";
import {normalizeTimeString} from '../actions'


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
            ]
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState !== this.state;
    }

    componentDidMount() {
        if (!this.props.navigation?.state?.params?.data) {
            this.props?.change(`selectedYear`, new Date().getFullYear())
            this.props?.change(`selectedMonth`, new Date().getMonth() + 1)
        }
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
        if (!isEdit) {
            let request = JSON.stringify({
                "year": values?.selectedYear ?? '',
                "month": values?.selectedMonth ?? '',
                "rosterEntries": rosterEntriesArr
            })
            console.log('form', request)
            dispatchFetchRequest(api.roster.createPlan, {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "year": values?.selectedYear ?? '',
                    "month": values?.selectedMonth ?? '',
                    "rosterEntries": rosterEntriesArr
                })
            }, response => {
                response.json().then(data => {
                    console.log('handleSubmit', data)
                    this.props.navigation?.state?.params?.refreshScreen()
                    this.props.navigation.goBack()
                })
            }).then()
        } else {
            console.log('else', rosterEntriesArr)

            for (let i = 0; i < rosterEntriesArr.length; i++) {
                const item = rosterEntriesArr[i]

                await dispatchFetchRequest(api.roster.createEntry(this.state?.data?.id), {
                    method: 'POST',
                    withCredentials: true,
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "dayOfWeek": item?.dayOfWeek ?? '',
                        "startTime": item?.startTime ?? '',
                        "endTime": item?.endTime ?? '',
                    })
                }, response => {
                    response.json().then(data => {

                    })
                }).then()
            }
            this.props.navigation?.state?.params?.refreshScreen()
            this.props.navigation.goBack()
        }

    }
    handleDelete = async () => {
        await dispatchFetchRequest(
            api.roster.deletePlan(this.state?.data?.id),
            {
                method: 'DELETE',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            },
            response => {

            }
        ).then()
        await this.props.navigation?.state?.params?.refreshScreen()
        await this.props.navigation.goBack()
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

    deleteForm = (index) => {
        if (index < this.state.rosterEntriesLength) {
            dispatchFetchRequest(
                api.roster.deleteEntry(this.state?.data?.id, this.state.rosterEntries?.[index]?.id),
                {
                    method: 'DELETE',
                    withCredentials: true,
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                },
                response => {
                    console.log('response', response.url)
                    response.json().then(data => {
                        console.log('res', data)
                        let arr = [...this.state.rosterEntries]
                        let showFromDateArr = [...this.state.showFromDate]
                        let showToDateArr = [...this.state.showToDate]
                        delete arr[index]
                        delete showFromDateArr[index]
                        delete showToDateArr[index]
                        this.setState({
                            rosterEntries: arr,
                            showFromDate: showFromDateArr,
                            showToDate: showToDateArr
                        })
                    })

                }
            ).then()
        } else {
            let arr = [...this.state.rosterEntries]
            let showFromDateArr = [...this.state.showFromDate]
            let showToDateArr = [...this.state.showToDate]
            delete arr[index]
            delete showFromDateArr[index]
            delete showToDateArr[index]
            this.setState({
                rosterEntries: arr,
                showFromDate: showFromDateArr,
                showToDate: showToDateArr
            })
        }


    }
    handlegetDate = (event, selectedDate) => {
        console.log(`selected date: ${selectedDate}`)
    }

    showFromDatepicker = (index) => {
        let showFromDateArr = [...this.state.showFromDate]
        showFromDateArr[index] = !showFromDateArr[index]
        this.setState({
            showFromDate: showFromDateArr
        })
    };

    showToDatepicker = (index) => {
        let showToDateArr = [...this.state.showToDate]
        showToDateArr[index] = !showToDateArr[index]
        this.setState({
            showToDate: showToDateArr
        })
    };

    render() {
        const {t} = this.context
        const {handleSubmit} = this.props


        return (

            <ThemeContainer>
                <View style={styles.container}>
                    <View style={{flex: 7, }}>
                        <ScreenHeader title={t('settings.roster')} />
                        {!this.state.data && <><View style={[{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 2,
                            marginBottom: 5,
                            flexBasis: 64
                        }]}>
                            <View style={[styles.tableCellView, styles.flex(1)]}>
                                <StyledText style={styles.fieldTitle}>{t('roster.year')}</StyledText>
                            </View>
                            <View style={[styles.justifyRight]}>
                                <Field
                                    name="selectedYear"
                                    component={DropDown}
                                    options={this.state.selectedYear}
                                />
                            </View>
                        </View>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 2,
                                marginBottom: 5,
                                flexBasis: 50
                            }}>
                                <View style={[styles.tableCellView, styles.flex(1)]}>
                                    <StyledText style={styles.fieldTitle}>{t('roster.month')}</StyledText>
                                </View>
                                <View style={[styles.justifyRight]}>
                                    <Field
                                        name="selectedMonth"
                                        component={DropDown}
                                        options={this.state.selectedMonth}
                                    />
                                </View>
                            </View></>}
                        {!!this.state.data && <>
                            <View style={{
                                paddingVertical: 12,
                                paddingHorizontal: 10,
                                flexDirection: 'row'
                            }}>
                                <StyledText style={{flex: 1, textAlign: 'center'}}>{this.state?.data?.rosterMonth}</StyledText>
                            </View>
                        </>}
                        {this.state.uneditable || <View style={{flexDirection: 'row', alignSelf: 'center', marginVertical: 10}}>
                            <Icon
                                name="pluscircleo"
                                size={32}
                                color={'gray'}
                                onPress={() => {
                                    this.addForm()
                                }}
                            />
                        </View>}
                        <ThemeKeyboardAwareScrollView style={{flex: 1}}>

                            {this.state.rosterEntries?.map((item, index) => {
                                if (item === undefined)
                                    return null
                                return (<View style={{
                                    paddingVertical: 12,
                                    paddingHorizontal: 10,
                                    borderColor: '#f1f1f1',
                                    borderBottomWidth: 1,
                                    flexDirection: 'row'
                                }}>

                                    <View style={{flex: 15, flexDirection: 'column'}}>
                                        <View style={styles.fieldContainer}>
                                            <View style={[styles.tableCellView, {flex: 1}]}>
                                                <StyledText style={styles.fieldTitle}>{t('roster.dayOfWeek')}</StyledText>
                                            </View>
                                            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>

                                                <Field
                                                    name={`dayOfWeek${index}`}
                                                    component={DropDown}
                                                    options={this.state.dayOfWeek}
                                                    placeholder={{value: null, label: ``}}
                                                    validate={isRequired}
                                                    defaultValue={item?.dayOfWeek}
                                                    disabled={index <= this.state.rosterEntriesLength - 1 ? true : false}
                                                />
                                            </View>
                                        </View>
                                        <View style={styles.fieldContainer}>
                                            <View style={[styles.tableCellView, {flex: 1}]}>
                                                <StyledText style={styles.fieldTitle}>{t('roster.startTime')}</StyledText>
                                            </View>
                                            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>

                                                <Field
                                                    name={`startTime${index}`}
                                                    component={RenderTimePicker}
                                                    onChange={this.handlegetDate}
                                                    placeholder={t('order.fromDate')}
                                                    isShow={this.state.showFromDate?.[index] ?? false}
                                                    showDatepicker={() => this.showFromDatepicker(index)}
                                                    defaultValue={normalizeTimeString(item?.startTime)}
                                                    readonly={index <= this.state.rosterEntriesLength - 1 ? true : false}
                                                />
                                            </View>
                                        </View>
                                        <View style={styles.fieldContainer}>
                                            <View style={[styles.tableCellView, {flex: 1}]}>
                                                <StyledText style={styles.fieldTitle}>{t('roster.endTime')}</StyledText>
                                            </View>
                                            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>

                                                <Field
                                                    name={`endTime${index}`}
                                                    component={RenderTimePicker}
                                                    onChange={this.handlegetDate}
                                                    isShow={this.state.showToDate?.[index] ?? false}
                                                    showDatepicker={() => this.showToDatepicker(index)}
                                                    defaultValue={normalizeTimeString(item?.endTime)}
                                                    readonly={index <= this.state.rosterEntriesLength - 1 ? true : false}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    {this.state.uneditable || <View style={{marginLeft: 10, alignItems: 'center', justifyContent: 'center'}}>
                                        <Icon
                                            name="minuscircleo"
                                            size={32}
                                            color={'gray'}
                                            onPress={() => {
                                                this.deleteForm(index)
                                            }}
                                        />
                                    </View>}
                                </View>)
                            })}


                        </ThemeKeyboardAwareScrollView>
                    </View>


                    <View style={[{marginTop: 30, justifyContent: 'flex-end'}]}>
                        {this.state.uneditable || <TouchableOpacity onPress={handleSubmit(data => {
                            this.handleSubmit(data, !!this.state.data)
                        })}>
                            <Text style={[styles.bottomActionButton, styles.actionButton]}>
                                {t('action.save')}
                            </Text>
                        </TouchableOpacity>}

                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Text style={[styles.bottomActionButton, styles.cancelButton]}>
                                {t('action.cancel')}
                            </Text>
                        </TouchableOpacity>
                        {!!this.state.data && <DeleteBtn handleDeleteAction={() => this.handleDelete()} />}
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

RostersFormScreen = reduxForm({
    form: 'rosterForm'
})(RostersFormScreen)

export default connect(mapStateToProps, mapDispatchToProps)(RostersFormScreen)

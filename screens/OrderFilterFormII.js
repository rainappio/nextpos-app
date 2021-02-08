import React from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import {Field, reduxForm} from 'redux-form'
import RenderDateTimePicker from '../components/DateTimePicker'
import DropDown from '../components/DropDown'
import {LocaleContext} from '../locales/LocaleContext'
import styles from '../styles'
import {StyledText} from "../components/StyledText";
import SegmentedControl from "../components/SegmentedControl";
import TimePeriodPicker from "../components/TimePeriodPicker";
import moment from "moment";

class OrderFilterFormII extends React.Component {
    static contextType = LocaleContext
    state = {
        dateRange: this.props?.initialValues?.dateRange ?? 0,
        readonly: true,
        showFromDate: false,
        showToDate: false,
        currentDate: this.props?.initialValues?.fromDate ?? new Date()
    }





    handlegetDate = (event, selectedDate) => {
        console.log(`selected date: ${selectedDate}`)
    }

    showFromDatepicker = () => {
        this.setState({
            showFromDate: !this.state.showFromDate
        })
    };

    showToDatepicker = () => {
        this.setState({
            showToDate: !this.state.showToDate
        })
    };

    render() {
        const {handleSubmit, handlegetDate, change, initialValues} = this.props
        const {t, isTablet} = this.context
        if (isTablet) {
            return (
                <View>
                    <View style={[styles.tableRowContainer, {marginBottom: 8}]}>
                        <View style={[styles.tableCellView, {flex: 3, marginRight: 5, flexDirection: 'column', justifyContent: 'center'}]}>
                            <Field
                                name="dateRange"
                                component={SegmentedControl}
                                onChange={(val) => {this.setState({dateRange: val})}}
                                values={[t('dateRange.SHIFT'), t('dateRange.TODAY'), t('dateRange.WEEK'), t('dateRange.MONTH'), t('dateRange.RANGE')]}
                            />
                        </View>
                        <View style={[styles.tableCellView, styles.justifyRight]}>
                            <TouchableOpacity
                                style={{flex: 1, marginLeft: 40}}
                                onPress={() => handleSubmit()}>
                                <Text
                                    style={[
                                        styles.searchButton
                                    ]}
                                >
                                    {t('action.search')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {this.state.dateRange === 4 && <View style={[styles.tableRowContainer, {paddingTop: 0}]}>
                        <View style={[styles.tableCellView, {flex: 2}]}>
                            <Field
                                name="fromDate"
                                component={RenderDateTimePicker}
                                onChange={this.handlegetDate}
                                placeholder={t('order.fromDate')}
                                isShow={this.state.showFromDate}
                                showDatepicker={this.showFromDatepicker}
                                defaultValue={initialValues?.fromDate ?? new Date()}
                            />
                        </View>
                        <View style={[styles.tableCellView, {flex: 0.2, justifyContent: 'center'}]}>
                            <StyledText>-</StyledText>
                        </View>
                        <View style={[styles.tableCellView, {flex: 2}]}>
                            <Field
                                name="toDate"
                                component={RenderDateTimePicker}
                                onChange={this.handlegetDate}
                                placeholder={t('order.toDate')}
                                isShow={this.state.showToDate}
                                showDatepicker={this.showToDatepicker}
                                defaultValue={initialValues?.toDate ?? new Date()}
                            />
                        </View>
                    </View>}
                    {this.state.dateRange === 3 && <TimePeriodPicker
                        currentDate={this.state.currentDate}
                        selectedFilter='months'
                        handleDateChange={(date) => {
                            this.setState({currentDate: date})
                            change('fromDate', new Date(moment().year(date.year()).month(date.month()).date(1)))
                            change('toDate', new Date(moment().year(date.year()).month(date.month() + 1).date(0)))

                        }}
                    />}
                    {this.state.dateRange === 2 && <TimePeriodPicker
                        currentDate={this.state.currentDate}
                        selectedFilter='weeks'
                        handleDateChange={(date) => {
                            this.setState({currentDate: date})
                            change('fromDate', new Date(moment(date).isoWeekday(1)))
                            change('toDate', new Date(moment(date).isoWeekday(7)))

                        }}
                    />}
                </View>
            )
        } else {
            return (
                <View>

                    <View style={[styles.tableCellView, {flex: 3, marginHorizontal: 2, marginBottom: 8, flexDirection: 'column', justifyContent: 'center'}]}>
                        <Field
                            name="dateRange"
                            component={SegmentedControl}
                            onChange={(val) => {this.setState({dateRange: val})}}
                            values={[t('dateRange.SHIFT'), t('dateRange.TODAY'), t('dateRange.WEEK'), t('dateRange.MONTH'), t('dateRange.RANGE')]}
                        />
                    </View>



                    {this.state.dateRange === 4 && <View style={[styles.tableRowContainer, {paddingBottom: 0, paddingHorizontal: 0}]}>
                        <View style={[styles.tableCellView, {flex: 2}]}>
                            <Field
                                name="fromDate"
                                component={RenderDateTimePicker}
                                onChange={this.handlegetDate}
                                placeholder={t('order.fromDate')}
                                isShow={this.state.showFromDate}
                                showDatepicker={this.showFromDatepicker}
                                defaultValue={initialValues?.fromDate ?? new Date()}
                            />
                        </View>
                        <View style={[styles.tableCellView, {flex: 0.2, justifyContent: 'center'}]}>
                            <StyledText>-</StyledText>
                        </View>
                        <View style={[styles.tableCellView, {flex: 2}]}>
                            <Field
                                name="toDate"
                                component={RenderDateTimePicker}
                                onChange={this.handlegetDate}
                                placeholder={t('order.toDate')}
                                isShow={this.state.showToDate}
                                showDatepicker={this.showToDatepicker}
                                defaultValue={initialValues?.toDate ?? new Date()}
                            />
                        </View>
                    </View>}
                    {this.state.dateRange === 3 && <TimePeriodPicker
                        currentDate={this.state.currentDate}
                        selectedFilter='months'
                        handleDateChange={(date) => {
                            this.setState({currentDate: date})

                            change('fromDate', new Date(moment().year(date.year()).month(date.month()).date(1)))
                            change('toDate', new Date(moment().year(date.year()).month(date.month() + 1).date(0)))

                        }}
                    />}
                    {this.state.dateRange === 2 && <TimePeriodPicker
                        currentDate={this.state.currentDate}
                        selectedFilter='weeks'
                        handleDateChange={(date) => {
                            this.setState({currentDate: date})

                            change('fromDate', new Date(moment(date).isoWeekday(1)))
                            change('toDate', new Date(moment(date).isoWeekday(7)))

                        }}
                    />}
                    <View style={[styles.tableRowContainer]}>
                        <View style={[styles.tableCellView, styles.justifyRight]}>
                            <TouchableOpacity
                                style={{flex: 1}}
                                onPress={() => handleSubmit()}>
                                <Text
                                    style={[
                                        styles.searchButton
                                    ]}
                                >
                                    {t('action.search')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
        }


    }
}

OrderFilterFormII = reduxForm({
    form: 'orderfilterFormII'
})(OrderFilterFormII)

export default OrderFilterFormII

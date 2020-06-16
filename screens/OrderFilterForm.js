import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { Field, reduxForm } from 'redux-form'
import RenderDatePicker from '../components/DateTimePicker'
import DropDown from '../components/DropDown'
import { LocaleContext } from '../locales/LocaleContext'
import moment from 'moment'
import styles from '../styles'

class OrderFilterForm extends React.Component {
  static contextType = LocaleContext
  state = {
    readonly: true,
    showFromDate: false,
    showToDate: false,
  }

  componentDidMount() {

    this.context.localize({
      en: {
        dateRange: {
          SHIFT: 'Shift Duration',
          TODAY: 'Today',
          WEEK: 'This Week',
          MONTH: 'This Month',
          RANGE: 'Date Range'
        }
      },
      zh: {
        dateRange: {
          SHIFT: '開帳期間',
          TODAY: '今日',
          WEEK: '本週',
          MONTH: '本月',
          RANGE: '自訂日期'
        }
      }
    })
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
    const { handleSubmit, handlegetDate } = this.props
    const { t } = this.context

    return (
      <View>
        <View style={[styles.tableRowContainer]}>
          <View style={{ flex: 3, marginRight: 5}}>
            <Field
              name="dateRange"
              component={DropDown}
              options={[
              	{ label: t('dateRange.RANGE'), value: 'RANGE' },
                { label: t('dateRange.SHIFT'), value: 'SHIFT' },
                { label: t('dateRange.TODAY'), value: 'TODAY' },
                { label: t('dateRange.WEEK'), value: 'WEEK' },
                { label: t('dateRange.MONTH'), value: 'MONTH' }
              ]}
              forFilter={true}
              onChange={(value) => {
                this.setState({
                  readonly: value !== 'RANGE'
                })
              }}
            />
          </View>
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <TouchableOpacity
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

        <View style={[styles.sectionContainer]}>
          <View style={[styles.tableRowContainer]}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <Field
                name="fromDate"
                component={RenderDatePicker}
                onChange={this.handlegetDate}
                placeholder={t('order.fromDate')}
                isShow={this.state.showFromDate}
                showDatepicker={this.showFromDatepicker}
                readonly={this.state.readonly}
              />
            </View>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <Field
                name="toDate"
                component={RenderDatePicker}
                onChange={this.handlegetDate}
                placeholder={t('order.toDate')}
                isShow={this.state.showToDate}
                showDatepicker={this.showToDatepicker}
                readonly={this.state.readonly}
              />
            </View>
          </View>
        </View>
      </View>
    )
  }
}

OrderFilterForm = reduxForm({
  form: 'orderfilterForm'
})(OrderFilterForm)

export default OrderFilterForm

import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { Field, reduxForm } from 'redux-form'
import RenderDatePicker from '../components/DatePicker'
import DropDown from '../components/DropDown'
import { LocaleContext } from '../locales/LocaleContext'
import styles from '../styles'

class OrderFilterForm extends React.Component {
  static contextType = LocaleContext
  state = {
    date: new Date(1598051730000),
		pickdateRange: ''
  }

  componentDidMount() {

    this.context.localize({
      en: {
        dateRange: {
          SHIFT: 'During Shift',
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

  handlegetDate = date => {
    this.setState({
      date: date
    })
  }

  handlegetDateRange = dateRange => {
		this.setState({
			pickdateRange: dateRange
		})
  }

  render() {
    const { handleSubmit, handlegetDate } = this.props
    const { t } = this.context

    return (
      <View>
        <View style={[styles.tableRowContainer]}>
          <View style={[styles.tableCellView, { flex: 3 }]}>
            <Field
              name="dateRange"
              component={DropDown}
              onChange={this.handlegetDateRange}
              options={[
              	{ label: t('dateRange.RANGE'), value: 'RANGE' },
                { label: t('dateRange.SHIFT'), value: 'SHIFT' },
                { label: t('dateRange.TODAY'), value: 'TODAY' },
                { label: t('dateRange.WEEK'), value: 'WEEK' },
                { label: t('dateRange.MONTH'), value: 'MONTH' }
              ]}
              forFilter={true}
            />
          </View>
          <View style={[styles.tableCellView, { flex: 1, justifyContent: 'flex-end' }]}>
            <TouchableOpacity
              //style={{flex: 1}}
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

        {this.state.pickdateRange === 'RANGE' && (
          <View style={styles.tableRowContainer}>
            <View style={[styles.tableCellView, {flex: 3}]}>
              <View style={{flex: 1}}>
                <Field
                  name="fromDate"
                  component={RenderDatePicker}
                  onChange={date => this.handlegetDate(date)}
                  placeholder={t('order.fromDate')}
                />
              </View>

              <View style={{flex: 1}}>
                <Field
                  name="toDate"
                  component={RenderDatePicker}
                  onChange={date => this.handlegetDate(date)}
                  placeholder={t('order.toDate')}
                />
              </View>
            </View>
          </View>
        )}
      </View>
    )
  }
}

OrderFilterForm = reduxForm({
  form: 'orderfilterForm',
  initialValues: {
  	dateRange: 'SHIFT'
  }
})(OrderFilterForm)

export default OrderFilterForm

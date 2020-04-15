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
    date: new Date(1598051730000),
    mode: '',
    showFromDate: false,
    showToDate: false,
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

  handlegetDateRange = dateRange => {
		this.setState({
			pickdateRange: dateRange
		})
  }

  handlegetDate = (event, selectedDate) => {  	
  	this.setState({
      date: selectedDate,
      showFromDate: false,
      showToDate: false
    })
  }

  showFromDatepicker = () => {
    this.setState({
  		showFromDate: !this.state.showFromDate,
  		mode: 'date'
  	})
  };

  showToDatepicker = () => {
    this.setState({
  		showToDate: !this.state.showToDate,
  		mode: 'date'
  	})
  };

  render() {
    const { handleSubmit, handlegetDate } = this.props
    const { t } = this.context

    return (
      <View>
        <View style={[styles.tableRowContainer]}>
          <View style={{ flex: 3.5, marginRight: 5}}>
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
          <View style={{ flex: 1.5, justifyContent: 'flex-end' }}>
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
          <View style={[styles.tableRowContainer]}>
        		<View style={[styles.tableCellView, {flex: 1, marginRight: 5}]}>
          		<Field
            		name="fromDate"
                component={RenderDatePicker}
                onChange={this.handlegetDate}
                placeholder={t('order.fromDate')}
                isShow={this.state.showFromDate}                
                showDatepicker={this.showFromDatepicker}           
          		/>
        		</View>

        		<View style={[styles.tableCellView, {flex: .9}]}>
          		<Field
            		name="toDate"
                component={RenderDatePicker}
                onChange={this.handlegetDate}
                placeholder={t('order.toDate')}
                isShow={this.state.showToDate}
                showDatepicker={this.showToDatepicker}                
          		/>
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
  	dateRange: 'SHIFT',
  	fromDate: moment(new Date().toISOString(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
  	toDate: moment(new Date().toISOString(), 'YYYY-MM-DD').format('YYYY-MM-DD')
  }
})(OrderFilterForm)

export default OrderFilterForm

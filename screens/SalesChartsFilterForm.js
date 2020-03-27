import React from 'react'
import { connect } from 'react-redux'
import { Text, View, TouchableOpacity } from 'react-native'
import { Field, reduxForm } from 'redux-form'
import RenderDatePicker from '../components/DateTimePicker'
import DropDown from '../components/DropDown'
import { LocaleContext } from '../locales/LocaleContext'
import moment from 'moment'
import styles from '../styles'

class SalesChartsFilterForm extends React.Component {
  static contextType = LocaleContext
  state = {
    date: new Date(1598051730000),
    mode: '',
    show: false,
		pickdateRange: ''
  }

  handlegetDate = (event, selectedDate) => {
  	this.setState({
      date: selectedDate,
      show: false
    })
  }

  showDatepicker = () => {
    this.setState({
  		show: true,
  		mode: 'date'
  	})
  };

  render() {
    const { handleSubmit, searchDate, needmonthFilter } = this.props
    const { t } = this.context

    return (
    	<View style={[styles.container, styles.no_mgrTop]}>
    		<Field
        	name="date"
        	component={RenderDatePicker}
        	onChange={this.handlegetDate}
        	placeholder={t('order.date')}
        	isShow={this.state.show}
        	showDatepicker={this.showDatepicker}
      	/>
      	<View style={[styles.flex_dir_row, {marginTop: 40}]}>        	
        	{
        		needmonthFilter
        		?
        		<View style={{ flex: 1.5 }}>   
        			<Field
            		name="month"
            		component={DropDown}
            		placeholder={{value: null, label: t('monthLabel')}}
            		options={[
              		{label: 'JANUARY', value: 'JANUARY'},
              		{label: 'FEBRUARY', value: 'FEBRUARY'},
              		{label: 'MARCH', value: 'MARCH'},
              		{label: 'APRIL', value: 'APRIL'},
              		{label: 'MAY', value: 'MAY'},
              		{label: 'JUNE', value: 'JUNE'},
              		{label: 'JULY', value: 'JULY'},
              		{label: 'AUGUST', value: 'AUGUST'},
              		{label: 'SEPTEMBER', value: 'SEPTEMBER'},
              		{label: 'OCTOBER', value: 'OCTOBER'},
              		{label: 'NOVEMBER', value: 'NOVEMBER'},
              		{label: 'DECEMBER', value: 'DECEMBER'},
            		]}
            		forFilter={true}
          		/>
          	</View>
        		:
        		<View style={{ flex: 2 }}>
        			<View style={styles.flex_dir_row}>
        				{/*<View style={{ flex: 1.5, marginRight: 10 }}>
        				          				<Field
        				            				name="date"
        				            				component={RenderDatePicker}
        				            				onChange={(e,date) => this.handlegetDate(date)}
        				            				placeholder={t('order.date')}
        				            				isShow={show}
        				            				//getWeekDuration={() => this.getWeekDuration()}
        				            				showDatepicker={() => this.showDatepicker()}
        				          				/>
        				        				</View>*/}

        				<View style={{ flex: 1 ,marginLeft: 10, marginTop: 10 }}>
          				<Text>{searchDate}</Text>
        				</View>
        			</View>
        		</View>
        	} 

        	<View style={{ flex: 0.8, marginLeft: 8 }}>
          	<TouchableOpacity onPress={() => handleSubmit()}>
            	<Text
              	style={[
                	styles.bottomActionButton,
                	styles.actionButton,
                	{ padding: 8 }
              	]}
            	>
            	Search
            	</Text>
          	</TouchableOpacity>
        	</View>
      	</View>
      </View>
    )
  }
}

SalesChartsFilterForm = reduxForm({
  form: 'salesChartFilterForm',
  initialValues: {date: moment(new Date().toISOString(), 'YYYY-MM-DD').format('YYYY-MM-DD')}
})(SalesChartsFilterForm)

export default SalesChartsFilterForm
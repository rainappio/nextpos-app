import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { Field, reduxForm } from 'redux-form'
import RenderDatePicker from '../components/DatePicker'
import DropDown from '../components/DropDown'
import { LocaleContext } from '../locales/LocaleContext'
import styles from '../styles'

class SalesChartsFilterForm extends React.Component {
  static contextType = LocaleContext
  state = {
    date: new Date(1598051730000),
		pickdateRange: ''
  }

  handlegetDate = date => {
    this.setState({
      date: date
    })
  }

  render() {
    const { handleSubmit, searchDate } = this.props
    const { t } = this.context

    return (
    	<View style={[styles.container, styles.no_mgrTop]}>
      	<View style={[styles.flex_dir_row, {marginTop: 40}]}>
        	<View style={{ flex: 1 }}>
          	<Field
            	name="date"
            	component={RenderDatePicker}
            	onChange={date => this.handlegetDate(date)}
            	placeholder={t('order.date')}
          	/>
        	</View>

        	<View style={{ flex: 0.8 ,marginLeft: 10, marginTop: 10 }}>
          	<Text>{searchDate}</Text>
        	</View>

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
})(SalesChartsFilterForm)

export default SalesChartsFilterForm

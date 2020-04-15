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
  		show: !this.state.show,
  		mode: 'date'
  	})
  };

  render() {
    const { handleSubmit } = this.props
    const { t } = this.context

    return (
    	<View style={[styles.tableRowContainer]}>
        <View style={[styles.tableCellView, {flex: 3}]}>
          <Field
            name="date"
            component={RenderDatePicker}
            onChange={this.handlegetDate}
            placeholder={t('order.date')}
            isShow={this.state.show}
            showDatepicker={this.showDatepicker}
            needWeekFilter={true}
          />
        </View>
        <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-start'}]}>
        <TouchableOpacity onPress={() => handleSubmit()}>
          <Text
            style={[styles.searchButton]}
          >
            {t('action.search')}
          </Text>
        </TouchableOpacity>
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

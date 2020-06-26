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
    from: {
      show: false
    },
    to: {
      show: false
    }
  }

  handlegetDate = (event, selectedDate) => {
    console.log(`selected datetime: ${selectedDate}`)
  }

  showDatepicker = (which) => {

    if (which === 'from') {
      this.setState({
        from: {
          show: !this.state.from.show
        }
      })

    } else if (which === 'to') {
      this.setState({
        to: {
          show: !this.state.to.show
        }
      })
    }
  };

  render() {
    const { handleSubmit } = this.props
    const { t } = this.context

    return (
      <View>
        <View style={[styles.tableRowContainer]}>
          <View style={[styles.tableCellView, { flex: 2 }]}>
            <Field
              name="fromDate"
              component={RenderDatePicker}
              onChange={this.handlegetDate}
              placeholder={t('order.date')}
              isShow={this.state.from.show}
              showDatepicker={() => this.showDatepicker('from')}
              needWeekFilter={true}
            />
          </View>
          <View style={[styles.tableCellView, { flex: 0.2, justifyContent: 'center' }]}>
            <Text>-</Text>
          </View>
          <View style={[styles.tableCellView, { flex: 2 }]}>
            <Field
              name="toDate"
              component={RenderDatePicker}
              onChange={this.handlegetDate}
              placeholder={t('order.date')}
              isShow={this.state.to.show}
              showDatepicker={() => this.showDatepicker('to')}
              needWeekFilter={true}
            />
          </View>
        </View>
        <View style={[styles.tableRowContainer]}>
          <View style={[styles.tableCellView, { flex: 1 }]}>
            <TouchableOpacity
              onPress={() => {
                handleSubmit()
              }}
              style={{ flex: 1 }}
            >
              <Text style={[styles.searchButton]}>
                {t('action.search')}
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

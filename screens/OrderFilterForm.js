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
      	{
      		this.state.pickdateRange === 'RANGE'
      		?
      			<View style={[styles.flex_dir_row, {marginTop: 40}]}>
          		<View style={{ flex: 1 }}>
            		<Field
              		name="fromDate"
              		component={RenderDatePicker}
              		onChange={date => this.handlegetDate(date)}
              		placeholder={t('order.fromDate')}
            		/>
          		</View>

          		<View style={{ flex: 1, marginLeft: 8 }}>
            		<Field
              		name="toDate"
              		component={RenderDatePicker}
              		onChange={date => this.handlegetDate(date)}
              		placeholder={t('order.toDate')}
            		/>
          		</View>
        		</View>
        		:
        		null
      	}        
        <View style={[styles.flex_dir_row]}>
          <View style={{ flex: 2, marginRight: 10}}>
            <Field
              name="dateRange"
              component={DropDown}
              onChange={this.handlegetDateRange}
              options={[
              	{ label: 'RANGE', value: 'RANGE' },
                { label: 'SHIFT', value: 'SHIFT' },
                { label: 'TODAY', value: 'TODAY' },
                { label: 'WEEK', value: 'WEEK' },
                { label: 'MONTH', value: 'MONTH' }
              ]}
              forFilter={true}
            />
          </View>

          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => handleSubmit()}>
              <Text
                style={[
                  styles.bottomActionButton,
                  styles.actionButton,
                  { padding: 12 }
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

OrderFilterForm = reduxForm({
  form: 'orderfilterForm',
  initialValues: {
  	dateRange: 'SHIFT'
  }
})(OrderFilterForm)

export default OrderFilterForm

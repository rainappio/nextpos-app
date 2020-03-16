import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { Field, reduxForm } from 'redux-form'
import XGFEDatePicker from '../components/XGFEDatePicker'
import DropDown from '../components/DropDown'
import { LocaleContext } from '../locales/LocaleContext'
import styles from '../styles'

class OrderFilterForm extends React.Component {
  static contextType = LocaleContext
  state = {
    date: new Date(1598051730000)
  }

  handlegetDate = date => {
    this.setState({
      date: date
    })
  }
  render() {
    const { handleSubmit, handlegetDate } = this.props
    const { t } = this.context
    return (
      <View>
        <View style={[styles.flex_dir_row]}>
          <View style={{ flex: 1 }}>
            <Field
              name="fromDate"
              component={XGFEDatePicker}
              onChange={handlegetDate}
              placeholder={t('selectDate')}
            />
          </View>

          <View style={{ flex: 1, marginLeft: 8 }}>
            <Field
              name="toDate"
              component={XGFEDatePicker}
              onChange={date => this.handlegetDate(date)}
              placeholder={t('selectDate')}
            />
          </View>
        </View>

        <View style={[styles.flex_dir_row]}>
          <View style={{ flex: 2 }}>
            <Field
              name="dateRange"
              component={DropDown}
              placeholder={{ value: null, label: t('dateRange') }}
              options={[
                { label: 'SHIFT', value: 'SHIFT' },
                { label: 'TODAY', value: 'TODAY' },
                { label: 'WEEK', value: 'WEEK' },
                { label: 'MONTH', value: 'MONTH' }
              ]}
              forFilter={true}
            />
          </View>

          <View style={{ flex: 1, paddingTop: 10 }}>
            <TouchableOpacity onPress={() => handleSubmit()}>
              <Text
                style={[
                  styles.bottomActionButton,
                  styles.actionButton,
                  { padding: 6 }
                ]}
              >
                {t('searchButton')}
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
  enableReinitialize: true
})(OrderFilterForm)

export default OrderFilterForm

import React from 'react'
import {Field} from 'redux-form'
import {Text, TouchableOpacity, View} from 'react-native'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import DropDown from '../components/DropDown'
import moment from "moment";

class TimeCardFilterForm extends React.Component {
  static contextType = LocaleContext

  render() {
    const {t, customMainThemeColor} = this.context
    const {handleSubmit, handleExport} = this.props

    const years = []
    for (let i = -5; i <= 0; i++) {
      const year = String(moment().add(i, 'y').year())
      years.push({
        label: year,
        value: year
      })
    }

    const months = []
    for (let i = 0; i < 12; i++) {
      const month = moment().month(i)
      months.push({
        label: month.format('MMMM'),
        value: String(month.month() + 1)
      })
    }

    return (
      <View style={[styles.tableRowContainer]}>
        <View style={{flex: 2.5, marginRight: 5, marginLeft: 4}}>
          <Field
            name="year"
            component={DropDown}
            placeholder={{value: null, label: t('timecard.yearLabel')}}
            options={years}
          />
        </View>

        <View style={{flex: 3.5}}>
          <Field
            name="month"
            component={DropDown}
            placeholder={{value: null, label: t('timecard.monthLabel')}}
            options={months}
          />
        </View>

        <View style={{flex: 3}}>
          <TouchableOpacity
            style={{flex: 1, marginLeft: 5, marginRight: 4, marginBottom: 5}}
            onPress={() => handleSubmit()}
          >
            <Text style={[styles?.searchButton(customMainThemeColor)]}>
              {t('action.search')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1, marginLeft: 5, marginRight: 4}}
            onPress={() => handleExport()}
          >
            <Text style={[styles?.searchButton(customMainThemeColor)]}>
              {t('timecard.export')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
export default TimeCardFilterForm

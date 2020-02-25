import React from 'react'
import { Field, reduxForm, FieldArray } from 'redux-form'
import { ScrollView, Text, View, TouchableOpacity, Image, ActivityIndicator, FlatList } from 'react-native'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import Icon from 'react-native-vector-icons/Ionicons'
import { getTimeCards, getMonthName } from '../actions'
import images from '../assets/images'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import DropDown from '../components/DropDown'
import TimeCardFilterForm from './TimeCardFilterForm'

class StaffTimeCardFilterForm extends React.Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
      	title: 'Staff Time Card',
        yearLabel: 'Year',
        monthLabel: 'Month',        
        searchButton: 'Search',
        firstColTitle: 'Staff',
        secColTitle: 'Total(days)',
        thirdColTitle: 'Total(Hrs)'
      },
      zh: {
      	title: 'Staff Time Card-CH',
        yearLabel: 'Year-CH',
        monthLabel: 'Month-CH',
        searchButton: 'Search - CH',
        firstColTitle: 'Staff - CH',
        secColTitle: 'Total(days) - CH',
        thirdColTitle: 'Total(Hrs) - CH'
      }
    })
  }

  render() {
    const { t } = this.context
    const { handleSubmit } = this.props
    
    return (
     <TimeCardFilterForm handleSubmit={handleSubmit}/>
    )
  }
}

StaffTimeCardFilterForm = reduxForm({
  form: 'staffTimeCardFilterForm',
  initialValues: {
    year: ''+ new Date().getFullYear(),
    month: getMonthName(new Date().getMonth() + 1)
  }
})(StaffTimeCardFilterForm)

export default StaffTimeCardFilterForm

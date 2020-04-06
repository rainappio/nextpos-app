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

class CustomerCountFilterForm extends React.Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        yearLabel: 'Year',
        monthLabel: 'Month',
      },
      zh: {
        yearLabel: '年',
        monthLabel: '月'
      }
    })
  }

  render() {
    const { handleSubmit } = this.props

    return (
     <TimeCardFilterForm handleSubmit={handleSubmit}/>
    )
  }
}

CustomerCountFilterForm = reduxForm({
  form: 'customerCountFilterForm',
  initialValues: {
    year: ''+ new Date().getFullYear(),
    month: getMonthName(new Date().getMonth() + 1)
  }
})(CustomerCountFilterForm)

export default CustomerCountFilterForm

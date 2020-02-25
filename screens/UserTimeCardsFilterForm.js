import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, FieldArray } from 'redux-form'
import { ScrollView, Text, View, TouchableOpacity, Image, ActivityIndicator, FlatList, Modal } from 'react-native'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import Icon from 'react-native-vector-icons/Ionicons'
import { getMonthName } from '../actions'
import images from '../assets/images'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import DropDown from '../components/DropDown'
import TimeCardFilterForm from './TimeCardFilterForm'

class UserTimeCardsFilterForm extends React.Component {

  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        title: 'User Time Cards',
        dayLabel: 'Day',
        monthLabel: 'Month',
        Day: 'Day',
        totalHr: 'Total(Hrs)',
        hours: 'hours',
        minutes: 'minutes'
      },
      zh: {
        title: '銷售報表',
        dayLabel: 'Day-CH',
        monthLabel: 'Month-CH',
        Day: 'Day-CH',
        totalHr: 'Total(Hrs)-CH',
        hours: 'hours-CH',
        minutes: 'minutes-CH'
      }
    })
  }

  render() {
    const { t } = this.context
    const { handleSubmit, username } = this.props

    return (
    	<View>
    		<Text style={styles.centerText}>User - {username}</Text>
      	<TimeCardFilterForm 
      		handleSubmit={handleSubmit}/>
      </View>        
    )
  }
}

UserTimeCardsFilterForm = reduxForm({
  form: 'userTimeCardsFilterForm',
  initialValues: {
    year: ''+ new Date().getFullYear(),
    month: getMonthName(new Date().getMonth() + 1)
  },
})(UserTimeCardsFilterForm)

export default UserTimeCardsFilterForm
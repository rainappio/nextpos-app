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
        userTimeCardTitle: 'User Time Cards',
        monthLabel: '月',
        Day: 'Shift',
        totalHr: 'Total Hours'
      },
      zh: {
        userTimeCardTitle: '職員打卡',
        monthLabel: '月',
        Day: '值班',
        totalHr: '總時數'
      }
    })
  }

  render() {
    const { t } = this.context
    const { handleSubmit, displayName } = this.props

    return (
    	<View>
    		<Text style={styles.screenSubTitle}>{displayName}</Text>
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

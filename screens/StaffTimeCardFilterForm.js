import React from 'react'
import { Field, reduxForm, FieldArray } from 'redux-form'
import { ScrollView, Text, View, TouchableOpacity, Image, ActivityIndicator, FlatList } from 'react-native'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import Icon from 'react-native-vector-icons/Ionicons'
import images from '../assets/images'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import DropDown from '../components/DropDown'
import TimeCardFilterForm from './TimeCardFilterForm'

class StaffTimeCardFilterForm extends React.Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { t } = this.context
    const { handleSubmit } = this.props

    return (
      <TimeCardFilterForm
        handleSubmit={handleSubmit}/>
    )
  }
}

StaffTimeCardFilterForm = reduxForm({
  form: 'staffTimeCardFilterForm'
})(StaffTimeCardFilterForm)

export default StaffTimeCardFilterForm

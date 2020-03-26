import React from 'react'
import { Field, reduxForm, FieldArray } from 'redux-form'
import { ScrollView, Text, View, TouchableOpacity, Image, ActivityIndicator, FlatList } from 'react-native'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import Icon from 'react-native-vector-icons/Ionicons'
import { getTimeCards } from '../actions'
import images from '../assets/images'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import DropDown from '../components/DropDown'

class TimeCardFilterForm extends React.Component {
  static contextType = LocaleContext

  render() {
    const { t } = this.context
    const { handleSubmit } = this.props

    return (
      <View style={[styles.tableRowContainer, { flex: 1 }]}>
        <View style={[styles.tableCellView, {flex: 1}]}>
          <Field
            name="year"
            component={DropDown}
            placeholder={{value: null, label: t('yearLabel')}}
            options={[
              {label: '2020', value: '2020'},
              {label: '2021', value: '2021'},
              {label: '2022', value: '2022'},
            ]}
            forFilter={true}
          />
        </View>

        <View style={{flex: 2, marginLeft: 5}}>
          <Field
            name="month"
            component={DropDown}
            placeholder={{value: null, label: t('monthLabel')}}
            options={[
              {label: 'JANUARY', value: 'JANUARY'},
              {label: 'FEBRUARY', value: 'FEBRUARY'},
              {label: 'MARCH', value: 'MARCH'},
              {label: 'APRIL', value: 'APRIL'},
              {label: 'MAY', value: 'MAY'},
              {label: 'JUNE', value: 'JUNE'},
              {label: 'JULY', value: 'JULY'},
              {label: 'AUGUST', value: 'AUGUST'},
              {label: 'SEPTEMBER', value: 'SEPTEMBER'},
              {label: 'OCTOBER', value: 'OCTOBER'},
              {label: 'NOVEMBER', value: 'NOVEMBER'},
              {label: 'DECEMBER', value: 'DECEMBER'},
            ]}
            forFilter={true}
          />
        </View>

        <View style={[styles.tableCellView, { flex: 1, justifyContent: 'flex-end'}]}>
          <TouchableOpacity
            style={{flex: 1, marginLeft: 5}}
            onPress={() => handleSubmit()}
          >
            <Text style={[styles.searchButton]}>
              {t('action.search')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
export default TimeCardFilterForm

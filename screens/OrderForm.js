import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import {Text, View, TouchableOpacity, ScrollView, Picker} from 'react-native'
import DropDown from '../components/DropDown'
import RenderRadioBtn from '../components/RadioItem'
import RenderStepper from '../components/RenderStepper'
import { isRequired } from '../validators'
import { DismissKeyboard } from '../components/DismissKeyboard'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import PickerInput from "../components/PickerInput";
import SegmentedControl from "../components/SegmentedControl";
import { isTablet } from '../actions'

class OrderForm extends Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      selectedTableId: null,
      selectedAgeGroup: null,
      ageGroups: {
        0: {label: '20-29', value: 'TWENTIES'},
        1: {label: '30-39', value: 'THIRTIES'},
        2: {label: '40-49', value: 'FORTIES'},
        3: {label: '50-59', value: 'FIFTIES'}
      },
      selectedVisitFrequency: null,
      visitFrequencies: {
        0: {label: '1', value: 'FIRST_TIME'},
        1: {label: '2 - 3', value: 'TWO_TO_THREE'},
        2: {label: '4+', value: 'MORE_THAN_THREE'}
      }
    }
  }

  componentDidMount() {
    this.context.localize({
      en: {
        newOrderTitle: 'New Order',
        table: 'Table',
        selectTable: 'Select a table',
        ageGroup: 'Age Group',
        visitFrequency: 'Visit Frequency',
        peopleCount: 'People Count',
        openOrder: 'Open Order'
      },
      zh: {
        newOrderTitle: '新訂單',
        table: '桌位',
        selectTable: '選擇桌位',
        ageGroup: '來客年齡層',
        visitFrequency: '造訪次數',
        peopleCount: '來客數',
        openOrder: '建立訂單'
      }
    })
  }

  handleAgeGroupSelection = (index) => {
    const selectedIndex = this.selectedAgeGroup === index ? null : index
    this.setState({ selectedAgeGroup: selectedIndex })
  }

  handleVisitFrequencySelection = (index) => {
    console.log(index)
    const selectedIndex = this.selectedVisitFrequency === index ? null : index
    this.setState({ selectedVisitFrequency: selectedIndex })
  }

  render() {
    const { tablesMap } = this.props
    const { t } = this.context

    const ageGroups = Object.keys(this.state.ageGroups).map(key => this.state.ageGroups[key].label)
    const visitFrequencies = Object.keys(this.state.visitFrequencies).map(key => this.state.visitFrequencies[key].label)

    const people = [
      {
        label: 'Male',
        value: 'male'
      },
      {
        label: 'Female',
        value: 'female'
      },
      {
        label: 'Kid',
        value: 'kid'
      }
    ]

    return (
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        <DismissKeyboard>
          <View style={styles.container}>
            <View>
              <Text style={styles.screenTitle}>
                {t('newOrderTitle')}
              </Text>
            </View>

            <View style={styles.mgrbtn20}>
              <View style={styles.fieldContainer}>
                <Text style={[styles.fieldTitle, styles.defaultfontSize]}>{t('table')}</Text>
              </View>
              <Field
                component={PickerInput}
                name="tableId"
                values={tablesMap}
                selectedValue={this.state.selectedTableId}
                validate={isRequired}
                onChange={(itemValue, itemIndex) => {
                  this.setState({selectedTableId: itemValue})
                }}
              />
            </View>

            <View style={styles.mgrbtn20}>
              <View style={styles.fieldContainer}>
                <Text style={[styles.fieldTitle, styles.defaultfontSize]}>{t('ageGroup')}</Text>
              </View>
              <View style={[styles.fieldContainer, styles.flex_dir_row]}>
                <View style={{flex: 1}}>
                  <Field
                    name="ageGroup"
                    component={SegmentedControl}
                    selectedIndex={this.state.selectedAgeGroup}
                    onChange={this.handleAgeGroupSelection}
                    values={ageGroups}
                    normalize={value => {
                      return this.state.ageGroups[value].value
                    }}
                    customHeight={isTablet ? 60 : 40}
                  />
                </View>
              </View>
            </View>

            <View style={styles.mgrbtn20}>
              <View style={styles.fieldContainer}>
                <Text style={[styles.fieldTitle, styles.defaultfontSize]}>{t('visitFrequency')}</Text>
              </View>
              <View style={[styles.fieldContainer]}>
                <View style={{flex: 1}}>
                  <Field
                    name="visitFrequency"
                    component={SegmentedControl}
                    selectedIndex={this.state.selectedVisitFrequency}
                    onChange={this.handleVisitFrequencySelection}
                    values={visitFrequencies}
                    normalize={value => {
                      return this.state.visitFrequencies[value].value
                    }}
                    customHeight={isTablet ? 60 : 40}
                  />
                </View>
              </View>
            </View>

            <View style={styles.mgrbtn20}>
              <View style={styles.fieldContainer}>
                <Text style={[styles.fieldTitle, styles.defaultfontSize]}>{t('peopleCount')}</Text>
              </View>
              <View>
                {people.map((people, ix) => (
                  <View
                    style={[styles.borderBottomLine, styles.paddingTopBtn8]}
                    key={ix}
                  >
                    <Field
                      name={people.value}
                      component={RenderStepper}
                      customValue={people.value + people.label}
                      optionName={people.label}
                      customHeight={isTablet ? 60 : 30}
                    />
                  </View>
                ))}
              </View>
            </View>

            <View
              style={[
                styles.jc_alignIem_center,
                styles.flex_dir_row,
                styles.mgrtotop20
              ]}
            >
              <View
                style={{
                  width: '46%',
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: '#F39F86',
                  backgroundColor: '#F39F86',
                  marginRight: '2%'
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.handleSubmit()
                  }}
                >
                  <Text style={[styles.signInText, styles.whiteColor]}>
                    {t('openOrder')}
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  width: '46%',
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: '#F39F86',
                  marginLeft: '2%'
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('TablesSrc')
                  }}
                >
                  <Text style={[styles.signInText]}>{t('action.cancel')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </DismissKeyboard>
      </ScrollView>
    )
  }
}

OrderForm = reduxForm({
  form: 'neworderForm'
})(OrderForm)

export default OrderForm

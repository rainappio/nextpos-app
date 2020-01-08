import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { Text, View, TouchableOpacity, ScrollView } from 'react-native'
import DropDown from '../components/DropDown'
import RenderRadioBtn from '../components/RadioItem'
import RenderStepper from '../components/RenderStepper'
import { isRequired } from '../validators'
import { DismissKeyboard } from '../components/DismissKeyboard'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'

class OrderForm extends Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
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

    this.state = {
      t: context.t
    }
  }

  render() {
    const { t } = this.state

    const ageGroupsA = [
      {
        label: '20-29',
        value: 'TWENTIES'
      },
      {
        label: '40-49',
        value: 'FORTIES'
      }
    ]

    const ageGroupsB = [
      {
        label: '30-39',
        value: 'THIRTIES'
      },
      {
        label: '50-59',
        value: 'FIFTIES_AND_ABOVE'
      }
    ]

    const visitedFrequenciesI = [
      {
        label: '1',
        value: 'FIRST_TIME'
      },
      {
        label: '4 - 5',
        value: 'MORE_THAN_THREE'
      }
    ]

    const visitedFrequenciesII = [
      {
        label: '2 - 3',
        value: 'TWO_TO_THREE'
      }
    ]

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
      <ScrollView>
        <DismissKeyboard>
          <View style={styles.container}>
            <Text
              style={[styles.welcomeText, styles.orange_color, styles.mgrbtn20]}
            >
              {t('newOrderTitle')}
            </Text>

            <View>
              <Text>{t('table')}</Text>
              <Field
                component={DropDown}
                name="tableId"
                options={this.props.tables}
                search
                selection
                fluid
                placeholder={{ value: null, label: t('selectTable') }}
                validate={isRequired}
              />
            </View>

            <View style={styles.paddingTopBtn20}>
              <Text>{t('ageGroup')}</Text>
              <View style={[styles.flex_dir_row]}>
                <View style={[styles.half_width]}>
                  {ageGroupsA.map((ageGp, ix) => (
                    <View
                      style={[styles.borderBottomLine, styles.paddingTopBtn8]}
                      key={ix}
                    >
                      <Field
                        name="ageGroup"
                        component={RenderRadioBtn}
                        customValue={ageGp.value}
                        optionName={ageGp.label}
                        //validate={isRequired}
                      />
                    </View>
                  ))}
                </View>

                <View style={[styles.half_width]}>
                  {ageGroupsB.map((ageGp, ix) => (
                    <View
                      style={[styles.borderBottomLine, styles.paddingTopBtn8]}
                      key={ix}
                    >
                      <Field
                        name="ageGroup"
                        component={RenderRadioBtn}
                        customValue={ageGp.value}
                        optionName={ageGp.label}
                        //validate={isRequired}
                      />
                    </View>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.paddBottom_20}>
              <Text>{t('visitFrequency')}</Text>
              <View style={[styles.flex_dir_row]}>
                <View style={[styles.half_width]}>
                  {visitedFrequenciesI.map((visitedFreq, ix) => (
                    <View
                      style={[styles.borderBottomLine, styles.paddingTopBtn8]}
                      key={ix}
                    >
                      <Field
                        name="visitFrequency"
                        component={RenderRadioBtn}
                        customValue={visitedFreq.value}
                        optionName={visitedFreq.label}
                        //validate={isRequired}
                      />
                    </View>
                  ))}
                </View>

                <View style={[styles.half_width]}>
                  {visitedFrequenciesII.map((visitedFreq, ix) => (
                    <View
                      style={[styles.borderBottomLine, styles.paddingTopBtn8]}
                      key={ix}
                    >
                      <Field
                        name="visitFrequency"
                        component={RenderRadioBtn}
                        customValue={visitedFreq.value}
                        optionName={visitedFreq.label}
                      />
                    </View>
                  ))}
                </View>
              </View>
            </View>

            <Text>{t('peopleCount')}</Text>
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
                  />
                </View>
              ))}
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
                  <Text style={styles.signInText}>{t('action.cancel')}</Text>
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

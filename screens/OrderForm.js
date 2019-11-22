import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import DropDown from '../components/DropDown'
import RenderRadioBtn from '../components/RadioItem'
import RenderStepper from '../components/RenderStepper'
import { isRequired } from '../validators'
import { DismissKeyboard } from '../components/DismissKeyboard'
import styles from '../styles'

class OrderForm extends Component {
  render() {
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
              New Order
            </Text>

            <View>
              <Text>Table</Text>
              <Field
                component={DropDown}
                name="tableId"
                options={this.props.tables}
                search
                selection
                fluid
                placeholder="Product Label"
                validate={isRequired}
              />
            </View>

            <View style={styles.paddingTopBtn20}>
              <Text>Age Group</Text>
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
              <Text>Visited Frequency</Text>
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

            <Text>Gender/People</Text>
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
                    //this.props.navigation.navigate('OrderFormII')
                    this.props.handleSubmit()
                  }}
                >
                  <Text style={[styles.signInText, styles.whiteColor]}>
                    Next
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
                    this.props.navigation.navigate('Tables')
                  }}
                >
                  <Text style={styles.signInText}>Cancel</Text>
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

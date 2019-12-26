import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { Text, View, TouchableOpacity } from 'react-native'
import RenderStepper from '../components/RenderStepper'
import { isRequired, isCountZero } from '../validators'
import { DismissKeyboard } from '../components/DismissKeyboard'
import styles from '../styles'

class LIneItemForm extends Component {
  render() {
    return (
      <DismissKeyboard>
        <View style={styles.container}>
          <Text
            style={[styles.welcomeText, styles.orange_color, styles.mgrbtn20]}
          >
            Edit LineItem Count
          </Text>

          <View style={[styles.paddingTopBtn8]}>
            <Field
              name="quantity"
              component={RenderStepper}
              customValue={this.props.initialValues.quantity}
              optionName="Items Count"
              validate={isCountZero}
            />
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
                  Update
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
                  this.props.navigation.navigate('OrdersSummary')
                }}
              >
                <Text style={styles.signInText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </DismissKeyboard>
    )
  }
}

LIneItemForm = reduxForm({
  form: 'lineItemForm'
})(LIneItemForm)

export default LIneItemForm

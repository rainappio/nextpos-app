import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { Text, View, TouchableOpacity } from 'react-native'
import RenderStepper from '../components/RenderStepper'
import { isRequired, isCountZero } from '../validators'
import { DismissKeyboard } from '../components/DismissKeyboard'
import styles from '../styles'
import {LocaleContext} from "../locales/LocaleContext";

class LIneItemForm extends Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        editLineItemTitle: 'Edit LineItem Quantity',
        quantity: 'Quantity'
      },
      zh: {
        editLineItemTitle: '編輯產品數量',
        quantity: '數量'
      }
    })

    this.state = {
      t: context.t
    }
  }
  render() {
    const { t } = this.state

    return (
      <DismissKeyboard>
        <View style={styles.container}>
          <Text
            style={[styles.welcomeText, styles.orange_color, styles.mgrbtn20]}
          >
            {t('editLineItemTitle')}
          </Text>

          <View style={[styles.paddingTopBtn8]}>
            <Field
              name="quantity"
              component={RenderStepper}
              customValue={this.props.initialValues.quantity}
              optionName={t('quantity')}
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
                  {t('action.update')}
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
                <Text style={styles.signInText}>{t('action.cancel')}</Text>
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

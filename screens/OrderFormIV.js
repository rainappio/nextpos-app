import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Text, View, TouchableOpacity, ScrollView } from 'react-native'
import { DismissKeyboard } from '../components/DismissKeyboard'
import CheckBoxGroupObjPick from '../components/CheckBoxGroupObjPick'
import RadioItemObjPick from '../components/RadioItemObjPick'
import RenderStepper from '../components/RenderStepper'
import { isRequired, isCountZero } from '../validators'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import BackBtn from '../components/BackBtn'
import { isTablet } from '../actions'

class OrderFormIV extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        productOptions: 'Select Product Option(s)',
        quantity: 'Quantity'
      },
      zh: {
        productOptions: '選擇產品客制',
        quantity: '數量'
      }
    })

    this.state = {
      t: context.t
    }
  }

  render() {
    const { product } = this.props
    const { t } = this.state

    return (
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        <View style={styles.container}>
          <BackBtn size={isTablet ? 44 : 28}/>
          <Text style={styles.screenTitle}>
            {this.props.navigation.state.params.prdName}
          </Text>
          {product.productOptions !== undefined &&
            product.productOptions.length > 0 && (
              <Text style={[styles.textBold, styles.paddBottom_20, styles.defaultfontSize]}>
                {t('productOptions')}
              </Text>
            )}

          {product.productOptions !== undefined &&
          product.productOptions.map(prdOption => {
            const requiredOption = prdOption.required

            var ArrForTrueState = []
            prdOption.optionValues.map((optVal, x) => {
              ArrForTrueState.push({
                optionName: prdOption.optionName,
                optionValue: optVal.value,
                optionPrice: optVal.price,
                id: prdOption.versionId + x
              })
            })

              return (
                <View
                  key={prdOption.versionId}
                  style={{
                    borderBottomColor: '#f1f1f1',
                    borderBottomWidth: 1,
                    marginBottom: 20
                  }}
                >
                  <Text style={[styles.fieldTitle, styles.defaultfontSize]}>
                    {prdOption.optionName}
                  </Text>
                  {prdOption.multipleChoice === false ? (
                    <View>
                      {prdOption.optionValues.map((optVal, ix) => {
                        let optionObj = {}
                        optionObj['optionName'] = prdOption.optionName
                        optionObj['optionValue'] = optVal.value
                        optionObj['optionPrice'] = optVal.price
                        optionObj['id'] = prdOption.id

                        return (
                          <View key={prdOption.id + ix}>
                            {requiredOption ? (
                              <Field
                                name={prdOption.optionName}
                                component={RadioItemObjPick}
                                customValueOrder={
                                  optionObj !== undefined && optionObj
                                }
                                optionName={optVal.value}
                                validate={isRequired}
                              />
                            ) : (
                              <Field
                                name={prdOption.optionName}
                                component={RadioItemObjPick}
                                customValueOrder={
                                  optionObj !== undefined && optionObj
                                }
                                optionName={optVal.value}
                              />
                            )}
                          </View>
                        )
                      })}
                    </View>
                  ) : (
                    <View
                      key={prdOption.id}
                    >
                      {requiredOption ? (
                        <Field
                          name={prdOption.optionName}
                          component={CheckBoxGroupObjPick}
                          customarr={ArrForTrueState}
                          validate={isRequired}
                        />
                      ) : (
                        <Field
                          name={prdOption.optionName}
                          component={CheckBoxGroupObjPick}
                          customarr={ArrForTrueState}
                        />
                      )}
                    </View>
                  )}
                </View>
              )
          })}

          <View style={styles.mgrbtn40}>
            <Field
              name="quantity"
              component={RenderStepper}
              optionName={t('quantity')}
              validate={[isRequired, isCountZero]}
            />
          </View>

          <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
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
                //onPress={this.props.navigation.state.params.onSubmit}
                onPress={this.props.handleSubmit}
              >
                <Text style={[styles.signInText, styles.whiteColor]}>
                  {t('action.save')}
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
                  this.props.navigation.navigate('OrderFormII')
                }}
              >
                <Text style={[styles.signInText]}>{t('action.cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }
}

export default OrderFormIV = reduxForm({
  form: 'OrderFormIV'
})(OrderFormIV)

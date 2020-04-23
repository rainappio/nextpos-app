import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Text, View, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native'
import { DismissKeyboard } from '../components/DismissKeyboard'
import CheckBoxGroupObjPick from '../components/CheckBoxGroupObjPick'
import RadioItemObjPick from '../components/RadioItemObjPick'
import RenderStepper from '../components/RenderStepper'
import { isRequired, isCountZero } from '../validators'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import BackBtn from '../components/BackBtn'
import ScreenHeader from "../components/ScreenHeader";
import { withNavigation } from "react-navigation";
import InputText from "../components/InputText";

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
        quantity: 'Quantity',
        freeTextProductOption: 'Note',
      },
      zh: {
        productOptions: '選擇產品客制',
        quantity: '數量',
        freeTextProductOption: '備註',
      }
    })
  }

  render() {
    const { product } = this.props
    const { t } = this.context

    const lastOptionIndex = product.productOptions != null ? product.productOptions.length : 0

    return (
      <KeyboardAvoidingView behavior="padding" enabled style={[{}]}>
        <ScrollView scrollIndicatorInsets={{ right: 1 }}>
          <View style={styles.fullWidthScreen}>
            <ScreenHeader backNavigation={true}
              parentFullScreen={true}
              title={product.name}
            />

            {product.productOptions != null && product.productOptions.length > 0 && (
              <View style={[styles.tableRowContainerWithBorder]}>
                <Text style={styles.tableCellText}>
                  {t('productOptions')}
                </Text>
              </View>
            )}

            {product.productOptions !== undefined &&
              product.productOptions.map((prdOption, optionIndex) => {
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
                    style={styles.sectionContainer}
                  >
                    <View style={styles.sectionTitleContainer}>
                      <Text style={[styles.sectionTitleText]}>
                        {prdOption.optionName}
                      </Text>
                    </View>

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
                              <Field
                                name={`productOptions[${optionIndex}]`}
                                component={RadioItemObjPick}
                                customValueOrder={optionObj !== undefined && optionObj}
                                optionName={optVal.value}
                                onCheck={(currentVal, fieldVal) => {
                                  return fieldVal !== undefined && currentVal.optionValue === fieldVal.optionValue
                                }}
                                validate={requiredOption ? isRequired : null}
                              />
                            </View>
                          )
                        })}
                      </View>
                    ) : (
                        <View>
                          <Field
                            name={`productOptions[${optionIndex}]`}
                            component={CheckBoxGroupObjPick}
                            customarr={ArrForTrueState}
                            validate={requiredOption ? isRequired : null}
                          />
                        </View>
                      )}
                  </View>
                )
              })}

            <View style={styles.sectionTitleContainer}>
              <Text style={[styles.sectionTitleText]}>
                {t('freeTextProductOption')}
              </Text>
            </View>

            <View style={[styles.tableRowContainerWithBorder]}>
              <View style={[{ flex: 1 }]}>
                <Field
                  name={`productOptions[${lastOptionIndex}]`}
                  component={InputText}
                  placeholder={t('freeTextProductOption')}
                  alignLeft={true}
                  format={(value, name) => {
                    return value != null ? String(value.optionValue) : ''
                  }}
                  normalize={value => {
                    return {
                      optionName: t('freeTextProductOption'),
                      optionValue: value
                    }
                  }}
                />
              </View>
            </View>

            <View style={styles.tableRowContainerWithBorder}>
              <Field
                name="quantity"
                component={RenderStepper}
                optionName={t('quantity')}
                validate={[isRequired, isCountZero]}
              />
            </View>

            <View style={[styles.bottom, styles.dynamicVerticalPadding(20), styles.horizontalMargin, { flexDirection: 'row' }]}>
              <View style={{ flex: 1, marginHorizontal: 5 }}>
                <TouchableOpacity
                  onPress={this.props.handleSubmit}
                >
                  <Text style={[[styles.bottomActionButton, styles.actionButton]]}>
                    {t('action.save')}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1, marginHorizontal: 5 }}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.goBack()
                  }}
                >
                  <Text style={[styles.bottomActionButton, styles.cancelButton]}>{t('action.cancel')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

OrderFormIV = reduxForm({
  form: 'OrderFormIV'
})(OrderFormIV)

export default withNavigation(OrderFormIV)

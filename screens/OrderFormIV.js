import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {Text, TouchableOpacity, View} from 'react-native'
import CheckBoxGroupObjPick from '../components/CheckBoxGroupObjPick'
import RadioItemObjPick from '../components/RadioItemObjPick'
import RenderStepper from '../components/RenderStepper'
import {isCountZero, isRequired} from '../validators'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import {withNavigation} from "react-navigation";
import InputText from "../components/InputText";
import RenderCheckBox from "../components/rn-elements/CheckBox";
import {StyledText} from "../components/StyledText";

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
        overridePrice: 'Custom Price',
        lineItemDiscount: 'Line Item Discount'
      },
      zh: {
        productOptions: '選擇產品註記',
        quantity: '數量',
        freeTextProductOption: '註記',
        overridePrice: '自訂價格',
        lineItemDiscount: '品項折扣'
      }
    })
  }

  render() {
    const {product, globalProductOffers} = this.props
    const {t, customMainThemeColor} = this.context

    const hasProductOptions = product.productOptions != null && product.productOptions.length > 0
    const lastOptionIndex = product.productOptions != null ? product.productOptions.length : 0

    return (
      <View style={styles.fullWidthScreen}>
        <ScreenHeader backNavigation={true}
          parentFullScreen={true}
          title={`${product.name} ($${product.price})`}
        />

        {hasProductOptions && (
          <View style={[styles.sectionTitleContainer]}>
            <StyledText style={styles.sectionTitleText}>
              {t('productOptions')}
            </StyledText>
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
                  <StyledText style={[styles.sectionTitleText]}>
                    {prdOption.optionName}
                  </StyledText>
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
                            customValueOrder={optionObj}
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
          <StyledText style={[styles.sectionTitleText]}>
            {t('freeTextProductOption')}
          </StyledText>
        </View>

        <View style={[styles.tableRowContainerWithBorder]}>
          <View style={[{flex: 1}]}>
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

        <View style={[styles.tableRowContainerWithBorder]}>
          <View style={[{flex: 1}]}>
            <Field
              name={`overridePrice`}
              component={InputText}
              placeholder={t('overridePrice')}
              keyboardType='numeric'
              alignLeft={true}
            />
          </View>
        </View>

        <View style={styles.sectionTitleContainer}>
          <StyledText style={[styles.sectionTitleText]}>
            {t('lineItemDiscount')}
          </StyledText>
        </View>

        <View style={styles.sectionContainer}>
          {globalProductOffers != null && globalProductOffers.map(offer => (
            <View key={offer.offerId}>
              <Field
                name="lineItemDiscount"
                component={RenderCheckBox}
                customValue={{
                  offerId: offer.offerId,
                  productDiscount: offer.offerId,
                  discount: offer.discountValue
                }}
                optionName={offer.offerName}
                defaultValueDisplay={(customValue, value) => String(customValue.productDiscount === value.productDiscount ? value.discount : 0)}
              />
            </View>
          ))}
        </View>

        <View style={styles.tableRowContainerWithBorder}>
          <Field
            name="quantity"
            component={RenderStepper}
            optionName={t('quantity')}
            validate={[isRequired, isCountZero]}
          />
        </View>

        <View style={[styles.bottom, styles.dynamicVerticalPadding(20), styles.horizontalMargin, {flexDirection: 'row'}]}>
          <View style={{flex: 1, marginHorizontal: 5}}>
            <TouchableOpacity
              onPress={this.props.handleSubmit}
            >
              <Text style={[[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]]}>
                {t('action.save')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{flex: 1, marginHorizontal: 5}}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack()
              }}
            >
              <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>{t('action.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

OrderFormIV = reduxForm({
  form: 'OrderFormIV'
})(OrderFormIV)

export default withNavigation(OrderFormIV)

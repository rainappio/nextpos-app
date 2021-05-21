import React from 'react'
import {Field, reduxForm, formValueSelector} from 'redux-form'
import {connect} from 'react-redux'
import {Text, TouchableOpacity, View, FlatList, Dimensions, TouchableHighlight} from 'react-native'
import CheckBoxGroupObjPick from '../components/CheckBoxGroupObjPick'
import RadioItemObjPick, {RadioLineItemObjPick} from '../components/RadioItemObjPick'
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
    this.state = {

      highlightSkuIndex: null,
      selectedSkuQuantity: 1,
      selectedSku: '',
      inventoryId: null,

    }
  }

  componentDidMount() {
    if (this.props?.initialValues.sku) {
      this.setState({selectedSku: this.props?.initialValues.sku})
    }
    if (this.props?.initialValues.quantity) {
      this.setState({selectedSkuQuantity: this.props?.initialValues.quantity})
    }
  }

  InventoryItem = (item) => {
    let isSelected = this.state.selectedSku == item.item.sku
      || this.state.highlightSkuIndex == item.index

    return (
      <View style={[{flex: 1, marginHorizontal: 20}]}>
        <TouchableHighlight
          style={{flexDirection: 'row', justifyContent: 'space-between', color: this.contetx?.customMainThemeColor}}
          onPress={() => {
            this.props.change(`sku`, item?.item.sku)
            this.setState({highlightSkuIndex: item.index, selectedSku: item?.item.sku})

            if (!!isSelected) {
              this.props.change(`quantity`, this.state.selectedSkuQuantity + 1)
              this.setState({selectedSkuQuantity: (this.state.selectedSkuQuantity + 1)})
            }
            console.log(this.state.selectedSku, this.props.sku)
          }}
        >
          <View style={[styles.flexButton(isSelected ? this.context?.customMainThemeColor : '#fff8c9')]}>

            <View style={{color: isSelected ? '#fff' : '#555'}}>
              <StyledText style={{color: isSelected ? '#fff' : '#555', paddingTop: 8, paddingBottom: 4, fontWeight: 'bold', fontSize: 16}}>{item?.item.sku}</StyledText>
            </View>
            <View>
              <StyledText style={{color: isSelected ? '#fff' : '#555', paddingBottom: 8}}>{item?.item.name}</StyledText>
            </View>
            <View style={{borderTopWidth: 1, borderColor: isSelected ? '#fff' : '#ccc', backgroundColor: isSelected ? this.context?.customMainThemeColor : '#fff8c9', width: '100%', justifyContent: 'center', alignItems: 'center', paddingVertical: 4}}>
              <StyledText style={{color: isSelected ? '#fff' : '#555'}}>{item?.item.quantity}</StyledText>
            </View>
          </View>

        </TouchableHighlight>
      </View >
    );
  }

  render() {
    const {product, globalProductOffers} = this.props
    const {t, customMainThemeColor} = this.context

    const hasProductOptions = product.productOptions != null && product.productOptions.length > 0
    const lastOptionIndex = product.productOptions != null ? product.productOptions.length : 0
    const hasInventory = product.inventory != null
    const inventoryData = product.inventory ? Object.values(product.inventory.inventoryQuantities) : null

    return (
      <View style={styles.fullWidthScreen}>
        <ScreenHeader backNavigation={true}
          parentFullScreen={true}
          title={`${product.name} ($${product.price})`}
        />

        {hasInventory && (
          <View style={[styles.sectionTitleContainer]}>
            <StyledText style={styles.sectionTitleText}>
              {t('inventory.skuName')}
            </StyledText>
          </View>
        )}
        {hasInventory && inventoryData && (

          <FlatList
            style={[styles.mgrbtn20], {
              maxHeight: 350, paddingBottom: 20, maxWidth: Dimensions.get('window').width / 1
            }}
            numColumns={2}
            data={inventoryData}
            renderItem={(item) => this.InventoryItem(item)}
            keyExtractor={(item) => item.name}
            extraData={this.state.highlightSkuIndex}
          />


        )
        }

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
                            component={RadioLineItemObjPick}
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
              name={`productOptions[${lastOptionIndex}].optionValue`}
              component={InputText}
              placeholder={t('freeTextProductOption')}
              alignLeft={true}
              format={(value, name) => {
                return value != null ? String(value) : ''
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

        <View style={[styles.sectionContainer, styles.customBorderAndBackgroundColor(this.context)]}>
          {globalProductOffers != null && globalProductOffers.map(offer => (
            <View key={offer.offerId}>
              <Field style={styles.customBorderAndBackgroundColor(this.context)}
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
                {t('action.addQty', {quantity: this.props?.quantity})}
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

const selector = formValueSelector('OrderFormIV')

OrderFormIV = connect(
  state => {
    const quantity = selector(state, 'quantity')
    return {
      quantity,
    }
  }
)(OrderFormIV)

export default withNavigation(OrderFormIV)

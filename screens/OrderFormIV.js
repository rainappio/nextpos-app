import React from 'react'
import {Field, reduxForm, formValueSelector} from 'redux-form'
import {connect} from 'react-redux'
import {api, dispatchFetchRequest, successMessage} from '../constants/Backend'
import {Text, TouchableOpacity, View, FlatList, Dimensions, TouchableHighlight} from 'react-native'
import CheckBoxGroupObjPick from '../components/CheckBoxGroupObjPick'
import RadioItemObjPick, {RadioLineItemObjPick} from '../components/RadioItemObjPick'
import RenderStepper from '../components/RenderStepper'
import {isCountZero, isRequired} from '../validators'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import {withNavigation} from "@react-navigation/compat"
import InputText from "../components/InputText";
import RenderCheckBox from "../components/rn-elements/CheckBox";
import {StyledText} from "../components/StyledText";
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";
import {Accordion, List} from '@ant-design/react-native'
import {Ionicons} from '@expo/vector-icons'
import LoadingScreen from "./LoadingScreen";
import {BottomMainActionButton, SecondActionButton} from "../components/ActionButtons";


class OrderFormIV extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {

      highlightSkuIndex: null,
      selectedSkuQuantity: 1,
      selectedSku: '',
      inventoryId: null,
      comboLabels: [],
      comboActiveSections: [],

    }
  }

  componentDidMount() {
    if (this.props?.initialValues.sku) {
      this.setState({selectedSku: this.props?.initialValues.sku})
    }
    if (this.props?.initialValues.quantity) {
      this.setState({selectedSkuQuantity: this.props?.initialValues.quantity})
    }
    if (this.props?.initialValues?.noteOption) {
      let lastOptionIndex = this.props?.product.productOptions != null ? this.props?.product.productOptions.length : 0
      this.props.change(`productOptions[${lastOptionIndex}].optionValue`, this.props?.initialValues?.noteOption)
    }
    if (!!this.props?.product?.productOptions) {

      let arrForInitState = []
      this.props?.product?.productOptions?.map((prdOption, optionIndex) => {
        prdOption.optionValues.map((optVal, x) => {
          if (this.props.initialValues?.optionValueIds?.includes(String(optVal.optionValueId))) {
            arrForInitState.push({
              optionName: prdOption.optionName,
              optionValue: optVal.value,
              optionPrice: optVal.price,
              optionValueId: optVal.optionValueId,
              id: prdOption.versionId + x
            })
          }
        })
        this.props.change(`productOptions[${optionIndex}]`, arrForInitState)
        arrForInitState = []  // clear for next option
      })
    }
    if (!!this.props?.product?.productComboLabels) {

      let comboLabelList = this.props.product.productComboLabels
      let requiredArr = []

      comboLabelList.map((prdComboLabel, labelIndex) => {
        const productsList = new Map(Object.entries(this.props?.productsDetail))

        if (prdComboLabel.required == true) {
          requiredArr.push(false)
        } else {
          requiredArr.push(true)
        }
        this.props?.labels.find((label) => {
          if (label.id == prdComboLabel.id) {
            let prds = productsList.get(label.label)
            prdComboLabel.products = prds
            prdComboLabel.products.map((product) => product.isSelected = false)
          }
        })
      })
      let activeSectionsArr = this.props?.product?.productComboLabels?.map((label, labelIndex) => {
        return labelIndex
      })?.filter((item) => {
        return item !== undefined
      })
      this.setState({comboActiveSections: activeSectionsArr, comboLabels: comboLabelList})
      this.props.change(`checkChildProduct`, requiredArr)

    }
  }

  getComboProduct = (comboPrd, prdIndex, labelIndex) => {

    if (this.props?.childLineItems !== undefined && this.props?.childLineItems[labelIndex] !== undefined && this.props?.childLineItems[labelIndex][prdIndex] !== undefined) {

      let newChild = this.props?.childLineItems[labelIndex].splice(prdIndex, 1, undefined)
      this.props.change(`childLineItems[${labelIndex}]`, newChild)
      this.state.comboLabels[labelIndex].products[prdIndex].isSelected = false
      this.setState({comboLabels: this.state.comboLabels})
      this.props.change(`childLineItems`, this.props?.childLineItems) // renew immediately

    } else {

      this.state.comboLabels[labelIndex].products[prdIndex].isLoading = true
      this.setState({comboLabels: this.state.comboLabels})
      dispatchFetchRequest(api.product.getById(comboPrd.id), {
          method: 'GET',
          withCredentials: true,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        }, response => {
          response.json().then(product => {
            if (comboPrd.hasOptions) {
              let optionsInfo = []
              let optionsArr = []
              product.productOptions.map((prdOption, optionIndex) => {

                optionsInfo.push({
                  optionName: prdOption.optionName,
                  multipleChoice: prdOption.multipleChoice,
                  required: prdOption.required,
                })
                optionsArr[optionIndex] = []
                prdOption.optionValues.map((optVal, x) => {
                  optionsArr[optionIndex].push({
                    optionName: prdOption.optionName,
                    optionValue: optVal.value,
                    optionPrice: optVal.price,
                    id: prdOption.versionId + x
                  })
                })
              })

              this.state.comboLabels[labelIndex].products[prdIndex].optionsInfo = optionsInfo
              this.state.comboLabels[labelIndex].products[prdIndex].productOptions = optionsArr
              this.state.comboLabels[labelIndex].products[prdIndex].isLoading = false
              this.state.comboLabels[labelIndex].products[prdIndex].isSelected = true
              this.setState({comboLabels: this.state.comboLabels})

            } else {
              this.state.comboLabels[labelIndex].products[prdIndex].productOptions = null
              this.state.comboLabels[labelIndex].products[prdIndex].optionsInfo = [{
                optionName: null,
                multipleChoice: false,
                required: false
              }]
              this.state.comboLabels[labelIndex].products[prdIndex].isLoading = false
              this.state.comboLabels[labelIndex].products[prdIndex].isSelected = true
              this.setState({comboLabels: this.state.comboLabels})
            }

            this.props.change(`childLineItems[${labelIndex}][${prdIndex}].productId`, product.id)
            this.props.change(`childLineItems[${labelIndex}][${prdIndex}].quantity`, 1)
          })
        }
      ).then()
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
              <StyledText style={{
                color: isSelected ? '#fff' : '#555',
                paddingTop: 8,
                paddingBottom: 4,
                fontWeight: 'bold',
                fontSize: 16
              }}>{item?.item.sku}</StyledText>
            </View>
            <View>
              <StyledText style={{color: isSelected ? '#fff' : '#555', paddingBottom: 8}}>{item?.item.name}</StyledText>
            </View>
            <View style={{
              borderTopWidth: 1,
              borderColor: isSelected ? '#fff' : '#ccc',
              backgroundColor: isSelected ? this.context?.customMainThemeColor : '#fff8c9',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 4
            }}>
              <StyledText style={{color: isSelected ? '#fff' : '#555'}}>{item?.item.quantity}</StyledText>
            </View>
          </View>

        </TouchableHighlight>
      </View>
    );
  }

  render() {
    const {product, productsDetail, globalProductOffers, labels = []} = this.props
    const {t, customMainThemeColor} = this.context

    const hasProductComboLabels = product.productComboLabels != null && product.productComboLabels.length > 0
    const hasProductOptions = product.productOptions != null && product.productOptions.length > 0
    const lastOptionIndex = product.productOptions != null ? product.productOptions.length : 0
    const hasInventory = product.inventory != null
    const inventoryData = product.inventory ? Object.values(product.inventory.inventoryQuantities) : null

    return (
      <View style={[styles.fullWidthScreen, styles.marginBottom(0)]}>
        <ScreenHeader backNavigation={true}
                      parentFullScreen={true}
                      title={`${product.name} ($${product.price})`}
        />

        <View style={[styles.flex(3)]}>
          <ThemeKeyboardAwareScrollView persistTaps={'handled'}>

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

            {hasProductComboLabels && (
              <View style={[styles.sectionTitleContainer]}>
                <StyledText style={styles.sectionTitleText}>
                  {t('product.childLabels')}
                </StyledText>
              </View>
            )}
            {hasProductComboLabels && product.productComboLabels !== undefined &&
              <Accordion
                onChange={(activeSections) => this.setState({comboActiveSections: activeSections})}
                expandMultiple={true}
                activeSections={this.state.comboActiveSections}
              >
                {this.state.comboLabels !== null && this.state.comboLabels.map((prdComboLabel, labelIndex) => {
                  let isMultipleLabel = prdComboLabel.multipleSelection
                  let isChildPrdRequired = prdComboLabel.required
                  let childPrdCheck = (this.props?.childLineItems !== undefined && this.props?.childLineItems[labelIndex] !== undefined) ? this.props?.childLineItems[labelIndex].every((value) => value === undefined) : true
                  if (isChildPrdRequired) {
                    let checkValidate = isChildPrdRequired && childPrdCheck
                    this.props.change(`checkChildProduct[${labelIndex}]`, !checkValidate)
                  }

                  return (
                    <Accordion.Panel
                      key={labelIndex}
                      header={<View style={styles.listPanel}>
                        <StyledText style={styles.listPanelText}>{prdComboLabel.name}</StyledText>
                        <StyledText style={[{
                          fontSize: 12,
                          color: customMainThemeColor,
                          padding: 4
                        }]}>{isMultipleLabel ? t('order.multipleChoice') : t('order.singleChoice')}</StyledText>
                        <StyledText style={[styles.rootError, {
                          padding: 4,
                          marginVertical: 0
                        }]}>{(isChildPrdRequired && childPrdCheck) && t('order.requiredChoice')}
                        </StyledText>
                      </View>}
                    >
                      <View
                        key={prdComboLabel.id}
                        style={styles.sectionContainer}
                      >
                        <View>
                          {prdComboLabel.products.map((product, prdIndex) => {
                            return (
                              <View key={prdIndex}>
                                <TouchableOpacity style={[styles.listPanel, styles.dynamicHorizontalPadding(16)]}
                                                  onPress={() => {

                                                    if (this.state.comboLabels[labelIndex].products[prdIndex]) {
                                                      if (!isMultipleLabel) {
                                                        this.state.comboLabels[labelIndex].products.map((product) => product.isSelected = false)
                                                        this.setState({comboLabels: this.state.comboLabels})
                                                        this.props.change(`childLineItems[${labelIndex}]`, undefined)
                                                      }

                                                      this.getComboProduct(product, prdIndex, labelIndex)
                                                    }
                                                  }
                                                  }>
                                  <View
                                    style={[styles.tableRowContainer, styles.flex(1), {justifyContent: 'space-between'}]}>
                                    <View style={[styles.tableCellView]}>
                                      <StyledText style={[styles.listPanelText]}>
                                        {product.name}
                                      </StyledText>

                                    </View>
                                    {(this.state.comboLabels[labelIndex].products[prdIndex].isSelected) &&
                                      <View style={[styles.tableCellView]}>
                                        <StyledText>
                                          <Ionicons name="checkbox" size={28} color={customMainThemeColor}/>
                                        </StyledText>
                                      </View>}

                                  </View>
                                </TouchableOpacity>
                                {this.state.comboLabels[labelIndex].products[prdIndex].isLoading && <LoadingScreen/>}
                                {
                                  (!!this.state.comboLabels[labelIndex].products[prdIndex].productOptions) && (this.state.comboLabels[labelIndex].products[prdIndex].isSelected) &&
                                  <View style={[{paddingLeft: 20}]}>
                                    {product.optionsInfo.map((option, optionIndex) => {
                                      return (
                                        <View key={optionIndex}>
                                          <View style={[styles.jc_alignIem_center, styles.sectionTitleText]}>
                                            <StyledText style={[{
                                              paddingTop: 8,
                                              color: customMainThemeColor
                                            }]}>{option.optionName}</StyledText>
                                          </View>

                                          <Field
                                            name={`childLineItems[${labelIndex}][${prdIndex}].productOptions[${optionIndex}]`}
                                            component={CheckBoxGroupObjPick}
                                            customarr={this.state.comboLabels[labelIndex].products[prdIndex].productOptions[optionIndex]}
                                            limitOne={option.multipleChoice === true ? false : true}
                                            validate={option.required ? isRequired : null}
                                          />
                                        </View>
                                      )
                                    })}

                                  </View>}
                              </View>
                            )

                          })

                          }
                        </View>

                      </View>
                    </Accordion.Panel>
                  )
                })}</Accordion>
            }

            {hasProductOptions && (
              <View style={[styles.sectionTitleContainer]}>
                <StyledText style={styles.sectionTitleText}>
                  {t('order.productOptions')}
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
                    optionValueId: optVal.optionValueId,
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

                    <View>
                      <Field
                        name={`productOptions[${optionIndex}]`}
                        component={CheckBoxGroupObjPick}
                        customarr={ArrForTrueState}
                        limitOne={prdOption.multipleChoice === false ? true : false}
                        validate={requiredOption ? isRequired : null}
                      />
                    </View>
                  </View>
                )
              })}

            <View style={styles.sectionTitleContainer}>
              <StyledText style={[styles.sectionTitleText]}>
                {t('order.freeTextProductOption')}
              </StyledText>
            </View>

            <View style={[styles.tableRowContainerWithBorder]}>
              <View style={[{flex: 1}]}>
                <Field
                  name={`productOptions[${lastOptionIndex}].optionValue`}
                  component={InputText}
                  placeholder={t('order.freeTextProductOption')}
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
                  placeholder={t('order.overridePrice')}
                  keyboardType='numeric'
                  alignLeft={true}
                />
              </View>
            </View>

            <View style={styles.sectionTitleContainer}>
              <StyledText style={[styles.sectionTitleText]}>
                {t('order.lineItemDiscount')}
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

          </ThemeKeyboardAwareScrollView>
        </View>

        <View style={[styles.bottom]}>
          <View style={[styles.flex(1), styles.dynamicHorizontalPadding(20)]}>
            <Field
              name="quantity"
              component={RenderStepper}
              optionName={t('order.quantity')}
              validate={[isRequired, isCountZero]}
            />
          </View>

          <View style={[styles.tableRowContainer]}>
            <View style={[{flex: 1, marginHorizontal: 5}]}>
              <SecondActionButton
                onPress={this.props.navigation.goBack}
                title={t('action.cancel')}
              />
            </View>

            <View style={[{flex: 1, marginHorizontal: 5}]}>
              <BottomMainActionButton
                onPress={this.props.handleSubmit}
                title={t('action.addQty', {quantity: this.props?.quantity})}
              />
            </View>
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
    const childLineItems = selector(state, 'childLineItems')
    return {
      quantity,
      childLineItems,
    }
  }
)(OrderFormIV)

export default withNavigation(OrderFormIV)

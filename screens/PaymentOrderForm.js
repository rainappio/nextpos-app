import React from 'react'
import {connect} from 'react-redux'
import {Field, reduxForm} from 'redux-form'
import {Text, TouchableOpacity, View} from 'react-native'
import {formatCurrency} from '../actions'
import InputText from '../components/InputText'
import styles, {mainThemeColor} from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import SegmentedControl from '../components/SegmentedControl'
import DropDown from '../components/DropDown'
import ScreenHeader from "../components/ScreenHeader";
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";
import {StyledText} from "../components/StyledText";

class PaymentOrderForm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        paymentMethodTitle: 'Payment Method',
        enterCash: 'Enter Cash',
        taxIDNumber: 'Tax ID Number',
        enterTaxIDNumber: 'Enter Tax ID Number',
        charge: 'Charge',
        paymentMethod: 'Payment Method',
        chooseCardType: 'Choose Card Type',
        CardNo: 'Last 4 Digits',
        enterCardNo: 'Last 4 Digits',
        charged: 'Payment charged'
      },
      zh: {
        paymentMethodTitle: '付費方式',
        enterCash: '輸入現金',
        taxIDNumber: '統一編號',
        enterTaxIDNumber: '輸入統一編號',
        charge: '結帳',
        paymentMethod: '付費方式',
        chooseCardType: '選擇信用卡種類',
        CardNo: '卡號末四碼',
        enterCardNo: '卡號末四碼',
        charged: '付款成功'
      }
    })
  }

  render() {
    const moneyAmts = [
      {
        label: '100',
        value: 100
      },
      {
        label: '500',
        value: 500
      },
      {
        label: '1000',
        value: 1000
      },
      {
        label: '2000',
        value: 2000
      }
    ]

    const {
      handleSubmit,
      order,
      addNum,
      resetTotal
    } = this.props

    const {t} = this.context
    const {paymentsTypes, selectedPaymentType, paymentsTypeslbl, handlePaymentTypeSelection} = this.props

    const TaxInputAndBottomBtns = (props) => {
      return (
        <View>
          <View style={styles.fieldContainer}>
            <View style={{flex: 2}}>
              <StyledText style={styles.fieldTitle}>{t('taxIDNumber')}</StyledText>
            </View>
            <View style={{flex: 3}}>
              <Field
                name="taxIdNumber"
                component={InputText}
                placeholder={t('enterTaxIDNumber')}
                keyboardType={'numeric'}
                extraStyle={{textAlign: 'left'}}
              />
            </View>
          </View>

          <View style={styles.bottom}>
            <TouchableOpacity onPress={() => props.handleSubmit()}>
              <Text style={[styles.bottomActionButton, styles.actionButton]}>
                {t('charge')}
              </Text>
            </TouchableOpacity>

            <View>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('OrdersSummary')}
              >
                <Text style={[styles.bottomActionButton, styles.cancelButton]}>
                  {t('action.cancel')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    }

    return (
      <ThemeKeyboardAwareScrollView>
        <View style={styles.fullWidthScreen}>
          <ScreenHeader backNavigation={true}
                        parentFullScreen={true}
                        title={t('paymentMethodTitle')}
          />

          <View style={[styles.tableRowContainerWithBorder, styles.verticalPadding]}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText>{t('order.subtotal')}</StyledText>
            </View>

            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
              <StyledText style={styles.tableCellText}>
                {formatCurrency(order.total.amountWithTax)}
              </StyledText>
            </View>
          </View>

          <View style={[styles.tableRowContainerWithBorder, styles.verticalPadding]}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText>{t('order.discount')}</StyledText>
            </View>

            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
              <StyledText style={styles.tableCellText}>
                {formatCurrency(order.discount)}
              </StyledText>
            </View>
          </View>

          <View style={[styles.tableRowContainerWithBorder, styles.verticalPadding]}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText>{t('order.serviceCharge')}</StyledText>
            </View>

            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
              <StyledText style={styles.tableCellText}>
                {formatCurrency(order.serviceCharge)}
              </StyledText>
            </View>
          </View>

          <View style={[styles.tableRowContainerWithBorder, styles.verticalPadding]}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText>{t('order.total')}</StyledText>
            </View>

            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
              <StyledText style={styles.tableCellText}>
                {formatCurrency(order.orderTotal)}
              </StyledText>
            </View>
          </View>

          <View style={[styles.sectionContainer, styles.horizontalMargin]}>
            <View style={[styles.sectionContent]}>
              <View style={styles.sectionTitleContainer}>
                <StyledText style={styles.sectionTitleText}>{t('paymentMethod')}</StyledText>
              </View>
              <View>
                <View>
                  <Field
                    name="paymentMethod"
                    component={SegmentedControl}
                    selectedIndex={selectedPaymentType}
                    values={paymentsTypeslbl}
                    onChange={handlePaymentTypeSelection}
                    normalize={value => {
                      return paymentsTypes[value].value
                    }}
                  />
                </View>
              </View>
            </View>

            {
              selectedPaymentType === 0 &&
              <View>
                <View style={[styles.fieldContainer]}>
                  <View style={{flex: 2}}>
                    <StyledText style={styles.fieldTitle}>{t('payment.cashPayment')}</StyledText>
                  </View>
                  <View style={{flex: 3}}>
                    <Field
                      name="cash"
                      component={InputText}
                      placeholder={t('enterCash')}
                      keyboardType={'numeric'}
                      onFocus={() => resetTotal()}
                      extraStyle={{textAlign: 'left'}}
                    />
                  </View>
                </View>

                <View style={[styles.fieldContainer, {justifyContent: 'space-between'}]}>
                  {moneyAmts.map((moneyAmt, ix) => (
                    <TouchableOpacity
                      onPress={() => {
                        addNum(moneyAmt.value)
                      }}
                      key={moneyAmt.value}
                    >
                      <View
                        style={{
                          width: 70,
                          height: 50,
                          borderWidth: 2,
                          borderColor: mainThemeColor,
                          justifyContent: 'center'
                        }}
                      >
                        <Text
                          style={[
                            styles.primaryText,
                            styles.centerText
                            // styles.orange_color,
                            // styles.textBold,
                            // styles.centerText
                          ]}
                        >
                          {moneyAmt.label}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            }

            {
              selectedPaymentType === 1 &&
              <View>
                <View style={styles.fieldContainer}>
                  <View style={{flex: 2}}>
                    <StyledText style={styles.fieldTitle}>{t('CardNo')}</StyledText>
                  </View>
                  <View style={{flex: 3}}>
                    <Field
                      name="cardNumber"
                      component={InputText}
                      placeholder={t('enterCardNo')}
                      keyboardType={'numeric'}
                      alignLeft={true}
                    />
                  </View>
                </View>

                <View style={styles.fieldContainer}>
                  <Field
                    name="cardType"
                    component={DropDown}
                    placeholder={{value: null, label: t('chooseCardType')}}
                    options={[
                      {label: 'Visa', value: 'VISA'},
                      {label: 'MasterCard', value: 'MASTER'},
                      {label: 'Other', value: 'OTHER'}
                    ]}
                  />
                </View>
              </View>
            }

            <TaxInputAndBottomBtns
              handleSubmit={handleSubmit}
              navigation={this.props.navigation}
            />

          </View>
        </View>
      </ThemeKeyboardAwareScrollView>
    )
  }
}

const mapStateToProps = (state, props) => ({
  initialValues: {
    cash: '' + props.dynamicTotal,
    paymentMethod: props.selectedPaymentType === 0 ? 'CASH' : 'CARD'
  }
})

export default connect(
  mapStateToProps,
  null
)(
  reduxForm({
    form: 'paymentorderForm',
    enableReinitialize: true
  })(PaymentOrderForm)
)

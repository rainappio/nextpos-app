import React from 'react'
import {connect} from 'react-redux'
import {Field, reduxForm} from 'redux-form'
import {Text, TouchableOpacity, View} from 'react-native'
import {formatCurrency, getfetchglobalOrderOffers} from '../actions'
import RenderCheckBox from '../components/rn-elements/CheckBox'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import CustomCheckBox from "../components/CustomCheckBox";
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";
import {StyledText} from "../components/StyledText";

class PaymentFormScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        paymentTitle: 'Payment',
        orderOptions: 'Order Options',
        waiveServiceCharge: 'Waive Service Charge',
        resetAllOffers: 'Reset All Offers',
        payOrder: 'Pay'
      },
      zh: {
        paymentTitle: '付款',
        orderOptions: '訂單選項',
        waiveServiceCharge: '折抵服務費',
        resetAllOffers: '取消訂單優惠',
        payOrder: '付帳'
      }
    })
  }

  componentDidMount() {
    this.props.getfetchglobalOrderOffers()
  }

  render() {
    const { order, navigation, handleSubmit, globalorderoffers } = this.props
    const { t } = this.context

    return (
      <ThemeKeyboardAwareScrollView>
          <View style={styles.fullWidthScreen}>
            <ScreenHeader backNavigation={true}
                          parentFullScreen={true}
                          title={t('paymentTitle')}
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

            <View style={[styles.sectionContainer]}>
              <View style={[styles.sectionTitleContainer]}>
                <StyledText style={styles.sectionTitleText}>{t('orderOptions')}</StyledText>
              </View>
              <View>
                <Field
                  name="waiveServiceCharge"
                  component={CustomCheckBox}
                  customValue={true}
                  checkboxType='checkbox'
                  optionName={t('waiveServiceCharge')}
                />
              </View>
              {/*<View>
                <Field
                  name="orderOption"
                  component={CustomCheckBox}
                  customValue="resetAllOffers"
                  optionName={t('resetAllOffers')}
                />
              </View>*/}
            </View>

            <View style={[styles.sectionContainer]}>
              <View style={[styles.sectionTitleContainer]}>
                <StyledText style={styles.sectionTitleText}>{t('order.discount')}</StyledText>
              </View>

              {globalorderoffers != null && globalorderoffers.map((offer, ix) => (
                <View
                  style={[]}
                  key={ix}
                >
                  <Field
                    name="discount"
                    component={RenderCheckBox}
                    customValue={{
                      offerId: offer.offerId,
                      orderDiscount: offer.offerId,
                      discount: offer.discountValue
                    }}
                    optionName={offer.offerName}
                    defaultValueDisplay={(customValue, value) => String(customValue.orderDiscount === value.orderDiscount ? value.discount : 0)}
                  />
                </View>
              ))}
            </View>

            <View style={[styles.bottom, styles.horizontalMargin]}>
              <TouchableOpacity onPress={() => handleSubmit()}>
                <Text style={[styles.bottomActionButton, styles.actionButton]}>
                  {t('payOrder')}
                </Text>
              </TouchableOpacity>

              <View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('OrdersSummary')}
                >
                  <Text
                    style={[styles.bottomActionButton, styles.cancelButton]}
                  >
                    {t('action.cancel')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
      </ThemeKeyboardAwareScrollView>
    )
  }
}

const mapStateToProps = (state, props) => ({
  globalorderoffers: state.globalorderoffers.data.results
})

const mapDispatchToProps = dispatch => ({
  getfetchglobalOrderOffers: () => dispatch(getfetchglobalOrderOffers())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({
    form: 'paymentForm',
    enableReinitialize: true
  })(PaymentFormScreen)
)

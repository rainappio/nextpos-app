import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import {ScrollView, Text, View, TouchableOpacity, TextInput, Image, KeyboardAvoidingView} from 'react-native'
import {
  getProducts,
  getLables,
  getLabel,
  getfetchglobalOrderOffers
} from '../actions'
import BackBtnCustom from '../components/BackBtnCustom'
import { DismissKeyboard } from '../components/DismissKeyboard'
import RenderCheckBox from '../components/rn-elements/CheckBox'
import RenderPureCheckBox from '../components/rn-elements/PureCheckBox'
import InputText from '../components/InputText'
import {
  api,
  makeFetchRequest,
  errorAlert,
  successMessage
} from '../constants/Backend'
import { isRequired } from '../validators'
import { calculatePercentage } from '../actions'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import images from "../assets/images";
import CustomCheckBox from "../components/CustomCheckBox";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scrollview";

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

    this.state = {
      getPercent: null
    }
  }

  componentDidMount() {
    this.props.getfetchglobalOrderOffers()
  }

  getPercent = percent => {
    if (percent >= 0) {
      this.setState({
        getPercent: percent
      })
    }
  }

  render() {
    const { order, navigation, handleSubmit, globalorderoffers } = this.props
    const { t } = this.context

    const discounts = []

    globalorderoffers !== undefined &&
      globalorderoffers.map(globalorderoffer => {
        discounts.push({
          label: globalorderoffer.displayName,
          value: {
            discount: globalorderoffer.discountValue,
            orderDiscount: globalorderoffer.offerName
          }
        })
      })
    return (
      <KeyboardAwareScrollView scrollIndicatorInsets={{ right: 1 }}>
        <DismissKeyboard>
          <View style={styles.fullWidthScreen}>
            <ScreenHeader backNavigation={true}
                          parentFullScreen={true}
                          title={t('paymentTitle')}
            />

            <View style={[styles.tableRowContainerWithBorder, styles.verticalPadding]}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <Text>{t('order.subtotal')}</Text>
              </View>

              <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                <Text style={styles.tableCellText}>
                  ${order.total.amountWithTax.toFixed(2)}
                </Text>
              </View>
            </View>

            <View style={[styles.tableRowContainerWithBorder, styles.verticalPadding]}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <Text>{t('order.discount')}</Text>
              </View>

              <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                <Text style={styles.tableCellText}>
                  ${order.discount}
                </Text>
              </View>
            </View>

            <View style={[styles.tableRowContainerWithBorder, styles.verticalPadding]}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <Text>{t('order.serviceCharge')}</Text>
              </View>

              <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                <Text style={styles.tableCellText}>
                  ${order.serviceCharge}
                </Text>
              </View>
            </View>

            <View style={[styles.tableRowContainerWithBorder, styles.verticalPadding]}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <Text>{t('order.total')}</Text>
              </View>

              <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                <Text style={styles.tableCellText}>
                  $
                  {(
                    order.orderTotal -
                    calculatePercentage(order.orderTotal, this.state.getPercent)
                  ).toFixed(2)}
                </Text>
              </View>
            </View>

            <View style={[styles.sectionContainer]}>
              <View style={[styles.sectionTitleContainer]}>
                <Text style={styles.sectionTitleText}>{t('orderOptions')}</Text>
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
                <Text style={styles.sectionTitleText}>{t('order.discount')}</Text>
              </View>

              {discounts.map((discount, ix) => (
                <View
                  style={[]}
                  key={ix}
                >
                  <Field
                    name="discount"
                    component={RenderCheckBox}
                    customValue={discount.value}
                    optionName={discount.label}
                    total={order.orderTotal}
                    getPercent={this.getPercent}
                    orderTotal={order.total.amountWithTax.toFixed(2)}
                    grandTotal={(
                      order.orderTotal -
                      calculatePercentage(
                        order.orderTotal,
                        this.state.getPercent
                      )
                    ).toFixed(2)}
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
        </DismissKeyboard>
      </KeyboardAwareScrollView>
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

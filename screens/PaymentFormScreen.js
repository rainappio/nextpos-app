import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
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
        total: 'Total',
        serviceCharge: 'Service Charge',
        discount: 'Discount',
        grandTotal: 'Grand Total',
        payOrder: 'Pay'
      },
      zh: {
        paymentTitle: '付款',
        total: '總計',
        serviceCharge: '服務費',
        discount: '折扣',
        grandTotal: '總金額',
        payOrder: '付帳'
      }
    })

    this.state = {
      t: context.t,
      getPercent: null
    }
  }

  componentDidMount() {
    this.props.getfetchglobalOrderOffers()
  }

  getPercent = percent => {
    this.setState({
      getPercent: percent
    })
  }

  render() {
    const { order, navigation, handleSubmit, globalorderoffers } = this.props
    const { t } = this.state

    var discounts = []
    discounts.push({
      label: 'No Discount',
      value: { discount: null, orderDiscount: 'NO_DISCOUNT' }
    })

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
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        <DismissKeyboard>
          <View style={styles.container}>
            <ScreenHeader backNavigation={true}
                          title={t('paymentTitle')}
            />

            <View
              style={[
                styles.flex_dir_row,
                styles.mgrtotop20,
                styles.paddingTopBtn20,
                styles.borderBottomLine
              ]}
            >
              <View style={[styles.half_width, styles.textBold]}>
                <Text>{t('total')}</Text>
              </View>

              <View style={[styles.half_width]}>
                <Text
                  style={[
                    { textAlign: 'right', marginRight: -26 },
                    styles.textBold
                  ]}
                >
                  $&nbsp;{order.total.amountWithTax.toFixed(2)}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.flex_dir_row,
                styles.paddingTopBtn20,
                styles.borderBottomLine
              ]}
            >
              <View style={[styles.half_width, styles.textBold]}>
                <Text>{t('serviceCharge')}</Text>
              </View>

              <View style={[styles.half_width]}>
                <Text
                  style={[
                    { textAlign: 'right', marginRight: -26 },
                    styles.textBold
                  ]}
                >
                  $&nbsp;{order.serviceCharge}
                </Text>
              </View>
            </View>

            <View style={[styles.paddingTopBtn20, styles.borderBottomLine]}>
              <View style={[styles.half_width, styles.textBold]}>
                <Text>{t('discount')}</Text>
              </View>
              {discounts.map((discount, ix) => (
                <View
                  style={[styles.borderBottomLine, styles.paddingTopBtn8]}
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

            <View
              style={[
                styles.flex_dir_row,
                styles.paddingTopBtn20,
                styles.borderBottomLine
              ]}
            >
              <View style={[styles.half_width, styles.textBold]}>
                <Text>{t('grandTotal')}</Text>
              </View>

              <View style={[styles.half_width]}>
                <Text
                  style={[
                    { textAlign: 'right', marginRight: -26 },
                    styles.textBold
                  ]}
                >
                  $&nbsp;
                  {(
                    order.orderTotal -
                    calculatePercentage(order.orderTotal, this.state.getPercent)
                  ).toFixed(2)}
                </Text>
              </View>
            </View>

            <View style={[styles.bottom]}>
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
      </ScrollView>
    )
  }
}

const mapStateToProps = (state, props) => ({
  globalorderoffers: state.globalorderoffers.data.results,
  initialValues: {
    orderTotal: props.order.orderTotal
  }
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

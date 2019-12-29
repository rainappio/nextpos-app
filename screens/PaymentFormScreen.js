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

class PaymentFormScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    getPercent: null
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
    var discounts = []
    var discountoffers = []
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
    discounts.push({
      label: 'ENTER DISCOUNT',
      value: { discount: '', orderDiscount: 'ENTER DISCOUNT' }
    })
    return (
      <ScrollView>
        <DismissKeyboard>
          <View style={styles.container_nocenterCnt}>
            <BackBtnCustom
              onPress={() => this.props.navigation.navigate('OrdersSummary')}
            />
            <Text
              style={[
                styles.welcomeText,
                styles.orange_color,
                styles.textMedium,
                styles.textBold
              ]}
            >
              Payment
            </Text>

            <View
              style={[
                styles.flex_dir_row,
                styles.mgrtotop20,
                styles.paddingTopBtn20,
                styles.borderBottomLine
              ]}
            >
              <View style={[styles.half_width, styles.textBold]}>
                <Text>Total</Text>
              </View>

              <View style={[styles.half_width]}>
                <Text
                  style={[
                    { textAlign: 'right', marginRight: -26 },
                    styles.textBold
                  ]}
                >
                  $&nbsp;{order.orderTotal.toFixed(2)}
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
                <Text>Service Fees</Text>
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
                <Text>Discount Amounts</Text>
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
                <Text>Total Amount</Text>
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
                  {/*{t('action.save')}*/}
                  Pay
                </Text>
              </TouchableOpacity>

              <View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('OrdersSummary')}
                >
                  <Text
                    style={[styles.bottomActionButton, styles.cancelButton]}
                  >
                    {/* {t('action.cancel')}*/}
                    Cancel
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

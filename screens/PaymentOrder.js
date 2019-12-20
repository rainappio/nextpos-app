import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
import { getProducts, getLables, getLabel } from '../actions'
import { successMessage } from '../constants/Backend'
import BackBtn from '../components/BackBtn'
import InputText from '../components/InputText'
import { isRequired } from '../validators'
import { DismissKeyboard } from '../components/DismissKeyboard'
import styles from '../styles'

class PaymentOrder extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    numbersArr: []
  }

  addNum = num => {
    let numbersArr = [...this.state.numbersArr]
    numbersArr.push(num)
    this.setState({ numbersArr })
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

    var total = 0
    this.state.numbersArr.map(num => (total += num))

    return (
      <ScrollView>
        <View
          style={{
            marginTop: 62,
            marginLeft: 35,
            marginRight: 35,
            marginBottom: 30
          }}
        >
          <BackBtn />
          <Text
            style={[
              styles.welcomeText,
              styles.orange_color,
              styles.textMedium,
              styles.textBold
            ]}
          >
            Payment Order
          </Text>

          <View
            style={[
              styles.flex_dir_row,
              styles.paddingTopBtn20,
              styles.borderBottomLine
            ]}
          >
            <View style={{ width: '90%' }}>
              <Text
                style={[styles.textBold, styles.textBig, styles.orange_color]}
              >
                {this.props.navigation.state.params.order.tableInfo.tableName}
              </Text>
            </View>

            <View>
              <Text style={styles.textBold}>split</Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.orange_bg,
            styles.flex_dir_row,
            styles.shoppingBar,
            styles.top40,
            {
              paddingLeft: 35,
              paddingRight: 35,
              paddingTop: 12
            }
          ]}
        >
          <View style={[styles.half_width]}>
            <Text style={[styles.textMedium, styles.whiteColor]}>
              Total Amount
            </Text>
          </View>

          <View style={[styles.half_width, styles.orange_color]}>
            <Text
              style={[
                { textAlign: 'right', marginRight: -26 },
                styles.textBold,
                styles.whiteColor,
                styles.textMedium
              ]}
            >
              $&nbsp;{this.props.navigation.state.params.payAmt.toFixed(2)}
              &nbsp;TX
            </Text>
          </View>
        </View>

        <View style={[styles.container, styles.no_mgrTop]}>
          <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
            <View style={[styles.onethirdWidth, styles.mgrtotop8]}>
              {/*<Text>{t('clientName')}</Text>*/}
              <Text>Cash</Text>
            </View>
            <View style={[styles.onesixthWidth]}>
              <Field
                name="cash"
                component={InputText}
                placeholder="EnterCash"
                keyboardType={'numeric'}
                cashVal={total}
              />
            </View>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row'
            }}
          >
            {moneyAmts.map((moneyAmt, ix) => (
              <TouchableOpacity
                onPress={() => {
                  this.addNum(moneyAmt.value)
                }}
                key={moneyAmt.value}
              >
                <View
                  style={{
                    width: 62,
                    height: 50,
                    borderWidth: 2,
                    borderColor: '#f18d1a',
                    marginRight: 17,
                    paddingTop: 16
                  }}
                >
                  <Text
                    style={[
                      styles.orange_color,
                      styles.textBold,
                      styles.centerText
                    ]}
                  >
                    {moneyAmt.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
            <View style={[styles.onethirdWidth, styles.mgrtotop8]}>
              {/*<Text>{t('clientName')}</Text>*/}
              <Text>Tax ID Number</Text>
            </View>
            <View style={[styles.onesixthWidth]}>
              <Field
                name="idnumber"
                component={InputText}
                validate={isRequired}
                placeholder="Enter ID Number"
                keyboardType={'numeric'}
              />
            </View>
          </View>

          <View style={[styles.mgrtotop20]}>
            <TouchableOpacity
              onPress={
                //() => this.props.navigation.navigate('CheckoutComplete')
                () => this.props.navigation.state.params.onSubmit()
              }
            >
              <Text style={[styles.bottomActionButton, styles.actionButton]}>
                {/*  {t('action.save')}*/}
                Charge
              </Text>
            </TouchableOpacity>

            <View>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Payment')}
              >
                <Text style={[styles.bottomActionButton, styles.cancelButton]}>
                  {/* {t('action.cancel')}*/}
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }
}

PaymentOrder = reduxForm({
  form: 'paymentForm'
})(PaymentOrder)

export default PaymentOrder

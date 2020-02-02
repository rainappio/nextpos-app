import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
import { getProducts, getLables, getLabel, isTablet } from '../actions'
import { successMessage } from '../constants/Backend'
import BackBtn from '../components/BackBtn'
import InputText from '../components/InputText'
import { isRequired } from '../validators'
import { DismissKeyboard } from '../components/DismissKeyboard'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'

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
        totalAmount: 'Total Amount',
        cash: 'Cash',
        enterCash: 'Enter Cash',
        taxIDNumber: 'Tax ID Number',
        enterTaxIDNumber: 'Enter Tax ID Number',
        charge: 'Charge'
      },
      zh: {
        paymentMethodTitle: '付費方式',
        totalAmount: '總金額',
        cash: '現金',
        enterCash: '輸入現金',
        taxIDNumber: '統一編號',
        enterTaxIDNumber: '輸入統一編號',
        charge: '結帳'
      }
    })

    this.state = {
      t: context.t
    }
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
      reset,
      handleSubmit,
      order,
      navigation,
      discountTotal,
      clearOrder,
      getOrder,
      initialize,
      addNum,
      dynamicTotal
    } = this.props

    const { t } = this.state

    return (
      <View style={{flex: 1, marginTop: 44}}>
        <View style={{ marginLeft: 20, marginRight: 20, marginBottom: 20}}>
          <BackBtn size={isTablet ? 44 : 28}/>
          <Text
            style={[
            	styles.welcomeText,
            	styles.orange_color,
            	styles.textBold
          	]}
          >
            {t('paymentMethodTitle')}
          </Text>

          <View
            style={[
              styles.flex_dir_row,
              styles.paddingTopBtn20,
              styles.borderBottomLine,
              {marginLeft: 20, marginRight: 20}
            ]}
          	>
            <View style={{ width: '90%' }}>
              <Text
                style={[styles.textBold, styles.textBig, styles.orange_color]}
              >
                {order.tableInfo.tableName}
              </Text>
            </View>

            <View>
             <Text style={[styles.textBold, styles.defaultfontSize]}></Text>
            </View>

          </View>
        </View>

        <View
          style={[
            styles.orange_bg,
            styles.flex_dir_row,
            {padding: 20}        
          ]}
        	>
          <View style={[styles.fullhalf_width]}>
            <Text style={[styles.defaultfontSize, styles.whiteColor]}>
              {t('totalAmount')}
            </Text>
          </View>

          <View style={[styles.fullhalf_width, styles.orange_color]}>
            <Text
              style={[
                { textAlign: 'right' },
                styles.textBold,
                styles.whiteColor,
                styles.defaultfontSize
              ]}
            >
              $&nbsp;{discountTotal.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={{marginLeft: 20, marginRight: 20}}>
          <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
            <View style={[styles.onethirdWidth, styles.mgrtotop8]}>
              <Text style={styles.defaultfontSize}>{t('cash')}</Text>
            </View>
            <View style={[styles.onesixthWidth]}>
              <Field
                name="cash"
                component={InputText}
                placeholder={t('enterCash')}
                keyboardType={'numeric'}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginTop: 12,
              marginLeft: '35%',
              width: '65%'
            }}
          >
            {moneyAmts.map((moneyAmt, ix) => (
              <TouchableOpacity
                onPress={() => {
                  addNum(moneyAmt.value)
                }}
                key={moneyAmt.value}
              >
                <View>
                  <Text
                    style={[
                      styles.orange_color,
                      styles.textBold,
                      styles.centerText,
                      styles.defaultfontSize,
                      styles.cashBox
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
              <Text style={styles.defaultfontSize}>{t('taxIDNumber')}</Text>
            </View>
            <View style={[styles.onesixthWidth]}>
              <Field
                name="idnumber"
                component={InputText}
                placeholder={t('enterTaxIDNumber')}
                keyboardType={'numeric'}
              />
            </View>
          </View>          
        </View>

        <View style={[styles.toBottom,{paddingLeft: 20, paddingRight: 20, width: '100%'}]}>
             <TouchableOpacity onPress={() => handleSubmit()} style={styles.jc_alignIem_center}>
              <Text style={[styles.bottomActionButton, styles.actionButton]}>
                {t('charge')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Payment')}
                style={styles.jc_alignIem_center}
              >
                <Text style={[styles.bottomActionButton, styles.cancelButton]}>
                  {t('action.cancel')}
                </Text>
              </TouchableOpacity>
          </View>
      </View>
    )
  }
}

const mapStateToProps = (state, props) => ({
  initialValues: { cash: '' + props.dynamicTotal }
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

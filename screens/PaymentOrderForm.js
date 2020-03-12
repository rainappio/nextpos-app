import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
import { getProducts, getLables, getLabel } from '../actions'
import { successMessage } from '../constants/Backend'
import BackBtn from '../components/BackBtn'
import InputText from '../components/InputText'
import { isRequired } from '../validators'
import { DismissKeyboard } from '../components/DismissKeyboard'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import SegmentedControl from '../components/SegmentedControl'
import DropDown from '../components/DropDown'

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
        enterCash: 'Enter Cash',
        taxIDNumber: 'Tax ID Number',
        enterTaxIDNumber: 'Enter Tax ID Number',
        charge: 'Charge',
        paymentMethod: 'Payment Method',
        cashPayment: 'Cash',
        cardPayment: 'Credit Card',
        chooseCardType: 'Choose Card Type',
        CardNo: 'Last 4 Digits',
        enterCardNo: 'Last 4 Digits'
      },
      zh: {
        paymentMethodTitle: '付費方式',
        totalAmount: '總金額',
        enterCash: '輸入現金',
        taxIDNumber: '統一編號',
        enterTaxIDNumber: '輸入統一編號',
        charge: '結帳',
        paymentMethod: '付費方式',
        cashPayment: '現金',
        cardPayment: '信用卡',
        chooseCardType: '選擇信用卡種類',
        CardNo: '卡號末四碼',
        enterCardNo: '卡號末四碼'
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
      discountTotal,
      addNum,
      resetTotal
    } = this.props

    const { t } = this.context
    const { paymentsTypes, selectedPaymentType, paymentsTypeslbl, handlePaymentTypeSelection } = this.props

		const TaxInputAndBottomBtns = (props) => {
			return(
				<View>
					<View style={styles.fieldContainer}>
            <View style={{flex: 2}}>
              <Text style={styles.fieldTitle}>{t('taxIDNumber')}</Text>
            </View>
            <View style={{flex: 3}}>
              <Field
                name="taxIdNumber"
                component={InputText}
                placeholder={t('enterTaxIDNumber')}
                keyboardType={'numeric'}
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
                onPress={() => props.navigation.navigate('Payment')}
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
      <ScrollView>
        <View style={styles.container}>
          <BackBtn />
          <Text style={styles.screenTitle}>
            {t('paymentMethodTitle')}
          </Text>

          <View>
            <View>
              <Text
                style={[styles.textBold, styles.textBig, styles.orange_color]}
              >
                {order.orderType === 'IN_STORE' ? order.tableDisplayName : t('order.takeOut')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionBar}>
          <View style={[styles.half_width]}>
            <Text style={[styles.textMedium, styles.whiteColor]}>
              {t('totalAmount')}
            </Text>
          </View>

          <View style={[styles.half_width, styles.orange_color]}>
            <Text
              style={[
                { textAlign: 'right' },
                styles.textBold,
                styles.whiteColor,
                styles.textMedium
              ]}
            >
              ${order.orderTotal.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={[styles.sectionContainer]}>
        	<View style={[styles.sectionContent]}>
          	<View style={styles.sectionTitleContainer}>
            	<Text style={styles.sectionTitleText}>{t('paymentMethod')}</Text>
          	</View>
          	<View>
            	<View style={{flex: 1}}>
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
              		<Text style={styles.fieldTitle}>{t('cashPayment')}</Text>
            		</View>
            		<View style={{flex: 3}}>
              		<Field
                		name="cash"
                		component={InputText}
                		placeholder={t('enterCash')}
                		keyboardType={'numeric'}
                		onFocus={() => resetTotal()}
              		/>
            		</View>
          		</View>

          		<View
            		style={{
              		flex: 1,
              		flexDirection: 'row',
              		justifyContent: 'space-evenly'
            		}}
          		>
            		{moneyAmts.map((moneyAmt, ix) => (
              		<TouchableOpacity
                		onPress={() => {
                  		addNum(moneyAmt.value)
                		}}
                		key={moneyAmt.value}
              		>
                		<View
                  		style={{
                    		width: 62,
                    		height: 50,
                    		borderWidth: 2,
                    		borderColor: '#f18d1a',
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
          	</View>
					}

					{
						selectedPaymentType === 1 &&
						<View>
          		<View style={styles.fieldContainer}>
            		<View style={{flex: 2}}>
              		<Text style={styles.fieldTitle}>{t('CardNo')}</Text>
            		</View>
            		<View style={{flex: 3}}>
              		<Field
                		name="cardNumber"
                		component={InputText}
                		placeholder={t('enterCardNo')}
                		keyboardType={'numeric'}
                		onFocus={() => resetTotal()}
              		/>
            		</View>
          		</View>

          		<Field
            		name="cardType"
            		component={DropDown}
            		placeholder={{value: null, label: t('chooseCardType')}}
            		options={[
              		{label: 'Visa', value: 'VISA'},
              		{label: 'MasterCard', value: 'MASTER'},
              		{label: 'Other', value: 'OTHER'}
            		]}
            		forFilter={true}
          		/>
          	</View>
					}

					{
						<TaxInputAndBottomBtns
							handleSubmit={handleSubmit}
							navigation={this.props.navigation}
							/>
					}

        </View>
      </ScrollView>
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

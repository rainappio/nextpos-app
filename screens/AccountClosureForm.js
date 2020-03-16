import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import { DismissKeyboard } from '../components/DismissKeyboard'
import InputText from '../components/InputText'
import { isRequired } from '../validators'
import {enter} from "react-native/Libraries/Utilities/ReactNativeTestTools";

class AccountClosureForm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        accountCloseTitle: 'Closing Account',
        staff: 'Staff',
        cashSection: 'Cash',
        cardSection: 'Credit Card',
      	nextAction: 'Next',
      	closingStatus: 'Status',
      	startingCash: 'Starting Cash',
      	totalCashTransitionAmt: 'Total Cash Transactions',
      	totalCashInRegister: 'Actual Cash Amount',
        enterAmount: 'Enter Amount',
      	remark: 'Unbalance Reason',
      	totalCardTransitionAmt: 'Total Card Transactions',
      	totalCardInRegister: 'Actual Card Amount'
      },
      zh: {
        accountCloseTitle: '開始關帳',
        staff: '員工',
        cashSection: '現金',
        cardSection: '信用卡',
        nextAction: '下一步',
        closingStatus: '關帳狀態',
        startingCash: '開帳現金',
        totalCashTransitionAmt: '現金營業額',
        totalCashInRegister: '實際現金總額',
        enterAmount: '請輸入金額',
        remark: '理由',
        totalCardTransitionAmt: '刷卡營業額',
        totalCardInRegister: '實際刷卡營業額'
      }
    })
  }

  render() {
    const { t } = this.context
    const { mostrecentShift, handleSubmit } = this.props

    const closingShiftReport = {
      totalByPaymentMethod: {}
    }

    if (mostrecentShift.close.closingShiftReport !== null && mostrecentShift.close.closingShiftReport.totalByPaymentMethod !== null) {
      closingShiftReport.totalByPaymentMethod = mostrecentShift.close.closingShiftReport.totalByPaymentMethod
    }

    let enteredCashAmount = null
    let enteredCardAmount = null

    if (mostrecentShift.close.closingBalances !== undefined) {
      if (mostrecentShift.close.closingBalances.hasOwnProperty('CASH')) {
        enteredCashAmount = mostrecentShift.close.closingBalances['CASH'].closingBalance
      }
    }

    return (
      <DismissKeyboard>
      	<ScrollView scrollIndicatorInsets={{ right: 1 }}>

			{/* Cash */}
          	<View style={styles.sectionBar}>
              <View>
                <Text style={styles.sectionBarTextSmall}>
                  {t('cashSection')}
                </Text>
              </View>
          	</View>

          	<View style={[styles.sectionContainer]}>
            	<View style={{flex: 3, justifyContent: 'center'}}>
              	<View style={[styles.fieldContainer]}>
                	<View style={{flex: 3}}>
                  	<Text style={[styles.fieldTitle]}>
                    	{t('startingCash')}
                  	</Text>
                	</View>
                	<View style={{flex: 1}}>
                  	<Text>${mostrecentShift.open.balance}</Text>
                	</View>
              	</View>

              	<View style={[styles.fieldContainer]}>
                	<View style={{flex: 3}}>
                  	<Text style={[styles.fieldTitle]}>
                    	{t('totalCashTransitionAmt')}
                  	</Text>
                	</View>
                	<View style={{flex: 1}}>
                  	<Text>${closingShiftReport.totalByPaymentMethod.hasOwnProperty('CASH') ? closingShiftReport.totalByPaymentMethod.CASH.orderTotal : 0}
                  	</Text>
                	</View>
              	</View>

              	<View style={styles.fieldContainer}>
                	<View style={{flex: 3}}>
                  	<Text style={[styles.fieldTitle]}>
                    	{t('totalCashInRegister')}
                  	</Text>
                	</View>
                	<View style={{flex: 1}}>
                  	<Field
              				name="cashclosingBalance"
              				component={InputText}
                      keyboardType={`numeric`}
              				validate={isRequired}
              				secureTextEntry={false}
              				height={35}
            				/>
                	</View>
              	</View>

              	<View style={styles.fieldContainer}>
                	<View style={{flex: 1}}>
                  	<Field
              				name="cashunbalanceReason"
              				component={InputText}
              				placeholder={t('remark')}
              				secureTextEntry={false}
              				height={35}
            				/>
                	</View>
              	</View>

            	</View>
          	</View>
        	{/* #Cash */}


        	{/* Credit Card */}
          <View style={styles.sectionBar}>
            <View>
              <Text style={styles.sectionBarText}>
                {t('cardSection')}
              </Text>
            </View>
          </View>

          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, {flex: 2}]}>
              <Text style={[styles.fieldTitle]}>
                {t('totalCardTransitionAmt')}
              </Text>
            </View>
            <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
              <Text>$
                {closingShiftReport.totalByPaymentMethod.hasOwnProperty('CARD') ? closingShiftReport.totalByPaymentMethod.CARD.orderTotal : 0}
              </Text>
            </View>
          </View>

          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, {flex: 2}]}>
              <Text style={[styles.fieldTitle]}>
                {t('totalCardInRegister')}
              </Text>
            </View>
            <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
              <Field
                name="cardclosingBalance"
                component={InputText}
                validate={isRequired}
                keyboardType={`numeric`}
                placeholder={t('enterAmount')}
              />
            </View>
          </View>

          <View style={styles.tableRowContainerWithBorder}>
            <View style={{flex: 1}}>
              <Field
                name="cardunbalanceReason"
                component={InputText}
                placeholder={t('remark')}
              />
            </View>
          </View>

          <View style={[styles.bottom, styles.horizontalMargin]}>
            <TouchableOpacity
              onPress={handleSubmit}
            >
              <Text style={[styles.bottomActionButton, styles.actionButton]}>
                {t('nextAction')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
            >
              <Text style={[styles.bottomActionButton, styles.cancelButton]}>
                {t('cancel')}
              </Text>
            </TouchableOpacity>
          </View>
          {/* #Credit Card */}

				</ScrollView>
      </DismissKeyboard>
    )
  }
}

AccountClosureForm = reduxForm({
  form: 'accountClosureForm'
})(AccountClosureForm)

export default AccountClosureForm

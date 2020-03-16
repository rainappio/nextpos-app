import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import ConfirmActionButton from '../components/ConfirmActionButton'
import InputText from '../components/InputText'

class AccountCloseConfirmForm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        confirmCloseTitle: 'Confirm Closing Account Details',
        staff: 'Staff',
        postClosingEntries: 'Closing Account Summaries',
      	totalCashIncome: 'Total Cash Income',
      	totalCreditCardIncome: 'Total Card Income',
      	totalClosingAmount: 'Total Closing Amount',
        invoicesTitle: 'Invoices',
      	totalInvoices: 'Total Number of Orders',
      	deletedOrders: 'Total Number Of Orders Deleted',
      	totalDiscounts: 'Total Amount Of Discount',
      	totalServiceCharge: 'Total Service Charge',
      	closingRemark: 'Closing Remark',
        confirmAction: 'Confirm Close',
      	abortAction: 'Abort Close'
      },
      zh: {
        confirmCloseTitle: '關帳確認',
        staff: '員工',
        postClosingEntries: '關帳總覽',
        totalCashIncome: '現金營業額',
        totalCreditCardIncome: '刷卡營業額',
        totalClosingAmount: '總營業額',
        invoicesTitle: '訂單總覽',
        totalInvoices: '訂單數',
        deletedOrders: '刪單數',
        totalDiscounts: '折扣',
        totalServiceCharge: '服務費',
        closingRemark:'關帳備註',
        confirmAction: '確定關帳',
        abortAction: '取消關帳'
      }
    })
  }

  render() {
    const { t } = this.context
		const { handleSubmit, mostrecentShift, handleAbortCloseShift } = this.props

		const closingShiftReport = {
      totalOrderCount: 0,
      totalByPaymentMethod: {},
      orderCountByState: {}

    }

    if (mostrecentShift.close.closingShiftReport !== null) {
      closingShiftReport.totalOrderCount = mostrecentShift.close.closingShiftReport.totalOrderCount
    }

		if (mostrecentShift.close.closingShiftReport !== null && mostrecentShift.close.closingShiftReport.totalByPaymentMethod !== null) {
			closingShiftReport.totalByPaymentMethod = mostrecentShift.close.closingShiftReport.totalByPaymentMethod
		}

		if(mostrecentShift.close.closingShiftReport !== null && mostrecentShift.close.closingShiftReport.orderCountByState !== null) {
			closingShiftReport.orderCountByState = mostrecentShift.close.closingShiftReport.orderCountByState
		}

    const cashTotal = closingShiftReport.totalByPaymentMethod.hasOwnProperty('CASH') ? closingShiftReport.totalByPaymentMethod.CASH.orderTotal : 0
    const cardTotal = closingShiftReport.totalByPaymentMethod.hasOwnProperty('CARD') ? closingShiftReport.totalByPaymentMethod.CARD.orderTotal : 0
    const cashDiscount = closingShiftReport.totalByPaymentMethod.hasOwnProperty('CASH') ? closingShiftReport.totalByPaymentMethod.CASH.discount : 0
    const cardDiscount = closingShiftReport.totalByPaymentMethod.hasOwnProperty('CARD') ? closingShiftReport.totalByPaymentMethod.CARD.discount : 0
    const cashServiceCharge = closingShiftReport.totalByPaymentMethod.hasOwnProperty('CASH') ? closingShiftReport.totalByPaymentMethod.CASH.serviceCharge : 0
    const cardServiceCharge = closingShiftReport.totalByPaymentMethod.hasOwnProperty('CARD') ? closingShiftReport.totalByPaymentMethod.CARD.serviceCharge : 0


    return (
      <View>
        {/* Post-Closing Entries */}
        <View style={styles.sectionBar}>
          <View>
            <Text style={styles.sectionBarText}>
              {t('postClosingEntries')}
            </Text>
          </View>
        </View>

        <View style={styles.tableRowContainerWithBorder}>
          <View style={{flex: 3}}>
            <Text style={[styles.fieldTitle]}>
              {t('totalCashIncome')}
            </Text>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <Text>${cashTotal}</Text>
          </View>
        </View>

        <View style={styles.tableRowContainerWithBorder}>
          <View style={{flex: 3}}>
            <Text style={[styles.fieldTitle]}>
              {t('totalCreditCardIncome')}
            </Text>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <Text>${cardTotal}</Text>
          </View>
        </View>

        <View style={styles.tableRowContainerWithBorder}>
          <View style={{flex: 3}}>
            <Text style={[styles.fieldTitle]}>
              {t('totalClosingAmount')}
            </Text>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <Text>
              ${cashTotal + cardTotal}
            </Text>
          </View>
        </View>
        {/* #Post-Closing Entries */}

        {/* Cash */}
        <View style={styles.sectionBar}>
          <View>
            <Text style={styles.sectionBarText}>
              {t('cashSection')}
            </Text>
          </View>
        </View>

        <View style={styles.tableRowContainerWithBorder}>
          <View style={[styles.tableCellView, {flex: 2}]}>
            <Text style={[styles.fieldTitle]}>
              {t('startingCash')}
            </Text>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <Text>${mostrecentShift.open.balance}</Text>
          </View>
        </View>

        <View style={styles.tableRowContainerWithBorder}>
          <View style={[styles.tableCellView, {flex: 2}]}>
            <Text style={[styles.fieldTitle]}>
              {t('totalCashTransitionAmt')}
            </Text>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <Text>${cashTotal}</Text>
          </View>
        </View>

        <View style={styles.tableRowContainerWithBorder}>
          <View style={[styles.tableCellView, {flex: 2}]}>
            <Text style={[styles.fieldTitle]}>
              {t('totalCashInRegister')}
            </Text>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <Text>${mostrecentShift.close.closingBalances.hasOwnProperty('CASH') ? mostrecentShift.close.closingBalances.CASH.closingBalance : 0}</Text>
          </View>
        </View>
        {/* #Cash */}

        {/* Credit Card */}
        <View style={styles.sectionBar}>
          <View>
            <TouchableOpacity>
              <Text style={styles.sectionBarText}>
                {t('cardSection')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tableRowContainerWithBorder}>
          <View style={[styles.tableCellView, {flex: 2}]}>
            <Text style={[styles.fieldTitle]}>
              {t('totalCardTransitionAmt')}
            </Text>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <Text>${cardTotal}</Text>
          </View>
        </View>

        <View style={styles.tableRowContainerWithBorder}>
          <View style={[styles.tableCellView, {flex: 2}]}>
            <Text style={[styles.fieldTitle]}>
              {t('totalCardInRegister')}
            </Text>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <Text>${mostrecentShift.close.closingBalances.hasOwnProperty('CARD') && mostrecentShift.close.closingBalances.CARD.closingBalance}
            </Text>
          </View>
        </View>
        {/* #Credit Card */}

        {/* Invoice */}
        <View style={styles.sectionBar}>
          <View>
            <Text style={styles.sectionBarText}>
              {t('invoicesTitle')}
            </Text>
          </View>
        </View>

        <View style={styles.tableRowContainerWithBorder}>
          <View style={[styles.tableCellView, {flex: 2}]}>
            <Text style={[styles.fieldTitle]}>
              {t('totalInvoices')}
            </Text>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <Text>{closingShiftReport.totalOrderCount}</Text>
          </View>
        </View>
        <View style={styles.tableRowContainerWithBorder}>
          <View style={[styles.tableCellView, {flex: 2}]}>
            <Text style={[styles.fieldTitle]}>
              {t('deletedOrders')}
            </Text>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <Text>
              {closingShiftReport.orderCountByState.hasOwnProperty('DELETED') ? closingShiftReport.orderCountByState.DELETED.orderCount : 0}
            </Text>
          </View>
        </View>
        <View style={styles.tableRowContainerWithBorder}>
          <View style={{flex: 3}}>
            <Text style={[styles.tableCellView, {flex: 2}]}>
              {t('totalDiscounts')}
            </Text>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <Text>${cashDiscount + cardDiscount}
            </Text>
          </View>
        </View>
        <View style={styles.tableRowContainerWithBorder}>
          <View style={{flex: 3}}>
            <Text style={[styles.tableCellView, {flex: 2}]}>
              {t('totalServiceCharge')}
            </Text>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <Text>${cashServiceCharge + cardServiceCharge}
            </Text>
          </View>
        </View>
        {/* #Invoice */}

        {/* Others */}
        <View style={styles.tableRowContainerWithBorder}>
          <View style={{flex: 1}}>
            <Field
              name="closingRemark"
              component={InputText}
              placeholder={t('closingRemark')}
              secureTextEntry={false}
              height={35}
            />
          </View>
        </View>

        <View style={[styles.bottom, styles.horizontalMargin]}>

          <TouchableOpacity
            onPress={handleSubmit}
          >
            <Text style={[styles.bottomActionButton, styles.actionButton]}>
              {t('confirmAction')}
            </Text>
          </TouchableOpacity>

          <ConfirmActionButton
            handleConfirmAction={handleAbortCloseShift}
            buttonTitle='abortAction'
          />
        </View>
        {/* #Others */}
      </View>
    )
  }
}

AccountCloseConfirmForm = reduxForm({
  form: 'AccountCloseConfirmForm'
})(AccountCloseConfirmForm)

export default AccountCloseConfirmForm

import React from 'react'
import {Field, reduxForm, FieldArray } from 'redux-form'
import {
  ActivityIndicator,
  InputAccessoryView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native'
import {connect} from 'react-redux'
import BackBtnCustom from '../components/BackBtnCustom'
import {formatCurrency, formatDate, getShiftStatus} from '../actions'
import {
  api,
  dispatchFetchRequest,
  successMessage, warningMessage
} from '../constants/Backend'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import ConfirmActionButton from '../components/ConfirmActionButton'
import { DismissKeyboard } from '../components/DismissKeyboard'
import {handleCloseShift, handleOpenShift, handleAbortCloseShift, renderShiftStatus} from "../helpers/shiftActions";
import BackBtn from "../components/BackBtn";
import InputText from '../components/InputText'
import ScreenHeader from "../components/ScreenHeader";
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";
import StyledTextInput from "../components/StyledTextInput";
import {StyledText} from "../components/StyledText";

class AccountCloseConfirmForm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { t } = this.context
		const { handleSubmit, mostrecentShift, handleAbortCloseShift } = this.props

		const closingShiftReport = {
      totalOrderCount: 0,
      totalByPaymentMethod: {},
      orderCountByState: {}

    }

    if (mostrecentShift.close.closingShiftReport != null) {
      closingShiftReport.totalOrderCount = mostrecentShift.close.closingShiftReport.totalOrderCount
    }

		if (mostrecentShift.close.closingShiftReport != null && mostrecentShift.close.closingShiftReport.totalByPaymentMethod != null) {
			closingShiftReport.totalByPaymentMethod = mostrecentShift.close.closingShiftReport.totalByPaymentMethod
		}

		if(mostrecentShift.close.closingShiftReport != null && mostrecentShift.close.closingShiftReport.orderCountByState != null) {
			closingShiftReport.orderCountByState = mostrecentShift.close.closingShiftReport.orderCountByState
		}

    const cashTotal = closingShiftReport.totalByPaymentMethod.hasOwnProperty('CASH') ? closingShiftReport.totalByPaymentMethod.CASH.orderTotal : 0
    const actualCashAmount = mostrecentShift.close.closingBalances.hasOwnProperty('CASH') ? mostrecentShift.close.closingBalances.CASH.closingBalance : 0
    const cashUnbalanceReason = mostrecentShift.close.closingBalances.hasOwnProperty('CASH') && mostrecentShift.close.closingBalances.CASH.unbalanceReason
    const cashDifference = actualCashAmount - (cashTotal + mostrecentShift.open.balance)
    const cardTotal = closingShiftReport.totalByPaymentMethod.hasOwnProperty('CARD') ? closingShiftReport.totalByPaymentMethod.CARD.orderTotal : 0
    const actualCardAmount = mostrecentShift.close.closingBalances.hasOwnProperty('CARD') ? mostrecentShift.close.closingBalances.CARD.closingBalance : 0
    const cardUnbalanceReason = mostrecentShift.close.closingBalances.hasOwnProperty('CARD') && mostrecentShift.close.closingBalances.CARD.unbalanceReason
    const cardDifference = actualCardAmount - cardTotal

    const cashDiscount = closingShiftReport.totalByPaymentMethod.hasOwnProperty('CASH') ? closingShiftReport.totalByPaymentMethod.CASH.discount : 0
    const cardDiscount = closingShiftReport.totalByPaymentMethod.hasOwnProperty('CARD') ? closingShiftReport.totalByPaymentMethod.CARD.discount : 0
    const cashServiceCharge = closingShiftReport.totalByPaymentMethod.hasOwnProperty('CASH') ? closingShiftReport.totalByPaymentMethod.CASH.serviceCharge : 0
    const cardServiceCharge = closingShiftReport.totalByPaymentMethod.hasOwnProperty('CARD') ? closingShiftReport.totalByPaymentMethod.CARD.serviceCharge : 0

    return (
      <ThemeKeyboardAwareScrollView>
        <View style={[styles.container]}>
          <ScreenHeader title={t('shift.confirmCloseTitle')}/>

          <View>
            <StyledText style={[styles.toRight]}>
              {t('shift.staff')} - {mostrecentShift.open.who}
            </StyledText>
            <StyledText style={[styles.toRight]}>
              {formatDate(mostrecentShift.open.timestamp)}
            </StyledText>
            <StyledText style={[styles.toRight]}>
              {t('shift.closingStatus')} - {renderShiftStatus(mostrecentShift.shiftStatus)}
            </StyledText>
          </View>
        </View>

        {/* Post-Closing Entries */}
        <View style={styles.sectionBar}>
          <View>
            <Text style={styles.sectionBarText}>
              {t('shift.shiftSummary')}
            </Text>
          </View>
        </View>

        <View style={styles.tableRowContainerWithBorder}>
          <View style={{flex: 3}}>
            <StyledText style={[styles.fieldTitle]}>
              {t('shift.totalCashIncome')}
            </StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <StyledText>{formatCurrency(cashTotal)}</StyledText>
          </View>
        </View>

        <View style={styles.tableRowContainerWithBorder}>
          <View style={{flex: 3}}>
            <StyledText style={[styles.fieldTitle]}>
              {t('shift.totalCreditCardIncome')}
            </StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <StyledText>{formatCurrency(cardTotal)}</StyledText>
          </View>
        </View>

        <View style={styles.tableRowContainerWithBorder}>
          <View style={{flex: 3}}>
            <StyledText style={[styles.fieldTitle]}>
              {t('shift.totalClosingAmount')}
            </StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <StyledText>
              {formatCurrency(cashTotal + cardTotal)}
            </StyledText>
          </View>
        </View>
        {/* #Post-Closing Entries */}

        {/* Cash */}
        <View style={styles.sectionBar}>
          <View>
            <Text style={styles.sectionBarText}>
              {t('shift.cashSection')}
            </Text>
          </View>
        </View>

        <View style={styles.tableRowContainerWithBorder}>
          <View style={[styles.tableCellView, {flex: 2}]}>
            <StyledText style={[styles.fieldTitle]}>
              {t('shift.startingCash')}
            </StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <StyledText>{formatCurrency(mostrecentShift.open.balance)}</StyledText>
          </View>
        </View>

        <View style={styles.tableRowContainerWithBorder}>
          <View style={[styles.tableCellView, {flex: 2}]}>
            <StyledText style={[styles.fieldTitle]}>
              {t('shift.totalCashTransitionAmt')}
            </StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <StyledText>{formatCurrency(cashTotal)}</StyledText>
          </View>
        </View>

        <View style={styles.tableRowContainerWithBorder}>
          <View style={[styles.tableCellView, {flex: 2}]}>
            <StyledText style={[styles.fieldTitle]}>
              {t('shift.totalCashInRegister')}
            </StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <StyledText>{formatCurrency(actualCashAmount)}</StyledText>
          </View>
        </View>

        <View style={styles.tableRowContainerWithBorder}>
          <View style={[styles.tableCellView, {flex: 2}]}>
            <StyledText style={[styles.fieldTitle]}>
              {t('shift.difference')}
            </StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <StyledText>{formatCurrency(cashDifference)}</StyledText>
          </View>
        </View>
        <View style={styles.tableRowContainerWithBorder}>
          <View style={[styles.tableCellView, {flex: 2}]}>
            <StyledText style={[styles.fieldTitle]}>
              {t('shift.remark')}
            </StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <StyledText>{cashUnbalanceReason}</StyledText>
          </View>
        </View>
        {/* #Cash */}

        {/* Credit Card */}
        <View style={styles.sectionBar}>
          <View>
            <TouchableOpacity>
              <Text style={styles.sectionBarText}>
                {t('shift.cardSection')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tableRowContainerWithBorder}>
          <View style={[styles.tableCellView, {flex: 2}]}>
            <StyledText style={[styles.fieldTitle]}>
              {t('shift.totalCardTransitionAmt')}
            </StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <StyledText>{formatCurrency(cardTotal)}</StyledText>
          </View>
        </View>

        <View style={styles.tableRowContainerWithBorder}>
          <View style={[styles.tableCellView, {flex: 2}]}>
            <StyledText style={[styles.fieldTitle]}>
              {t('shift.totalCardInRegister')}
            </StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <StyledText>{formatCurrency(actualCardAmount)}
            </StyledText>
          </View>
        </View>

        <View style={styles.tableRowContainerWithBorder}>
          <View style={[styles.tableCellView, {flex: 2}]}>
            <StyledText style={[styles.fieldTitle]}>
              {t('shift.difference')}
            </StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <StyledText>{formatCurrency(cardDifference)}
            </StyledText>
          </View>
        </View>

        <View style={styles.tableRowContainerWithBorder}>
          <View style={[styles.tableCellView, {flex: 2}]}>
            <StyledText style={[styles.fieldTitle]}>
              {t('shift.remark')}
            </StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <StyledText>{cardUnbalanceReason}</StyledText>
          </View>
        </View>
        {/* #Credit Card */}

        {/* Invoice */}
        <View style={styles.sectionBar}>
          <View>
            <Text style={styles.sectionBarText}>
              {t('shift.invoicesTitle')}
            </Text>
          </View>
        </View>

        <View style={styles.tableRowContainerWithBorder}>
          <View style={[styles.tableCellView, {flex: 2}]}>
            <StyledText style={[styles.fieldTitle]}>
              {t('shift.totalInvoices')}
            </StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <StyledText>{closingShiftReport.totalOrderCount}</StyledText>
          </View>
        </View>
        <View style={styles.tableRowContainerWithBorder}>
          <View style={[styles.tableCellView, {flex: 2}]}>
            <StyledText style={[styles.fieldTitle]}>
              {t('shift.deletedOrders')}
            </StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <StyledText>
              {closingShiftReport.orderCountByState.hasOwnProperty('DELETED') ? closingShiftReport.orderCountByState.DELETED.orderCount : 0}
            </StyledText>
          </View>
        </View>
        <View style={styles.tableRowContainerWithBorder}>
          <View style={{flex: 3}}>
            <StyledText style={[styles.tableCellView, {flex: 2}]}>
              {t('shift.totalDiscounts')}
            </StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <StyledText>{formatCurrency(cashDiscount + cardDiscount)}</StyledText>
          </View>
        </View>
        <View style={styles.tableRowContainerWithBorder}>
          <View style={{flex: 3}}>
            <StyledText style={[styles.tableCellView, {flex: 2}]}>
              {t('shift.totalServiceCharge')}
            </StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <StyledText>{formatCurrency(cashServiceCharge + cardServiceCharge)}</StyledText>
          </View>
        </View>
        {/* #Invoice */}

        {/* Others */}
        <View style={styles.tableRowContainerWithBorder}>
          <View style={{flex: 1}}>
            <Field
              name="closingRemark"
              component={InputText}
              placeholder={t('shift.closingRemark')}
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
              {t('shift.confirmAction')}
            </Text>
          </TouchableOpacity>

          <ConfirmActionButton
            handleConfirmAction={handleAbortCloseShift}
            buttonTitle='shift.abortAction'
          />
        </View>
        {/* #Others */}
      </ThemeKeyboardAwareScrollView>
    )
  }
}

AccountCloseConfirmForm = reduxForm({
  form: 'AccountCloseConfirmForm'
})(AccountCloseConfirmForm)

export default AccountCloseConfirmForm

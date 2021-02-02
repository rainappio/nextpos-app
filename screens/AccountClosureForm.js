import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {Text, TouchableOpacity, View} from 'react-native'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import InputText from '../components/InputText'
import {handleAbortCloseShift, renderShiftStatus} from "../helpers/shiftActions";
import ConfirmActionButton from "../components/ConfirmActionButton";
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";
import ScreenHeader from "../components/ScreenHeader";
import {formatCurrency, formatDate} from "../actions";
import {StyledText} from "../components/StyledText";

class AccountClosureForm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }

  render() {
    const {t} = this.context
    const {mostrecentShift, handleSubmit} = this.props

    const closingShiftReport = {
      totalByPaymentMethod: {}
    }

    if (mostrecentShift.close.closingShiftReport !== null && mostrecentShift.close.closingShiftReport.totalByPaymentMethod !== null) {
      closingShiftReport.totalByPaymentMethod = mostrecentShift.close.closingShiftReport.totalByPaymentMethod
    }

    return (
      <ThemeKeyboardAwareScrollView>
        <View style={[styles.container]}>
          <ScreenHeader title={t('shift.accountCloseTitle')} />

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

        {/* Cash */}
        <View style={styles.sectionBar}>
          <View>
            <Text style={styles.sectionBarText}>
              {t('shift.cashSection')}
            </Text>
          </View>
        </View>

        <View style={[styles.tableRowContainerWithBorder]}>
          <View style={[styles.tableCellView, {flex: 2}]}>
            <StyledText style={[styles.fieldTitle]}>
              {t('shift.startingCash')}
            </StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <StyledText>{formatCurrency(mostrecentShift.open.balance)}</StyledText>
          </View>
        </View>

        <View style={[styles.tableRowContainerWithBorder]}>
          <View style={[styles.tableCellView, {flex: 2}]}>
            <StyledText style={[styles.fieldTitle]}>
              {t('shift.totalCashTransitionAmt')}
            </StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <StyledText>{formatCurrency(closingShiftReport.totalByPaymentMethod.hasOwnProperty('CASH') ? closingShiftReport.totalByPaymentMethod.CASH.orderTotal : 0)}
            </StyledText>
          </View>
        </View>

        <View style={styles.tableRowContainerWithBorder}>
          <View style={[styles.tableCellView, {flex: 2}]}>
            <StyledText style={[styles.fieldTitle]}>
              {t('shift.totalCashInRegister')}
            </StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <Field
              name="cash.closingBalance"
              component={InputText}
              keyboardType={`numeric`}
              placeholder={t('shift.enterAmount')}
              clearTextOnFocus={true}
              format={(value, name) => {
                return value != null ? String(value) : ''
              }}
            />
          </View>
        </View>

        <View style={styles.tableRowContainerWithBorder}>
          <View style={[styles.tableCellView, {flex: 2}]}>
            <StyledText style={[styles.fieldTitle]}>
              {t('shift.remark')}
            </StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <Field
              name="cash.unbalanceReason"
              component={InputText}
              placeholder={t('shift.enterRemark')}
              height={35}
            />
          </View>

        </View>

        {/* #Cash */}


        {/* Credit Card */}
        <View style={styles.sectionBar}>
          <View>
            <Text style={styles.sectionBarText}>
              {t('shift.cardSection')}
            </Text>
          </View>
        </View>

        <View style={styles.tableRowContainerWithBorder}>
          <View style={[styles.tableCellView, {flex: 2}]}>
            <StyledText style={[styles.fieldTitle]}>
              {t('shift.totalCardTransitionAmt')}
            </StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <StyledText>
              {formatCurrency(closingShiftReport.totalByPaymentMethod.hasOwnProperty('CARD') ? closingShiftReport.totalByPaymentMethod.CARD.orderTotal : 0)}
            </StyledText>
          </View>
        </View>

        <View style={styles.tableRowContainerWithBorder}>
          <View style={[styles.tableCellView, {flex: 2}]}>
            <StyledText style={[styles.fieldTitle]}>
              {t('shift.totalCardInRegister')}
            </StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <Field
              name="card.closingBalance"
              component={InputText}
              keyboardType={`numeric`}
              placeholder={t('shift.enterAmount')}
              clearTextOnFocus={true}
              format={(value, name) => {
                return value != null ? String(value) : ''
              }}
            />
          </View>
        </View>

        <View style={styles.tableRowContainerWithBorder}>
          <View style={{flex: 1}}>
            <Field
              name="card.unbalanceReason"
              component={InputText}
              placeholder={t('shift.remark')}
            />
          </View>
        </View>

        <View style={[styles.bottom, styles.horizontalMargin]}>
          <TouchableOpacity
            onPress={handleSubmit}
          >
            <Text style={[styles.bottomActionButton, styles.actionButton]}>
              {t('shift.nextAction')}
            </Text>
          </TouchableOpacity>

          <ConfirmActionButton
            handleConfirmAction={handleAbortCloseShift}
            buttonTitle='shift.abortAction'
          />
        </View>
        {/* #Credit Card */}

      </ThemeKeyboardAwareScrollView>
    )
  }
}

AccountClosureForm = reduxForm({
  form: 'accountClosureForm'
})(AccountClosureForm)

export default AccountClosureForm

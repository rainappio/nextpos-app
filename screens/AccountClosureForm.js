import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {KeyboardAvoidingView, ScrollView, Text, TouchableOpacity, View} from 'react-native'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import InputText from '../components/InputText'
import {isRequired} from '../validators'
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scrollview";
import {handleAbortCloseShift} from "../helpers/shiftActions";
import ConfirmActionButton from "../components/ConfirmActionButton";

class AccountClosureForm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
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

    return (
      <KeyboardAwareScrollView scrollIndicatorInsets={{right: 1}}>

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
            <Text style={[styles.fieldTitle]}>
              {t('shift.startingCash')}
            </Text>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <Text>${mostrecentShift.open.balance}</Text>
          </View>
        </View>

        <View style={[styles.tableRowContainerWithBorder]}>
          <View style={[styles.tableCellView, {flex: 2}]}>
            <Text style={[styles.fieldTitle]}>
              {t('shift.totalCashTransitionAmt')}
            </Text>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <Text>${closingShiftReport.totalByPaymentMethod.hasOwnProperty('CASH') ? closingShiftReport.totalByPaymentMethod.CASH.orderTotal : 0}
            </Text>
          </View>
        </View>

        <View style={styles.tableRowContainerWithBorder}>
          <View style={[styles.tableCellView, {flex: 2}]}>
            <Text style={[styles.fieldTitle]}>
              {t('shift.totalCashInRegister')}
            </Text>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <Field
              name="cash.closingBalance"
              component={InputText}
              keyboardType={`numeric`}
              placeholder={t('shift.enterAmount')}
              format={(value, name) => {
                return value != null ? String(value) : '0'
              }}
            />
          </View>
        </View>

        <View style={styles.tableRowContainerWithBorder}>
          <View style={{flex: 1}}>
            <Field
              name="cash.unbalanceReason"
              component={InputText}
              placeholder={t('shift.remark')}
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
            <Text style={[styles.fieldTitle]}>
              {t('shift.totalCardTransitionAmt')}
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
              {t('shift.totalCardInRegister')}
            </Text>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <Field
              name="card.closingBalance"
              component={InputText}
              keyboardType={`numeric`}
              placeholder={t('shift.enterAmount')}
              format={(value, name) => {
                return value != null ? String(value) : '0'
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

      </KeyboardAwareScrollView>
    )
  }
}

AccountClosureForm = reduxForm({
  form: 'accountClosureForm'
})(AccountClosureForm)

export default AccountClosureForm

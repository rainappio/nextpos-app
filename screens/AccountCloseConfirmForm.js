import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {Text, TouchableOpacity, View, ScrollView} from 'react-native'
import {formatCurrency, formatDate, dateToLocaleString, customFormatLocaleDate} from '../actions'
import styles, {mainThemeColor} from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ConfirmActionButton from '../components/ConfirmActionButton'
import {renderShiftStatus} from "../helpers/shiftActions";
import InputText from '../components/InputText'
import ScreenHeader from "../components/ScreenHeader";
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";
import {StyledText} from "../components/StyledText";
import Modal from 'react-native-modal';
import {Ionicons} from '@expo/vector-icons';

class AccountCloseConfirmForm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
    this.state = {
      isShow: false
    }
  }

  render() {
    const {t, themeStyle} = this.context
    const {handleSubmit, mostrecentShift, handleAbortCloseShift} = this.props

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

    if (mostrecentShift.close.closingShiftReport != null && mostrecentShift.close.closingShiftReport.orderCountByState != null) {
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
          <ScreenHeader title={t('shift.confirmCloseTitle')} />
          <Modal
            isVisible={this.state?.isShow}
            useNativeDriver
            hideModalContentWhileAnimating
            animationIn='fadeIn'
            animationOut='fadeOut'
            onBackdropPress={() => this.setState({isShow: false})}
            style={{
              margin: 0, flex: 1,
            }}
          ><ScrollView style={[themeStyle, {padding: 10, borderRadius: 20, maxHeight: '50%', marginHorizontal: 10}]}>
              <View style={styles.sectionBar}>
                <View style={[{flex: 1}, styles.tableCellView]}>
                  <Text style={[styles.sectionBarTextSmall]}>{t('order.product')}</Text>
                </View>

                <View style={[{flex: 1}, styles.tableCellView, {justifyContent: 'flex-end'}]}
                >
                  <Text style={styles.sectionBarTextSmall}>{t('order.quantity')}</Text>
                </View>

                <View style={[{flex: 2}, styles.tableCellView, {justifyContent: 'flex-end'}]}>
                  <Text style={styles.sectionBarTextSmall}>{t('order.total')}</Text>
                </View>

                <View style={[{flex: 2}, styles.tableCellView, {justifyContent: 'flex-end'}]}>
                  <Text style={styles.sectionBarTextSmall}>{t('order.date')}</Text>
                </View>
              </View>
              {mostrecentShift?.deletedLineItems?.map((item) => {
                return (
                  <View style={styles.tableRowContainerWithBorder}>
                    <View style={[{flex: 1}, styles.tableCellView]}>
                      <StyledText style={[styles.tableCellView]}>{item?.productName}</StyledText>
                    </View>

                    <View style={[{flex: 1}, styles.tableCellView, {justifyContent: 'flex-end'}]}
                    >
                      <StyledText style={[styles.tableCellView]}>{item?.quantity}</StyledText>
                    </View>

                    <View style={[{flex: 2}, styles.tableCellView, {justifyContent: 'flex-end'}]}>
                      <StyledText style={[styles.tableCellView]}>{formatCurrency(item?.total ?? 0)}</StyledText>
                    </View>

                    <View style={[{flex: 2}, styles.tableCellView, {justifyContent: 'flex-end'}]}>
                      <StyledText style={[styles.tableCellView]}>{customFormatLocaleDate(item?.deletedDate)}</StyledText>
                    </View>
                  </View>

                )
              })}
            </ScrollView>

          </Modal>

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
        <TouchableOpacity style={[styles.sectionBar]}
          onPress={() => {this.setState({isShow: true})}}>
          <View style={{flex: 3, flexDirection: 'row'}}>
            <StyledText style={[styles.sectionBarText, {marginRight: 10}]}>
              {t('shift.deleteLineItemLog')}
            </StyledText>
            <Ionicons name="eye" size={20} color={mainThemeColor} />
          </View>

        </TouchableOpacity>
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

        <View style={[styles.bottom, styles.horizontalMargin, {marginTop: 40}]}>

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

import React from 'react'
import {ScrollView, Text, TouchableOpacity, View} from 'react-native'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import {formatDate, formatDateObj} from "../actions";

class ShiftDetails extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        shiftDetailsTitle: 'Shift Details',
        searchShiftOrders: 'Search Shift Orders'
      },
      zh: {
        shiftDetailsTitle: '帳內容',
        searchShiftOrders: '尋找帳訂單'
      }
    })
  }

  render() {
    const {t} = this.context
    const {shift} = this.props.navigation.state.params

    const closingShiftReport = {
      totalOrderCount: 0,
      totalByPaymentMethod: {},
      orderCountByState: {}

    }

    if (shift.close.closingShiftReport !== null) {
      closingShiftReport.totalOrderCount = shift.close.closingShiftReport.totalOrderCount
    }

    if (shift.close.closingShiftReport !== null && shift.close.closingShiftReport.totalByPaymentMethod !== null) {
      closingShiftReport.totalByPaymentMethod = shift.close.closingShiftReport.totalByPaymentMethod
    }

    if (shift.close.closingShiftReport !== null && shift.close.closingShiftReport.orderCountByState !== null) {
      closingShiftReport.orderCountByState = shift.close.closingShiftReport.orderCountByState
    }

    const cashTotal = closingShiftReport.totalByPaymentMethod.hasOwnProperty('CASH') ? closingShiftReport.totalByPaymentMethod.CASH.orderTotal : 0
    const actualCashAmount = shift.close.closingBalances.hasOwnProperty('CASH') ? shift.close.closingBalances.CASH.closingBalance : 0
    const cashUnbalanceReason = shift.close.closingBalances.hasOwnProperty('CASH') && shift.close.closingBalances.CASH.unbalanceReason
    const cashDifference = actualCashAmount - (cashTotal + shift.open.balance)
    const cardTotal = closingShiftReport.totalByPaymentMethod.hasOwnProperty('CARD') ? closingShiftReport.totalByPaymentMethod.CARD.orderTotal : 0
    const actualCardAmount = shift.close.closingBalances.hasOwnProperty('CARD') ? shift.close.closingBalances.CARD.closingBalance : 0
    const cardUnbalanceReason = shift.close.closingBalances.hasOwnProperty('CARD') && shift.close.closingBalances.CARD.unbalanceReason
    const cardDifference = actualCardAmount - cardTotal

    const cashDiscount = closingShiftReport.totalByPaymentMethod.hasOwnProperty('CASH') ? closingShiftReport.totalByPaymentMethod.CASH.discount : 0
    const cardDiscount = closingShiftReport.totalByPaymentMethod.hasOwnProperty('CARD') ? closingShiftReport.totalByPaymentMethod.CARD.discount : 0
    const cashServiceCharge = closingShiftReport.totalByPaymentMethod.hasOwnProperty('CASH') ? closingShiftReport.totalByPaymentMethod.CASH.serviceCharge : 0
    const cardServiceCharge = closingShiftReport.totalByPaymentMethod.hasOwnProperty('CARD') ? closingShiftReport.totalByPaymentMethod.CARD.serviceCharge : 0

    return (
      <ScrollView scrollIndicatorInsets={{right: 1}}>
        <View style={[styles.fullWidthScreen]}>
          <ScreenHeader parentFullScreen={true}
                        title={t('shiftDetailsTitle')}/>

          <View>
            <View style={{ alignItems: 'center'}}>
              <Text>{formatDate(shift.open.timestamp)} - {formatDate(shift.close.timestamp)}</Text>
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
                <Text style={[styles.fieldTitle]}>
                  {t('shift.totalCashIncome')}
                </Text>
              </View>
              <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                <Text>${cashTotal}</Text>
              </View>
            </View>

            <View style={styles.tableRowContainerWithBorder}>
              <View style={{flex: 3}}>
                <Text style={[styles.fieldTitle]}>
                  {t('shift.totalCreditCardIncome')}
                </Text>
              </View>
              <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                <Text>${cardTotal}</Text>
              </View>
            </View>

            <View style={styles.tableRowContainerWithBorder}>
              <View style={{flex: 3}}>
                <Text style={[styles.fieldTitle]}>
                  {t('shift.totalClosingAmount')}
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
                  {t('shift.cashSection')}
                </Text>
              </View>
            </View>

            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, {flex: 2}]}>
                <Text style={[styles.fieldTitle]}>
                  {t('shift.startingCash')}
                </Text>
              </View>
              <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                <Text>${shift.open.balance}</Text>
              </View>
            </View>

            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, {flex: 2}]}>
                <Text style={[styles.fieldTitle]}>
                  {t('shift.totalCashTransitionAmt')}
                </Text>
              </View>
              <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                <Text>${cashTotal}</Text>
              </View>
            </View>

            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, {flex: 2}]}>
                <Text style={[styles.fieldTitle]}>
                  {t('shift.totalCashInRegister')}
                </Text>
              </View>
              <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                <Text>${actualCashAmount}</Text>
              </View>
            </View>

            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, {flex: 2}]}>
                <Text style={[styles.fieldTitle]}>
                  {t('shift.difference')}
                </Text>
              </View>
              <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                <Text>${cashDifference}
                </Text>
              </View>
            </View>

            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, {flex: 2}]}>
                <Text style={[styles.fieldTitle]}>
                  {t('shift.remark')}
                </Text>
              </View>
              <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                <Text>{cashUnbalanceReason}</Text>
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
                <Text style={[styles.fieldTitle]}>
                  {t('shift.totalCardTransitionAmt')}
                </Text>
              </View>
              <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                <Text>${cardTotal}</Text>
              </View>
            </View>

            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, {flex: 2}]}>
                <Text style={[styles.fieldTitle]}>
                  {t('shift.totalCardInRegister')}
                </Text>
              </View>
              <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                <Text>${actualCardAmount}
                </Text>
              </View>
            </View>

            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, {flex: 2}]}>
                <Text style={[styles.fieldTitle]}>
                  {t('shift.difference')}
                </Text>
              </View>
              <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                <Text>${cardDifference}
                </Text>
              </View>
            </View>

            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, {flex: 2}]}>
                <Text style={[styles.fieldTitle]}>
                  {t('shift.remark')}
                </Text>
              </View>
              <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                <Text>{cardUnbalanceReason}</Text>
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
                <Text style={[styles.fieldTitle]}>
                  {t('shift.totalInvoices')}
                </Text>
              </View>
              <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                <Text>{closingShiftReport.totalOrderCount}</Text>
              </View>
            </View>
            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, {flex: 2}]}>
                <Text style={[styles.fieldTitle]}>
                  {t('shift.deletedOrders')}
                </Text>
              </View>
              <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                <Text>
                  {closingShiftReport.orderCountByState.hasOwnProperty('DELETED') ? closingShiftReport.orderCountByState.DELETED.orderCount : 0}
                </Text>
              </View>
            </View>
            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, {flex: 3}]}>
                <Text style={[styles.fieldTitle]}>
                  {t('shift.totalDiscounts')}
                </Text>
              </View>
              <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                <Text>${cashDiscount + cardDiscount}
                </Text>
              </View>
            </View>
            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, {flex: 3}]}>
                <Text style={[styles.fieldTitle]}>
                  {t('shift.totalServiceCharge')}
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
              <View style={[styles.tableCellView, {flex: 2}]}>
                <Text style={styles.fieldTitle}>{t('shift.closingRemark')}</Text>
              </View>
              <View style={{flex: 1}}>
                <Text>{shift.close.closingRemark}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.sectionContainer, styles.verticalPadding, styles.horizontalMargin]}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('OrdersScr', {
                  shiftId: shift.id
                })
              }}>
              <Text style={[styles.bottomActionButton, styles.actionButton]}>{t('searchShiftOrders')}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    )
  }
}

export default ShiftDetails

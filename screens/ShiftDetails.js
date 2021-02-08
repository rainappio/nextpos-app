import React from 'react'
import {Text, TouchableOpacity, View, ScrollView} from 'react-native'
import styles, {mainThemeColor} from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import {formatCurrency, formatDate, customFormatLocaleDate} from "../actions";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {StyledText} from "../components/StyledText";
import Modal from 'react-native-modal';
import {Ionicons} from '@expo/vector-icons';
import {handleSendEmail} from "../helpers/shiftActions";

class ShiftDetails extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
    this.state = {
      isShow: false
    }
    context.localize({
      en: {
        shiftDetailsTitle: 'Shift Details',
        searchShiftOrders: 'Search Shift Orders',
        deletedBy: 'Deleted By'
      },
      zh: {
        shiftDetailsTitle: '帳內容',
        searchShiftOrders: '尋找帳訂單',
        deletedBy: '操作者'
      }
    })
  }

  render() {
    const {t, themeStyle} = this.context
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
      <ThemeScrollView>
        <View style={[styles.fullWidthScreen]}>
          <ScreenHeader parentFullScreen={true}
            title={t('shiftDetailsTitle')} />
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

                <View style={[{flex: 0.5}, styles.tableCellView, {justifyContent: 'flex-end'}]}
                >
                  <Text style={styles.sectionBarTextSmall}>{t('order.quantity')}</Text>
                </View>

                <View style={[{flex: 2}, styles.tableCellView, {justifyContent: 'flex-end'}]}>
                  <Text style={styles.sectionBarTextSmall}>{t('order.total')}</Text>
                </View>

                <View style={[{flex: 2}, styles.tableCellView, {justifyContent: 'flex-end'}]}>
                  <Text style={styles.sectionBarTextSmall}>{t('order.date')}</Text>
                </View>
                <View style={[{flex: 1}, styles.tableCellView, {justifyContent: 'flex-end'}]}>
                  <Text style={styles.sectionBarTextSmall}>{t('deletedBy')}</Text>
                </View>
              </View>
              {shift?.deletedLineItems?.map((item) => {
                return (
                  <View style={styles.tableRowContainerWithBorder}>
                    <View style={[{flex: 1, flexWrap: 'wrap'}, styles.tableCellView]}>
                      <StyledText style={[styles.tableCellView]}>{item?.productName} </StyledText>
                      <StyledText style={[styles.tableCellView]}>{item?.total === 0 && `(${t('order.freeLineitem')})`}</StyledText>
                    </View>

                    <View style={[{flex: 0.5}, styles.tableCellView, {justifyContent: 'flex-end'}]}
                    >
                      <StyledText style={[styles.tableCellView]}>{item?.quantity}</StyledText>
                    </View>

                    <View style={[{flex: 2}, styles.tableCellView, {justifyContent: 'flex-end'}]}>
                      <StyledText style={[styles.tableCellView]}>{formatCurrency(item?.total ?? 0)}</StyledText>
                    </View>

                    <View style={[{flex: 2}, styles.tableCellView, {justifyContent: 'flex-end'}]}>
                      <StyledText style={[styles.tableCellView]}>{customFormatLocaleDate(item?.deletedDate)}</StyledText>
                    </View>

                    <View style={[{flex: 1}, styles.tableCellView, {justifyContent: 'flex-end'}]}>
                      <StyledText style={[styles.tableCellView]}>{item?.deletedBy}</StyledText>
                    </View>
                  </View>

                )
              })}
            </ScrollView>

          </Modal>
          <View>
            <View style={{alignItems: 'center'}}>
              <StyledText>{formatDate(shift.open.timestamp)} - {formatDate(shift.close.timestamp)}</StyledText>
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
                <StyledText>{formatCurrency(shift.open.balance)}</StyledText>
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
                <StyledText>{formatCurrency(cashDifference)}
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
                <StyledText>{formatCurrency(actualCardAmount)}</StyledText>
              </View>
            </View>

            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, {flex: 2}]}>
                <StyledText style={[styles.fieldTitle]}>
                  {t('shift.difference')}
                </StyledText>
              </View>
              <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                <StyledText>{formatCurrency(cardDifference)}</StyledText>
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
              <View style={[styles.tableCellView, {flex: 3}]}>
                <StyledText style={[styles.fieldTitle]}>
                  {t('shift.totalDiscounts')}
                </StyledText>
              </View>
              <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                <StyledText>{formatCurrency(cashDiscount + cardDiscount)}</StyledText>
              </View>
            </View>
            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, {flex: 3}]}>
                <StyledText style={[styles.fieldTitle]}>
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
              <View style={[styles.tableCellView, {flex: 2}]}>
                <StyledText style={styles.fieldTitle}>{t('shift.closingRemark')}</StyledText>
              </View>
              <View style={{flex: 1}}>
                <StyledText>{shift.close.closingRemark}</StyledText>
              </View>
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

          <View style={[styles.sectionContainer, styles.verticalPadding, styles.horizontalMargin]}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('OrdersScr', {
                  shiftId: shift.id
                })
              }}>
              <Text style={[styles.bottomActionButton, styles.actionButton]}>{t('searchShiftOrders')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleSendEmail(shift.id)
              }}>
              <Text style={[styles.bottomActionButton, styles.actionButton]}>{t('shift.sendEmail')}</Text>
            </TouchableOpacity>
          </View>



        </View>
      </ThemeScrollView>
    )
  }
}

export default ShiftDetails

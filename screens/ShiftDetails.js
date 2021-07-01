import React from 'react'
import {Text, TouchableOpacity, View, ScrollView} from 'react-native'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import {formatCurrency, formatDate, customFormatLocaleDate} from "../actions";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {StyledText} from "../components/StyledText";
import Modal from 'react-native-modal';
import {Ionicons} from '@expo/vector-icons';
import {handleSendEmail, handlePrintReport} from "../helpers/shiftActions";
import {DeleteLineItemLogModal} from "../components/DeleteLineItemLogModal";

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
      },
      zh: {
        shiftDetailsTitle: '帳內容',
        searchShiftOrders: '尋找帳訂單',
      }
    })
  }

  render() {
    const {t, themeStyle, customMainThemeColor} = this.context
    const {shift} = this.props.navigation.state.params

    const closingShiftReport = {
      totalOrderCount: 0,
      totalByPaymentMethod: {},
      orderCountByState: {}

    }
    let allPaymentMethod = []
    let allDiscount = 0
    let allServiceCharge = 0
    let allClosingAmount = 0

    if (shift.close.closingShiftReport !== null) {
      closingShiftReport.totalOrderCount = shift.close.closingShiftReport.totalOrderCount
    }

    if (shift.close.closingShiftReport !== null && shift.close.closingShiftReport.totalByPaymentMethod !== null) {
      closingShiftReport.totalByPaymentMethod = shift.close.closingShiftReport.totalByPaymentMethod
    }

    if (shift.close.closingBalances != null) {
      allPaymentMethod = Object.entries(shift.close.closingBalances).sort((a, b) => {
        let sort = ["CASH", "CARD", "LINE_PAY", "JKO", "UBER_EATS", "FOOD_PANDA"];
        return sort.indexOf(a[0]) - sort.indexOf(b[0]);
      })
    }


    if (shift.close.closingShiftReport != null && shift.close.closingShiftReport.oneOrderSummary != null) {

      allDiscount = shift.close.closingShiftReport.oneOrderSummary.discount
      allServiceCharge = shift.close.closingShiftReport.oneOrderSummary.serviceCharge
    }

    if (shift.close.closingShiftReport != null && shift.close.closingShiftReport.totalByPaymentMethod != null) {

      let checkLen = Object.keys(shift.close.closingShiftReport.totalByPaymentMethod).length

      if (!!checkLen) {

        allClosingAmount = Object.values(shift.close.closingShiftReport?.totalByPaymentMethod)?.map((item => item?.orderTotal))?.reduce((a, b) => a + b)
      }
    }

    if (shift.close.closingShiftReport !== null && shift.close.closingShiftReport.orderCountByState !== null) {
      closingShiftReport.orderCountByState = shift.close.closingShiftReport.orderCountByState
    }

    console.log('shift', JSON.stringify(shift))
    return (
      <ThemeScrollView>
        <View style={[styles.fullWidthScreen]}>
          <ScreenHeader parentFullScreen={true}
            title={t('shiftDetailsTitle')} />

          <DeleteLineItemLogModal isShow={this.state?.isShow} closeModal={() => this.setState({isShow: false})} data={shift} />
          <View>
            <View style={{alignItems: 'center'}}>
              <StyledText>{formatDate(shift.open.timestamp)} - {formatDate(shift.close.timestamp)}</StyledText>
            </View>
            {/* Post-Closing Entries */}
            <View style={styles.sectionBar}>
              <View>
                <Text style={styles?.sectionBarText(customMainThemeColor)}>
                  {t('shift.shiftSummary')}
                </Text>
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
                  {formatCurrency(allClosingAmount)}
                </StyledText>
              </View>
            </View>

            {!!allPaymentMethod && (allPaymentMethod).map(([key, value]) => {
              return (
                <View key={key} style={styles.tableRowContainerWithBorder}>
                  <View style={{flex: 3}}>
                    <StyledText style={[styles.fieldTitle]}>
                      {t(`settings.paymentMethods.${key}`)}
                    </StyledText>
                  </View>
                  <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                    <StyledText>{formatCurrency(value.expectedBalance)}</StyledText>
                  </View>
                </View>
              )
            })}
            {/* #Post-Closing Entries */}

            {!!allPaymentMethod && (allPaymentMethod).map(([key, value]) => {
              return (
                <View key={key} style={{flex: 1}}>

                  <View style={styles.sectionBar}>
                    <View>
                      <Text style={styles?.sectionBarText(customMainThemeColor)}>
                        {t(`settings.paymentMethods.${key}`)}
                      </Text>
                    </View>
                  </View>

                  {key === 'CASH' && <View style={[styles.tableRowContainerWithBorder]}>
                    <View style={[styles.tableCellView, {flex: 2}]}>
                      <StyledText style={[styles.fieldTitle]}>
                        {t('shift.startingCash')}
                      </StyledText>
                    </View>
                    <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                      <StyledText>{formatCurrency(shift.open.balance)}</StyledText>
                    </View>
                  </View>}

                  <View style={[styles.tableRowContainerWithBorder]}>
                    <View style={[styles.tableCellView, {flex: 2}]}>
                      <StyledText style={[styles.fieldTitle]}>
                        {t('shift.expectedBalance')}
                      </StyledText>
                    </View>
                    <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                      <StyledText>{formatCurrency(value.expectedBalance)}
                      </StyledText>
                    </View>
                  </View>

                  <View style={styles.tableRowContainerWithBorder}>
                    <View style={[styles.tableCellView, {flex: 2}]}>
                      <StyledText style={[styles.fieldTitle]}>
                        {t('shift.closingBalance')}
                      </StyledText>
                    </View>
                    <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                      <StyledText>{formatCurrency(value.closingBalance)}</StyledText>
                    </View>
                  </View>

                  <View style={styles.tableRowContainerWithBorder}>
                    <View style={[styles.tableCellView, {flex: 2}]}>
                      <StyledText style={[styles.fieldTitle]}>
                        {t('shift.difference')}
                      </StyledText>
                    </View>
                    <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                      <StyledText>{formatCurrency(value.difference)}</StyledText>
                    </View>
                  </View>
                  <View style={styles.tableRowContainerWithBorder}>
                    <View style={[styles.tableCellView, {flex: 2}]}>
                      <StyledText style={[styles.fieldTitle]}>
                        {t('shift.remark')}
                      </StyledText>
                    </View>
                    <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                      <StyledText>{value.unbalanceReason}</StyledText>
                    </View>
                  </View>
                </View>
              )
            })
            }


            {/* Invoice */}
            <View style={styles.sectionBar}>
              <View>
                <Text style={styles?.sectionBarText(customMainThemeColor)}>
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
                <StyledText>{formatCurrency(allDiscount)}</StyledText>
              </View>
            </View>
            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, {flex: 3}]}>
                <StyledText style={[styles.fieldTitle]}>
                  {t('shift.totalServiceCharge')}
                </StyledText>
              </View>
              <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                <StyledText>{formatCurrency(allServiceCharge)}</StyledText>
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
              <StyledText style={[styles?.sectionBarText(customMainThemeColor), {marginRight: 10}]}>
                {t('shift.deleteLineItemLog')}
              </StyledText>
              <Ionicons name="eye" size={20} color={customMainThemeColor} />
            </View>

          </TouchableOpacity>

          <View style={[styles.sectionContainer, styles.verticalPadding, styles.horizontalMargin]}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('OrdersScr', {
                  shiftId: shift.id
                })
              }}>
              <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>{t('searchShiftOrders')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handlePrintReport(shift.id)
              }}>
              <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>{t('shift.printShiftReport')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleSendEmail(shift.id)
              }}>
              <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>{t('shift.sendEmail')}</Text>
            </TouchableOpacity>
          </View>



        </View>
      </ThemeScrollView>
    )
  }
}

export default ShiftDetails

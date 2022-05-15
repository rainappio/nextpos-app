import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {Text, TouchableOpacity, View, ScrollView} from 'react-native'
import {formatCurrency, formatDate} from '../actions'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ConfirmActionButton from '../components/ConfirmActionButton'
import {renderShiftStatus} from "../helpers/shiftActions";
import InputText from '../components/InputText'
import ScreenHeader from "../components/ScreenHeader";
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";
import {StyledText} from "../components/StyledText";
import Modal from 'react-native-modal';
import {Ionicons} from '@expo/vector-icons';
import {DeleteLineItemLogModal} from "../components/DeleteLineItemLogModal";
import {SecondActionButton} from "../components/ActionButtons";


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
    const {t, themeStyle, customMainThemeColor, isTablet} = this.context
    const {handleSubmit, mostrecentShift, handleAbortCloseShift} = this.props

    const closingShiftReport = {
      totalOrderCount: 0,
      totalByPaymentMethod: {},
      orderCountByState: {}

    }
    let allPaymentMethod = []
    let allDiscount = 0
    let allServiceCharge = 0
    let allClosingAmount = 0

    if (mostrecentShift.close.closingBalances != null) {

      allPaymentMethod = Object.entries(mostrecentShift.close.closingBalances).sort((a, b) => {
        let sort = ["CASH", "CARD", "LINE_PAY", "JKO", "UBER_EATS", "FOOD_PANDA", "GOV_VOUCHER"];
        return sort.indexOf(a[0]) - sort.indexOf(b[0]);
      })

    }

    if (mostrecentShift.close.closingShiftReport != null && mostrecentShift.close.closingShiftReport.oneOrderSummary != null) {
      allDiscount = mostrecentShift.close.closingShiftReport.oneOrderSummary.discount
      allServiceCharge = mostrecentShift.close.closingShiftReport.oneOrderSummary.serviceCharge
      allClosingAmount = mostrecentShift.close.closingShiftReport?.oneOrderSummary?.orderTotal
    }

    if (mostrecentShift.close.closingShiftReport != null && mostrecentShift.close.closingShiftReport.orderCountByState != null) {
      closingShiftReport.orderCountByState = mostrecentShift.close.closingShiftReport.orderCountByState
    }

    return (
      <ThemeKeyboardAwareScrollView>
        <View style={[styles.container, isTablet && styles.horizontalPaddingScreen]}>
          <ScreenHeader title={t('shift.confirmCloseTitle')} />

          <DeleteLineItemLogModal isShow={this.state?.isShow} closeModal={() => this.setState({isShow: false})} data={mostrecentShift} />

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
            <Text style={styles?.sectionBarText(customMainThemeColor)}>
              {t('shift.shiftSummary')}
            </Text>
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
        })
        }

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
                  <StyledText>{formatCurrency(mostrecentShift.open.balance)}</StyledText>
                </View>
              </View>}

              <View style={[styles.tableRowContainerWithBorder]}>
                <View style={[styles.tableCellView, {flex: 2}]}>
                  <StyledText style={[styles.fieldTitle]}>
                    {t('shift.totalCashTransitionAmt')}
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
                    {t('shift.totalCashInRegister')}
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
          <View style={{flex: 3}}>
            <StyledText style={[styles.tableCellView, {flex: 2}]}>
              {t('shift.totalDiscounts')}
            </StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <StyledText>{formatCurrency(allDiscount)}</StyledText>
          </View>
        </View>
        <View style={styles.tableRowContainerWithBorder}>
          <View style={{flex: 3}}>
            <StyledText style={[styles.tableCellView, {flex: 2}]}>
              {t('shift.totalServiceCharge')}
            </StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <StyledText>{formatCurrency(allServiceCharge)}</StyledText>
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
            <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
              {t('shift.confirmAction')}
            </Text>
          </TouchableOpacity>

          <SecondActionButton
            confirmPrompt={true}
            onPress={handleAbortCloseShift}
            title={t('shift.abortAction')}
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

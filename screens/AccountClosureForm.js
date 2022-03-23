import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {Text, TouchableOpacity, View} from 'react-native'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import InputText from '../components/InputText'
import {handleAbortCloseShift, renderShiftStatus} from "../helpers/shiftActions";
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";
import ScreenHeader from "../components/ScreenHeader";
import {formatCurrency, formatDate} from "../actions";
import {StyledText} from "../components/StyledText";
import {SecondActionButton} from "../components/ActionButtons";

class AccountClosureForm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }

  render() {
    const {t, customMainThemeColor, isTablet} = this.context
    const {mostrecentShift, handleSubmit} = this.props

    let allPaymentMethod = []

    if (mostrecentShift.close.closingBalances !== null) {
      allPaymentMethod = Object.entries(mostrecentShift.close.closingBalances).sort((a, b) => {
        let sort = ["CASH", "CARD", "LINE_PAY", "JKO", "UBER_EATS", "FOOD_PANDA", "GOV_VOUCHER"];
        return sort.indexOf(a[0]) - sort.indexOf(b[0]);
      })
    }

    return (
      <ThemeKeyboardAwareScrollView>
        <View style={[styles.container, isTablet && styles.horizontalPaddingScreen]}>
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
                  <Field
                    name={`${key}.closingBalance`}
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
                <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                  <Field
                    name={`${key}.unbalanceReason`}
                    component={InputText}
                    placeholder={t('shift.remark')}
                    height={35}
                    format={(value, name) => {
                      return value != null ? String(value) : ''
                    }}
                  />
                </View>
              </View>
            </View>
          )
        })
        }

        <View style={[styles.bottom, styles.horizontalMargin]}>
          <TouchableOpacity
            onPress={handleSubmit}
          >
            <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
              {t('shift.nextAction')}
            </Text>
          </TouchableOpacity>

          <SecondActionButton
            confirmPrompt={true}
            onPress={handleAbortCloseShift}
            title={t('shift.abortAction')}
          />
        </View>

      </ThemeKeyboardAwareScrollView>
    )
  }
}

AccountClosureForm = reduxForm({
  form: 'accountClosureForm'
})(AccountClosureForm)

export default AccountClosureForm

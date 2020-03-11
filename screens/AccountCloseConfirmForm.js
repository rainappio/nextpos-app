import React from 'react'
import { Field, reduxForm, FieldArray } from 'redux-form'
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
import { formatDate, getShiftStatus } from '../actions'
import {
  api,
  dispatchFetchRequest,
  successMessage, warningMessage
} from '../constants/Backend'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import ConfirmActionButton from '../components/ConfirmActionButton'
import { DismissKeyboard } from '../components/DismissKeyboard'
import {handleCloseShift, handleOpenShift, handleAbortCloseShift} from "../helpers/shiftActions";
import BackBtn from "../components/BackBtn";
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
        Title: 'Closing Confirm',
        staff: 'Staff',
        cash: 'Cash',
        card: 'Credit Card',
      	confirm: 'Confirm',
      	postClosingEntries: 'Post-Closing Entries',
      	invoice: 'Invoice',
      	others: 'Others',
      	cancel: 'Cancel',
      	remark: 'Closing Remark',
      	totalCashIncome: 'Total Cash Income',
      	totalCreditCardIncome: 'Total credit card Income',
      	totalClosingAmount: 'Total Closing Amount',
      	startingCash: 'Starting Cash',
      	expectedCashRegister: 'Expected Cash Amount In Register',
      	actualCashInRegister: 'Actual Cash Amount In Register',
      	expectedCardAmtInRegister: 'Expected Card Amount In Register',
      	actualCardAmtInRegister: 'Actual Card Amount In Register',
      	totalInvoices: 'Total Number Of Invoices',
      	deletedOrder: 'Total Number Of Orders Deleted',
      	discounts: 'Total Amount Of Discount',
      	serviceCharge: 'Total Service Charge',
      	abort: 'Abort'
      },
      zh: {
        Title: 'Closing Confirm-CH',
        staff: '員工',
        cash: 'Cash-CH',
        card: 'Credit Card-CH',
        confirm: 'Confirm-CH',
        postClosingEntries: 'Post-Closing Entries-CH',
        invoice: 'Invoice-CH',
        others: 'Others-CH',
        cancel: 'Cancel-CH',
        remark:'Closing Remark-CH',
        totalCashIncome: 'Total Cash Income-CH',
        totalCreditCardIncome: 'Total credit card Income-CH',
        totalClosingAmount: 'Total Closing Amount-CH',
        startingCash: 'Starting Cash-CH',
        expectedCashRegister: 'Expected Cash Amount In Register-CH',
        actualCashInRegister: 'Actual Cash In Register-CH',
        expectedCardAmtInRegister: 'Expected Card Amount In Register-CH',
        actualCardAmtInRegister: 'Actual Card Amount In Register-CH',
        totalInvoices: 'Total Number Of Invoices-CH',
        deletedOrder: 'Total Number Of Orders Deleted-CH',
        discounts: 'Total Amount Of Discount-CH',
        serviceCharge: 'Total Service Charge-CH',
        abort: 'Abort-CH'
      }
    })
  }

  render() {
    const { t } = this.context
		const { handleSubmit, mostrecentShift, handleAbortCloseShift } = this.props

		const closingShiftReport = {}	
		if (mostrecentShift.close.closingShiftReport !== null && mostrecentShift.close.closingShiftReport.totalByPaymentMethod !== null) {
			closingShiftReport.totalByPaymentMethod = mostrecentShift.close.closingShiftReport.totalByPaymentMethod
		}

		if(mostrecentShift.close.closingShiftReport !== null && mostrecentShift.close.closingShiftReport.orderCountByState !== null) {
			closingShiftReport.orderCountByState = mostrecentShift.close.closingShiftReport.orderCountByState
		} 
											
    return (
			<View>
        {/* Post-Closing Entries */}
          <View style={styles.sectionBar}>             
            <View style={[styles.tableCellView, {flex: 4}]}>
              <TouchableOpacity>
                <Text style={styles.sectionBarTextSmall}>
                  {t('postClosingEntries')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.container, styles.no_mgrTop]}>
            <View style={{flex: 3, justifyContent: 'center'}}>
              <View style={styles.fieldContainer}>
               	<View style={{flex: 3}}>
                  <Text style={[styles.fieldTitle]}>
                    {t('totalCashIncome')}
                  </Text>
                </View>
                <View style={{flex: 1}}>
              		<Text>$&nbsp;{closingShiftReport.totalByPaymentMethod.hasOwnProperty('CASH') ? closingShiftReport.totalByPaymentMethod.CASH.orderTotal : 0}</Text>
              	</View>     
              </View>

              <View style={styles.fieldContainer}>
                <View style={{flex: 3}}>
                  <Text style={[styles.fieldTitle]}>
                  {t('totalCreditCardIncome')}
                  </Text>
                </View>
                <View style={{flex: 1}}>   
									<Text>$&nbsp;{closingShiftReport.totalByPaymentMethod.hasOwnProperty('CARD') ? closingShiftReport.totalByPaymentMethod.CARD.orderTotal: 0}</Text>
            		</View> 	
              </View>      

              <View style={styles.fieldContainer}>
                <View style={{flex: 3}}>
                  <Text style={[styles.fieldTitle]}>
                  {t('totalClosingAmount')}
                  </Text>
                </View>
                <View style={{flex: 1}}>
                	<Text>$&nbsp;
                	{
                		Object.keys(closingShiftReport.totalByPaymentMethod).length === 0
                  	?
                  		0
                  		:
											!closingShiftReport.totalByPaymentMethod.hasOwnProperty('CASH') 
											?										
                  			closingShiftReport.totalByPaymentMethod.CARD.orderTotal
											:
												!closingShiftReport.totalByPaymentMethod.hasOwnProperty('CARD')
												?
													closingShiftReport.totalByPaymentMethod.CASH.orderTotal     			
												:
													closingShiftReport.totalByPaymentMethod.hasOwnProperty('CASH') && closingShiftReport.totalByPaymentMethod.hasOwnProperty('CARD')
														&& closingShiftReport.totalByPaymentMethod.CASH.orderTotal + closingShiftReport.totalByPaymentMethod.CARD.orderTotal
                	}    
                	</Text>    
                </View>      	
              </View>       
            </View>             		
          </View>
        {/* #Post-Closing Entries */}

				{/* Cash */}
          <View style={styles.sectionBar}>             
            <View style={[styles.tableCellView, {flex: 4}]}>
              <TouchableOpacity>
                <Text style={styles.sectionBarTextSmall}>
                  {t('cash')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.container, styles.no_mgrTop]}>
            <View style={{flex: 3, justifyContent: 'center'}}>
              <View style={styles.fieldContainer}>
                <View style={{flex: 3}}>
                  <Text style={[styles.fieldTitle]}>
                    {t('startingCash')}
                  </Text>
                </View>
                <View style={{flex: 1}}>
                  <Text>$&nbsp;{mostrecentShift.open.balance}</Text>
                </View>
              </View>                           

              <View style={styles.fieldContainer}>
                <View style={{flex: 3}}>
                  <Text style={[styles.fieldTitle]}>
                    {t('expectedCashRegister')}
                  </Text>
                </View>
                <View style={{flex: 1}}>
                	<Text>$&nbsp;{closingShiftReport.totalByPaymentMethod.hasOwnProperty('CASH') ? closingShiftReport.totalByPaymentMethod.CASH.orderTotal: 0}</Text>
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <View style={{flex: 3}}>
                  <Text style={[styles.fieldTitle]}>
                    {t('actualCashInRegister')}
                  </Text>
                </View>
                <View style={{flex: 1}}>
                  {
                  	mostrecentShift.close.closingBalances.hasOwnProperty('CASH') 
										&&
											<Text>$&nbsp;{mostrecentShift.close.closingBalances.CASH.closingBalance}</Text>
                  }
                </View>
              </View>
            </View>             		
          </View>
        {/* #Cash */}

        {/* Credit Card */}
          <View style={styles.sectionBar}>             
            <View style={[styles.tableCellView, {flex: 4}]}>
              <TouchableOpacity>
                <Text style={styles.sectionBarTextSmall}>
                  {t('card')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.container, styles.no_mgrTop]}>
            <View style={{flex: 3, justifyContent: 'center'}}>             	        	              
              <View style={styles.fieldContainer}>
                <View style={{flex: 3}}>
                  <Text style={[styles.fieldTitle]}>
                    {t('expectedCardAmtInRegister')}
                  </Text>
                </View>
                <View style={{flex: 1}}>
									<Text>$&nbsp;{closingShiftReport.totalByPaymentMethod.hasOwnProperty('CARD') ? closingShiftReport.totalByPaymentMethod.CARD.orderTotal: 0}</Text>
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <View style={{flex: 3}}>
                  <Text style={[styles.fieldTitle]}>
                    {t('actualCardAmtInRegister')}
                  </Text>
                </View>
                <View style={{flex: 1}}>
                	<Text>$&nbsp;
                  { mostrecentShift.close.closingBalances.hasOwnProperty('CARD') && mostrecentShift.close.closingBalances.CARD.closingBalance }    
									</Text>
                </View>
              </View>
            </View>         		
          </View>
        {/* #Credit Card */}

				{/* Invoice */}
          <View style={styles.sectionBar}>             
            <View style={[styles.tableCellView, {flex: 4}]}>
              <TouchableOpacity>
                <Text style={styles.sectionBarTextSmall}>
                  {t('invoice')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.container, styles.no_mgrTop]}>
            <View style={{flex: 3, justifyContent: 'center'}}>
              <View style={styles.fieldContainer}>
                <View style={{flex: 3}}>
                  <Text style={[styles.fieldTitle]}>
                    {t('totalInvoices')}
                  </Text>
                </View>
                <View style={{flex: 1}}>
                  <Text>&nbsp;{mostrecentShift.close.closingShiftReport.totalOrderCount}</Text>
                </View>
              </View>                
            </View>             		
          </View>
        {/* #Invoice */}

				{/* Others */}
          <View style={styles.sectionBar}>             
            <View style={[styles.tableCellView, {flex: 4}]}>
              <TouchableOpacity>
                <Text style={styles.sectionBarTextSmall}>
                  {t('others')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.container, styles.no_mgrTop]}>
            <View style={{flex: 3, justifyContent: 'center'}}>              	              
              <View style={styles.fieldContainer}>
                <View style={{flex: 3}}>
                  <Text style={[styles.fieldTitle]}>
                    {t('deletedOrder')}
                  </Text>
                </View>
                <View style={{flex: 1}}>
                	<Text>
                  {
										closingShiftReport.orderCountByState.hasOwnProperty('DELETED') 
										?  												 
                  	closingShiftReport.orderCountByState.DELETED.orderCount
										:
											0
            			}    
            			</Text>
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <View style={{flex: 3}}>
                  <Text style={[styles.fieldTitle]}>
                    {t('discounts')} 
                  </Text>
                </View>
                <View style={{flex: 1}}>
                	<Text>$&nbsp;
                  {
                  	Object.keys(closingShiftReport.totalByPaymentMethod).length === 0
                  	?
                  	0
                  	:
                			!closingShiftReport.totalByPaymentMethod.hasOwnProperty('CASH') 
											?
                  			closingShiftReport.totalByPaymentMethod.CARD.discount
											:
												!closingShiftReport.totalByPaymentMethod.hasOwnProperty('CARD') 
												?
													closingShiftReport.totalByPaymentMethod.CASH.discount
												:
													closingShiftReport.totalByPaymentMethod.hasOwnProperty('CASH') && closingShiftReport.totalByPaymentMethod.hasOwnProperty('CARD')
													&&
														closingShiftReport.totalByPaymentMethod.CASH.discount + closingShiftReport.totalByPaymentMethod.CARD.discount  
														
                	}        
                	</Text>       
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <View style={{flex: 3}}>
                  <Text style={[styles.fieldTitle]}>
                    {t('serviceCharge')}
                  </Text>
                </View>
                <View style={{flex: 1}}>
                	<Text>$&nbsp;
                  {
                  	Object.keys(closingShiftReport.totalByPaymentMethod).length === 0
										? 
											0 
											:
												!closingShiftReport.totalByPaymentMethod.hasOwnProperty('CASH') 
												?		 
													closingShiftReport.totalByPaymentMethod.CARD.serviceCharge
													:
														!closingShiftReport.totalByPaymentMethod.hasOwnProperty('CARD') 
														?
															closingShiftReport.totalByPaymentMethod.CASH.serviceCharge
															:
															closingShiftReport.totalByPaymentMethod.hasOwnProperty('CASH') && closingShiftReport.totalByPaymentMethod.hasOwnProperty('CARD')
															&&
																closingShiftReport.totalByPaymentMethod.CASH.serviceCharge + closingShiftReport.totalByPaymentMethod.CARD.serviceCharge
                  }
                  </Text>
                </View>
              </View> 

              <View style={styles.fieldContainer}>
                <View style={{flex: 1}}>
                  <Field
              			name="closingRemark"
              			component={InputText}
              			placeholder={t('remark')}
              			secureTextEntry={false}
              			height={35}
            			/>
                </View>
              </View>
            </View>
               	
    				<TouchableOpacity
      				onPress={handleSubmit}
    					>
      				<Text style={[styles.bottomActionButton, styles.actionButton]}>
        				{t('confirm')}
      				</Text>
    				</TouchableOpacity>    

    				<ConfirmActionButton
              handleConfirmAction={handleAbortCloseShift}
              params={90}
              buttonTitle="abort"
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

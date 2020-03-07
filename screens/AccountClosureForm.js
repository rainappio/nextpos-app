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
import {handleCloseShift, handleOpenShift} from "../helpers/shiftActions";
import BackBtn from "../components/BackBtn";
import InputText from '../components/InputText'
import { isRequired } from '../validators'

class AccountClosureForm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        Title: 'Account Closure',
        staff: 'Staff',
        cash: 'Cash',
        card: 'Credit Card',
      	next: 'Next',
      	status: 'Status',
      	startingCash: 'Starting Cash',
      	totalCashInRegister: 'Total Cash In Register',
      	remark: 'Remark',
      	totalCardInRegister: 'Total Card In Register',
      	totalCashTransitionAmt: 'Total Cash Transactions Amount',
      	totalCardTransitionAmt: 'Total Card Transactions Amount'   	
      },
      zh: {
        Title: 'Account Closure-CH',
        staff: '員工',
        cash: 'Cash-CH',
        card: 'Credit Card-CH',
        next: 'Next-CH',
        status: 'Status-CH',
        startingCash: 'Starting Cash-CH',
        totalCashInRegister: 'Total Cash In Register-CH',
        remark: 'Remark-CH',
        totalCardInRegister: 'Total Card In Register-CH',
        totalCardTransitionAmt: 'Total Card Transactions Amount-CH'
      }
    })
  }

  render() {
    const { t } = this.context
    const { mostrecentShift, handleSubmit } = this.props

    const closingShiftReport = {}	
		if (mostrecentShift.close.closingShiftReport !== null && mostrecentShift.close.closingShiftReport.totalByPaymentMethod !== null ) {
			closingShiftReport.totalByPaymentMethod = mostrecentShift.close.closingShiftReport.totalByPaymentMethod
		}
		
    return (
      <DismissKeyboard>
      	<ScrollView>          

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

          	<View style={[styles.container, styles.no_mgrTop, {marginBottom: 8}]}>
            	<View style={{flex: 3, justifyContent: 'center'}}>
              	<View style={[styles.fieldContainer]}>
                	<View style={{flex: 3}}>
                  	<Text style={[styles.fieldTitle]}>
                    	{t('startingCash')}
                  	</Text>
                	</View>
                	<View style={{flex: 1}}>
                  	<Text>$&nbsp;{mostrecentShift.open.balance}</Text>
                	</View>
              	</View>     	   

              	<View style={[styles.fieldContainer]}>
                	<View style={{flex: 3}}>
                  	<Text style={[styles.fieldTitle]}>
                    	{t('totalCashTransitionAmt')}
                  	</Text>
                	</View>
                	<View style={{flex: 1}}>
                  	<Text>$&nbsp;
                  		{
                  			Object.keys(closingShiftReport.totalByPaymentMethod).length === 0
                  			?
                  				0
                  				:
														closingShiftReport.totalByPaymentMethod.hasOwnProperty('CASH') 
														&&
                  						closingShiftReport.totalByPaymentMethod.CASH.orderTotal
                  		}
                  	</Text>
                	</View>
              	</View>           

              	<View style={styles.fieldContainer}>
                	<View style={{flex: 3}}>
                  	<Text style={[styles.fieldTitle]}>
                    	{t('totalCashInRegister')}
                  	</Text>
                	</View>
                	<View style={{flex: 1}}>
                  	<Field
              				name="cashclosingBalance"
              				component={InputText}
              				validate={isRequired}
              				placeholder={"0"}
              				secureTextEntry={false}
              				height={35}
            				/>
                	</View>
              	</View>

              	<View style={styles.fieldContainer}>
                	<View style={{flex: 1}}>
                  	<Field
              				name="cashunbalanceReason"
              				component={InputText}
              				//validate={isRequired}
              				placeholder={t('remark')}
              				secureTextEntry={false}
              				height={35}
            				/>
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
                    	{t('totalCardTransitionAmt')}
                  	</Text>
                	</View>
                	<View style={{flex: 1}}>
                  	<Text>$&nbsp;
											{
												Object.keys(closingShiftReport.totalByPaymentMethod).length === 0
                  			?
                  				0
                  				:
														closingShiftReport.totalByPaymentMethod.hasOwnProperty('CARD') 
														&&
                  						closingShiftReport.totalByPaymentMethod.CARD.orderTotal 
											}
                  	</Text>
                	</View>
              	</View>

              	<View style={styles.fieldContainer}>
                	<View style={{flex: 3}}>
                  	<Text style={[styles.fieldTitle]}>
                    	{t('totalCardInRegister')}
                  	</Text>
                	</View>
                	<View style={{flex: 1}}>
                  	<Field
              				name="cardclosingBalance"
              				component={InputText}
              				validate={isRequired}
              				placeholder={"0"}
              				secureTextEntry={false}
              				height={35}
            				/>
                	</View>
              	</View>

              	<View style={styles.fieldContainer}>
                	<View style={{flex: 1}}>
                  	<Field
              				name="cardunbalanceReason"
              				component={InputText}
              				//validate={isRequired}
              				placeholder={t('remark')}
              				secureTextEntry={false}
            				/>
                	</View>
              	</View>
            	</View>
               		
    					<TouchableOpacity
      					onPress={handleSubmit}
    						>
      					<Text style={[styles.bottomActionButton, styles.actionButton]}>
        					{t('next')}
      					</Text>
    					</TouchableOpacity>    

    					<TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                >
                <Text style={[styles.bottomActionButton, styles.cancelButton]}>
                  {t('cancel')}
                </Text>
              </TouchableOpacity>          
          	</View>
        	{/* #Credit Card */}

				</ScrollView>
      </DismissKeyboard>
    )
  }
}

AccountClosureForm = reduxForm({
  form: 'accountClosureForm'
})(AccountClosureForm)

export default AccountClosureForm
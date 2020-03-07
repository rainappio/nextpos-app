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
import { formatDate, getShiftStatus, getMostRecentShiftStatus } from '../actions'
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
import AccountClosureForm from './AccountClosureForm'

class AccountClose extends React.Component {
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
      	totalCardTransactions: 'Total Credit Card Transactions'
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
        totalCardTransactions: 'Total Credit Card Transactions-CH'
      }
    })
  }

  componentDidMount() {
    this.props.getMostRecentShiftStatus()
  }

  handleCloseShift = (values) => {
  	var shiftObjToClose = {
  		"cash": {
				"closingBalance": values.cashclosingBalance,
				"unbalanceReason": values.cashunbalanceReason
			},
			"card": {
				"closingBalance": values.cardclosingBalance,
				"unbalanceReason": values.cardunbalanceReason
			}
  	}

  	dispatchFetchRequest(api.shift.close, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(shiftObjToClose)
    },
    response => {
      response.json().then(data => {
      	successMessage('Shift closed')
        this.props.getMostRecentShiftStatus()
      	this.props.navigation.navigate('AccountCloseConfirm')
      })
    }).then()
  }

  render() {
    const { t } = this.context
		const {loading, haveData, mostRecentShift} = this.props

		if (loading) {
      return (
        <View style={[styles.container]}>
          <ActivityIndicator size="large" color="#ccc"/>
        </View>
      )
    }

    return (
      <DismissKeyboard>
      	<ScrollView>
          <View style={[styles.container,{marginBottom: 10}]}>
            <BackBtn/>
            <Text style={styles.screenTitle}>
              {t('Title')}
            </Text>

            <View style={[{width: '100%'}]}>
              <View>
                <Text style={[styles.toRight]}>
                  {t('staff')} - {mostRecentShift.open.who}
                </Text>
                <Text style={[styles.toRight]}>
                  {formatDate(mostRecentShift.open.timestamp)}
                </Text>
                <Text style={[styles.toRight]}>
                  {t('status')} - {mostRecentShift.shiftStatus}
                </Text>
              </View>
            </View>

            <AccountClosureForm 
            	mostrecentShift = {mostRecentShift}
            	onSubmit={this.handleCloseShift}
            	navigation={this.props.navigation}
            />
          </View> 
				</ScrollView>
      </DismissKeyboard>
    )
  }
}

const mapStateToProps = state => ({
	mostRecentShift: state.mostRecentShift.data,
  loading: state.mostRecentShift.loading,
  haveData: state.mostRecentShift.haveData
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getMostRecentShiftStatus: () => dispatch(getMostRecentShiftStatus())
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountClose)


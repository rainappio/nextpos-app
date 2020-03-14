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
import BackBtn from '../components/BackBtn'
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
import {handleCloseShift, handleOpenShift, handleAbortCloseShift} from "../helpers/shiftActions";
import InputText from '../components/InputText'
import AccountCloseConfirmForm from './AccountCloseConfirmForm'
import ScreenHeader from "../components/ScreenHeader";

class AccountCloseConfirm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }

  handleConfirmCloseShift = (values) => {
  	const confirmRemark = values.hasOwnProperty('closingRemark') ? values.closingRemark : ' '
  	dispatchFetchRequest(
    	api.shift.confirm,
    	{
      	method: 'POST',
      	withCredentials: true,
      	credentials: 'include',
      	headers: {
        	'Content-Type': 'text/plain'
      	},
      	body: confirmRemark
    	},
    	response => {
    		this.props.getMostRecentShiftStatus()
      	this.props.navigation.navigate('CloseComplete')
    	}).then()
	}

	handleAbortCloseShift = () => {
  	dispatchFetchRequest(
    	api.shift.abort,
    	{
      	method: 'POST',
      	withCredentials: true,
      	credentials: 'include',
      	headers: {
        	'Content-Type': 'application/json'
      	},
      	body: ''
    	},
    	response => {
      	this.props.navigation.navigate('ShiftClose')
      	this.props.getMostRecentShiftStatus()
    	}).then()
	}

  render() {
    const { t } = this.context
    const { mostRecentShift, loading } = this.props

    if (loading) {
      return (
        <View style={[styles.container]}>
          <ActivityIndicator size="large" color="#ccc"/>
        </View>
      )
    }

    return (
      <DismissKeyboard>
      	<ScrollView scrollIndicatorInsets={{ right: 1 }}>
          <View style={[styles.container]}>
            <ScreenHeader title={t('confirmCloseTitle')}/>

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

					<AccountCloseConfirmForm
						onSubmit={this.handleConfirmCloseShift}
						handleAbortCloseShift={this.handleAbortCloseShift}
						mostrecentShift={mostRecentShift}
					/>
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
  getMostRecentShiftStatus: () => dispatch(getMostRecentShiftStatus()),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountCloseConfirm)


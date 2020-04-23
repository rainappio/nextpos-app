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
  dispatchFetchRequest, dispatchFetchRequestWithOption,
  successMessage, warningMessage
} from '../constants/Backend'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import ConfirmActionButton from '../components/ConfirmActionButton'
import { DismissKeyboard } from '../components/DismissKeyboard'
import {handleCloseShift, handleOpenShift, handleAbortCloseShift, renderShiftStatus} from "../helpers/shiftActions";
import InputText from '../components/InputText'
import AccountCloseConfirmForm from './AccountCloseConfirmForm'
import ScreenHeader from "../components/ScreenHeader";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scrollview";

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

    dispatchFetchRequestWithOption(api.shift.confirm, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: confirmRemark
    }, {
      defaultMessage: false
    }, response => {
      successMessage(this.context.t('shift.shiftClosed'))
      this.props.getMostRecentShiftStatus()
      this.props.navigation.navigate('CloseComplete')
    }).then()
	}

	handleAbortCloseShift = () => {
    dispatchFetchRequestWithOption(api.shift.abort, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: ''
      }, {
        defaultMessage: false
      },
      response => {
        successMessage(this.context.t('shift.shiftAborted'))
        this.props.navigation.navigate('ShiftClose')
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
      	<KeyboardAwareScrollView scrollIndicatorInsets={{ right: 1 }}>
          <View style={[styles.container]}>
            <ScreenHeader title={t('shift.confirmCloseTitle')}/>

            <View>
              <Text style={[styles.toRight]}>
                {t('shift.staff')} - {mostRecentShift.open.who}
              </Text>
              <Text style={[styles.toRight]}>
                {formatDate(mostRecentShift.open.timestamp)}
              </Text>
              <Text style={[styles.toRight]}>
                {t('shift.closingStatus')} - {renderShiftStatus(mostRecentShift.shiftStatus)}
              </Text>
            </View>
          </View>

					<AccountCloseConfirmForm
						onSubmit={this.handleConfirmCloseShift}
						handleAbortCloseShift={this.handleAbortCloseShift}
						mostrecentShift={mostRecentShift}
					/>
				</KeyboardAwareScrollView>
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


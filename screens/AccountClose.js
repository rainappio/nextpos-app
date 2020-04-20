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
  dispatchFetchRequest, dispatchFetchRequestWithOption,
  successMessage, warningMessage
} from '../constants/Backend'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import ConfirmActionButton from '../components/ConfirmActionButton'
import { DismissKeyboard } from '../components/DismissKeyboard'
import {handleCloseShift, handleOpenShift, renderShiftStatus} from "../helpers/shiftActions";
import BackBtn from "../components/BackBtn";
import InputText from '../components/InputText'
import AccountClosureForm from './AccountClosureForm'
import ScreenHeader from "../components/ScreenHeader";
import LoadingScreen from "./LoadingScreen";

class AccountClose extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    this.props.getMostRecentShiftStatus()
  }

  handleCloseShift = (values) => {
  	dispatchFetchRequestWithOption(api.shift.close, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(values)
    }, {
      defaultMessage: false
    }, response => {
      response.json().then(data => {
        this.props.getMostRecentShiftStatus()
        this.props.navigation.navigate('AccountCloseConfirm')
      })
    }).then()
  }

  render() {
    const { t } = this.context
		const {loading, haveData, mostRecentShift} = this.props

    const initialValues = {
      cash: mostRecentShift.close.closingBalances['CASH'],
      card: mostRecentShift.close.closingBalances['CARD']
    }

		if (loading) {
      return (
        <LoadingScreen/>
      )
    }

    return (
      <DismissKeyboard>
      	<ScrollView scrollIndicatorInsets={{ right: 1 }}>
          <View style={[styles.container]}>
            <ScreenHeader title={t('shift.accountCloseTitle')}/>

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

          <AccountClosureForm
            mostrecentShift={mostRecentShift}
            initialValues={initialValues}
            onSubmit={this.handleCloseShift}
            navigation={this.props.navigation}
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
  getMostRecentShiftStatus: () => dispatch(getMostRecentShiftStatus())
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountClose)


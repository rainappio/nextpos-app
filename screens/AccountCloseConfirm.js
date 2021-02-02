import React from 'react'
import {connect} from 'react-redux'
import {getMostRecentShiftStatus} from '../actions'
import {api, dispatchFetchRequestWithOption, successMessage} from '../constants/Backend'
import {LocaleContext} from '../locales/LocaleContext'
import AccountCloseConfirmForm from './AccountCloseConfirmForm'
import LoadingScreen from "./LoadingScreen";

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
      this.props.navigation.navigate('CloseComplete', {mostRecentShift: this.props?.mostRecentShift})
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
    const {t} = this.context
    const {mostRecentShift, loading} = this.props

    if (loading) {
      return (
        <LoadingScreen />
      )
    }

    return (
      <AccountCloseConfirmForm
        onSubmit={this.handleConfirmCloseShift}
        handleAbortCloseShift={this.handleAbortCloseShift}
        mostrecentShift={mostRecentShift}
      />
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


import React from 'react'
import {connect} from 'react-redux'
import {getMostRecentShiftStatus} from '../actions'
import {api, dispatchFetchRequestWithOption} from '../constants/Backend'
import {LocaleContext} from '../locales/LocaleContext'
import AccountClosureForm from './AccountClosureForm'
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
    const {t} = this.context
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
      <AccountClosureForm
        mostrecentShift={mostRecentShift}
        initialValues={initialValues}
        onSubmit={this.handleCloseShift}
        navigation={this.props.navigation}
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
  getMostRecentShiftStatus: () => dispatch(getMostRecentShiftStatus())
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountClose)


import React from 'react'
import {ScrollView, View, Alert} from 'react-native'
import {api, dispatchFetchRequest, dispatchFetchRequestWithOption} from '../constants/Backend'
import {getCurrentClient, clearReservation} from '../actions'
import {LocaleContext} from "../locales/LocaleContext";
import {ThemeContainer} from "../components/ThemeContainer";
import ReservationFormScreen from './ReservationFormScreen'
import {connect} from 'react-redux'
import {FocusAwareStatusBar, statusHeight} from '../components/FocusAwareStatusBar'


class ReservationScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  _isMounted = false

  static contextType = LocaleContext
  constructor(props, context) {
    super(props, context)
    this.state = {
      nextStep: false,
      initialValues: this.props.route?.params?.initialValues ?? null,
    }
  }

  componentDidMount() {
    this._isMounted = true;

    if (this._isMounted) {
      this.props.clearReservation()
      this._resetForm = this.props.navigation.addListener('focus', () => {
        this.props.clearReservation()
        this.checkPropsChange()
      })

    }
  }
  componentWillUnmount() {
    this._isMounted = false;

    this._resetForm()
    this.setState = (state, callback) => {
      return
    }
  }

  checkPropsChange = () => {
    this.setState({initialValues: this.props.route?.params?.initialValues ?? null, nextStep: false})
  }

  handleCreateReservation = (notificationPush, t, flag) => {

    let values = this.state.initialValues
    let request = {
      reservationDate: values?.checkDate,
      name: values.name,
      phoneNumber: values.phoneNumber,
      tableIds: values.tableIds,
      people: values?.people ?? 0,
      kid: values?.kid ?? 0,
      note: values?.note ?? '',
      membershipId: values?.membershipId
    }
    dispatchFetchRequestWithOption(
      api.reservation.create,
      {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      }, {defaultMessage: true},
      response => {
        this.handleReset()
        this.props.navigation.navigate('ReservationCalendarScreen')
      }
    ).then(() => {
      if (this.props.client?.clientSettings?.PUSH_NOTIFICATION && !!this.props.client?.clientSettings?.PUSH_NOTIFICATION?.value) {
        notificationPush(request, t, flag)
      }
    })
  }

  handleReset = () => {
    this.setState({initialValues: null, nextStep: false})
  }
  handleNextStep = (value) => {
    this.setState({nextStep: value})
  }

  handleSubmit = (values) => {
    console.log(values)
    this.setState({initialValues: values, nextStep: true})
  }

  handleCreateCancel = () => {
    Alert.alert(
      ``,
      `${this.context.t('reservation.cancelActionContext')}`,
      [
        {
          text: `${this.context.t('action.yes')}`,
          onPress: () => {
            this.handleReset()
            this.props.navigation.navigate('ReservationCalendarScreen')
          }
        },
        {
          text: `${this.context.t('action.no')}`,
          onPress: () => console.log('Cancelled'),
          style: 'cancel'
        }
      ]
    )
  }


  render() {
    const {navigation, route, client} = this.props

    return (
      <>
        <FocusAwareStatusBar barStyle="light-content" backgroundColor="#222" />
        <ReservationFormScreen
          isEdit={false}
          statusHeight={statusHeight}
          onSubmit={this.handleSubmit}
          handleReset={this.handleReset}
          handleNextStep={this.handleNextStep}
          handleSaveReservation={this.handleCreateReservation}
          handleCancel={this.handleCreateCancel}
          nextStep={this.state.nextStep}
          initialValues={this.state.initialValues ?? this.props.route?.params?.initialValues}
          navigation={navigation}
          route={route}
          client={client}
        />
      </>
    )
  }
}


const mapStateToProps = state => ({
  client: state.client.data,
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getCurrentClient: () => dispatch(getCurrentClient()),
  clearReservation: () => dispatch(clearReservation()),

})


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReservationScreen)


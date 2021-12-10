import React from 'react'
import {ScrollView, View, Alert} from 'react-native'
import {api, dispatchFetchRequest, dispatchFetchRequestWithOption} from '../constants/Backend'
import {LocaleContext} from "../locales/LocaleContext";
import {getCurrentClient, getTableLayouts, getTablesAvailable, getTableLayout, getShiftStatus} from '../actions'
import {ThemeContainer} from "../components/ThemeContainer";
import ReservationUpcomingForm from './ReservationUpcomingForm'
import {connect} from 'react-redux'
import moment from 'moment-timezone'
import LoadingScreen from "./LoadingScreen";
import {FocusAwareStatusBar, statusHeight} from '../components/FocusAwareStatusBar'
import {schedulePushNotification} from '../components/NotificationTask'


class ReservationUpcomingScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  _isMounted = false

  static contextType = LocaleContext
  constructor(props, context) {
    super(props, context)

    this.state = {
      loading: false,
    }
  }

  componentDidMount() {
    this._isMounted = true;

    if (this._isMounted) {
      this.props.getTableLayouts()
      this.props.getAvailableTables()
      this.props.getShiftStatus()
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }


  handleSubmit = (values) => {

    let request = {
      reservationDate: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
      name: values.name,
      phoneNumber: values.phoneNumber,
      tableIds: [],
      people: values?.people ?? 0,
      kid: values?.kid ?? 0,
      note: values?.note ?? ''
    }
    console.log("request=", request)

    Alert.alert(
      ``,
      `${this.context.t('reservation.sendActionContext', {phoneNumber: values.phoneNumber})}`,
      [
        {
          text: `${this.context.t('action.yes')}`,
          onPress: () => {
            this.setState({loading: true})

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
                response.json().then((data) => {
                  dispatchFetchRequestWithOption(
                    api.reservation.sendNotification(data.id),
                    {
                      method: 'POST',
                      withCredentials: true,
                      credentials: 'include',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                    }, {defaultMessage: false},
                    response => {
                    }
                  ).then()
                  this.setState({loading: false})
                })
              }
            ).then(() => {
              if (this.props.client?.clientSettings?.PUSH_NOTIFICATION !== undefined && this.props.client?.clientSettings?.PUSH_NOTIFICATION?.value) {
                schedulePushNotification(request, this.context.t, 'CREATE')
              }
            })
          }
        },
        {
          text: `${this.context.t('action.no')}`,
          onPress: () => {
            this.setState({loading: true})

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
                response.json().then((data) => {
                  this.setState({loading: false})
                })
              }
            ).then(() => {
              if (this.props.client?.clientSettings?.PUSH_NOTIFICATION !== undefined && this.props.client?.clientSettings?.PUSH_NOTIFICATION?.value) {
                schedulePushNotification(request, this.context.t, 'CREATE')
              }
            })
          },
          style: 'cancel'
        }
      ]
    )
  }



  render() {
    const {client, navigation, route, tablelayouts, availableTables, isLoading, haveData, shiftStatus} = this.props


    if (isLoading || this.state.loading || !haveData) {
      return (
        <LoadingScreen />
      )
    } else {
      return (
        <>
          <FocusAwareStatusBar barStyle="light-content" backgroundColor="#222" />
          <ReservationUpcomingForm
            statusHeight={statusHeight}
            onSubmit={this.handleSubmit}
            navigation={navigation}
            route={route}
            client={client}
            tablelayouts={tablelayouts}
            availableTables={availableTables}
            shiftStatus={shiftStatus}
            initialValues={{people: 0, kid: 0}}
          />
        </>
      )
    }
  }
}



const mapStateToProps = state => ({
  client: state.client.data,
  tablelayouts: state.tablelayouts.data.tableLayouts,
  haveData: state.tablelayouts.haveData,
  haveError: state.tablelayouts.haveError,
  isLoading: state.tablelayouts.loading,
  availableTables: state.tablesavailable.data.availableTables,
  shiftStatus: state.shift.data.shiftStatus,
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getCurrentClient: () => dispatch(getCurrentClient()),
  getTableLayouts: () => dispatch(getTableLayouts()),
  getAvailableTables: () => dispatch(getTablesAvailable()),
  getTableLayout: (id) => dispatch(getTableLayout(id)),
  getShiftStatus: () => dispatch(getShiftStatus()),

})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReservationUpcomingScreen)


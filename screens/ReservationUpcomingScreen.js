import React from 'react'
import {ScrollView, View, Alert} from 'react-native'
import {api, dispatchFetchRequest, dispatchFetchRequestWithOption} from '../constants/Backend'
import {LocaleContext} from "../locales/LocaleContext";
import {getTableLayouts, getTablesAvailable, getTableLayout, getfetchOrderInflights} from '../actions'
import {ThemeContainer} from "../components/ThemeContainer";
import ReservationUpcomingForm from './ReservationUpcomingForm'
import {connect} from 'react-redux'
import moment from 'moment-timezone'
import LoadingScreen from "./LoadingScreen";


class ReservationUpcomingScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  static contextType = LocaleContext
  constructor(props, context) {
    super(props, context)

    this.state = {
      loading: false,
    }
  }

  componentDidMount() {
    this.props.getTableLayouts()
    this.props.getfetchOrderInflights()
    this.props.getAvailableTables()
  }


  handleSubmit = (values) => {

    this.setState({loading: true})
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
        this.setState({loading: false})

      }
    ).then()
  }


  render() {
    const {navigation, route, tablelayouts, availableTables, ordersInflight, isLoading, haveData} = this.props

    if (isLoading || this.state.loading || !haveData) {
      return (
        <LoadingScreen />
      )
    } else {
      return (
        <ReservationUpcomingForm
          onSubmit={this.handleSubmit}
          navigation={navigation}
          route={route}
          tablelayouts={tablelayouts}
          availableTables={availableTables}
          ordersInflight={ordersInflight}
          initialValues={{people: 0, kid: 0}}
        />
      )
    }
  }
}



const mapStateToProps = state => ({
  tablelayouts: state.tablelayouts.data.tableLayouts,
  haveData: state.tablelayouts.haveData,
  haveError: state.ordersinflight.haveError || state.tablelayouts.haveError,
  isLoading: state.ordersinflight.loading || state.tablelayouts.loading,
  availableTables: state.tablesavailable.data.availableTables,
  ordersInflight: state.ordersinflight.data.orders,
  orderSets: state.ordersinflight.data?.setData,
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getTableLayouts: () => dispatch(getTableLayouts()),
  getAvailableTables: () => dispatch(getTablesAvailable()),
  getTableLayout: (id) => dispatch(getTableLayout(id)),
  getfetchOrderInflights: () => dispatch(getfetchOrderInflights()),
})


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReservationUpcomingScreen)


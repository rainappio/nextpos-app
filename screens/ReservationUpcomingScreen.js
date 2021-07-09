import React from 'react'
import {ScrollView, View, Alert} from 'react-native'
import {api, dispatchFetchRequest, dispatchFetchRequestWithOption} from '../constants/Backend'
import {clearReservation} from '../actions'
import {LocaleContext} from "../locales/LocaleContext";
import {ThemeContainer} from "../components/ThemeContainer";
import ReservationUpcomingForm from './ReservationUpcomingForm'
import {connect} from 'react-redux'


class ReservationUpcomingScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  static contextType = LocaleContext
  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {

  }




  handleSubmit = (values) => {

    let request = {
      reservationDate: values?.checkDate,
      name: values.name,
      phoneNumber: values.phoneNumber,
      tableIds: values.tableIds,
      people: values?.people ?? 0,
      kid: values?.kid ?? 0,
      note: values?.note ?? ''
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
    ).then()
  }



  render() {
    const {navigation, route} = this.props

    return (
      <ThemeContainer>
        <ReservationUpcomingForm
          isEdit={false}
          onSubmit={this.handleSubmit}
          navigation={navigation}
          route={route}
        />
      </ThemeContainer>
    )
  }
}


const mapStateToProps = state => ({
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  clearReservation: () => dispatch(clearReservation()),

})


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReservationUpcomingScreen)


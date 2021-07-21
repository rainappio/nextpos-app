import React from 'react'
import {LocaleContext} from "../locales/LocaleContext";
import {getTableLayouts, getTablesAvailable, getCurrentClient, getReservationSettings} from '../actions'
import {api, dispatchFetchRequest, dispatchFetchRequestWithOption} from '../constants/Backend'
import {ThemeContainer} from "../components/ThemeContainer";
import {connect} from 'react-redux'
import LoadingScreen from "./LoadingScreen";
import ReservationSettingForm from './ReservationSettingForm'
import {FocusAwareStatusBar} from '../components/FocusAwareStatusBar'

class ReservationSetting extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    this.props.getTableLayouts()
    this.props.getAvailableTables()
    this.props.getReservationSettings()
    this._getReservationSettings = this.props.navigation.addListener('focus', () => {
      this.props.getReservationSettings()

    })
  }
  componentWillUnmount() {
    this._getReservationSettings()
  }

  handleSubmit = (values) => {
    console.log(values)
    dispatchFetchRequest(api.reservation.settings, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    }, response => {
      response.json().then(data => {
        this.props.navigation.navigate('ReservationCalendarScreen')
      })
    }).then()
  }

  render() {
    const {
      navigation,
      route,
      haveData,
      isLoading,
      tablelayouts,
      availableTables,
      reservationSettings,
    } = this.props
    const {t, isTablet, themeStyle, customMainThemeColor, customBackgroundColor} = this.context


    if (isLoading) {
      return (
        <LoadingScreen />
      )
    } else if (haveData) {
      return (
        <ThemeContainer>
          <FocusAwareStatusBar barStyle="light-content" backgroundColor="#222" />
          <ReservationSettingForm
            initialValues={reservationSettings}
            onSubmit={this.handleSubmit}
            navigation={navigation}
            route={route}
            tablelayouts={tablelayouts}
            availableTables={availableTables}
          />
        </ThemeContainer>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = state => ({
  isLoading: state.reservationSettings.loading,
  haveData: state.tablelayouts.haveData || state.reservationSettings.data,
  reservationSettings: state.reservationSettings.data,
  tablelayouts: state.tablelayouts.data.tableLayouts,
  availableTables: state.tablesavailable.data.availableTables,
})

const mapDispatchToProps = dispatch => ({
  getAvailableTables: () => dispatch(getTablesAvailable()),
  getReservationSettings: () => dispatch(getReservationSettings()),
  getTableLayouts: () => dispatch(getTableLayouts()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReservationSetting)

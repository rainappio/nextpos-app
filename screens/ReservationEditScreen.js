import React from 'react'
import {ScrollView, View, Alert} from 'react-native'
import {api, dispatchFetchRequest, dispatchFetchRequestWithOption} from '../constants/Backend'
import {LocaleContext} from "../locales/LocaleContext";
import {ThemeContainer} from "../components/ThemeContainer";
import {NavigationEvents} from "react-navigation";
import {getReservation} from '../actions'
import LoadingScreen from "./LoadingScreen";
import ReservationFormScreen from './ReservationFormScreen'
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import styles from '../styles'




class ReservationEditScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  static contextType = LocaleContext
  constructor(props, context) {
    super(props, context)
    this.state = {
      nextStep: false,
      initialValues: null,
    }
  }

  componentDidMount() {
    this.props.getReservation()
  }

  handleUpdateReservation = () => {

    let values = this.state.initialValues
    let request = {
      reservationDate: values?.checkDate,
      name: values.name,
      phoneNumber: values.phoneNumber,
      tableIds: values.tableIds,
      people: values?.people ?? 0,
      kid: values?.kid ?? 0,
      note: values?.note ?? ''
    }
    console.log("check update=", request)

    dispatchFetchRequestWithOption(
      api.reservation.update(values.id),
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
    ).then(

    )
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

  handleEditCancel = () => {
    Alert.alert(
      ``,
      `${this.context.t('reservation.cancelEditActionContext')}`,
      [
        {
          text: `${this.context.t('action.yes')}`,
          onPress: () => {
            this.handleReset()
            this.props.navigation.navigate('ReservationViewScreen')
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
    const {navigation, reservation, isLoading} = this.props
    const {t, isTablet, customMainThemeColor, customBackgroundColor} = this.context

    return (
      <ThemeContainer>
        <NavigationEvents
          onWillFocus={() => {
            this.props.getReservation()
          }}
        />
        {isLoading ? <LoadingScreen /> :
          <ReservationFormScreen
            isEdit={true}
            onSubmit={this.handleSubmit}
            handleReset={this.handleReset}
            handleNextStep={this.handleNextStep}
            handleSaveReservation={this.handleUpdateReservation}
            handleCancel={this.handleEditCancel}
            nextStep={this.state.nextStep}
            initialValues={this.state.initialValues ?? reservation}
            navigation={navigation}
          />
        }
      </ThemeContainer>
    )
  }
}


const mapStateToProps = state => ({
  haveData: state.reservation.haveData,
  haveError: state.reservation.haveError,
  isLoading: state.reservation.loading,
  reservation: state.reservation.data,
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getReservation: () => dispatch(getReservation(props.navigation?.state?.params?.reservationId)),
})


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReservationEditScreen)


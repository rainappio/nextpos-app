import React from 'react'
import {ScrollView, View, Alert} from 'react-native'
import {api, dispatchFetchRequest, dispatchFetchRequestWithOption} from '../constants/Backend'
import {LocaleContext} from "../locales/LocaleContext";
import {ThemeContainer} from "../components/ThemeContainer";
import ReservationFormScreen from './ReservationFormScreen'
import {connect} from 'react-redux'


class ReservationScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  static contextType = LocaleContext
  constructor(props, context) {
    super(props, context)
    this.state = {
      nextStep: false,
      initialValues: this.props.navigation?.state?.params?.initialValues ?? null,
    }
  }

  componentDidMount() {
    this.checkPropsChange()
  }
  componentDidUpdate(prevProps, prevState) {

    if (prevProps.navigation?.state?.params?.initialValues.id !== this.props.navigation?.state?.params?.initialValues.id || prevState.initialValues !== this.props.navigation?.state?.params?.initialValues) {
      this.checkPropsChange()
    }
  }
  checkPropsChange = () => {
    this.setState({initialValues: this.props.navigation?.state?.params?.initialValues, nextStep: false})
  }

  handleCreateReservation = (isEdit) => {

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

  handleEditCancel = (isEdit) => {
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
    const {navigation} = this.props

    return (
      <ThemeContainer>
        <ReservationFormScreen
          isEdit={false}
          onSubmit={this.handleSubmit}
          handleReset={this.handleReset}
          handleNextStep={this.handleNextStep}
          handleCreateReservation={this.handleCreateReservation}
          handleCancel={this.handleEditCancel}
          nextStep={this.state.nextStep}
          initialValues={this.state.initialValues ?? this.props.navigation?.state?.params?.initialValues}
          navigation={navigation}
        />
      </ThemeContainer>
    )
  }
}


const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
  dispatch,
})


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReservationScreen)


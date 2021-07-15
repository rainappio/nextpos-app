import React from 'react'
import {ScrollView, View, Alert} from 'react-native'
import {api, dispatchFetchRequest, dispatchFetchRequestWithOption} from '../constants/Backend'
import {clearReservation} from '../actions'
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
      initialValues: this.props.route?.params?.initialValues ?? null,
    }
  }

  componentDidMount() {
    this.props.clearReservation()
    this.checkPropsChange()
    this._resetForm = this.props.navigation.addListener('focus', () => {
      this.props.clearReservation()
      this.checkPropsChange()
    })
  }
  componentWillUnmount() {
    this._resetForm()
  }

  checkPropsChange = () => {
    this.setState({initialValues: this.props.route?.params?.initialValues ?? null, nextStep: false})
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
    const {navigation, route} = this.props

    return (
      <ThemeContainer>
        <ReservationFormScreen
          isEdit={false}
          onSubmit={this.handleSubmit}
          handleReset={this.handleReset}
          handleNextStep={this.handleNextStep}
          handleSaveReservation={this.handleCreateReservation}
          handleCancel={this.handleCreateCancel}
          nextStep={this.state.nextStep}
          initialValues={this.state.initialValues ?? this.props.route?.params?.initialValues}
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
)(ReservationScreen)


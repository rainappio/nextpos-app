import React from 'react'
import {ScrollView, View, Alert} from 'react-native'
import {api, dispatchFetchRequest, dispatchFetchRequestWithOption} from '../constants/Backend'
import {LocaleContext} from "../locales/LocaleContext";
import {ThemeContainer} from "../components/ThemeContainer";
import ReservationFormScreen from './ReservationFormScreen'
import {connect} from 'react-redux'


class ReservationEditScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  static contextType = LocaleContext
  constructor(props, context) {
    super(props, context)
    this.state = {
      nextStep: false,
      initialValues: this.props.navigation?.state?.params?.data ?? null,
      timeBlock: this.props.navigation?.state?.params?.timeBlock ?? null,
    }
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
    if (!isEdit) {
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

          this.props.navigation.navigate('LoginSuccess')
        }
      ).then()
    } else {
      this.handleUpdateReservation(request, values.id)
    }
  }
  handleUpdateReservation = (request, id) => {

    dispatchFetchRequestWithOption(
      api.reservation.update(id),
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

        this.props.navigation.navigate('LoginSuccess')
      }
    ).then()
  }

  handleDeleteReservation = () => {
    Alert.alert(
      ``,
      `${this.context.t('reservation.deleteActionContext')}`,
      [
        {
          text: `${this.context.t('action.yes')}`,
          onPress: () => {
            dispatchFetchRequestWithOption(
              api.reservation.update(this.state.initialValues.id),
              {
                method: 'DELETE',
                withCredentials: true,
                credentials: 'include',
                headers: {},
              }, {defaultMessage: true},
              response => {
                this.props.navigation.navigate('LoginSuccess')
              }
            ).then()
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

  handleNextStep = (value) => {
    this.setState({nextStep: value})
  }

  handleSubmit = (values) => {
    console.log(values)
    this.setState({initialValues: values, nextStep: true})
  }

  handleEditCancel = (isEdit) => {
    if (!isEdit) {
      Alert.alert(
        ``,
        `${this.context.t('reservation.cancelActionContext')}`,
        [
          {
            text: `${this.context.t('action.yes')}`,
            onPress: () => {
              this.props.navigation.navigate('LoginSuccess')
            }
          },
          {
            text: `${this.context.t('action.no')}`,
            onPress: () => console.log('Cancelled'),
            style: 'cancel'
          }
        ]
      )
    } else {
      this.handleDeleteReservation()
    }
  }


  render() {
    const {navigation} = this.props

    return (
      <ThemeContainer>
        <ReservationFormScreen
          isEdit={true}
          onSubmit={this.handleSubmit}
          handleNextStep={this.handleNextStep}
          handleCreateReservation={this.handleCreateReservation}
          handleCancel={this.handleEditCancel}
          nextStep={this.state.nextStep}
          initialValues={this.state.initialValues}
          timeBlock={this.state.timeBlock}
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
)(ReservationEditScreen)


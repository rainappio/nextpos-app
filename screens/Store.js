import React from 'react'
import {connect} from 'react-redux'
import {api, dispatchFetchRequest} from '../constants/Backend'
import {getCurrentClient, getPaymentMethods, getSettingTimezone} from '../actions'
import StoreFormScreen from './StoreFormScreen'
import LoadingScreen from "./LoadingScreen";

class Store extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.getCurrentClient()
    this.props.getPaymentMethods()
  }

  handleSubmit = values => {

    console.log("values.clientSettings = ", values.clientSettings)
    if (!values.clientSettings.SERVICE_CHARGE) {
      values.clientSettings.SERVICE_CHARGE = {
        value: 0.1,
        enable: false,
      }
    }

    if (!values.clientSettings.TABLE_TIME_LIMIT) {
      values.clientSettings.TABLE_TIME_LIMIT = {
        value: 120,
        enable: false,
      }
    }
    if (!values.clientSettings.TAX_INCLUSIVE) {
      values.clientSettings.TAX_INCLUSIVE = {enable: false}
    }

    if (values.clientSettings.TAX_INCLUSIVE !== undefined) {
      values.clientSettings.TAX_INCLUSIVE.value = values.clientSettings.TAX_INCLUSIVE.enabled
    }

    if (values.clientSettings.LOCATION_BASED_SERVICE !== undefined) {
      values.clientSettings.LOCATION_BASED_SERVICE.value = values.clientSettings.LOCATION_BASED_SERVICE.enabled
    }

    if (values.clientSettings.APPLY_CUSTOM_OFFER !== undefined) {
      values.clientSettings.APPLY_CUSTOM_OFFER.value = values.clientSettings.APPLY_CUSTOM_OFFER.enabled
    }
    const updatePaymentIds = values.paymentMethods.map(item => item.id)

    values = {...values, 'paymentMethodIds': updatePaymentIds}


    dispatchFetchRequest(api.client.update, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values)
    },
      response => {
        getSettingTimezone()
        this.props.navigation.navigate('SettingScr')
      }).then()


  }

  render() {
    const {client, navigation, route, loading, haveData, paymentMethods} = this.props


    if (loading) {
      return (
        <LoadingScreen />
      )
    } else if (haveData) {
      return (
        <StoreFormScreen
          initialValues={client}
          onSubmit={this.handleSubmit}
          navigation={navigation}
          route={route}
          paymentMethods={paymentMethods}
        />
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = state => ({
  client: state.client.data,
  loading: state.client.loading,
  haveData: state.client.haveData,
  paymentMethods: state.paymentMethods.data

})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getCurrentClient: () => dispatch(getCurrentClient()),
  getPaymentMethods: () => dispatch(getPaymentMethods())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Store)

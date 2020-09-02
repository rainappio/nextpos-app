import React from 'react'
import {connect} from 'react-redux'
import {api, dispatchFetchRequest} from '../constants/Backend'
import {getCurrentClient} from '../actions/client'
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
  }

  handleSubmit = values => {
    if (values.clientSettings.TAX_INCLUSIVE !== undefined) {
      values.clientSettings.TAX_INCLUSIVE.value = values.clientSettings.TAX_INCLUSIVE.enabled
    }

    if (values.clientSettings.LOCATION_BASED_SERVICE !== undefined) {
      values.clientSettings.LOCATION_BASED_SERVICE.value = values.clientSettings.LOCATION_BASED_SERVICE.enabled
    }

    if (values.clientSettings.APPLY_CUSTOM_OFFER !== undefined) {
      values.clientSettings.APPLY_CUSTOM_OFFER.value = values.clientSettings.APPLY_CUSTOM_OFFER.enabled
    }

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
        this.props.navigation.navigate('SettingScr')
      }).then()
  }

  render() {
    const { client, navigation, loading, haveData } = this.props

    if (loading) {
      return (
        <LoadingScreen/>
      )
    } else if (haveData) {
      return (
        <StoreFormScreen
          initialValues={client}
          onSubmit={this.handleSubmit}
          navigation={navigation}
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
  haveData: state.client.haveData
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getCurrentClient: () => dispatch(getCurrentClient())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Store)

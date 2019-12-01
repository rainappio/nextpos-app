import React from 'react'
import {connect} from 'react-redux'
import {api, makeFetchRequest} from "../constants/Backend";
import {getCurrentClient} from "../actions/client";
import StoreFormScreen from "./StoreFormScreen";
import {ActivityIndicator, View} from "react-native";
import styles from "../styles";
import FetchErrorPopUp from "../components/FetchErrorPopUp";

class Store extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props)

    this.state = {
      refreshing: false,
      errorResponse: null
    }

    this.popupReference = React.createRef()
  }


  componentDidMount() {
    this.props.getCurrentClient()
  }

  handleSubmit = values => {
    makeFetchRequest((token) => {
      fetch(api.client.update, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.access_token}`
        },
        body: JSON.stringify(values)
      })
        .then(response => {
          console.log(response)
          if (response.status === 200) {
            this.props.navigation.navigate('SettingScr')
          } else {
            this.setState({ errorResponse: response }, () => {
              this.popupReference.current.toggleModal(true)
            })
          }
        })
        .catch(error => {
          console.error(error)
        })
    })
  }

  render() {
    const { client, navigation, loading, haveData } = this.props
    const { refreshing, errorResponse } = this.state

    if (loading) {
      return (
        <View style={[styles.container]}>
          <ActivityIndicator size="large" color="#ccc" />
        </View>
      )
    } else if (haveData) {
      return (
        <View>
          <FetchErrorPopUp errorResponse={errorResponse} ref={this.popupReference} screenProps={this.props.screenProps}/>
          <StoreFormScreen
            initialValues={client}
            onSubmit={this.handleSubmit}
            navigation={navigation}
            refreshing={refreshing}
            screenProps={this.props.screenProps}
          />
        </View>
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

import React, { Component } from 'react'
import {
  View,
  Text,
  ScrollView,
  AsyncStorage,
  ActivityIndicator
} from 'react-native'
import { connect } from 'react-redux'
import StaffFormScreen from './StaffFormScreen'
import { clearClient, getClientUsr, getClientUsrs } from '../actions'
import styles from '../styles'

class StaffEditScreen extends Component {
  static navigationOptions = {
    header: null
  }

  state = {
    isEditForm: true,
    isSaving: false,
    saveError: true,
    refreshing: false
  }

  componentDidMount() {
    this.props.getClientUsr()
  }

  handleEditCancel = () => {
    this.props.clearClient()
    this.props.navigation.navigate('StaffsOverview')
  }

  handleUpdate = values => {
    values.roles === true
      ? (values.roles = ['MANAGER', 'USER'])
      : (values.roles = ['USER'])
    var staffname = this.props.navigation.state.params.staffname
    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      fetch(`http://35.234.63.193/clients/me/users/${staffname}`, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          // 'x-client-id': tokenObj.clientId,
          Authorization: 'Bearer ' + tokenObj.access_token
        },
        body: JSON.stringify(values)
      })
        .then(response => {
          if (response.status === 200) {
            this.props.clearClient()
            this.props.navigation.navigate('StaffsOverview', {
              staffname: staffname
            })

            this.setState({
              isSaving: true,
              saveError: false,
              refreshing: true
            })
            this.props.getClientUsrs() !== undefined &&
              this.props.getClientUsrs().then(() => {
                this.setState({
                  refreshing: false
                })
              })
          } else {
            alert('pls try again')
          }
        })
        .catch(error => {
          this.setState({
            isSaving: false,
            saveError: true
          })
          console.error(error)
        })
    })
  }

  render() {
    const {
      navigation,
      clientuser,
      clearProduct,
      haveData,
      haveError,
      isLoading
    } = this.props
    const { isEditForm, refreshing } = this.state

    Array.isArray(clientuser.roles) && clientuser.roles.includes('MANAGER')
      ? (clientuser.roles = true)
      : (clientuser.roles = false)

    if (isLoading) {
      return (
        <View style={[styles.container]}>
          <ActivityIndicator size="large" color="#ccc" />
        </View>
      )
    } else if (haveData) {
      return (
        <StaffFormScreen
          isEditForm={isEditForm}
          navigation={navigation}
          initialValues={clientuser}
          handleEditCancel={this.handleEditCancel}
          onSubmit={this.handleUpdate}
          refreshing={refreshing}
        />
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = state => ({
  clientuser: state.clientuser.data,
  haveData: state.clientuser.haveData,
  haveError: state.clientuser.haveError,
  isLoading: state.clientuser.loading
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getClientUsr: () =>
    dispatch(getClientUsr(props.navigation.state.params.staffname)),
  clearClient: () => dispatch(clearClient()),
  getClientUsrs: () => dispatch(getClientUsrs())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StaffEditScreen)

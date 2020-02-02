import React from 'react'
import { connect } from 'react-redux'
import { AsyncStorage } from 'react-native'
import StaffFormScreen from './StaffFormScreen'
import {getClientUsr, getClientUsrs, resolveRoles} from '../actions'
import {
  api,
  dispatchFetchRequest,
  errorAlert,
  successMessage
} from '../constants/Backend'

class Staff extends React.Component {
  static navigationOptions = {
    header: null
  }

  handleCancel = () => {
    this.props.getClientUsrs()
    this.props.navigation.navigate('StaffsOverview')
  }

  handleSubmit = values => {
    values.roles = values.selectedRole

    dispatchFetchRequest(
      api.clientUser.new,
      {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      },
      response => {
        successMessage('Saved')
        this.props.navigation.navigate('StaffsOverview')
        this.props.getClientUsrs()
      }
    ).then()
  }

  render() {
    const { navigation } = this.props

    return (
      <StaffFormScreen
        isEditForm={false}
        onSubmit={this.handleSubmit}
        navigation={navigation}
        onCancel={this.handleCancel}
      />
    )
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getClientUsrs: () => dispatch(getClientUsrs())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Staff)

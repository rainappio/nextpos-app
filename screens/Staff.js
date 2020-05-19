import React from 'react'
import { connect } from 'react-redux'
import StaffFormScreen from './StaffFormScreen'
import { getClientUsr, getClientUsrs, resolveRoles, getUserRoles } from '../actions'
import {
  api,
  dispatchFetchRequest,
  errorAlert,
  successMessage
} from '../constants/Backend'
import LoadingScreen from "./LoadingScreen";

class Staff extends React.Component {
  static navigationOptions = {
    header: null
  }

  componentDidMount() {
    this.props.getUserRoles()
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
        this.props.navigation.navigate('StaffsOverview')
        this.props.getClientUsrs()
      }
    ).then()
  }

  render() {
    const { navigation, userRoles, isLoading } = this.props

    if (isLoading) {
      return (
        <LoadingScreen />
      )
    }
    return (
      <StaffFormScreen
        isEditForm={false}
        onSubmit={this.handleSubmit}
        navigation={navigation}
        onCancel={this.handleCancel}
        userRoles={userRoles}
      />
    )
  }
}

const mapStateToProps = state => ({
  userRoles: state.userroles.data.userRoles,
  isLoading: state.userroles.loading
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getClientUsrs: () => dispatch(getClientUsrs()),
  getUserRoles: () => dispatch(getUserRoles())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Staff)

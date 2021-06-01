import React from 'react'
import {connect} from 'react-redux'
import StaffFormScreen from './StaffFormScreen'
import {getClientUsrs, getUserRoles, getWorkingAreas} from '../actions'
import {api, dispatchFetchRequest} from '../constants/Backend'
import LoadingScreen from "./LoadingScreen";

class Staff extends React.Component {
  static navigationOptions = {
    header: null
  }

  componentDidMount() {
    this.props.getUserRoles()
    this.props.getWorkingAreas()
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
    const {navigation, userRoles, isLoading, workingareas} = this.props

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
        workingareas={workingareas}
      />
    )
  }
}

const mapStateToProps = state => ({
  userRoles: state.userroles.data.userRoles,
  isLoading: state.userroles.loading,
  workingareas: state.workingareas.data.workingAreas,
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getClientUsrs: () => dispatch(getClientUsrs()),
  getUserRoles: () => dispatch(getUserRoles()),
  getWorkingAreas: () => dispatch(getWorkingAreas())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Staff)

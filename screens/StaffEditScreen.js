import React, {Component} from 'react'
import {connect} from 'react-redux'
import StaffFormScreen from './StaffFormScreen'
import {clearClientUser, getClientUsr, getClientUsrs, getUserRoles} from '../actions'
import {api, dispatchFetchRequest} from '../constants/Backend'
import LoadingScreen from "./LoadingScreen";

class StaffEditScreen extends Component {
  static navigationOptions = {
    header: null
  }

  state = {
    isEditForm: true,
    clientuser: {},
    isLoading: false
  }

  async componentDidMount() {
    await this.getClientUsr(this.props.navigation.state.params.staffname)
    this.props.getUserRoles()
  }

  handleEditCancel = () => {
    this.props.getClientUsrs()
    this.props.navigation.navigate('StaffsOverview')
  }

  handleUpdate = values => {
    if (!Number.isInteger(values.selectedRole)) {
      values.roles = values.selectedRole
    }

    const staffname = this.props.navigation.state.params.staffname

    dispatchFetchRequest(
      api.clientUser.update(staffname),
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
    ).then(() => {
      //handleRefreshToken().then()
    })
  }

  getClientUsr = async (name) => {
    this.setState({isLoading: true})
    dispatchFetchRequest(
      api.clientUser.get(name),
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          this.setState({clientuser: data, isLoading: false})
        })
      },
    ).then()

  }

  render() {
    const {
      navigation,
      haveData,
      haveError,
      userRoles
    } = this.props
    const {isEditForm, clientuser, isLoading, } = this.state

    clientuser.selectedRole = 0

    if (clientuser.roles !== undefined) {
      if (clientuser.roles.includes('OWNER')) {
        clientuser.selectedRole = 2
      } else if (clientuser.roles.includes('MANAGER')) {
        clientuser.selectedRole = 1
      }
    }

    if (isLoading) {
      return (
        <LoadingScreen />
      )
    } else if (haveData) {
      return (
        <StaffFormScreen
          isEditForm={isEditForm}
          navigation={navigation}
          initialValues={clientuser}
          handleEditCancel={this.handleEditCancel}
          onSubmit={this.handleUpdate}
          userRoles={userRoles}
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
  isLoading: state.clientuser.loading,
  userRoles: state.userroles.data.userRoles
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getClientUsr: () =>
    dispatch(getClientUsr(props.navigation.state.params.staffname)),
  clearClient: () => dispatch(clearClientUser()),
  getClientUsrs: () => dispatch(getClientUsrs()),
  getUserRoles: () => dispatch(getUserRoles())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StaffEditScreen)

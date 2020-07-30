import React, {Component} from 'react'
import {connect} from 'react-redux'
import {View} from 'react-native'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import {getPermissions, getUserRoles} from '../actions'
import styles from '../styles'
import NewUserRoleForm from './NewUserRoleForm'
import {api, dispatchFetchRequest} from '../constants/Backend'
import {ThemeScrollView} from "../components/ThemeScrollView";

class EditUserRole extends Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  componentDidMount() {
    this.props.getPermissions()
  }

  handleEditCancel = () => {
    this.props.navigation.navigate('ManageUserRole')
  }

  handleSubmit = (values) => {
    var userroleId = this.props.navigation.state.params.userroleId;
    dispatchFetchRequest(
      api.clientUser.updateuserRole(userroleId), {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      },
      response => {
        this.props.navigation.navigate('ManageUserRole')
        this.props.getUserRoles()
      }
    ).then()
  }

  handleDeleteUserRole = () => {
    var userroleId = this.props.navigation.state.params.userroleId;
    dispatchFetchRequest(api.clientUser.deleteuserRole(userroleId), {
      method: 'DELETE',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }, response => {
      this.props.navigation.navigate('ManageUserRole')
      this.props.getUserRoles()
    }).then()
  }

  render() {
    const {t} = this.context

    return (
      <ThemeScrollView>
        <View style={styles.fullWidthScreen}>
          <ScreenHeader title={t('editUserRoleTitle')} parentFullScreen={true}/>
          <NewUserRoleForm
            permissions={Object.keys(this.props.permissions)}
            labels={this.props.permissions}
            initialValues={this.props.navigation.state.params.initialValues}
            handleEditCancel={this.handleEditCancel}
            isEditForm={this.props.navigation.state.params.isEditForm}
            onSubmit={this.handleSubmit}
            handleDeleteUserRole={this.handleDeleteUserRole}
          />
        </View>
      </ThemeScrollView>
    )
  }
}

const mapStateToProps = state => ({
  userRoles: state.userroles.data.userRoles,
  haveData: state.userroles.haveData,
  haveError: state.userroles.haveError,
  isLoading: state.userroles.loading,
  permissions: state.permissions.data.permissions
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getUserRoles: () => dispatch(getUserRoles()),
  getPermissions: () => dispatch(getPermissions())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps)
(EditUserRole)

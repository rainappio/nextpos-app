import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { DismissKeyboard } from '../components/DismissKeyboard'
import { getUserRoles } from '../actions'
import { api, dispatchFetchRequest } from '../constants/Backend'
import { LocaleContext } from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import styles from '../styles'
import NewUserRoleForm from './NewUserRoleForm'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";


class NewUserRole extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    const selectedRoleIndex = this.props.initialValues !== undefined ? this.props.initialValues.selectedRole : null

    this.state = {
      selectedRole: selectedRoleIndex
    }
  }

  componentDidMount() {

  }

  handleRoleSelection = (index) => {
    this.setState({ selectedRole: index })
  }

  handleSubmit = values => {
    dispatchFetchRequest(
      api.clientUser.createuserRole,
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
        this.props.navigation.navigate('ManageUserRole')
        this.props.getUserRoles()
      }
    ).then()
  }

  handleCancel = () => {
    this.props.navigation.navigate('ManageUserRole')
  }

  render() {
    const { t } = this.context

    return (
      <KeyboardAwareScrollView>
        <View style={styles.container_nocenterCnt}>
          <ScreenHeader title={t('newUserRoleTitle')} />
          <NewUserRoleForm
            onSubmit={this.handleSubmit}
            permissions={this.props.navigation.state.params.permissions}
            onCancel={this.handleCancel}
            labels={this.props.navigation.state.params.labels}
          />
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
  getUserRoles: () => dispatch(getUserRoles())
})

export default connect(null, mapDispatchToProps)(NewUserRole)


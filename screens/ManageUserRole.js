import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, FlatList } from 'react-native'
import { LocaleContext } from '../locales/LocaleContext'
import { DismissKeyboard } from '../components/DismissKeyboard'
import ScreenHeader from "../components/ScreenHeader";
import { getUserRoles, getPermissions } from '../actions'
import { ListItem } from 'react-native-elements'
import LoadingScreen from "./LoadingScreen";
import AddBtn from '../components/AddBtn'
import styles from '../styles'

class ManageUserRole extends Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  componentDidMount() {
    this.context.localize({
      en: {
        manageusrRoleTitle: 'Manage User Roles'
      },
      zh: {
        editusrRoleTitle: '員工'
      }
    })
    this.props.getUserRoles()
    this.props.getPermissions()
  }

  renderItem = ({ item }) => {
    return (
      <ListItem
        key={item}
        title={
          <View style={[styles.tableRowContainer]}>
            <View style={[styles.tableCellView, { flex: 1 }]}>
              <Text>{item.roleName}</Text>
            </View>
          </View>
        }
        onPress={() =>
          this.props.navigation.navigate('EditUserRole', {
            userroleId: item.id,
            isEditForm: true,
            initialValues: { roleName: item.roleName, permissions: item.permissions }
          })
        }
        bottomDivider
        containerStyle={[styles.dynamicVerticalPadding(12), { padding: 0 }]}
      />
    )
  }

  render() {
    const { userRoles, isLoading, permissions } = this.props
    const { t } = this.context

    if (isLoading) {
      return (
        <LoadingScreen />
      )
    }
    return (
      <DismissKeyboard>
        <View style={styles.container_nocenterCnt}>
          <View>
            <ScreenHeader title={t('manageusrRoleTitle')} rightComponent={<AddBtn onPress={() => this.props.navigation.navigate('NewUserRole', { permissions: Object.keys(permissions), labels: permissions })} />} />
            {
              userRoles !== undefined &&
              <FlatList
                data={userRoles}
                renderItem={this.renderItem}
                keyExtractor={item => item.id}
              />
            }
          </View>
        </View>
      </DismissKeyboard>
    )
  }
}

const mapStateToProps = state => ({
  userRoles: state.userroles.data.userRoles,
  permissions: state.permissions.data.permissions,
  haveData: state.permissions.haveData,
  haveError: state.permissions.haveError,
  isLoading: state.permissions.loading
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getUserRoles: () => dispatch(getUserRoles()),
  getPermissions: () => dispatch(getPermissions())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps)
  (ManageUserRole)
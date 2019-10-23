import React from 'react'
import {
  View,
  Text,
  TouchableHighlight,
  Image,
  ScrollView,
  TouchableOpacity,
  AsyncStorage
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { doLogout } from '../actions'
import ClientUsers from './ClientUsers'
import styles from '../styles'

class LoginSuccessScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    isLogoutBtnClick: false,
    refreshing: false,
    showHiddenMenu: false
  }

  goToClentUsersList = () => {
    this.setState({
      isLogoutBtnClick: true,
      refreshing: true
    })
  }

  async handleClientUserLogout(navigation) {
    try {
      await AsyncStorage.removeItem('clientusrToken')
      navigation.navigate('Login')
    } catch (err) {
      console.log(`The error is: ${err}`)
    }
  }

  _toggleShow = () => {
    this.setState({ showHiddenMenu: !this.state.showHiddenMenu })
  }

  render() {
    const { doLogout, navigation } = this.props
    const { isLogoutBtnClick, refreshing } = this.state
    var isAuthClientUser =
      this.props.navigation.state.params !== undefined &&
      this.props.navigation.state.params.isAuthClientUser
    var authClientUserName =
      this.props.navigation.state.params !== undefined &&
      this.props.navigation.state.params.clientusersName
    var clientusers = this.props.navigation.state.params.clientusers

    if (isLogoutBtnClick) {
      return (
        <ClientUsers
          navigation={navigation}
          refreshing={refreshing}
          clientusers={clientusers}
        />
      )
    } else {
      return (
        <ScrollView>
          <View style={styles.container}>
            <View style={[styles.paddBottom_10]}>
              <Image
                source={
                  __DEV__
                    ? require('../assets/images/logo.png')
                    : require('../assets/images/logo.png')
                }
                style={styles.welcomeImage}
              />

              {isAuthClientUser ? (
                <View style={{ alignItems: 'flex-end', marginTop: -30 }}>
                  <Text
                    style={[styles.orange_bg, styles.userIcon]}
                    onPress={this._toggleShow}
                  >
                    {authClientUserName[0]}
                  </Text>
                  {this.state.showHiddenMenu && (
                    <HiddenMenu
                      navigation={navigation}
                      handleClientUserLogout={this.handleClientUserLogout}
                    />
                  )}
                </View>
              ) : null}
            </View>

            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <View
                style={[
                  styles.margin_15,
                  styles.grayBg,
                  styles.half_width,
                  styles.jc_alignIem_center,
                  styles.paddTop_30,
                  styles.paddBottom_30
                ]}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Tables')}
                >
                  <View>
                    <Icon
                      name="md-people"
                      size={40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text style={styles.centerText}>Tables</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.margin_15,
                  styles.grayBg,
                  styles.half_width,
                  styles.jc_alignIem_center,
                  styles.paddTop_30,
                  styles.paddBottom_30
                ]}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Orders')}
                >
                  <View>
                    <Icon
                      name="md-document"
                      size={40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text style={styles.centerText}>Orders</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <View
                style={[
                  styles.margin_15,
                  styles.grayBg,
                  styles.half_width,
                  styles.jc_alignIem_center,
                  styles.paddTop_30,
                  styles.paddBottom_30
                ]}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Reservation')}
                >
                  <View>
                    <Icon
                      name="ios-calendar"
                      size={40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text style={styles.centerText}>Reservations</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.margin_15,
                  styles.grayBg,
                  styles.half_width,
                  styles.jc_alignIem_center,
                  styles.paddTop_30,
                  styles.paddBottom_30
                ]}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Reports')}
                >
                  <View>
                    <FontAwesomeIcon
                      name="bar-chart"
                      size={40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text style={styles.centerText}>Reporting</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <View
                style={[
                  styles.margin_15,
                  styles.grayBg,
                  styles.half_width,
                  styles.jc_alignIem_center,
                  styles.paddTop_30,
                  styles.paddBottom_30
                ]}
              >
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('Settings', {
                      currRoute: navigation.state.routeName
                    })
                  }
                >
                  <View>
                    <Icon
                      name="md-settings"
                      size={40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text style={styles.centerText}>Setting</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {isAuthClientUser ? (
                <View
                  style={[
                    styles.margin_15,
                    styles.orange_bg,
                    styles.half_width,
                    styles.jc_alignIem_center,
                    styles.paddTop_30,
                    styles.paddBottom_30,
                    styles.borderRadius4
                  ]}
                >
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('ClockIn', {
                        authClientUserName: authClientUserName
                      })
                    }
                  >
                    <View>
                      <FontAwesomeIcon
                        name="clock-o"
                        size={40}
                        color="#fff"
                        style={[styles.centerText, styles.margin_15]}
                      />
                      <Text style={(styles.centerText, styles.whiteColor)}>
                        Time Card
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={[
                    styles.margin_15,
                    styles.grayBg,
                    styles.half_width,
                    styles.jc_alignIem_center,
                    styles.paddTop_30,
                    styles.paddBottom_30
                  ]}
                >
                  <TouchableOpacity onPress={this.goToClentUsersList}>
                    <View>
                      <Icon
                        name="ios-log-out"
                        size={40}
                        color="#f18d1a"
                        style={[styles.centerText, styles.margin_15]}
                      />
                      <Text style={styles.centerText}>Client Users</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      )
    }
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
  doLogout: () => {
    dispatch(doLogout())
  }
})

export default connect(
  null,
  mapDispatchToProps
)(LoginSuccessScreen)

export class HiddenMenu extends React.Component {
  render() {
    return (
      <View
        style={[
          styles.jc_alignIem_center,
          styles.flex_dir_row,
          styles.mgrtotop12
        ]}
      >
        <View
          style={[
            styles.half_width,
            styles.jc_alignIem_center,
            styles.paddingTopBtn20
          ]}
        >
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Account')}
          >
            <View>
              <Text style={[styles.orange_color]}>Account</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.half_width,
            styles.jc_alignIem_center,
            styles.paddingTopBtn20
          ]}
        >
          <Text
            onPress={() =>
              this.props.handleClientUserLogout(this.props.navigation)
            }
            style={[styles.orange_color]}
          >
            Logout
          </Text>
        </View>
      </View>
    )
  }
}

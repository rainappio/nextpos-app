import React from 'react'
import {
  View,
  Text,
  TouchableHighlight,
  Image,
  ScrollView,
  TouchableOpacity
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
    refreshing: false
  }

  goToClentUsersList = () => {
    this.setState({
      isLogoutBtnClick: true,
      refreshing: true
    })
  }

  render() {
    const { doLogout, clientusers, navigation } = this.props
    const { isLogoutBtnClick, refreshing } = this.state
    var isAuthClientUser =
      this.props.navigation.state.params !== undefined &&
      this.props.navigation.state.params.isAuthClientUser
    var authClientUserName =
      this.props.navigation.state.params !== undefined &&
      this.props.navigation.state.params.clientusersName

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
            <View style={[styles.jc_alignIem_center, styles.paddBottom_10]}>
              <Image
                source={
                  __DEV__
                    ? require('../assets/images/logo.png')
                    : require('../assets/images/logo.png')
                }
                style={styles.welcomeImage}
              />
              {isAuthClientUser ? (
                <Text style={[styles.orange_bg, styles.uerIcon]}>
                  {authClientUserName[0]}
                </Text>
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
                  onPress={() => this.props.navigation.navigate('Product')}
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
                  onPress={() => this.props.navigation.navigate('Product')}
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
                  onPress={() => this.props.navigation.navigate('Product')}
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
                  onPress={() => this.props.navigation.navigate('Product')}
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
                  onPress={() => this.props.navigation.navigate('Settings')}
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
                  <TouchableOpacity
                    onPress={this.goToClentUsersList}
                  >
                    <View>
                      <Icon
                        name="ios-log-out"
                        size={40}
                        color="#f18d1a"
                        style={[styles.centerText, styles.margin_15]}
                      />
                      <Text style={styles.centerText}>Logout</Text>
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

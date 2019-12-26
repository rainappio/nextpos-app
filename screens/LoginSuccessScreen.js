import React from 'react'
import {
  View,
  Text,
  TouchableHighlight,
  Image,
  ScrollView,
  TouchableOpacity,
  AsyncStorage,
  RefreshControl
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { doLogout } from '../actions'
// import ClientUsers from './ClientUsers'
import styles from '../styles'

class LoginSuccessScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    showHiddenMenu: false,
    clientusrToken: null,
    clientusersName: null
  }

  async handleClientUserLogout(navigation) {
    try {
      await AsyncStorage.removeItem('clientusrToken')
      await AsyncStorage.removeItem('clientusersName')
      navigation.navigate('ClientUsers')
    } catch (err) {
      console.log(`The error is: ${err}`)
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('clientusrToken')
      .then(value => {
        this.setState({ clientusrToken: JSON.parse(value) })
      })
      .done()

    AsyncStorage.getItem('clientusersName')
      .then(value => {
        this.setState({ clientusersName: value })
      })
      .done()
  }

  _toggleShow = () => {
    this.setState({ showHiddenMenu: !this.state.showHiddenMenu })
  }

  render() {
    const { doLogout, navigation, clientusers } = this.props
    const { t } = this.props.screenProps
    const { clientusrToken, clientusersName } = this.state

    var isAuthClientUser =
      this.props.navigation.state.params !== undefined &&
      this.props.navigation.state.params.isAuthClientUser
    var authClientUserName =
      this.props.navigation.state.params !== undefined &&
      this.props.navigation.state.params.clientusersName

    var isAuthClientUserAfterRefresh =
      clientusrToken !== null && clientusrToken.hasOwnProperty('access_token')

    return (
      <ScrollView>
        <View style={[styles.container, styles.nomgrBottom]}>
          <View style={{ marginLeft: 4, marginRight: 4 }}>
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
                  {clientusersName !== null
                    ? clientusersName
                    : authClientUserName[0]}
                </Text>
                {this.state.showHiddenMenu && (
                  <HiddenMenu
                    navigation={navigation}
                    handleClientUserLogout={this.handleClientUserLogout}
                    screenProps={this.props.screenProps}
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
                onPress={() => this.props.navigation.navigate('TablesSrc')}
              >
                <View>
                  <Icon
                    name="md-people"
                    size={40}
                    color="#f18d1a"
                    style={[styles.centerText, styles.margin_15]}
                  />
                  <Text style={styles.centerText}>{t('menu.tables')}</Text>
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
                disabled={true}
              >
                <View>
                  <Icon
                    name="md-document"
                    size={40}
                    color="#f18d1a"
                    style={[
                      styles.centerText,
                      styles.margin_15,
                      { opacity: 0.3 }
                    ]}
                  />
                  <Text style={styles.centerText}>{t('menu.orders')}</Text>
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
                disabled={true}
              >
                <View>
                  <Icon
                    name="ios-calendar"
                    size={40}
                    color="#f18d1a"
                    style={[
                      styles.centerText,
                      styles.margin_15,
                      { opacity: 0.3 }
                    ]}
                  />
                  <Text style={styles.centerText}>
                    {t('menu.reservations')}
                  </Text>
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
                disabled={true}
              >
                <View>
                  <FontAwesomeIcon
                    name="bar-chart"
                    size={40}
                    color="#f18d1a"
                    style={[
                      styles.centerText,
                      styles.margin_15,
                      { opacity: 0.3 }
                    ]}
                  />
                  <Text style={styles.centerText}>{t('menu.reporting')}</Text>
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
                onPress={() => this.props.navigation.navigate('SettingScr')}
              >
                <View>
                  <Icon
                    name="md-settings"
                    size={40}
                    color="#f18d1a"
                    style={[styles.centerText, styles.margin_15]}
                  />
                  <Text style={styles.centerText}>{t('menu.settings')}</Text>
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
                    <Text style={[styles.centerText, styles.whiteColor]}>
                      {t('menu.timecard')}
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
                  //onPress={this.goToClentUsersList}
                  onPress={() => this.props.navigation.navigate('ClientUsers')}
                >
                  <View>
                    <Icon
                      name="ios-log-out"
                      size={40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text style={styles.centerText}>
                      {t('menu.clientUsers')}
                    </Text>
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
    let { t } = this.props.screenProps

    return (
      <View
        style={[
          styles.jc_alignIem_center,
          styles.flex_dir_row,
          styles.mgrtotop8,
          styles.lightgrayBg
        ]}
      >
        <View
          style={[
            styles.half_width,
            styles.jc_alignIem_center,
            styles.paddingTopBtn20,
            { marginLeft: 7.5, marginRight: 7.5 }
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Account')
            }}
          >
            <View>
              <Text style={[styles.orange_color]}>{t('settings.account')}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.half_width,
            styles.jc_alignIem_center,
            styles.paddingTopBtn20,
            { marginLeft: 7.5, marginRight: 7.5 }
          ]}
        >
          <Text
            onPress={() =>
              this.props.handleClientUserLogout(this.props.navigation)
            }
            style={[styles.orange_color]}
          >
            {t('logout')}
          </Text>
        </View>
      </View>
    )
  }
}

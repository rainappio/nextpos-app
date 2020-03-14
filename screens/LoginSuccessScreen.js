import React from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  AsyncStorage,
  ActivityIndicator, Modal, TouchableWithoutFeedback
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import {
  doLogout,
  formatDateFromMillis,
  formatDateObj,
  getClientUsr,
  getAnnouncements, getShiftStatus
} from '../actions'
import styles from '../styles'
import BackendErrorScreen from './BackendErrorScreen'
import { NavigationEvents } from 'react-navigation'
import { getToken } from '../constants/Backend'
import { LocaleContext } from '../locales/LocaleContext'
import { Avatar } from 'react-native-elements'
import Markdown from 'react-native-markdown-renderer'
import IonIcon from 'react-native-vector-icons/Ionicons'
import {handleDelete, handleOrderSubmit} from "../helpers/orderActions";
import Constants from "expo-constants/src/Constants";

class LoginSuccessScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.hiddenMenu = React.createRef()

    this.state = {
      token: null,
      username: ' ',
      loggedIn: null,
      tokenExpiry: null,
    }
  }

  async handleClientUserLogout(navigation) {
    try {
      await AsyncStorage.removeItem('clientusrToken')
      navigation.navigate('ClientUsers')
    } catch (err) {
      console.log(`The error is: ${err}`)
    }
  }

  /**
   * Navigation lifecycle reference:
   * https://reactnavigation.org/docs/en/navigation-lifecycle.html
   */
  componentDidMount() {
    this.context.localize({
      en: {
        welcome: 'Welcome,',
        loggedIn: 'Logged in at',
        quickOrder: 'Quick Order',
        ownerRemark: '\'s Owner'
      },
      zh: {
        welcome: '歡迎,',
        loggedIn: '登入時間:',
        quickOrder: '快速訂單',
        ownerRemark: '老闆'
      }
    })
    // <NavigationEvent> component in the render function takes care of loading user info.
  }

  loadUserInfo = async () => {
    let token = await getToken()
    this.props.getCurrentUser(token.username)
    this.props.getAnnouncements()
    this.props.getShiftStatus()

    this.setState({
      token: token,
      username: token.username,
      loggedIn: token.loggedIn,
      tokenExpiry: token.tokenExp
    })
  }

  render() {
    const {
      doLogout,
      navigation,
      currentUser,
      isLoading,
      haveError,
      getannouncements,
      shiftStatus
    } = this.props
    const { t } = this.context
    const { username, loggedIn, tokenExpiry } = this.state

    if (isLoading) {
      return (
        <View style={[styles.container]}>
          <ActivityIndicator size="large" color="#ccc" />
        </View>
      )
    } else if (haveError) {
      return <BackendErrorScreen />
    }

    return (
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        <NavigationEvents
          onWillFocus={() => {
            this.loadUserInfo().then()
          }}
        />
        <HiddenMenu
          ref={this.hiddenMenu}
          navigation={navigation}
          handleClientUserLogout={this.handleClientUserLogout}
        />

        <View style={[styles.container]}>
          <View style={[{flexDirection: 'row', flex: 1, marginHorizontal: 10 }]}>
            <View style={{flex: 1}}>
              <Image
                source={
                  __DEV__
                    ? require('../assets/images/logo.png')
                    : require('../assets/images/logo.png')
                }
                style={[styles.welcomeImage]}
              />
            </View>

            <View
            	style={[
                {flex: 1, marginTop: 6, alignItems: 'flex-end'}
              ]}>
              <Avatar
                rounded
                title={username != null && username.charAt(0).toUpperCase()}
                size="small"
                overlayContainerStyle={[styles.orange_bg]}
                titleStyle={styles.whiteColor}
                onPress={() => this.hiddenMenu.current.toggleMenu()}
              />
            </View>
          </View>

          <View style={{marginLeft: 10}}>
            <Text style={[styles.text, styles.textBig, styles.orange_color]}>
              {t('welcome')} {currentUser.displayName}{currentUser.defaultUser && t('ownerRemark')}
            </Text>
            <Text style={[styles.textSmall]}>
              {t('loggedIn')} {formatDateObj(loggedIn)}
            </Text>
          </View>

          {shiftStatus === 'ACTIVE' && (
            <TouchableOpacity
              style={[styles.mainSquareButton]}
              onPress={() => {
                this.props.navigation.navigate('OrderStart', {
                  handleOrderSubmit: handleOrderSubmit,
                  handleDelete: handleDelete
                })
              }}>
              <View>
                <MaterialIcon
                  name="play-arrow"
                  size={40}
                  color="#f18d1a"
                  style={[styles.centerText, styles.margin_15]}
                />
                <Text style={styles.centerText}>{t('quickOrder')}</Text>
              </View>
            </TouchableOpacity>
          )}

          <View style={[styles.flex_dir_row, {flex: 1}]}>
            <View style={{flex: 1}}>
              <TouchableOpacity
                style={[styles.mainSquareButton
                ]}
                onPress={() =>
                  this.props.navigation.navigate('ClockIn', {
                    authClientUserName: username
                  })
                }
              >
                <View>
                  <FontAwesomeIcon
                    name="clock-o"
                    size={40}
                    color="#f18d1a"
                    style={[styles.centerText, styles.margin_15]}
                  />
                  <Text style={[styles.centerText]}>{t('menu.timecard')}</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{flex: 1}}>
              <TouchableOpacity
                style={[styles.mainSquareButton
                ]}
                onPress={() => this.props.navigation.navigate('ClientUsers')}
              >
                <View>
                  <Icon
                    name="ios-log-out"
                    size={40}
                    color="#f18d1a"
                    style={[styles.centerText, styles.margin_15]}
                  />
                  <Text style={styles.centerText}>{t('menu.clientUsers')}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[{flex: 1, margin: 10}]}>
            {
              getannouncements.results !== undefined &&
              getannouncements.results.map(getannoc =>
                <View
                  style={[
                    {backgroundColor: '#f1f1f1', padding: 20},
                    styles.mgrbtn20
                  ]}
                  key={getannoc.id}
                >
                  <View style={styles.flex_dir_row}>
                    <View style={{marginRight: 17}}>
                      <IonIcon
                        name={getannoc.titleIcon}
                        size={31}
                        color="#f18d1a"
                      />
                    </View>
                    <View>
                      <Text style={[
                        styles.orange_color,
                        styles.textMedium,
                      ]}>
                        {getannoc.title}
                      </Text>
                    </View>
                  </View>

                  <Markdown style={styles.markDownStyle}>
                    {getannoc.markdownContent}
                    {'\n'}
                  </Markdown>
                </View>
              )
            }
          </View>

        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = state => ({
  currentUser: state.clientuser.data,
  haveData: state.clientuser.haveData,
  haveError: state.clientuser.haveError,
  isLoading: state.clientuser.loading,
	getannouncements: state.announcements.data,
  shiftStatus: state.shift.data.shiftStatus
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getCurrentUser: name => dispatch(getClientUsr(name)),
  doLogout: () => {
    dispatch(doLogout())
  },
  getAnnouncements: () => dispatch(getAnnouncements()),
  getShiftStatus: () => dispatch(getShiftStatus())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginSuccessScreen)

export class HiddenMenu extends React.Component {
  static contextType = LocaleContext

  constructor(props) {
    super(props)

    this.state = {
      isVisible: false
    }
  }

  toggleMenu = () => {
    this.setState({
      isVisible: !this.state.isVisible,
    })
  }

  render() {
    let { t } = this.context

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isVisible}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalContainer}
          onPressOut={() => {
            this.toggleMenu()
          }}
        >
          <View
            style={[
              styles.jc_alignIem_center,
              styles.flex_dir_row,
              {
                position: 'absolute',
                top: 100,
                width: '100%',
                backgroundColor: '#858585',
                opacity: 1,
                zIndex: 10
              }
            ]}
          >
            <TouchableOpacity
              style={[
                styles.jc_alignIem_center,
                styles.paddingTopBtn20,
                {flex: 1}
              ]}
              onPress={() => {
                this.toggleMenu()
                this.props.navigation.navigate('Account')
              }}
            >
              <Text style={[styles.whiteColor]}>{t('settings.account')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.jc_alignIem_center,
                styles.paddingTopBtn20,
                {flex: 1}
              ]}
              onPress={() => {
                this.toggleMenu()
                this.props.handleClientUserLogout(this.props.navigation)
              }}
            >
              <Text style={[styles.whiteColor]}>
                {t('logout')}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
}

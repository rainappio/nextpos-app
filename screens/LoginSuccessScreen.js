import React from 'react'
import {Image, Modal, Text, TouchableOpacity, View} from 'react-native'
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import IonIcon from 'react-native-vector-icons/Ionicons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import {doLogout, formatDateObj, getAnnouncements, getClientUsr, getCurrentClient, getShiftStatus} from '../actions'
import styles, {mainThemeColor} from '../styles'
import BackendErrorScreen from './BackendErrorScreen'
import {NavigationEvents} from 'react-navigation'
import {getToken} from '../constants/Backend'
import {LocaleContext} from '../locales/LocaleContext'
import {Avatar} from 'react-native-elements'
import Markdown from 'react-native-markdown-display'
import {handleDelete, handleOrderSubmit} from "../helpers/orderActions";
import MenuButton from "../components/MenuButton";
import LoadingScreen from "./LoadingScreen";
import {withContext} from "../helpers/contextHelper";
import {compose} from "redux";
import {StyledText} from "../components/StyledText";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {complexTheme} from "../themes/ThemeContext";

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
    this.props.getCurrentClient()
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
      shiftStatus,
      themeStyle
    } = this.props
    const {t} = this.context
    const {username, loggedIn, tokenExpiry} = this.state

    if (isLoading) {
      return (
        <LoadingScreen/>
      )
    } else if (haveError) {
      return <BackendErrorScreen/>
    }

    return (
      <ThemeScrollView>
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

        <View style={[styles.fullWidthScreen]}>
          <View style={[{flexDirection: 'row', marginHorizontal: 10}]}>
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

            <View style={[{flex: 1, marginTop: 6, alignItems: 'flex-end'}]}>
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

          <View style={[styles.horizontalMargin, {marginTop: 15}]}>
            <Text style={[styles.primaryText]}>
              {t('welcome')} {currentUser.displayName}{currentUser.defaultUser && t('ownerRemark')}
            </Text>
            <StyledText style={[styles.subText]}>
              {t('loggedIn')} {formatDateObj(loggedIn)}
            </StyledText>
          </View>

          <View>
            {shiftStatus === 'ACTIVE' && (
              <View style={styles.menuContainer}>
                <MenuButton
                  onPress={() => {
                    this.props.navigation.navigate('OrderStart', {
                      handleOrderSubmit: handleOrderSubmit,
                      handleDelete: handleDelete
                    })
                  }}
                  title={t('quickOrder')}
                  icon={
                    <MaterialIcon
                      name="play-arrow"
                      size={40}
                      style={[styles.buttonIconStyle]}
                    />
                  }/>
              </View>
            )}

            <View style={[styles.menuContainer]}>
              <MenuButton
                onPress={() =>
                  this.props.navigation.navigate('ClockIn', {
                    authClientUserName: username
                  })}
                title={t('menu.timecard')}
                icon={
                  <FontAwesomeIcon
                    name="clock-o"
                    size={40}
                    style={[styles.buttonIconStyle]}
                  />
                }/>
              <View style={styles.dynamicHorizontalPadding(6)}/>
              <MenuButton
                onPress={() => this.props.navigation.navigate('ClientUsers')}
                title={t('menu.clientUsers')}
                icon={
                  <Icon
                    name="ios-log-out"
                    size={40}
                    style={[styles.buttonIconStyle]}
                  />
                }/>
            </View>
          </View>

          <View style={[styles.flex(2), {margin: 10}]}>
            {
              getannouncements.results !== undefined &&
              getannouncements.results.map(getannoc =>
                <View
                  style={[styles.sectionContainer, styles.withBottomBorder]}
                  key={getannoc.id}
                >
                  <View style={[styles.tableCellView]}>
                    <IonIcon
                      name={getannoc.titleIcon}
                      size={32}
                      color={mainThemeColor}
                    />
                    <StyledText style={[styles.announcementTitle, {marginLeft: 10}]}>
                      {getannoc.title}
                    </StyledText>
                  </View>

                  <View style={styles.markdownContainer}>
                  <Markdown style={themeStyle}>
                    {getannoc.markdownContent}
                  </Markdown>
                  </View>
                </View>
              )
            }
          </View>

        </View>
      </ThemeScrollView>
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
  getCurrentClient: () => dispatch(getCurrentClient()),
  getCurrentUser: name => dispatch(getClientUsr(name)),
  doLogout: () => {
    dispatch(doLogout())
  },
  getAnnouncements: () => dispatch(getAnnouncements()),
  getShiftStatus: () => dispatch(getShiftStatus())
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withContext,
)

export default enhance(LoginSuccessScreen)


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
    let {t, theme} = this.context

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
                backgroundColor: complexTheme[theme].overlay.backgroundColor,
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
              <Text style={complexTheme[theme].overlay}>{t('settings.account')}</Text>
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
              <Text style={complexTheme[theme].overlay}>
                {t('logout')}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
}

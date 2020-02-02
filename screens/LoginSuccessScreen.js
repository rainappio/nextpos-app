import React from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  AsyncStorage,
  ActivityIndicator
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
  getAnnouncements,
  isTablet
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

class LoginSuccessScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      showHiddenMenu: false,
      token: null,
      username: ' ',
      loggedIn: null,
      tokenExpiry: null,
      mainViewOpacity: 1
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
        quickOrder: 'Quick Order'
      },
      zh: {
        welcome: '歡迎,',
        loggedIn: '登入時間:',
        quickOrder: '快速訂單'
      }
    })
    // <NavigationEvent> component in the render function takes care of loading user info.
  }

  loadUserInfo = async () => {
    let token = await getToken()
    this.props.getCurrentUser(token.username)
    this.props.getAnnouncements()

    this.setState({
      token: token,
      username: token.username,
      loggedIn: token.loggedIn,
      tokenExpiry: token.tokenExp,
      showHiddenMenu: false,
      mainViewOpacity: 1
    })
  }

  _toggleShow = () => {
    const opacity = !this.state.showHiddenMenu ? 0.3 : 1
    this.setState({
      showHiddenMenu: !this.state.showHiddenMenu,
      mainViewOpacity: opacity
    })
  }

  render() {
    const {
      doLogout,
      navigation,
      currentUser,
      isLoading,
      haveError,
      getannouncements
    } = this.props
    const { t } = this.context
    const { username, loggedIn, tokenExpiry } = this.state
    console.log(t('welcome'))
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
      <ScrollView>
        <NavigationEvents
          onWillFocus={() => {
            console.log('reloading user info')
            this.loadUserInfo().then()
          }}
        />

        {this.state.showHiddenMenu && (
          <HiddenMenu
            navigation={navigation}
            handleClientUserLogout={this.handleClientUserLogout}
          />
        )}

        <View
          style={[styles.container, styles.nomgrBottom]}
          opacity={this.state.mainViewOpacity}
        >
          <View style={styles.flex_dir_row}>
            <View
              style={{width: '80%'}}
            >
            <Image
              source={
                __DEV__
                  ? require('../assets/images/logo.png')
                  : require('../assets/images/logo.png')
              }
              style={styles.welcomeImage}
            />
            </View>

            <View
            	style={[
                {width: '20%', alignItems: 'flex-end'}
              ]}>
              <Avatar
                rounded
                title={username != null && username.charAt(0)}
                size={isTablet ? "large" : "small"}
                overlayContainerStyle={[styles.orange_bg]}
                titleStyle={styles.whiteColor}
                onPress={this._toggleShow}
              />
            </View>
          </View>

          <View style={[styles.customMgr]}>
            <Text style={[styles.textBold, styles.orange_color, styles.textBig]}>
              {t('welcome')} {currentUser.displayName}
            </Text>
            <Text style={[styles.textSmall]}>
              {t('loggedIn')} {formatDateObj(loggedIn)}
            </Text>
          </View>

          <View style={[styles.jc_alignIem_center, styles.commonMgrBtn]}>
            <View
              style={[
                styles.fullWidth,
                styles.grayBg,
                styles.jc_alignIem_center,
                styles.paddTop_30,
                styles.paddBottom_30,
                styles.borderRadius4               
              ]}
            >
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('OrderStart', {
                  handleOrderSubmit: handleOrderSubmit,
                  handleDelete: handleDelete
                })
              }}
            >
              <View>
                <MaterialIcon
                  name="play-arrow"
                  size={isTablet ? 70 : 40}
                  color="#f18d1a"
                  style={[styles.centerText, styles.iconMargin]}
                />
                  <Text style={[styles.centerText, styles.defaultfontSize]}>{t('quickOrder')}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

          <View style={[styles.jc_alignIem_center, styles.flex_dir_row, styles.commonMgrBtn]}>
            <View
              style={[
                styles.grayBg,
                styles.half_width,
                styles.jc_alignIem_center,
                styles.paddTop_30,
                styles.paddBottom_30,
                styles.borderRadius4,
                {marginRight: '3%', width: '47%'}
              ]}
            >
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('ClockIn', {
                    authClientUserName: username
                  })
                }
              >
                <View>
                  <FontAwesomeIcon
                    name="clock-o"
                    size={isTablet ? 70 : 40}
                    color="#f18d1a"
                    style={[styles.centerText, styles.iconMargin]}
                  />
                  <Text style={[styles.centerText, styles.defaultfontSize]}>{t('menu.timecard')}</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={[                
                styles.grayBg,                
                styles.jc_alignIem_center,
                styles.paddTop_30,
                styles.paddBottom_30,
                styles.borderRadius4,
                {marginLeft: '3%', width: '47%'}
              ]}
            >
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('ClientUsers')}
              >
                <View>
                  <Icon
                    name="ios-log-out"
                    size={isTablet ? 70 : 40}
                    color="#f18d1a"
                    style={[styles.centerText, styles.iconMargin]}
                  />
                  <Text style={[styles.centerText, styles.defaultfontSize]}>{t('menu.clientUsers')}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
            <View
              style={[
                styles.fullWidth,
                styles.borderRadius4
              ]}
            >
             	{
            		getannouncements.results !== undefined &&
            		getannouncements.results.map(getannoc =>
									<View
            				style={[
              				{ backgroundColor: '#f1f1f1', padding: 20 },
              				styles.commonMgrBtn
            				]}
            				key={getannoc.id}
          					>
          					<View style={styles.flex_dir_row}>
          						<View style={{marginRight: 17}}>
          							<IonIcon
              						name={getannoc.titleIcon}
              						size={isTablet ? 60 : 26}
              						color="#f18d1a"
              						//onPress={() => fields.push()}
            						/>
          						</View>
          						<View>
												<Text style={[
                						styles.orange_color,
                						styles.defaultfontSize,
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
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getCurrentUser: name => dispatch(getClientUsr(name)),
  doLogout: () => {
    dispatch(doLogout())
  },
  getAnnouncements: () => dispatch(getAnnouncements())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginSuccessScreen)

export class HiddenMenu extends React.Component {
  static contextType = LocaleContext

  render() {
    let { t } = this.context

    return (
      <View
        style={[
          styles.jc_alignIem_center,
          styles.flex_dir_row,
          styles.mgrtotop8,
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
              <Text style={[styles.whiteColor, styles.textMedium]}>{t('settings.account')}</Text>
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
            style={[styles.whiteColor, styles.textMedium]}
          >
            {t('logout')}
          </Text>
        </View>
      </View>
    )
  }
}

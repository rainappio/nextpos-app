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
  getAnnouncements
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
          <View style={[{ marginLeft: 4, marginRight: 4 },styles.flex_dir_row]}>
            <View
              style={[
                styles.margin_15,
                styles.half_width,
              ]}
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
                styles.margin_15,
                styles.half_width,
                {alignItems: 'flex-end'}
              ]}>
              <Avatar
                rounded
                title={username != null && username.charAt(0)}
                size="small"
                overlayContainerStyle={[styles.orange_bg]}
                titleStyle={styles.whiteColor}
                onPress={this._toggleShow}
              />
            </View>
          </View>

          <View style={{marginLeft: '3%'}}>
            <Text style={[styles.text, styles.textBig, styles.orange_color]}>
              {t('welcome')} {currentUser.displayName}
            </Text>
            <Text style={[styles.textSmall]}>
              {t('loggedIn')} {formatDateObj(loggedIn)}
            </Text>
          </View>

          <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
            <TouchableOpacity
              style={{width: '96%'}}
              onPress={() => {
                this.props.navigation.navigate('OrderStart', {
                  handleOrderSubmit: handleOrderSubmit,
                  handleDelete: handleDelete
                })
              }}
            >
              <View
                style={[
                  styles.margin_15,
                  styles.grayBg,
                  styles.jc_alignIem_center,
                  styles.paddTop_30,
                  styles.paddBottom_30,
                  styles.borderRadius4,
                  {width: '96%'}
                ]}
              >
                <View>
                  <MaterialIcon
                    name="play-arrow"
                    size={40}
                    color="#f18d1a"
                    style={[styles.centerText, styles.margin_15]}
                  />
                  <Text style={styles.centerText}>{t('quickOrder')}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
            <View
              style={[
                styles.margin_15,
                styles.grayBg,
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

          <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
            <View
              style={[
                styles.margin_15,
                {width: '96%'}
              ]}
            >
             	{
            		getannouncements.results !== undefined &&
            		getannouncements.results.map(getannoc =>
									<View
            				style={[
              				{ backgroundColor: '#f1f1f1', padding: 20 },
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
              						//onPress={() => fields.push()}
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
              <Text style={[styles.whiteColor]}>{t('settings.account')}</Text>
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
            style={[styles.whiteColor]}
          >
            {t('logout')}
          </Text>
        </View>
      </View>
    )
  }
}

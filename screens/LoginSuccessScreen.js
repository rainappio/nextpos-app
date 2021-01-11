import React from 'react'
import {Image, Text, TouchableOpacity, View, Alert} from 'react-native'
import {connect} from 'react-redux'
import {Field, reduxForm} from 'redux-form'
import IonIcon from 'react-native-vector-icons/Ionicons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import {doLogout, formatDateObj, getAnnouncements, getClientUsr, getCurrentClient, getShiftStatus, getPrinters} from '../actions'
import styles, {mainThemeColor} from '../styles'
import BackendErrorScreen from './BackendErrorScreen'
import {NavigationEvents} from 'react-navigation'
import {getToken, api, dispatchFetchRequestWithOption, successMessage} from '../constants/Backend'
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
import NavigationService from "../navigation/NavigationService";
import Modal from 'react-native-modal';
import {Pages} from 'react-native-pages'
import {CheckBox} from 'react-native-elements'
import {checkExpoUpdate} from "../helpers/updateAppHelper";

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
      globalAnnouncements: null,
      modalVisible: false,
      checkedObj: null,
      isLoadingUserInfo: false
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
        ownerRemark: '\'s Owner',
        clientStatusTitle: 'Please complete the following settings',
        addTableLayout: 'Add Table Layout',
        addCategory: 'Add Category',
        addElectronicInvoice: 'Add Electronic Invoice',
        addPrinter: 'Add Printer',
        addProduct: 'Add Product',
        addTable: 'Add Table',
        addWorkingArea: 'Add Working Area',
        markAsReadPrompt: 'Dismiss'
      },
      zh: {
        welcome: '歡迎,',
        loggedIn: '登入時間:',
        quickOrder: '快速訂單',
        ownerRemark: '老闆',
        clientStatusTitle: '請完成下列設定',
        addTableLayout: '新增樓面',
        addCategory: '新增產品分類',
        addElectronicInvoice: '新增電子發票',
        addPrinter: '新增出單機',
        addProduct: '新增產品',
        addTable: '新增桌位',
        addWorkingArea: '新增工作區',
        markAsReadPrompt: '不再顯示此公告'
      }
    })
    // <NavigationEvent> component in the render function takes care of loading user info.
  }

  loadUserInfo = async () => {
    this.setState({isLoadingUserInfo: true})
    let token = await getToken()
    this.props.getCurrentClient()
    this.props.getCurrentUser(token.username)
    this.props.getAnnouncements()
    this.props.getShiftStatus()

    this.setState({
      token: token,
      username: token.username,
      loggedIn: token.loggedIn,
      tokenExpiry: token.tokenExp,
    })

    checkExpoUpdate(this.context?.disableReload, this.context?.setDisableReload)
  }


  componentDidUpdate(prevProps, prevState) {
    if ((prevProps?.currentUser?.username !== this.props?.currentUser?.username || prevProps?.client?.clientName !== this.props?.client?.clientName) && this.state?.isLoadingUserInfo && !!this.props?.currentUser?.username && !!this.props?.client?.clientName) {
      this.getGlobalAnnouncements()
      this.setState({
        isLoadingUserInfo: false
      })
    }
  }

  getGlobalAnnouncements = () => {
    dispatchFetchRequestWithOption(api.announcements.getGlobal, {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }, {
      defaultMessage: false
    }, response => {
      response.json().then(data => {
        let globalAnnouncements = [...data?.results]
        if (globalAnnouncements?.length > 0) {
          let tempObj = {}
          let tempGlobalAnnouncements = globalAnnouncements?.filter((item) => {return !(!!item?.readDevices?.[`${this.props?.client?.id}`] && item?.readDevices?.[`${this.props?.client?.id}`].includes(this.props?.currentUser?.username))})
          tempGlobalAnnouncements?.forEach((item) => tempObj[`${item?.id}`] = false)
          this.setState({
            checkedObj: tempObj,
            globalAnnouncements: tempGlobalAnnouncements,
            modalVisible: tempGlobalAnnouncements?.length > 0
          })

        } else {
          this.setState({
            globalAnnouncements: globalAnnouncements,
          })
        }

      })
    }).then()
  }

  handleCloseModal = () => {
    this.state?.globalAnnouncements.forEach((item) => {
      if (this.state?.checkedObj?.[`${item?.id}`]) {
        dispatchFetchRequestWithOption(api.announcements.markAsRead(item?.id), {
          method: 'POST',
          withCredentials: true,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            clientId: this.props?.client?.id,
            deviceId: this.props?.currentUser?.username
          })
        }, {
          defaultMessage: false
        }, response => {

        }).then()
      }
    })

    this.setState({modalVisible: false})
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
      themeStyle,
      client,
      printers = [],
    } = this.props
    const {t} = this.context
    const {username, loggedIn, tokenExpiry} = this.state

    if (isLoading) {
      return (
        <LoadingScreen />
      )
    } else if (haveError) {
      return <BackendErrorScreen />
    }

    return (
      <ThemeScrollView>
        <NavigationEvents
          onWillFocus={() => {
            this.loadUserInfo()
          }}
        />
        <HiddenMenu
          ref={this.hiddenMenu}
          navigation={navigation}

        />


        <View style={[styles.fullWidthScreen]}>
          <Modal
            isVisible={this.state.modalVisible}
            backdropOpacity={0.7}
            onBackdropPress={() => this.handleCloseModal()}
            useNativeDriver
            hideModalContentWhileAnimating
            animationIn='bounceIn'
            animationOut='bounceOut'
            style={{alignSelf: 'center', maxWidth: 640, width: '80%'}}
          >
            <View style={[themeStyle, {borderRadius: 20, flex: 0.7}]}>
              <Pages indicatorColor={mainThemeColor}>
                {this.state?.globalAnnouncements?.map((item) => {
                  return (
                    <View style={{flex: 1, paddingBottom: 18}}>
                      <View style={{alignItems: 'center', borderColor: mainThemeColor, borderBottomWidth: 1, paddingVertical: 10, marginBottom: 10}}>
                        <StyledText style={{fontSize: 28, color: mainThemeColor, marginHorizontal: 8}}>{item?.title}</StyledText>
                      </View>

                      <View style={{alignItems: 'center'}}>
                        <StyledText>{item?.content}</StyledText>
                      </View>

                      <View style={{alignSelf: 'flex-end', justifyContent: 'flex-end', flex: 1, paddingRight: 20}}>
                        <View style={[styles.tableRowContainer, {paddingHorizontal: 0}]}>

                          <View style={[styles.tableCellView, {justifyContent: 'flex-end'}]}>
                            <View>
                              <CheckBox
                                checkedIcon={'check-circle'}
                                uncheckedIcon={'circle'}
                                checked={this.state?.checkedObj?.[`${item?.id}`]}
                                containerStyle={{margin: 0, padding: 0, minWidth: 0}}
                                onPress={() => {
                                  let tempObj = {...this.state?.checkedObj}
                                  tempObj[`${item?.id}`] = !tempObj[`${item?.id}`]
                                  this.setState({checkedObj: tempObj})
                                }}
                              >
                              </CheckBox>
                            </View>

                          </View>
                          <View style={[styles.tableCellView,]}>
                            <StyledText>{t('markAsReadPrompt')}</StyledText>
                          </View>
                        </View>
                      </View>
                    </View>
                  )
                })}
              </Pages>
            </View>

          </Modal>
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

          <View style={{flexDirection: 'row'}}>
            {shiftStatus === 'ACTIVE' && (
              <View style={[styles.menuContainer, {flex: 1}]}>
                <MenuButton
                  route='OrderStart'
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
                  } />
              </View>
            )}

            <View style={[styles.menuContainer, {flex: 1}]}>
              <MenuButton
                route='ClockIn'
                onPress={() =>
                  NavigationService?.navigateToRoute('ClockIn', {
                    authClientUserName: username
                  })}
                title={t('menu.timecard')}
                icon={
                  <FontAwesomeIcon
                    name="clock-o"
                    size={40}
                    style={[styles.buttonIconStyle]}
                  />
                } />

            </View>
          </View>
          <View style={[styles.flex(2), {margin: 10}]}>
            {(client?.localClientStatus?.noCategory
              || client?.localClientStatus?.noTableLayout
              || client?.localClientStatus?.noElectronicInvoice
              || client?.localClientStatus?.noPrinter
              || client?.localClientStatus?.noProduct
              || client?.localClientStatus?.noTable
              || client?.localClientStatus?.noWorkingArea) &&
              <View style={[styles.sectionContainer, styles.withBottomBorder, {alignItems: 'center'}]}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <StyledText style={[styles.announcementTitle]}>
                    {t('clientStatusTitle')}
                  </StyledText>
                </View>

                {client?.localClientStatus?.noTableLayout &&
                  <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', width: '100%', maxWidth: 640, justifyContent: 'space-between', marginBottom: 8}} onPress={() => this.props.navigation.navigate('TableLayoutAdd')}>
                    <StyledText style={[{marginLeft: 10, marginRight: 10}]}>
                      {t('addTableLayout')}
                    </StyledText>
                    <IonIcon
                      name={'arrow-forward-circle-outline'}
                      size={32}
                      color={mainThemeColor}
                    />
                  </TouchableOpacity>}
                {client?.localClientStatus?.noTable &&
                  <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', width: '100%', maxWidth: 640, justifyContent: 'space-between', marginBottom: 8}} onPress={() => this.props.navigation.navigate('TableLayouts')}>
                    <StyledText style={[{marginLeft: 10, marginRight: 10}]}>
                      {t('addTable')}
                    </StyledText>
                    <IonIcon
                      name={'arrow-forward-circle-outline'}
                      size={32}
                      color={mainThemeColor}
                    />
                  </TouchableOpacity>}
                {client?.localClientStatus?.noCategory &&
                  <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', width: '100%', maxWidth: 640, justifyContent: 'space-between', marginBottom: 8}} onPress={() => this.props.navigation.navigate('Category')}>
                    <StyledText style={[{marginLeft: 10, marginRight: 10}]}>
                      {t('addCategory')}
                    </StyledText>
                    <IonIcon
                      name={'arrow-forward-circle-outline'}
                      size={32}
                      color={mainThemeColor}
                    />
                  </TouchableOpacity>}
                {client?.localClientStatus?.noProduct &&
                  <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', width: '100%', maxWidth: 640, justifyContent: 'space-between', marginBottom: 8}} onPress={() => this.props.navigation.navigate('Product')}>
                    <StyledText style={[{marginLeft: 10, marginRight: 10}]}>
                      {t('addProduct')}
                    </StyledText>
                    <IonIcon
                      name={'arrow-forward-circle-outline'}
                      size={32}
                      color={mainThemeColor}
                    />
                  </TouchableOpacity>}
                {client?.localClientStatus?.noElectronicInvoice &&
                  <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', width: '100%', maxWidth: 640, justifyContent: 'space-between', marginBottom: 8}} onPress={() => this.props.navigation.navigate('EinvoiceStatusScreen')}>
                    <StyledText style={[{marginLeft: 10, marginRight: 10}]}>
                      {t('addElectronicInvoice')}
                    </StyledText>
                    <IonIcon
                      name={'arrow-forward-circle-outline'}
                      size={32}
                      color={mainThemeColor}
                    />
                  </TouchableOpacity>}
                {client?.localClientStatus?.noPrinter &&
                  <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', width: '100%', maxWidth: 640, justifyContent: 'space-between', marginBottom: 8}} onPress={() => this.props.navigation.navigate('PrinterAdd')}>
                    <StyledText style={[{marginLeft: 10, marginRight: 10}]}>
                      {t('addPrinter')}
                    </StyledText>
                    <IonIcon
                      name={'arrow-forward-circle-outline'}
                      size={32}
                      color={mainThemeColor}
                    />
                  </TouchableOpacity>}
                {client?.localClientStatus?.noWorkingArea &&
                  <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', width: '100%', maxWidth: 640, justifyContent: 'space-between', marginBottom: 8}} onPress={() => this.props.navigation.navigate('WorkingAreaAdd', {dataArr: printers})}>
                    <StyledText style={[{marginLeft: 10, marginRight: 10}]}>
                      {t('addWorkingArea')}
                    </StyledText>
                    <IonIcon
                      name={'arrow-forward-circle-outline'}
                      size={32}
                      color={mainThemeColor}
                    />
                  </TouchableOpacity>}


              </View>}
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
  shiftStatus: state.shift.data.shiftStatus,
  client: state.client.data,
  printers: state.printers.data.printers,
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getCurrentClient: () => dispatch(getCurrentClient()),
  getCurrentUser: name => dispatch(getClientUsr(name)),
  doLogout: () => {
    dispatch(doLogout())
  },
  getAnnouncements: () => dispatch(getAnnouncements()),
  getShiftStatus: () => dispatch(getShiftStatus()),
  getPrinters: () => dispatch(getPrinters()),
})

LoginSuccessScreen = reduxForm({
  form: 'readGlobalAnnouncementsForm'
})(LoginSuccessScreen)

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
        style={{
          margin: 0, flex: 1,
        }}
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
                this.props.navigation.navigate('ClientUsers')
              }}
            >
              <Text style={complexTheme[theme].overlay}>
                {t('changeUser')}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
}

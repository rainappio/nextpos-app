import React from 'react'
import "intl";
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  AsyncStorage,
  YellowBox,
  Dimensions,
  LogBox,
  Alert
} from 'react-native';
if (Platform.OS === "android") {
  // See https://github.com/expo/expo/issues/6536 for this issue.
  if (typeof Intl.__disableRegExpRestore === "function") {
    Intl.__disableRegExpRestore();
  }
}
import "intl/locale-data/jsonp/en";


import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import AppLoading from 'expo-app-loading'
import {Asset} from 'expo-asset'
import * as Font from 'expo-font'
import {Icon, Ionicons} from '@expo/vector-icons'
import {canClockIn, doLoggedIn} from './actions'
import AppNavigator from './navigation/AppNavigator'
import styles from './styles'
import * as Localization from 'expo-localization'
import i18n from 'i18n-js'
import globalEn from './locales/en'
import globalZh from './locales/zh'
import FlashMessage from 'react-native-flash-message'
import {LocaleContext} from './locales/LocaleContext'
import NavigationService from "./navigation/NavigationService";
import * as Sentry from 'sentry-expo';
import Constants from "expo-constants/src/Constants";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import {activateKeepAwake, useKeepAwake} from "expo-keep-awake";
import TimeZoneService from "./helpers/TimeZoneService";
import {complexTheme, ThemeContext, themes} from "./themes/ThemeContext";
import {getTheme, storeTheme} from "./helpers/contextHelper";

import * as Device from 'expo-device';
import * as ScreenOrientation from 'expo-screen-orientation';
import {checkExpoUpdate} from "./helpers/updateAppHelper";
import {api, dispatchFetchRequest} from './constants/Backend'

export let currentLocale = ""

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested', // TODO: Remove when fixed
  'Warning: componentWillReceiveProps',
  'Warning: componentWillMount'
]);

Sentry.init({
  dsn: 'https://b5c10cbde6414c0292495c58e7b699d3@sentry.io/5174447',
  enableInExpoDevelopment: true,
  debug: true
});

Sentry.setRelease(Constants.manifest.revisionId);

export const store = createStore(
  rootReducer,
  {},
  composeWithDevTools(applyMiddleware(thunk))
)

TaskManager.defineTask('geoFencingTask', async ({data: {eventType, region}, error}) => {
  if (error) {
    console.error(error)
    // check `error.message` for more details.
    return;
  }

  let enterRegion = false

  if (eventType === Location.GeofencingEventType.Enter) {
    console.log("GeoFencing - enter region:", region);
    enterRegion = true

  } else if (eventType === Location.GeofencingEventType.Exit) {
    console.log("GeoFencing - left region:", region);
    enterRegion = false
  }

  store.dispatch(canClockIn(enterRegion))
});

function restoreAuth(dispatch) {
  try {
    AsyncStorage.getItem('token').then(val => {
      if (!val) {
        return Promise.resolve()
      } else {
        dispatch(doLoggedIn(val))
      }
    })
  } catch (e) {
    return Promise.resolve()
  }
}
restoreAuth(store.dispatch)


export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoadingComplete: false,
      locale: Localization.locale,
      localeResource: {
        en: globalEn,
        zh: globalZh
      },
      localize: this.mergeLocaleResource,
      t: this.t,
      changeLanguage: this.changeLanguage,

      // theme
      theme: 'light',
      themeStyle: themes.light,
      reverseThemeStyle: themes.dark,
      complexTheme: complexTheme.light,
      toggleTheme: this.toggleTheme,
      splitOrderId: null,
      saveSplitOrderId: this.saveSplitOrderId,
      splitParentOrderId: null,
      saveSplitParentOrderId: this.saveSplitParentOrderId,
      disableReload: false,
      setDisableReload: this.setDisableReload,
      appType: 'store',
      changeAppType: this.changeAppType,
      getAppType: this.getAppType,
      customMainThemeColor: '#f18d1a',
      changeCustomMainThemeColor: this.changeCustomMainThemeColor,
      customSecondThemeColor: '#f18d1a',
      customBackgroundColor: '#fff',
      customBorderColor: '#e7e7e7',
      customTabBarBackgroundColor: '#fff',
      customTabBarIconColor: '#808080'
    }

    TimeZoneService.setClientReference(() => store.getState().client)

    i18n.fallbacks = true
    i18n.locale = Localization.locale
    i18n.translations = {en: {...globalEn}, zh: {...globalZh}}
  }

  //if isTablet===2:keep screen in landscape mode; else:keep screen in portrait mode
  changeScreenOrientation = async (isTablet) => {
    if (isTablet === 2) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    } else {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    }
  }

  async componentDidMount() {
    getTheme().then(async (theme) => {
      const themeStyle = theme === 'light' ? themes.light : themes.dark
      const reverseThemeStyle = theme === 'light' ? {...themes.light, borderColor: 'black'} : themes.light
      const isTablet = await Device.getDeviceTypeAsync();// 1=PHONE 2=TABLET
      this.changeScreenOrientation(isTablet);
      this.setState({
        theme: theme,
        themeStyle: themeStyle,
        reverseThemeStyle: reverseThemeStyle,
        complexTheme: complexTheme[theme],
        isTablet: (isTablet !== 1)
      })
    })
    this.checkCustomTheme()
    this.initSplitOrderId()
    this.initSplitParentOrderId()


    checkExpoUpdate(this.state?.disableReload, this.setDisableReload)
  }



  mergeLocaleResource = async locales => {
    const updatedLocaleResource = {
      en: {
        ...this.state.localeResource.en,
        ...locales.en
      },
      zh: {
        ...this.state.localeResource.zh,
        ...locales.zh
      }
    }

    i18n.translations = {
      en: updatedLocaleResource.en,
      zh: updatedLocaleResource.zh
    }

    await this.promisedSetState({
      localeResource: updatedLocaleResource
    })
  }

  /**
   * Example of setting state using await:
   * https://medium.com/horizon-alpha/await-setstate-in-react-native-631d182e8738
   */
  promisedSetState = newState => {
    return new Promise(resolve => {
      this.setState(newState, () => {
        resolve()
      })
    })
  }

  /**
   * Function to merge global localization with screen specific localization.
   *
   * Reference (expo-localization, i18n-js):
   * https://docs.expo.io/versions/v35.0.0/sdk/localization/
   * https://reactnavigation.org/docs/en/localization.html
   * https://medium.com/@nicolas.kovacs/react-native-localize-and-i18n-js-117f09428017
   *
   * react-i18next (another implementation)
   */
  localize = locales => this.mergeLocaleResource(locales)

  changeLanguage = () => {
    let toLocale = this.state.locale === 'zh-Hant-TW' ? 'en-TW' : 'zh-Hant-TW'
    console.log(`Default locale: ${Localization.locale}, current locale: ${this.state.locale}, changing to ${toLocale}`)

    this.setState({locale: toLocale})

    currentLocale = toLocale
  }

  t = (scope, options) => {
    return i18n.t(scope, {locale: this.state.locale, ...options})
  }


  changeCustomMainThemeColor = async (color = '#f18d1a') => {
    if (color === '#f18d1a') {
      await AsyncStorage.setItem('customTheme', JSON.stringify({customMainThemeColor: '#f18d1a', customSecondThemeColor: '#f18d1a', customBackgroundColor: '#fff', customBorderColor: '#e7e7e7', customTabBarBackgroundColor: '#fff', customTabBarIconColor: '#808080'}))
      this.setState({customMainThemeColor: '#f18d1a', customSecondThemeColor: '#f18d1a', customBackgroundColor: '#fff', customBorderColor: '#e7e7e7', customTabBarBackgroundColor: '#fff', customTabBarIconColor: '#808080'})
      if (this.state.theme === 'dark') {

        this.toggleTheme()
      } else {

      }
    } else if (color === '#006B35') {
      await AsyncStorage.setItem('customTheme', JSON.stringify({customMainThemeColor: color, customSecondThemeColor: '#FF6915', customBackgroundColor: '#FFFFF5', customBorderColor: '#006B35', customTabBarBackgroundColor: '#006B35', customTabBarIconColor: '#FFFFF5'}))
      this.setState({customMainThemeColor: color, customSecondThemeColor: '#FF6915', customBackgroundColor: '#FFFFF5', customBorderColor: '#006B35', customTabBarBackgroundColor: '#006B35', customTabBarIconColor: '#FFFFF5'})
      if (this.state.theme === 'dark') {

        this.toggleTheme()
      } else {

      }
    } else if (color === '#000') {
      await AsyncStorage.setItem('customTheme', JSON.stringify({customMainThemeColor: '#f18d1a', customSecondThemeColor: '#f18d1a', customBackgroundColor: '#222222', customBorderColor: '#e7e7e7', customTabBarBackgroundColor: '#222222', customTabBarIconColor: '#808080'}))
      this.setState({customMainThemeColor: '#f18d1a', customSecondThemeColor: '#f18d1a', customBackgroundColor: '#222222', customBorderColor: '#e7e7e7', customTabBarBackgroundColor: '#222222', customTabBarIconColor: '#808080'})
      if (this.state.theme === 'light') {

        this.toggleTheme()
      } else {

      }
    }

  }


  checkCustomTheme = async () => {
    try {
      AsyncStorage.getItem('customTheme').then(val => {
        if (!val) {
          return Promise.resolve()
        } else {
          let data = JSON.parse(val)
          this.setState({
            customMainThemeColor: data?.customMainThemeColor,
            customSecondThemeColor: data?.customSecondThemeColor,
            customBackgroundColor: data?.customBackgroundColor,
            customBorderColor: data?.customBorderColor,
            customTabBarBackgroundColor: data?.customTabBarBackgroundColor,
            customTabBarIconColor: data?.customTabBarIconColor
          })
        }
      })
    } catch (e) {
      return Promise.resolve()
    }

  }

  changeAppType = () => {
    dispatchFetchRequest(api.client.changeClientType, {
      method: 'PATCH',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({clientType: this.state?.appType === 'store' ? 'RETAIL' : 'FOOD_BEVERAGE'})
    },
      response => {
        response.json().then(data => {
          this.setState({appType: data?.clientType === 'RETAIL' ? 'retail' : 'store'})
        })
      }).then()
  }

  getAppType = (successCallback = null) => {
    dispatchFetchRequest(
      api.client.get,
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {

          this.setState({appType: data?.clientType === 'RETAIL' ? 'retail' : 'store'})
          !!successCallback && successCallback()
        })
      },
      response => {
      }
    ).then()
  }

  t = (scope, options) => {
    return i18n.t(scope, {locale: this.state.locale, ...options})
  }

  toggleTheme = () => {
    const theme = this.state.theme === 'light' ? 'dark' : 'light'
    const themeStyleToChange = this.state.themeStyle === themes.dark ? themes.light : themes.dark
    const reverseThemeStyle = theme === 'light' ? {...themes.light, borderColor: 'black'} : themes.light
    storeTheme(theme).then()
    this.setState({
      theme: theme,
      themeStyle: themeStyleToChange,
      reverseThemeStyle: reverseThemeStyle,
      complexTheme: complexTheme[theme]
    })
  }

  setDisableReload = (flag) => {
    this.setState({disableReload: flag})
  }

  initSplitParentOrderId = async () => {
    try {
      AsyncStorage.getItem('splitParentOrderId').then(val => {
        if (!val) {
          return Promise.resolve()
        } else {
          this.setState({
            splitParentOrderId: val
          })
        }
      })
    } catch (e) {
      return Promise.resolve()
    }
  }
  saveSplitParentOrderId = async (id = null) => {

    if (id === null) {
      await AsyncStorage.removeItem('splitParentOrderId')
    } else {
      await AsyncStorage.setItem('splitParentOrderId', id)
    }
    this.setState({
      splitParentOrderId: id
    })
  }

  initSplitOrderId = async () => {
    try {
      AsyncStorage.getItem('splitOrderId').then(val => {
        if (!val) {
          return Promise.resolve()
        } else {
          this.setState({
            splitOrderId: val
          })
        }
      })
    } catch (e) {
      return Promise.resolve()
    }
  }

  saveSplitOrderId = async (id = null) => {
    if (id === null) {
      await AsyncStorage.removeItem('splitOrderId')
    } else {
      await AsyncStorage.setItem('splitOrderId', id)
    }
    this.setState({
      splitOrderId: id
    })
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      )
    } else {
      activateKeepAwake()

      return (
        <Provider store={store}>
          <View style={styles.mainContainer}>
            <StatusBar
              translucent={true}
              hidden={false}
              barStyle="dark-content"
            />
            <ThemeContext.Provider value={{
              theme: this.state.theme,
              themeStyle: this.state.themeStyle,
              reverseThemeStyle: this.state.reverseThemeStyle,
              complexTheme: this.state.complexTheme,
              toggleTheme: this.state.toggleTheme,
              isTablet: this.state.isTablet,
              splitOrderId: this.state?.splitOrderId,
              saveSplitOrderId: this.state.saveSplitOrderId,
              splitParentOrderId: this.state.splitParentOrderId,
              saveSplitParentOrderId: this.state.saveSplitParentOrderId,
              disableReload: this.state.disableReload,
              setDisableReload: this.state.setDisableReload,
              appType: this.state?.appType,
              changeAppType: this.state?.changeAppType,
              getAppType: this.state?.getAppType,
              customMainThemeColor: this.state?.customMainThemeColor,
              changeCustomMainThemeColor: this.state?.changeCustomMainThemeColor,
              customSecondThemeColor: this.state?.customSecondThemeColor,
              customBackgroundColor: this.state?.customBackgroundColor,
              customBorderColor: this.state?.customBorderColor,
              customTabBarBackgroundColor: this.state?.customTabBarBackgroundColor,
              customTabBarIconColor: this.state?.customTabBarIconColor
            }}>
              <LocaleContext.Provider value={this.state}>
                <AppNavigator
                  ref={navigatorRef => {
                    NavigationService.setTopLevelNavigator(navigatorRef);
                  }}
                  screenProps={{
                    t: this.t,
                    locale: this.state.locale,
                    localize: this.localize,
                    changeLanguage: this.changeLanguage,
                    themeStyle: this.state.themeStyle,
                    reverseThemeStyle: this.state.reverseThemeStyle,
                    appType: this.state?.appType,
                    changeAppType: this.state?.changeAppType,
                    getAppType: this.state?.getAppType,
                    customMainThemeColor: this.state?.customMainThemeColor,
                    changeCustomMainThemeColor: this.state?.changeCustomMainThemeColor,
                    customSecondThemeColor: this.state?.customSecondThemeColor,
                    customBackgroundColor: this.state?.customBackgroundColor,
                    customBorderColor: this.state?.customBorderColor,
                    customTabBarBackgroundColor: this.state?.customTabBarBackgroundColor,
                    customTabBarIconColor: this.state?.customTabBarIconColor
                  }}
                />
              </LocaleContext.Provider>
            </ThemeContext.Provider>
            {/*https://www.npmjs.com/package/react-native-flash-message?activeTab=readme*/}
            <FlashMessage position="bottom" />
          </View>
        </Provider>
      )
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png')
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        antoutline: require('@ant-design/icons-react-native/fonts/antoutline.ttf')
      })
    ])
  }

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error)
  }

  _handleFinishLoading = () => {
    this.setState({isLoadingComplete: true})
  }
}

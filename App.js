import React from 'react'
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  AsyncStorage,
  YellowBox
} from 'react-native'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import { AppLoading } from 'expo'
import { Asset } from 'expo-asset'
import * as Font from 'expo-font'
import { Icon, Ionicons } from '@expo/vector-icons'
import { doLoggedIn } from './actions'
import AppNavigator from './navigation/AppNavigator'
import styles from './styles'
import * as Localization from 'expo-localization'
import i18n from 'i18n-js'
import globalEn from './locales/en'
import globalZh from './locales/zh'
import FlashMessage from 'react-native-flash-message'
import { LocaleContext } from './locales/LocaleContext'
import NavigationService from "./navigation/NavigationService";
import * as Sentry from 'sentry-expo';
import Constants from "expo-constants/src/Constants";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import {activateKeepAwake, useKeepAwake} from "expo-keep-awake";
import TimeZoneService from "./helpers/TimeZoneService";

YellowBox.ignoreWarnings([
  'VirtualizedLists should never be nested', // TODO: Remove when fixed
  'Warning: componentWillReceiveProps',
  'Warning: componentWillMount'
])

Sentry.init({
  dsn: 'https://b5c10cbde6414c0292495c58e7b699d3@sentry.io/5174447',
  enableInExpoDevelopment: true,
  debug: true
});

Sentry.setRelease(Constants.manifest.revisionId);

const store = createStore(
  rootReducer,
  {},
  composeWithDevTools(applyMiddleware(thunk))
)

TaskManager.defineTask('geoFencingTask', async ({ data: { eventType, region }, error }) => {
  if (error) {
    console.error(error)
    // check `error.message` for more details.
    return;
  }

  let canClockIn = "false"

  if (eventType === Location.GeofencingEventType.Enter) {
    console.log("GeoFencing - enter region:", region);
    canClockIn = "true"
  } else if (eventType === Location.GeofencingEventType.Exit) {
    console.log("GeoFencing - left region:", region);
    canClockIn = "false"
  }

  await AsyncStorage.setItem('canClockIn', canClockIn)
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
      client: () => store.getState().client
    }

    TimeZoneService.setClientReference(() => store.getState().client)

    i18n.fallbacks = true
    i18n.locale = Localization.locale
    i18n.translations = { en: { ...globalEn }, zh: { ...globalZh } }
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
    console.log(
      `Default locale: ${Localization.locale}, current locale: ${this.state.locale}, changing to ${toLocale}`
    )

    this.setState({ locale: toLocale })
  }

  t = (scope, options) => {
    return i18n.t(scope, { locale: this.state.locale, ...options })
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
            <LocaleContext.Provider value={this.state}>
              <AppNavigator
                ref={navigatorRef => {
                  NavigationService.setTopLevelNavigator(navigatorRef);
                }}
                screenProps={{
                  t: this.t,
                  locale: this.state.locale,
                  localize: this.localize,
                  changeLanguage: this.changeLanguage
                }}
              />
            </LocaleContext.Provider>
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
    this.setState({ isLoadingComplete: true })
  }
}

import React from 'react'
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  AsyncStorage
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
import * as Localization from "expo-localization";
import i18n from 'i18n-js';
import globalEn from "./locales/en"
import globalZh from "./locales/zh"


const store = createStore(
  rootReducer,
  {},
  composeWithDevTools(applyMiddleware(thunk))
)

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
    super(props);

    this.state = {
      isLoadingComplete: false,
      locale: Localization.locale
    }

    i18n.fallbacks = true;
    i18n.locale = Localization.locale;
    i18n.translations = { en: {...globalEn}, zh: {...globalZh} };
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
   * @param locale
   */
  localize = (locale) => {
    const en = { ...globalEn, ...locale.en }
    const zh = { ...globalZh, ...locale.zh }

    i18n.translations = { en, zh };
  }

  changeLanguage = () => {
    let locale = this.state.locale === 'zh-TW' ? 'en-TW' : 'zh-TW';
    console.log(`Change to ${locale}`);

    this.setState({ locale });
  };

  t = (scope, options) => {
    return i18n.t(scope, { locale: this.state.locale, ...options });
  };

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
      return (
        <Provider store={store}>
          <View style={styles.mainContainer}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            <AppNavigator screenProps={{
              t: this.t,
              locale: this.state.locale,
              localize: this.localize,
              changeLanguage: this.changeLanguage,
            }}/>
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

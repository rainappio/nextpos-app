import React from 'react'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlight,
  AsyncStorage
} from 'react-native'
import { WebBrowser } from 'expo'
import { connect } from 'react-redux'
import HomeScreen from './HomeScreen'
import CreateAccScreen from './CreateAccScreen'
import { MonoText } from '../components/StyledText'
import styles from '../styles'
import { doLogout } from '../actions'

class IntroAppScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);

    this.props.screenProps.localize({
      en: {
        createAccount: 'Create Account',
        signIn: 'Sign In'
      },
      zh: {
        createAccount: '註冊新帳號',
        signIn: '登入'
      }
    })
  }

  isTokenAlive = () => {
    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        return JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      if (tokenObj !== null && tokenObj.tokenExp > Date.now()) {
        this.props.navigation.navigate('LoginSuccess')
      } else if (tokenObj == null) {
        this.props.dispatch(doLogout())
        this.props.navigation.navigate('Login')
      } else {
        this.props.dispatch(doLogout())
        this.props.navigation.navigate('Login')
      }
    })
  }

  render() {
    let {t} = this.props.screenProps;

    return (
      <View style={styles.container}>
        <View style={[{ position: 'absolute', top: 10 }]}>
          <Image
            source={
              __DEV__
                ? require('../assets/images/logo.png')
                : require('../assets/images/logo.png')
            }
            style={styles.welcomeImage}
          />
        </View>
        <Text style={styles.welcomeText}>Simplify</Text>
        <Text style={styles.welcomeText}>Your</Text>
        <Text style={styles.welcomeText}>Selling</Text>

        <View
          style={[
            {
              width: '100%',
              backgroundColor: '#F39F86',
              position: 'absolute',
              bottom: 48,
              borderRadius: 4
            }
          ]}
        >
          <TouchableHighlight
            onPress={() => this.props.navigation.navigate('CreateAcc')}
          >
            <Text style={styles.gsText}>{t('createAccount')}</Text>
          </TouchableHighlight>
        </View>

        <View
          style={[
            {
              width: '100%',
              position: 'absolute',
              bottom: 0,
              borderRadius: 4,
              borderWidth: 1,
              borderColor: '#F39F86'
            }
          ]}
        >
          <TouchableHighlight onPress={this.isTokenAlive}>
            <Text style={styles.signInText}>{t('signIn')}</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}
const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(
  null,
  mapDispatchToProps
)(IntroAppScreen)

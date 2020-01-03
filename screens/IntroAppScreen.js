import React from 'react'
import {
  Image,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  AsyncStorage
} from 'react-native'
import { connect } from 'react-redux'
import styles from '../styles'
import { doLogout } from '../actions'

class IntroAppScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props)

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

  isTokenAlive = async () => {
    let token = await AsyncStorage.getItem('clientusrToken')

    if (token == null) {
      token = await AsyncStorage.getItem('token')
    }

    const tokenObj = JSON.parse(token)

    if (tokenObj !== null && tokenObj.tokenExp > Date.now()) {
      this.props.navigation.navigate('LoginSuccess')
    } else if (tokenObj == null) {
      this.props.dispatch(doLogout())
      this.props.navigation.navigate('Login')
    } else {
      this.props.dispatch(doLogout())
      this.props.navigation.navigate('Login')
    }
  }

  render() {
    let { t } = this.props.screenProps

    return (
      <View style={styles.container}>
        <View style={{ flex: 3, justifyContent: 'center' }}>
          <View style={[{ position: 'absolute', top: 0 }]}>
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
        </View>

        <View style={[styles.bottom]}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('CreateAcc')}
          >
            <Text style={[styles.bottomActionButton, styles.actionButton]}>
              {t('createAccount')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.isTokenAlive}>
            <Text style={[styles.bottomActionButton, styles.cancelButton]}>
              {t('signIn')}
            </Text>
          </TouchableOpacity>
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

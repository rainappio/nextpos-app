import React from 'react'
import {Image, Text, TouchableOpacity, View} from 'react-native'
import {connect} from 'react-redux'
import styles from '../styles'
import {doLogout} from '../actions'
import {getToken} from "../constants/Backend";
import {LocaleContext} from "../locales/LocaleContext";
import {ThemeContainer} from "../components/ThemeContainer";
import {StyledText} from "../components/StyledText";

class IntroAppScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
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
    const tokenObj = await getToken()

    if (tokenObj !== null && tokenObj.tokenExp > Date.now()) {
      this.props.navigation.navigate('LoginSuccess')
    } else {
      this.props.dispatch(doLogout())
      this.props.navigation.navigate('Login')
    }
  }

  render() {
    let {t} = this.context

    return (
      <ThemeContainer>
        <View style={styles.container}>
          <View style={{flex: 1}}>
            <View>
              <Image
                source={
                  __DEV__
                    ? require('../assets/images/logo.png')
                    : require('../assets/images/logo.png')
                }
                style={styles.welcomeImage}
              />
            </View>
          </View>

          <View style={styles.flex(2)}>
            <StyledText style={styles.welcomeText}>Simplify</StyledText>
            <StyledText style={styles.welcomeText}>Your</StyledText>
            <StyledText style={styles.welcomeText}>Selling</StyledText>
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
      </ThemeContainer>
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

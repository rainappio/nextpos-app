import React from 'react'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlight
} from 'react-native'
import { connect } from 'react-redux'
import { isTablet } from '../actions'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      t: context.t
    }
  }

  componentDidMount() {
    this.context.localize({
      en: {
        getStarted: 'Get Started'
      },
      zh: {
        getStarted: '開始'
      }
    })
  }

  render() {
    let { t } = this.state

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
              style={[styles.welcomeImage]}
              width={isTablet ? 200 : 40}
            />
          </View>
          <Text style={isTablet ? [styles.welcomeText, styles.tabletTextBig, styles.mgrbtn40] : [styles.welcomeText]}>Quickly</Text>
          <Text style={isTablet ? [styles.welcomeText, styles.tabletTextBig, styles.mgrbtn40] : [styles.welcomeText]}>Easily</Text>
          <Text style={isTablet ? [styles.welcomeText, styles.tabletTextBig, styles.mgrbtn40] : [styles.welcomeText]}>Securely</Text>
        </View>

        <View style={styles.bottom}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Intro')}
          >
            <Text style={isTablet ? [styles.bottomActionButton, styles.actionButton, styles.tabletTextMedium, styles.paddingTopBtn15] : [styles.bottomActionButton, styles.actionButton]}>
              {t('getStarted')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

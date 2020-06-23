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
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
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
    let { t, theme } = this.context

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
          <Text style={[styles.welcomeText, { color: theme.foreground }]}>Quickly</Text>
          <Text style={[styles.welcomeText, { color: theme.foreground }]}>Easily</Text>
          <Text style={[styles.welcomeText, { color: theme.foreground }]}>Securely</Text>
        </View>

        <View style={styles.bottom}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Intro')}
          >
            <Text style={[styles.bottomActionButton, styles.actionButton]}>
              {t('getStarted')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

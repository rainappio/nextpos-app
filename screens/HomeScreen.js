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
      <View style={[styles.container, styles.nomgrBottom]}>
        <View style={{ flex: 3, justifyContent: 'center' }}>
          <View style={[{ position: 'absolute', top: 0 }]}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/logo.png')
                  : require('../assets/images/logo.png')
              }
              style={[styles.welcomeImage]}
            />
          </View>
          <Text style={styles.welcomeText}>Quickly</Text>
          <Text style={styles.welcomeText}>Easily</Text>
          <Text style={styles.welcomeText}>Securely</Text>
        </View>
        
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Intro')}
          style={[styles.jc_alignIem_center, styles.mgrbtn40]}
        >
          <Text style={[styles.bottomActionButton, styles.actionButton]}>
            {t('getStarted')}
          </Text>
        </TouchableOpacity>        
      </View>
    )
  }
}

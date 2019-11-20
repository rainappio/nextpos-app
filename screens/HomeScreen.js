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

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);

    this.props.screenProps.localize({
      en: {
        getStarted: 'Get Started'
      },
      zh: {
          getStarted: '開始'
        }
      }
    );
  }

  render() {
    let {t} = this.props.screenProps;

    return (
      <View style={styles.container}>
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
        <Text style={styles.welcomeText}>Quickly</Text>
        <Text style={styles.welcomeText}>Easily</Text>
        <Text style={styles.welcomeText}>Securely</Text>

        <View
          style={[
            {
              width: '100%',
              backgroundColor: '#F39F86',
              position: 'absolute',
              bottom: 0,
              borderRadius: 4
            }
          ]}
        >
          <TouchableHighlight
            onPress={() => this.props.navigation.navigate('Intro')}
          >
            <Text style={styles.gsText}>{t('getStarted')}</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

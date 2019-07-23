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
import styles from '../styles'

export default class IntroAppScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
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
            <Text style={styles.gsText}>Create Account</Text>
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
          <TouchableHighlight
            onPress={() => this.props.navigation.navigate('Login')}
          >
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

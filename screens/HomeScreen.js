import React from 'react'
import {Image, Text, TouchableOpacity, View} from 'react-native'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import {ThemeContainer} from "../components/ThemeContainer";
import {StyledText} from "../components/StyledText";

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
            <StyledText style={styles.welcomeText}>Quickly</StyledText>
            <StyledText style={styles.welcomeText}>Easily</StyledText>
            <StyledText style={styles.welcomeText}>Securely</StyledText>
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
      </ThemeContainer>
    )
  }
}

import styles from '../styles'
import {Text, TouchableOpacity, View} from 'react-native'
import React from 'react'
import { LocaleContext } from '../locales/LocaleContext'
import BackBtn from '../components/BackBtn'
import {withNavigation} from "react-navigation";

// todo: use this on all screens that need to show backend error.
class BackendErrorScreen extends React.Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        errorScreenTitle: 'Error',
        errorMessage:
          'There is an issue with your request. Please try to login again, or consult your service provider.'
      },
      zh: {
        errorScreenTitle: '錯誤',
        errorMessage: '您的請求有問題，請試著重新登入，或詢問你的軟體供應商.'
      }
    })
  }

  render() {
    const { t } = this.context

    return (
      <View style={[styles.container, { justifyContent: 'space-between' }]}>
        <View style={{ flex: 1 }}>
          <BackBtn />
          <Text style={styles.screenTitle}>{t('errorScreenTitle')}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text>{t('errorMessage')}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'flex-end'}}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Login')}
          >
            <Text style={[styles.bottomActionButton, styles.actionButton]}>
              {t('login')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default withNavigation(BackendErrorScreen)

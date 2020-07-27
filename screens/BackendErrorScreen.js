import styles from '../styles'
import {Text, TouchableOpacity, View} from 'react-native'
import React from 'react'
import {LocaleContext} from '../locales/LocaleContext'
import {withNavigation} from "react-navigation";
import {ThemeContainer} from "../components/ThemeContainer";
import {StyledText} from "../components/StyledText";
import ScreenHeader from "../components/ScreenHeader";

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
    const {t} = this.context

    return (
      <ThemeContainer>
        <View style={[styles.container]}>
          <ScreenHeader backNavigation={false}
                        title={t('errorScreenTitle')}/>

          <View>
            <StyledText style={styles.messageBlock}>{t('errorMessage')}</StyledText>
          </View>
          <View style={styles.bottom}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Login')}
            >
              <Text style={[styles.bottomActionButton, styles.actionButton]}>
                {t('login')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ThemeContainer>
    )
  }
}

export default withNavigation(BackendErrorScreen)

import styles from '../styles'
import { Text, View } from 'react-native'
import React from 'react'
import {LocaleContext} from "../locales/LocaleContext";
import BackBtn from "../components/BackBtn";

// todo: use this on all screens that need to show backend error.
export default class BackendErrorScreen extends React.Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        errorScreenTitle: 'Error',
        errorMessage: 'There is an issue with your request. Please consult your service provider.'
      },
      zh: {
        errorScreenTitle: '錯誤',
        errorMessage: '您的請求有問題，請詢問你的軟體供應商.'
      }
    })

    this.state = {
      t: context.t
    }
  }


  render() {
    const { t } = this.state

    return (
      <View style={[styles.container, {justifyContent: 'space-between'}]}>
        <View style={{flex: 1}}>
          <BackBtn />
          <Text style={styles.screenTitle}>
            {t('errorScreenTitle')}
          </Text>
        </View>
        <Text style={{flex: 2}}>
          {t('errorMessage')}
        </Text>
      </View>
    )
  }
}

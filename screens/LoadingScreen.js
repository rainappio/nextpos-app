import styles from '../styles'
import { ActivityIndicator, View } from 'react-native'
import React from 'react'
import { LocaleContext } from '../locales/LocaleContext'


export default class LoadingScreen extends React.Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }

  render() {
    return (
      <View style={[styles.container, this.context.theme]}>
        <ActivityIndicator size="small" color="#ccc" />
      </View>
    )
  }
}

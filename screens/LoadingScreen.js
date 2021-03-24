import styles from '../styles'
import {ActivityIndicator, View} from 'react-native'
import React from 'react'
import {LocaleContext} from '../locales/LocaleContext'
import {withContext} from "../helpers/contextHelper";


class LoadingScreen extends React.Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }

  render() {
    const {theme, themeStyle} = this.props
    const {customMainThemeColor, customBackgroundColor} = this.context
    const spinColor = customMainThemeColor
    return (
      <View style={[styles.mainContainer, {justifyContent: 'center'}, themeStyle, {backgroundColor: customBackgroundColor}]}>
        <ActivityIndicator size="small" color={spinColor} />
      </View>
    )
  }
}

export default withContext(LoadingScreen)

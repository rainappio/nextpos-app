import styles from '../styles'
import {ActivityIndicator, View} from 'react-native'
import React from 'react'
import {LocaleContext} from '../locales/LocaleContext'
import {withContext} from "../helpers/contextHelper";


class BlankScreen extends React.Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }

  render() {
    const {themeStyle} = this.props
    const {customMainThemeColor, customBackgroundColor} = this.context

    return (
      <View style={[styles.mainContainer, {justifyContent: 'center'}, themeStyle, {backgroundColor: customBackgroundColor}]}>
      </View>
    )
  }
}

export default withContext(BlankScreen)

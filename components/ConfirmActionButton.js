import React from 'react'
import {Alert, Text, TouchableOpacity} from 'react-native'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'

class ConfirmActionButton extends React.Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props)
  }

  render() {
    const {handleConfirmAction, params, buttonTitle} = this.props
    const {t, customMainThemeColor} = this.context

    return (
      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            `${t('action.confirmMessageTitle')}`,
            `${t('action.confirmMessage')}`,
            [
              {
                text: `${t('action.yes')}`,
                onPress: () => handleConfirmAction(params)
              },
              {
                text: `${t('action.no')}`,
                onPress: () => console.log('Cancelled'),
                style: 'cancel'
              }
            ]
          )
        }}
      >
        <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
          {t(buttonTitle)}
        </Text>
      </TouchableOpacity>
    )
  }
}

export default ConfirmActionButton

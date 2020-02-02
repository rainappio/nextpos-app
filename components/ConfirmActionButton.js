import React from 'react'
import { Alert, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'

class ConfirmActionButton extends React.Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props)

    this.state = {
      t: context.t
    }
  }

  render() {
    const { handleConfirmAction, params, buttonTitle } = this.props
    const { t } = this.state

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
        style={styles.jc_alignIem_center}
      >
        <Text style={[styles.bottomActionButton, styles.actionButton]}>
          {t(buttonTitle)}
        </Text>
      </TouchableOpacity>
    )
  }
}

export default ConfirmActionButton

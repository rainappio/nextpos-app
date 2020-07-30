import React from 'react'
import {Alert, Text, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'

class DeleteBtn extends React.Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props)

    // https://www.freecodecamp.org/news/react-changing-state-of-child-component-from-parent-8ab547436271/
    this.deletePopUpReference = React.createRef()
  }

  showDeletePopUp = () => {
    this.deletePopUpReference.current.toggleModal(true)
  }

  render() {
    const {
      handleDeleteAction,
      params,
      islineItemDelete,
      disabled
    } = this.props
    const { t } = this.context

    return (
      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            `${t('action.confirmMessageTitle')}`,
            `${t('action.confirmMessage')}`,
            [
              {
                text: `${t('action.yes')}`,
                onPress: () => handleDeleteAction(params)
              },
              {
                text: `${t('action.no')}`,
                onPress: () => console.log('Cancelled'),
                style: 'cancel'
              }
            ]
          )
        }}
        disabled={disabled}
      >
        {islineItemDelete ? (
          <Icon
            name="md-trash"
            size={30}
            color="#fff"
          />
        ) : (
          <Text style={[styles.bottomActionButton, styles.deleteButton]}>
            {t('action.delete')}
          </Text>
        )}
      </TouchableOpacity>
    )
  }
}

export default DeleteBtn

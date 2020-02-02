import React from 'react'
import { Alert, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import { isTablet } from '../actions'

class DeleteBtn extends React.Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props)

    this.state = {
      t: context.t
    }

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
            size={isTablet ? 50 : 25}
            color="#fff"
            // style={{textAlign: 'right', backgroundColor: 'pink'}}
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

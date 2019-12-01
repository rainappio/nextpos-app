import React from 'react'
import {Alert, Text, TouchableOpacity} from 'react-native'
import styles from '../styles'
import GenericPopUp from './GenericPopUp'

class DeleteBtn extends React.Component {
  constructor(props) {
    super(props)

    // https://www.freecodecamp.org/news/react-changing-state-of-child-component-from-parent-8ab547436271/
    this.deletePopUpReference = React.createRef()
  }

  showDeletePopUp = () => {
    this.deletePopUpReference.current.toggleModal(true)
  }

  render() {
    const { handleDeleteAction, params } = this.props
    const { t } = this.props.screenProps

    return (
      <TouchableOpacity
        onPress={() => {
          Alert.alert(`${t('action.confirmMessageTitle')}`, `${t('action.confirmMessage')}`,
            [{text: `${t('action.yes')}`, onPress: () => handleDeleteAction(params)},
              {text: `${t('action.no')}`, onPress: () => console.log("Cancelled"), style: 'cancel'}
            ])
        }}
        style={[
          {
            width: '100%',
            borderRadius: 4,
            borderWidth: 1,
            marginTop: 10,
            borderColor: '#F39F86'
          }
        ]}
      >
        <Text style={styles.signInText}>{t('action.delete')}</Text>
      </TouchableOpacity>
    )
  }
}

export default DeleteBtn

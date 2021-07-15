import {Alert} from 'react-native'
import i18n from 'i18n-js'

export const backAction = (navigation) => {
    Alert.alert(
        `${i18n.t('action.confirmMessageTitle')}`,
        `${i18n.t('action.confirmMessage')}`,
        [
            {
                text: `${i18n.t('action.yes')}`,
                onPress: () => navigation?.goBack()
            },
            {
                text: `${i18n.t('action.no')}`,
                onPress: () => console.log('Cancelled'),
                style: 'cancel'
            }
        ]
    )
}
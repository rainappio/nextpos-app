import {Alert} from 'react-native'
import * as Updates from 'expo-updates';
import i18n from 'i18n-js'
import {exp} from 'react-native-reanimated';

export const checkExpoUpdate = async (disableReload, setDisableReload) => {
    try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            !!disableReload || Alert.alert(
                `${i18n.t('updateExpo.haveUpdate')}`,
                `${i18n.t('updateExpo.msg')}`,
                [
                    {
                        text: `${i18n.t('action.yes')}`,
                        onPress: () => {
                            Updates.reloadAsync();
                        }
                    },
                    {
                        text: `${i18n.t('action.no')}`,
                        onPress: () => setDisableReload(true),
                        style: 'cancel'
                    }
                ]
            )
        }
        else {
            console.log('no update')
        }
    } catch (e) {
        console.log('error', e)
        // handle or log error
    }
}
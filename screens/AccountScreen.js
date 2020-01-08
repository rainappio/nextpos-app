import React from 'react'
import {
  ScrollView,
  Text,
  View,
  AsyncStorage,
  Button,
  Alert, TouchableOpacity
} from 'react-native'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import styles from '../styles'
import { Avatar, Badge, Divider } from 'react-native-elements'
import { LocaleContext } from '../locales/LocaleContext'

class AccountScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        username: 'User Name'
      },
      zh: {
        username: '使用者名稱'
      }
    })

    this.state = {
      t: context.t,
      objects: []
    }
  }

  /**
   * https://stackoverflow.com/questions/49809884/access-react-context-outside-of-render-function
   */
  async componentDidMount() {
    const objects = []
    let storedKeys = []

    await AsyncStorage.getAllKeys((error, keys) => {
      storedKeys = keys
    })

    for (const key of storedKeys) {
      const value = await AsyncStorage.getItem(key)
      objects.push({ key: key, value: value })
    }

    this.setState({
      objects: objects
    })
  }

  render() {
    const storageItems = this.state.objects.map(obj => {
      return (
        <View key={obj.key} style={styles.fieldContainer}>
          <Text style={[styles.fieldTitle, {flex: 2}]}>{obj.key}</Text>
          <TouchableOpacity onPress={() => Alert.alert('Value', obj.value, [{ text: 'Ok' }])}>
            <Text style={{flex: 1}}>Details</Text>
          </TouchableOpacity>
        </View>
      )
    })

    const { t } = this.state

    return (
      <ScrollView>
        <DismissKeyboard>
          <View style={styles.container}>
            <BackBtn />
            <Text
              style={[
                styles.welcomeText,
                styles.orange_color,
                styles.textMedium,
                styles.textBold
              ]}
            >
              {t('settings.account')}
            </Text>
            <View>
              <View style={[styles.fieldTitle, {flexDirection: 'row', justifyContent: 'space-between'}]}>
                <Avatar rounded title="RA" size="large" />
                <Text style={styles.text}>{t('username')}: </Text>
                <Text style={styles.text}>XXXX</Text>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldTitle}>Developer Section</Text>
              </View>
              <View>{storageItems}</View>
            </View>
          </View>
        </DismissKeyboard>
      </ScrollView>
    )
  }
}

export default AccountScreen

import React from 'react'
import {ScrollView, Text, View, AsyncStorage, Button, Alert} from 'react-native'
import {DismissKeyboard} from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import styles from '../styles'
import {Avatar, Badge, Divider} from "react-native-elements";
import {LocaleContext} from '../locales/LocaleContext'

class AccountScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  static contextType = LocaleContext

  constructor(props) {
    super(props);

    this.state = {
      objects: []
    }
  }

  /**
   * https://stackoverflow.com/questions/49809884/access-react-context-outside-of-render-function
   */
  async componentDidMount() {
    this.context.localize({
        en: {
          username: 'User Name'
        },
        zh: {
          username: '使用者名稱'
        }
      }
    )

    const objects = []
    let storedKeys = []

    await AsyncStorage.getAllKeys((error, keys) => {
      storedKeys = keys
    })

    for (const key of storedKeys) {
      const value = await AsyncStorage.getItem(key);
      objects.push({key: key, value: value})
    }

    this.setState({
      objects: objects
    })
  }

  render() {
    const storageItems = this.state.objects.map(obj => {
      return (
        <View key={obj.key}>
          <Text style={styles.text}>{obj.key}</Text>
          <Button
            title="Show value"
            onPress={() => Alert.alert('Value', obj.value, [{text: 'Ok'}])}
          />
        </View>
      )
    })

    const {t} = this.props.screenProps

    return (
      <ScrollView>
        <DismissKeyboard>
          <View style={styles.container_nocenterCnt}>
            <BackBtn/>
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
            <View style={{alignItems: 'center'}}>
              <View>
                <Avatar
                  rounded
                  title="RA"
                  size="large"
                />
                <Badge
                  status="success"
                  badgeStyle={{
                    borderRadius: 9,
                    height: 18,
                    minWidth: 0,
                    width: 18
                  }}
                  containerStyle={{position: 'absolute', top: 0, right: 0, left: 60, bottom: 0}}
                />
              </View>
              <Text style={styles.text}>
                {t('username')}
              </Text>
              <Divider style={{ height: 1, backgroundColor: '#1c3830'}}/>
              <View>
                {storageItems}
              </View>
            </View>
          </View>

        </DismissKeyboard>
      </ScrollView>
    )
  }
}

export default AccountScreen

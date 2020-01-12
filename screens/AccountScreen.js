import React from 'react'
import {
  ScrollView,
  Text,
  View,
  AsyncStorage,
  Button,
  Alert,
  TouchableOpacity
} from 'react-native'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import {doLogout, getClientUsr} from "../actions";
import {connect} from "react-redux";
import EditPasswordPopUp from "../components/EditPasswordPopUp";
import {reduxForm} from "redux-form";

class AccountScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

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

    await this.context.localize({
      en: {
        username: 'User Name',
        nickname: 'Nick Name'
      },
      zh: {
        username: '使用者名稱',
        nickname: '暱稱'
      }
    })
  }

  render() {
    const storageItems = this.state.objects.map(obj => {
      return (
        <View key={obj.key} style={styles.fieldContainer}>
          <Text style={[styles.fieldTitle, { flex: 2 }]}>{obj.key}</Text>
          <TouchableOpacity
            onPress={() => Alert.alert('Value', obj.value, [{ text: 'Ok' }])}
          >
            <Text style={{ flex: 1 }}>Details</Text>
          </TouchableOpacity>
        </View>
      )
    })
    const { currentUser } = this.props
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
              <View style={[{flexDirection: 'row', justifyContent: 'space-between'}]}>
                <Text style={styles.fieldTitle}>{t('username')}: {currentUser.username}</Text>
              </View>
              <View style={[{flexDirection: 'row', justifyContent: 'space-between'}]}>
                <Text style={styles.fieldTitle}>{t('nickname')}: {currentUser.nickname}</Text>
              </View>

              <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
                <EditPasswordPopUp
                  name={currentUser.username}
                />
              </View>

              { currentUser.defaultUser &&
                <View>
                  <View style={[styles.fieldContainer, styles.mgrtotop12]}>
                    <Text style={styles.fieldTitle}>Developer Section</Text>
                  </View>
                  <View>{storageItems}</View>
                </View>
              }
            </View>
          </View>
        </DismissKeyboard>
      </ScrollView>
    )
  }
}

const mapStateToProps = state => ({
  currentUser: state.clientuser.data,
  haveData: state.clientuser.haveData,
  haveError: state.clientuser.haveError,
  isLoading: state.clientuser.loading
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getCurrentUser: (name) => dispatch(getClientUsr(name))
})

AccountScreen = reduxForm({
  form: 'accountForm'
})(AccountScreen)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountScreen)

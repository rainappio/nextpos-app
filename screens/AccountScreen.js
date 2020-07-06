import React from 'react'
import {
  ScrollView,
  Text,
  View,
  AsyncStorage,
  Button,
  Alert,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import { doLogout, getClientUsr } from '../actions'
import { connect } from 'react-redux'
import EditPasswordPopUp from '../components/EditPasswordPopUp'
import { reduxForm } from 'redux-form'
import { getToken } from '../constants/Backend'
import Constants from "expo-constants/src/Constants";
import ScreenHeader from "../components/ScreenHeader";
import ThemeTogglerButton from '../mode_switcher/theme-toggler-btn'
import { themes } from '../mode_switcher/themeContext'

class AccountScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      objects: []
    }
  }

  /**
   * https://stackoverflow.com/questions/49809884/access-react-context-outside-of-render-function
   */
  async componentDidMount() {
    let token = await getToken()
    this.props.getCurrentUser(token.username)

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
    const { t, theme } = this.context
console.log(theme)
    return (
      <View style={[styles.fullWidthScreen,theme]}>
        <ScreenHeader backNavigation={true}
                      parentFullScreen={true}
                      title={t('settings.account')}
                      rightComponent={<ThemeTogglerButton />}
        />
          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, { flex: 1 }]}>
              <Text style={[styles.fieldTitle,theme]}>{t('username')}</Text>
            </View>
            <View style={[styles.tableCellView, { flex: 3, justifyContent: 'flex-end' }]}>
              <Text>
                {currentUser.username}
              </Text>
            </View>
          </View>
          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, { flex: 1 }]}>
              <Text style={styles(theme).fieldTitle}>{t('nickname')}</Text>
            </View>
            <View style={[styles.tableCellView, { flex: 3, justifyContent: 'flex-end' }]}>
              <Text>
                {currentUser.nickname}
              </Text>
            </View>
          </View>
          <View style={[styles.tableRowContainerWithBorder]}>
            <View style={[styles.tableCellView, { flex: 1 }]}>
              <Text style={rainApp.fieldTitle}>{t('password')}</Text>
            </View>
            <View style={[styles.tableCellView, { flex: 3, justifyContent: 'flex-end' }]}>
              <EditPasswordPopUp defaultUser={currentUser.defaultUser} name={currentUser.username} ownAccount={true}/>
            </View>
          </View>
          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, { flex: 1 }]}>
              <Text style={rainApp.fieldTitle}>App Version</Text>
            </View>
            <View style={[styles.tableCellView, { flex: 3, justifyContent: 'flex-end' }]}>
              <Text>
                {Constants.nativeAppVersion} | {Constants.nativeBuildVersion}
              </Text>
            </View>
          </View>

        {/*{currentUser.defaultUser && (
          <View style={{ flex: 2, justifyContent: 'flex-end' }}>
            <View style={[styles.fieldContainer]}>
              <Text style={styles.fieldTitle}>Developer Section</Text>
            </View>
            <View>{storageItems}</View>
          </View>
        )}*/}
      </View>
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
  getCurrentUser: name => dispatch(getClientUsr(name))
})

AccountScreen = reduxForm({
  form: 'accountForm'
})(AccountScreen)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountScreen)

// const rainApp = StyleSheet.create({
//   fieldTitle: {
//     color: themes.dark.color
//   }
//   })

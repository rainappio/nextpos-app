import React from 'react'
import {Alert, AsyncStorage, Text, TouchableOpacity, View} from 'react-native'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import {getClientUsr} from '../actions'
import {connect} from 'react-redux'
import {EditPasswordPopUp, EditGesturePasswordPopUp} from '../components/EditPasswordPopUp'
import {reduxForm} from 'redux-form'
import {getToken} from '../constants/Backend'
import Constants from "expo-constants/src/Constants";
import ScreenHeader from "../components/ScreenHeader";
import {withContext} from "../helpers/contextHelper";
import {compose} from "redux";
import {StyledText} from "../components/StyledText";

class AccountScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        username: 'User Name',
        nickname: 'Nick Name',
        updateDate: 'Last updated',
        gesturePassword: 'Gesture Password'
      },
      zh: {
        username: '使用者代號',
        nickname: '暱稱',
        updateDate: '最後更新',
        gesturePassword: '圖形密碼'
      }
    })

    this.state = {
      objects: [],
      updateGestureFlag: false
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
      objects.push({key: key, value: value})
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
          <TouchableOpacity
            onPress={() => Alert.alert('Value', obj.value, [{text: 'Ok'}])}
          >
            <Text style={{flex: 1}}>Details</Text>
          </TouchableOpacity>
        </View>
      )
    })
    const {currentUser, themeStyle} = this.props
    const {t} = this.context

    return (
      <View style={[styles.mainContainer, themeStyle]}>
        <View style={[styles.fullWidthScreen]}>
          <ScreenHeader backNavigation={true}
            parentFullScreen={true}
            title={t('settings.account')}
          />

          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText style={styles.fieldTitle}>{t('username')}</StyledText>
            </View>
            <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
              <StyledText>
                {currentUser?.username}
              </StyledText>
            </View>
          </View>
          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText style={styles.fieldTitle}>{t('nickname')}</StyledText>
            </View>
            <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
              <StyledText>
                {currentUser?.displayName}
              </StyledText>
            </View>
          </View>
          <View style={[styles.tableRowContainerWithBorder]}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText style={styles.fieldTitle}>{t('password')}</StyledText>
            </View>
            <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
              <EditPasswordPopUp defaultUser={currentUser.defaultUser} name={currentUser.username} ownAccount={true} updateCallback={() => this.setState({updateGestureFlag: !this.state?.updateGestureFlag})} />
            </View>
          </View>

          {!!currentUser.defaultUser && <View style={[styles.tableRowContainerWithBorder]}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText style={styles.fieldTitle}>{t('gesturePassword')}</StyledText>
            </View>
            <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
              <EditGesturePasswordPopUp defaultUser={currentUser.defaultUser} name={currentUser.username} ownAccount={true} updateGestureFlag={this.state?.updateGestureFlag} />
            </View>
          </View>}

          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText style={styles.fieldTitle}>App Version</StyledText>
            </View>
            <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
              <StyledText>
                {Constants.nativeAppVersion} | {Constants.nativeBuildVersion}
              </StyledText>
            </View>
          </View>

          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText style={styles.fieldTitle}>{t('updateDate')}</StyledText>
            </View>
            <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
              <StyledText>
                2021-03-05
              </StyledText>
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

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withContext
)

export default enhance(AccountScreen)

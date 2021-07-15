import React from 'react'
import {Alert, AsyncStorage, Text, TouchableOpacity, View, Share} from 'react-native'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import {getClientUsr} from '../actions'
import {connect} from 'react-redux'
import {EditPasswordPopUp, EditGesturePasswordPopUp} from '../components/EditPasswordPopUp'
import {reduxForm} from 'redux-form'
import {api, getToken, dispatchFetchRequest, storage} from '../constants/Backend'
import Constants from "expo-constants";
import ScreenHeader from "../components/ScreenHeader";
import {withContext} from "../helpers/contextHelper";
import {compose} from "redux";
import {StyledText} from "../components/StyledText";
import {ThemeContainer} from "../components/ThemeContainer";
import Icon from 'react-native-vector-icons/Ionicons'

class AccountScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)



    this.state = {
      objects: [],
      updateGestureFlag: false,
      encodeToken: null
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

  handleEncodeToken = async () => {

    const username = await AsyncStorage.getItem(storage.clientUsername)
    const masterPassword = await AsyncStorage.getItem(storage.clientPassword)

    dispatchFetchRequest(api.encodeToken, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "username": username,
        "password": masterPassword,
      })
    },
      response => {
        response.text().then(data => {
          this.setState({encodeToken: data})
        })
      },
    ).then()
  }

  handleShareToken = async (token) => {
    try {
      const result = await Share.share({
        title: `${this.context.t(`account.encodeToken`)}`,
        message: token,
      });

      if (result.action === Share.sharedAction) {
        Alert.alert(
          ``,
          `${this.context.t(`account.tokenShareSuccess`)}`,
          [
            {text: `${this.context.t(`action.confirm`)}`, }
          ]
        )
      } else if (result.action === Share.dismissedAction) {
        Alert.alert(
          ``,
          `${this.context.t(`account.tokenShareFailed`)}`,
          [
            {text: `${this.context.t(`action.confirm`)}`, }
          ]
        )
      }
    } catch (error) {

      Alert.alert(
        ``,
        `${this.context.t(`action.cancel`)}`,
        [
          {text: `${error.message}`, }
        ]
      )

    }

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

    const {t, customMainThemeColor, customBackgroundColor} = this.context

    return (
      <ThemeContainer>
        <View style={[styles.fullWidthScreen]}>
          <ScreenHeader backNavigation={true}
            parentFullScreen={true}
            title={t('settings.account')}
          />

          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText style={styles.fieldTitle}>{t('account.username')}</StyledText>
            </View>
            <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
              <StyledText>
                {currentUser?.username}
              </StyledText>
            </View>
          </View>
          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText style={styles.fieldTitle}>{t('account.nickname')}</StyledText>
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
              <StyledText style={styles.fieldTitle}>{t('account.gesturePassword')}</StyledText>
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
              <StyledText style={styles.fieldTitle}>{t('account.updateDate')}</StyledText>
            </View>
            <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
              <StyledText>
                2021-05-31
              </StyledText>
            </View>
          </View>

          {!!currentUser.defaultUser && <View style={[styles.tableRowContainerWithBorder]}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText style={styles.fieldTitle}>{t('account.encodeToken')}</StyledText>
            </View>
            <View style={[styles.tableCellView, {flex: 4, justifyContent: 'flex-end'}]}>
              {this.state?.encodeToken && <TouchableOpacity
                onPress={() => this.handleShareToken(this.state?.encodeToken)}
                style={{paddingHorizontal: 8}}
              >
                <Text style={{color: customMainThemeColor}}>{this.state?.encodeToken}</Text>
              </TouchableOpacity>
              }


            </View>
            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
              <TouchableOpacity
                onPress={() => this.handleShareToken(this.state?.encodeToken)}
                style={{justifyContent: 'flex-end'}}
              >
                <Text style={{flex: 1, paddingRight: 8}}>
                  {this.state?.encodeToken && <Icon name='share-outline' size={24} color={customMainThemeColor} />}
                </Text>

              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.handleEncodeToken()}
                style={{paddingVertical: 0}}
              >
                <Text style={{flex: 1}}>
                  <Icon name={this.state?.encodeToken ? "md-create" : 'add'} size={24} color={customMainThemeColor} />
                </Text>
              </TouchableOpacity>
            </View>
          </View>}

          {/* {currentUser.defaultUser && (
            <View style={{flex: 2, justifyContent: 'flex-end'}}>
              <View style={[styles.fieldContainer]}>
                <Text style={styles.fieldTitle}>Developer Section</Text>
              </View>
              <View>{storageItems}</View>
            </View>
          )} */}
        </View>
      </ThemeContainer>
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

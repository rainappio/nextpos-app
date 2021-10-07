import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {Text, TouchableOpacity, View, AsyncStorage} from 'react-native'
import PinCodeInput from '../components/PinCodeInput'
import styles from '../styles'
import InputText from '../components/InputText'
import {LocaleContext} from "../locales/LocaleContext";
import ScreenHeader from "../components/ScreenHeader";
import {withContext} from "../helpers/contextHelper";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {ThemeContainer} from "../components/ThemeContainer";
import {CardFourNumberKeyboard} from '../components/MoneyKeyboard'
import {GesturePassword} from '../components/GesturePassword'
import {compose} from "redux";
import {connect} from "react-redux";

class ClientUserLoginForm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
    this.state = {
      cardKeyboardResult: [],
      showGesture: false,
      wrongPassword: false
    }
  }

  componentDidMount() {
    this.context.localize({
      en: {
        userLoginTitle: 'User Login',
        login: 'Login',
        toBack: 'Back'
      },
      zh: {
        userLoginTitle: '使用者登入',
        login: '登入',
        toBack: '返回'
      }
    })
    this.checkGesturePassword()
  }

  checkGesturePassword = async (result = null) => {
    console.log('client', JSON.stringify(this.props?.client))
    try {
      const value = await AsyncStorage.getItem(`gesturePassword_${this.props?.client?.id}`);
      if (value !== null) {
        // We have data!!
        this.setState({showGesture: true})
        if (!!result) {
          const gesturePassword = await AsyncStorage.getItem(`gesturePassword_${this.props?.client?.id}_${result}`);
          if (result === value && gesturePassword !== null) {
            this.setState({showGesture: true})
            this.props.onSubmit({username: this.props?.clientusersName, password: String(gesturePassword)})
          } else {
            this.setState({showGesture: true, wrongPassword: true})
          }
        } else {
          this.setState({showGesture: true})
        }
      } else {
        this.setState({showGesture: false})
      }
    } catch (error) {
      // Error retrieving data
    }
  }

  render() {
    const {clientusersName, displayName, handleSubmit, themeStyle} = this.props
    const {t, isTablet, customMainThemeColor} = this.context
    return (
      <ThemeContainer>
        <View style={styles.fullWidthScreen}>
          <ScreenHeader backNavigation={true} parentFullScreen={true} title={t('userLoginTitle')}
            backAction={() => {this.props.navigation.navigate('ClientUsers')}}
          />

          <View style={[styles.horizontalMargin, styles.flex(1)]}>
            <View>
              <Text style={[styles?.screenSubTitle(customMainThemeColor)]}>
                {displayName}
              </Text>
            </View>

            {this.props.defaultUser ? (
              <View style={[styles.sectionContainer, styles.flex(1)]}>



                {(!this.state?.showGesture || this.state?.wrongPassword) && <View style={{width: isTablet ? 400 : 320, alignSelf: 'center'}}>
                  <View style={[styles.tableCellView, styles.dynamicVerticalPadding(10)]}>
                    <Field
                      name="password"
                      component={InputText}
                      placeholder={t('password')}
                      secureTextEntry={true}
                      alignLeft={true}
                    />
                  </View>

                  <View >
                    <TouchableOpacity
                      onPress={handleSubmit}
                    >
                      <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>{t('login')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>}
                {this.state?.wrongPassword &&
                  <Text style={{marginBottom: -20, marginTop: 20, textAlign: 'center', color: '#f75336'}}>
                    {t('editPasswordPopUp.incorrectPassword')}
                  </Text>}
                {this.state?.showGesture &&
                  <GesturePassword gestureAreaLength={isTablet ? 400 : 320} style={{alignSelf: 'center'}} getResult={(result) => this.checkGesturePassword(result)} />}

                <View style={{flex: 1}}></View>

              </View>
            ) : <View style={{maxWidth: 400, maxHeight: 600, alignSelf: 'center'}}>
                <CardFourNumberKeyboard
                  initialValue={[]}
                  value={this.state.cardKeyboardResult}
                  getResult={(result) => {
                    this.setState({cardKeyboardResult: result})
                    if (result.length === 4 && !result.some((item) => {return item === ''})) {
                      this.props.onSubmit({username: clientusersName, password: result.join('')})
                      this.setState({cardKeyboardResult: []})
                    }
                  }} />
              </View>}
          </View>
        </View>
      </ThemeContainer>
    )
  }
}

ClientUserLoginForm = reduxForm({
  form: 'ClientUserLoginForm'
})(ClientUserLoginForm)


const mapStateToProps = state => ({
  client: state.client.data
})

const enhance = compose(
  connect(mapStateToProps, null),
  withContext
)

export default enhance(ClientUserLoginForm)

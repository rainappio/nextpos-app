import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {Text, TouchableOpacity, View} from 'react-native'
import PinCodeInput from '../components/PinCodeInput'
import styles from '../styles'
import InputText from '../components/InputText'
import {LocaleContext} from "../locales/LocaleContext";
import ScreenHeader from "../components/ScreenHeader";
import {withContext} from "../helpers/contextHelper";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {CardFourNumberKeyboard} from '../components/MoneyKeyboard'

class ClientUserLoginForm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
    this.state = {
      cardKeyboardResult: []
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
  }

  render() {
    const {clientusersName, displayName, handleSubmit, themeStyle} = this.props
    const {t, isTablet} = this.context
    return (
      <ThemeScrollView>
        <View style={styles.fullWidthScreen}>
          <ScreenHeader backNavigation={true} parentFullScreen={true} title={t('userLoginTitle')}
            backAction={() => {this.props.navigation.navigate('ClientUsers')}}
          />

          <View style={[styles.horizontalMargin, styles.flex(1)]}>
            <View>
              <Text style={[styles.screenSubTitle]}>
                {displayName}
              </Text>
            </View>

            {this.props.defaultUser ? (
              <View style={[styles.sectionContainer, styles.flex(1)]}>
                <View style={[styles.tableCellView, styles.dynamicVerticalPadding(10)]}>
                  <Field
                    name="password"
                    component={InputText}
                    placeholder={t('password')}
                    secureTextEntry={true}
                    alignLeft={true}
                  />
                </View>

                <View style={[styles.flex(3)]}>
                  <TouchableOpacity
                    onPress={handleSubmit}
                  >
                    <Text style={[styles.bottomActionButton, styles.actionButton]}>{t('login')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (isTablet ?
              <View style={{width: 400, height: 600, alignSelf: 'center'}}>
                <CardFourNumberKeyboard
                  initialValue={[]}
                  value={this.state.cardKeyboardResult}
                  getResult={(result) => {
                    this.setState({cardKeyboardResult: result})
                    if (result.length === 4 && !result.some((item) => {return item === ''}))
                      this.props.onSubmit({username: clientusersName, password: result.join('')})
                  }} />
              </View>
              : <View style={[styles.sectionContainer, styles.flex(1)]}>
                <Field
                  name="password"
                  component={PinCodeInput}
                  onChange={val => {
                    if (val.length === 4)
                      this.props.onSubmit({username: clientusersName, password: val})
                  }}
                  customHeight={60}
                />
              </View>
              )}
          </View>
        </View>
      </ThemeScrollView>
    )
  }
}

ClientUserLoginForm = reduxForm({
  form: 'ClientUserLoginForm'
})(ClientUserLoginForm)

export default withContext(ClientUserLoginForm)

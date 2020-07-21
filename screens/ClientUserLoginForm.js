import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {AsyncStorage, Image, Text, TouchableOpacity, View, Modal, TouchableHighlight} from 'react-native'
import {encode as btoa} from 'base-64'
import Icon from 'react-native-vector-icons/Ionicons'
import PinCodeInput from '../components/PinCodeInput'
import {DismissKeyboard} from '../components/DismissKeyboard'
import styles, {mainThemeColor} from '../styles'
import InputText from '../components/InputText'
import {isRequired} from '../validators'
import {api, warningMessage} from '../constants/Backend'
import {LocaleContext} from "../locales/LocaleContext";
import ScreenHeader from "../components/ScreenHeader";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scrollview";
import {withContext} from "../helpers/contextHelper";
import {ThemeScrollView} from "../components/ThemeScrollView";

class ClientUserLoginForm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
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
    const {t} = this.context

    return (
      <ThemeScrollView>
        <View style={styles.fullWidthScreen}>
          <ScreenHeader parentFullScreen={true} title={t('userLoginTitle')}/>

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
            ) : (
              <View style={[styles.sectionContainer, styles.flex(1)]}>
                <Field
                  name="password"
                  component={PinCodeInput}
                  onChange={val => this.props.onSubmit({username: clientusersName, password: val})}
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

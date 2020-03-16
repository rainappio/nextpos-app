import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { AsyncStorage, Image, Text, TouchableOpacity, View, Modal, TouchableHighlight } from 'react-native'
import { encode as btoa } from 'base-64'
import Icon from 'react-native-vector-icons/Ionicons'
import PinCodeInput from '../components/PinCodeInput'
import { DismissKeyboard } from '../components/DismissKeyboard'
import styles from '../styles'
import InputText from '../components/InputText'
import { isRequired } from '../validators'
import { api, warningMessage } from '../constants/Backend'
import {LocaleContext} from "../locales/LocaleContext";
import ScreenHeader from "../components/ScreenHeader";

class ClientUserLoginForm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }

  componentDidMount(){
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
    const { clientusersName, displayName, handleSubmit } = this.props
		const { t } = this.context

    return (
      <View style={styles.fullWidthScreen}>
        <ScreenHeader parentFullScreen={true} title={t('userLoginTitle')}/>

        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text
            style={[
              styles.welcomeText,
              styles.orange_color,
              styles.textMedium,
              styles.mgrBtm50
            ]}
          >
            {displayName}
          </Text>

          {this.props.defaultUser ? (
            <View style={styles.horizontalMargin}>
              <Field
                name="password"
                component={InputText}
                placeholder={t('password')}
                secureTextEntry={true}
                extraStyle={{ textAlign: 'left' }}
              />
              <TouchableOpacity
                onPress={handleSubmit}
              >
                <Text style={[styles.bottomActionButton, styles.actionButton]}>{t('login')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Field
              name="password"
              component={PinCodeInput}
              onChange={val => this.props.onSubmit({username: clientusersName, password: val})}
              customHeight={71}
            />
          )}
        </View>
      </View>
    )
  }
}

ClientUserLoginForm = reduxForm({
  form: 'ClientUserLoginForm'
})(ClientUserLoginForm)

export default ClientUserLoginForm

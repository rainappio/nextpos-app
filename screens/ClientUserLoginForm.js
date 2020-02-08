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
  		  login: 'Login',
  			toBack: 'Back'
  		},
  		zh: {
        login: '登入',
  			toBack: '返回'
  		}
  	})
  }

  render() {
    const { clientusersName, handleSubmit } = this.props
		const { t } = this.context

    return (
      <DismissKeyboard>
      	<View style={{flex: 1}}>
        <View style={styles.container}>
          <View style={[{ position: 'absolute', top: 0 }]}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/logo.png')
                  : require('../assets/images/logo.png')
              }
              style={styles.welcomeImage}
            />
          </View>

          <Text
            style={[
              styles.welcomeText,
              styles.orange_color,
              styles.marginTop40
            ]}
            onPress={() => this.props.navigation.goBack()}
          >
            <Icon name="ios-arrow-back" size={26} color="#f18d1a">
              {t('toBack')}
            </Icon>
          </Text>

          <Text
            style={[
              styles.welcomeText,
              styles.orange_color,
              styles.textMedium,
              styles.mgrBtm50
            ]}
          >
            {clientusersName}
          </Text>

          {this.props.defaultUser ? (
            <View>
              <Field
                name="password"
                component={InputText}
                placeholder="Password"
                secureTextEntry={true}
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
    </DismissKeyboard>
    )
  }
}

ClientUserLoginForm = reduxForm({
  form: 'ClientUserLoginForm'
})(ClientUserLoginForm)

export default ClientUserLoginForm

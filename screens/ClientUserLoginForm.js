import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { AsyncStorage, Image, Text, View } from 'react-native'
import { encode as btoa } from 'base-64'
import Icon from 'react-native-vector-icons/Ionicons'
import PinCodeInput from '../components/PinCodeInput'
import { DismissKeyboard } from '../components/DismissKeyboard'
import styles from '../styles'
import InputText from '../components/InputText'
import { isRequired } from '../validators'
import { api, warningMessage } from '../constants/Backend'

class ClientUserLoginForm extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    isAuthClientUser: false
  }

  clientLogin = async passWord => {
    let token = await AsyncStorage.getItem('token')
    const tokenObj = JSON.parse(token)
    const username = tokenObj.cli_userName
    const masterPassword = tokenObj.cli_masterPwd

    const formData = new FormData()
    formData.append('grant_type', 'password')
    formData.append('username', this.props.clientusersName)
    formData.append('password', passWord)

    const auth = 'Basic ' + btoa(username + ':' + masterPassword)

    let response = await fetch(api.getAuthToken, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        Authorization: auth
      },
      body: formData
    })

    if (response.status === 400) {
      this.props.navigation.navigate('ClientUsers')
      warningMessage('Incorrect password.')
    } else {
      const res = await response.json()
      res.tokenExp = new Date().setSeconds(
        new Date().getSeconds() + parseInt(res.expires_in)
      )
      await AsyncStorage.setItem('clientusrToken', JSON.stringify(res))
      await AsyncStorage.setItem('clientusersName', this.props.clientusersName)

      this.props.navigation.navigate('LoginSuccess', {
        isAuthClientUser: true,
        clientusersName: this.props.clientusersName
      })
    }
  }

  render() {
    const { clientusersName } = this.props

    return (
      <DismissKeyboard>
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
              Back
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
            <Field
              name="encryptedPassword"
              component={InputText}
              validate={isRequired}
              placeholder="Password"
              secureTextEntry={true}
              onSubmitEditing={val => this.clientLogin(val.nativeEvent.text)}
            />
          ) : (
            <Field
              name="encryptedPassword"
              component={PinCodeInput}
              onChange={val => this.clientLogin(val)}
              customHeight={71}
            />
          )}
        </View>
      </DismissKeyboard>
    )
  }
}

const mapStateToProps = state => ({
  csState: state,
  isLoggedIn: state.auth.isLoggedIn
})

ClientUserLoginForm = reduxForm({
  form: 'ClientUserLoginForm'
})(ClientUserLoginForm)

export default ClientUserLoginForm

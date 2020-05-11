import {encode as btoa} from "base-64";
import {api, getToken, storage, warningMessage} from "../constants/Backend";
import {AsyncStorage} from "react-native";
import {doLoggedIn} from "../actions";

export const handleRefreshToken = async () => {
  const accessToken = await getToken()
  const clientUsername = await AsyncStorage.getItem(storage.clientUsername)
  const clientPassword = await AsyncStorage.getItem(storage.clientPassword)

  const formData = new FormData()
  formData.append('grant_type', 'refresh_token')
  formData.append('refresh_token', accessToken.refresh_token)
  const auth = 'Basic ' + btoa(clientUsername + ':' + clientPassword)

  let response = await fetch(api.getAuthToken, {
    method: 'POST',
    withCredentials: true,
    credentials: 'include',
    headers: {
      Authorization: auth
    },
    body: formData
  })

  if (!response.ok) {
    warningMessage('Refresh token request failed.')
  } else {
    let res = await response.json()
    // const loggedIn = new Date()
    // res.loggedIn = loggedIn
    // res.tokenExp = new Date().setSeconds(
    //   loggedIn.getSeconds() + parseInt(res.expires_in)
    // )
    //
    // res.cli_userName = values.username
    // res.cli_masterPwd = values.masterPassword
    //
    // // this is used for LoginSuccessScreen.
    // res.username = res.cli_userName
    //
    // await AsyncStorage.setItem('token', JSON.stringify(res))
    // this.props.dispatch(doLoggedIn(res.access_token))
    // this.props.navigation.navigate('LoginSuccess')
  }

  return response
}

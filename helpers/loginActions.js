import {encode as btoa} from "base-64";
import {api, getToken, storage, warningMessage} from "../constants/Backend";
import {AsyncStorage} from "react-native";
import {doLoggedIn} from "../actions";

export const handleRefreshToken = async () => {
  const clientUsername = await AsyncStorage.getItem(storage.clientUsername)
  const clientPassword = await AsyncStorage.getItem(storage.clientPassword)

  const formData = new FormData()
  formData.append('grant_type', 'password')
  formData.append('password', clientPassword)
  formData.append('username', clientUsername)

  const auth = 'Basic ' + btoa(clientUsername + ':' + clientPassword)

  const response = await fetch(api.getAuthToken, {
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
    await AsyncStorage.removeItem('token')
    await AsyncStorage.removeItem('clientusrToken')

    await AsyncStorage.setItem(storage.clientUsername, clientUsername)
    await AsyncStorage.setItem(storage.clientPassword, clientPassword)

    const res = await response.json()
    const loggedIn = new Date()
    res.loggedIn = loggedIn
    res.tokenExp = new Date().setSeconds(
      loggedIn.getSeconds() + parseInt(res.expires_in)
    )

    res.cli_userName = clientUsername
    res.cli_masterPwd = clientPassword

    // this is used for LoginSuccessScreen.
    res.username = res.cli_userName

    await AsyncStorage.setItem('token', JSON.stringify(res))
    doLoggedIn(res.access_token)
  }

  const accessToken = await getToken()

  return accessToken
}

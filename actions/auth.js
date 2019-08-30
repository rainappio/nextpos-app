import { AsyncStorage } from 'react-native'
export const LOGGED_IN = 'LOGGED_IN'
export const LOGGED_OUT = 'LOGGED_OUT'

export const loggedIn = data => ({
  type: LOGGED_IN,
  data
})

export const loggedOut = () => ({
  type: LOGGED_OUT
})

export function doLoggedIn (accessToken) {
  return dispatch => {
    dispatch(loggedIn(accessToken))
  }
}

export function doLogout () {
  try {
    AsyncStorage.removeItem('token')
  } catch (e) {
    // Ignore missing local storage
  }
  return dispatch => {
    dispatch(loggedOut())
  }
}

export const LOGGED_IN = 'LOGGED_IN'
export const LOGGED_OUT = 'LOGGED_OUT'

export const loggedIn = accInfo => ({
  type: LOGGED_IN,
  payload: accInfo
})

export const loggedOut = () => ({
  type: LOGGED_OUT
})

export function hasLoggedIn (loginData) {
  const accInfo = {}
  return (dispatch, getState) => {
    dispatch(loggedIn(accInfo))
  }
}

export function doLogout () {
  return dispatch => {
    dispatch(loggedOut)
  }
}

import { AsyncStorage } from 'react-native'
export const FETCH_CLIENTUSERS = 'FETCH_CLIENTUSERS'
export const FETCH_CLIENTUSERS_SUCCESS = 'FETCH_CLIENTUSERS_SUCCESS'
export const FETCH_CLIENTUSERS_FAILURE = 'FETCH_CLIENTUSERS_FAILURE'

export const fetchClientsUsers = () => ({
  type: FETCH_CLIENTUSERS
})

export const fetchClientsUsersSuccess = data => ({
  type: FETCH_CLIENTUSERS_SUCCESS,
  data
})

export const fetchClientsUsersFailure = error => ({
  type: FETCH_CLIENTUSERS_FAILURE,
  error
})

export const getClientUsr = () => {
  return dispatch => {
    dispatch(fetchClientsUsers())
    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        return JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      var auth = 'Bearer ' + tokenObj.access_token
      return fetch('http://35.234.63.193/clients/me/users', {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
          // 'Content-Type': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-client-id': tokenObj.clientId,
          Authorization: auth
        }
      })
        .then(res => res.json())
        .then(data => {
          dispatch(fetchClientsUsersSuccess(data))
          return data
        })
        .catch(error => dispatch(fetchClientsUsersFailure(error)))
    })
  }
}

function handleErrors (response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

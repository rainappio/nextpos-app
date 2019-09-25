import { AsyncStorage } from 'react-native'
export const FETCH_CLIENT = 'FETCH_CLIENT'
export const FETCH_CLIENT_SUCCESS = 'FETCH_CLIENT_SUCCESS'
export const FETCH_CLIENT_FAILURE = 'FETCH_CLIENT_FAILURE'
export const CLEAR_CLIENT = 'CLEAR_CLIENT'

export const fetchClient = name => ({
  type: FETCH_CLIENT,
  name
})

export const fetchClientSuccess = data => ({
  type: FETCH_CLIENT_SUCCESS,
  data
})

export const fetchClientFailure = error => ({
  type: FETCH_CLIENT_FAILURE,
  error
})

export const clearClient = () => ({
  type: CLEAR_CLIENT
})

export const getClientUsr = name => {
  return dispatch => {
    dispatch(fetchClient(name))
    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      var auth = 'Bearer ' + tokenObj.access_token
      return fetch(`http://35.234.63.193/clients/me/users/${name}`, {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-client-id': tokenObj.clientId,
          Authorization: auth
        }
      })
        .then(res => res.json())
        .then(data => {
          dispatch(fetchClientSuccess(data))
          return data
        })
        .catch(error => dispatch(fetchClientFailure(error)))
    })
  }
}

function handleErrors (response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

import { AsyncStorage } from 'react-native'
export const FETCH_TABLES = 'FETCH_TABLES'
export const FETCH_TABLES_SUCCESS = 'FETCH_TABLES_SUCCESS'
export const FETCH_TABLES_FAILURE = 'FETCH_TABLES_FAILURE'

export const fetchTableLayouts = () => ({
  type: FETCH_TABLES
})

export const fetchTableLayoutsSuccess = data => ({
  type: FETCH_TABLES_SUCCESS,
  data
})

export const fetchTableLayoutsFailure = error => ({
  type: FETCH_TABLES_FAILURE,
  error
})

export const getTableLayouts = () => {
  return dispatch => {
    dispatch(fetchTableLayouts())
    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        return JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      var auth = 'Bearer ' + tokenObj.access_token
      return fetch('http://35.234.63.193/tablelayouts/', {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': tokenObj.clientId,
          Authorization: auth
        }
      })
        .then(res => res.json())
        .then(data => {
          dispatch(fetchTableLayoutsSuccess(data))
          return data
        })
        .catch(error => dispatch(fetchTableLayoutsFailure(error)))
    })
  }
}

function handleErrors (response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

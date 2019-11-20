import { AsyncStorage } from 'react-native'
export const FETCH_TABLELAYOUT = 'FETCH_TABLELAYOUT'
export const FETCH_TABLELAYOUT_SUCCESS = 'FETCH_TABLELAYOUT_SUCCESS'
export const FETCH_TABLELAYOUT_FAILURE = 'FETCH_TABLELAYOUT_FAILURE'
export const CLEAR_TABLELAYOUT = 'CLEAR_TABLELAYOUT'

export const fetchTableLayout = id => ({
  type: FETCH_TABLELAYOUT,
  id
})

export const fetchTableLayoutSuccess = data => ({
  type: FETCH_TABLELAYOUT_SUCCESS,
  data
})

export const fetchTableLayoutFailure = error => ({
  type: FETCH_TABLELAYOUT_FAILURE,
  error
})

export const clearTableLayout = () => ({
  type: CLEAR_TABLELAYOUT
})

export const getTableLayout = id => {
  return dispatch => {
    dispatch(fetchTableLayout(id))
    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        return JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      var auth = 'Bearer ' + tokenObj.access_token
      return fetch(`http://35.234.63.193/tablelayouts/${id}`, {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'x-client-id': tokenObj.clientId,
          Authorization: auth
        }
      })
        .then(res => res.json())
        .then(data => {
          dispatch(fetchTableLayoutSuccess(data))
          return data
        })
        .catch(error => dispatch(fetchTableLayoutFailure(error)))
    })
  }
}

function handleErrors (response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

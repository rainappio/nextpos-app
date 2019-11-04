import { AsyncStorage } from 'react-native'
export const FETCH_SHIFT = 'FETCH_PRODUCT'
export const FETCH_SHIFT_SUCCESS = 'FETCH_SHIFT_SUCCESS'
export const FETCH_SHIFT_FAILURE = 'FETCH_SHIFT_FAILURE'

export const fetchShift = () => ({
  type: FETCH_SHIFT
})

export const fetchShiftSuccess = data => ({
  type: FETCH_SHIFT_SUCCESS,
  data
})

export const fetchShiftFailure = error => ({
  type: FETCH_SHIFT_FAILURE,
  error
})

export const getShiftStatus = () => {
  return dispatch => {
    dispatch(fetchShift())
    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        return JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      var auth = 'Bearer ' + tokenObj.access_token
      return fetch('http://35.234.63.193/shifts/active', {
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
          dispatch(fetchShiftSuccess(data))
          return data
        })
        .catch(error => dispatch(fetchShiftFailure(error)))
    })
  }
}

function handleErrors (response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

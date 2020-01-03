import { AsyncStorage } from 'react-native'
import { makeFetchRequest } from '../constants/Backend'
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

    makeFetchRequest(token => {
      return fetch('http://35.234.63.193/shifts/active', {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
          Authorization: 'Bearer ' + token.access_token
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

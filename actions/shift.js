import { api, dispatchFetchRequest } from '../constants/Backend'
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
  return async dispatch => {
    dispatch(fetchShift())

    return await dispatchFetchRequest(
      api.shift.active,
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchShiftSuccess(data))
        })
      },
      response => {
        dispatch(fetchShiftFailure(response))
      }
    ).then()
  }
}

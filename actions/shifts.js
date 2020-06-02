import { api, dispatchFetchRequest } from '../constants/Backend'
export const FETCH_SHIFTS = 'FETCH_SHIFTS'
export const FETCH_SHIFTS_SUCCESS = 'FETCH_SHIFTS_SUCCESS'
export const FETCH_SHIFTS_FAILURE = 'FETCH_SHIFTS_FAILURE'

export const fetchShifts = () => ({
  type: FETCH_SHIFTS
})

export const fetchShiftsSuccess = data => ({
  type: FETCH_SHIFTS_SUCCESS,
  data
})

export const fetchShiftsFailure = error => ({
  type: FETCH_SHIFTS_FAILURE,
  error
})

export const getShifts = (date) => {
  return async dispatch => {
    dispatch(fetchShifts())

    return await dispatchFetchRequest(
      api.shift.getAll(date),
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchShiftsSuccess(data))
        })
      },
      response => {
        dispatch(fetchShiftsFailure(response))
      }
    ).then()
  }
}

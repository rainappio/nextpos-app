import { api, dispatchFetchRequest } from '../constants/Backend'
export const FETCH_SHIFT_MOST_RECENT = 'FETCH_SHIFT_MOST_RECENT'
export const FETCH_SHIFT_MOST_RECENT_SUCCESS = 'FETCH_SHIFT_MOST_RECENT_SUCCESS'
export const FETCH_SHIFT_MOST_RECENT_FAILURE = 'FETCH_SHIFT_MOST_RECENT_FAILURE'

export const fetchShiftMostRecent = () => ({
  type: FETCH_SHIFT_MOST_RECENT
})

export const fetchShiftMostRecentSuccess = data => ({
  type: FETCH_SHIFT_MOST_RECENT_SUCCESS,
  data
})

export const fetchShiftMostRecentFailure = error => ({
  type: FETCH_SHIFT_MOST_RECENT_FAILURE,
  error
})

export const getMostRecentShiftStatus = () => {
  return dispatch => {
    dispatch(fetchShiftMostRecent())

    dispatchFetchRequest(
      api.shift.mostRecent,
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchShiftMostRecentSuccess(data))
        })
      },
      response => {
        dispatch(fetchShiftMostRecentFailure(response))
      }
    ).then()
  }
}

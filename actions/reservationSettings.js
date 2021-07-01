import {api, dispatchFetchRequest} from '../constants/Backend'

export const FETCH_RESERVATIONSETTINGS = 'FETCH_RESERVATIONSETTINGS'
export const FETCH_RESERVATIONSETTINGS_SUCCESS = 'FETCH_RESERVATIONSETTINGS_SUCCESS'
export const FETCH_RESERVATIONSETTINGS_FAILURE = 'FETCH_RESERVATIONSETTINGS_FAILURE'

export const fetchReservationSettings = () => ({
  type: FETCH_RESERVATIONSETTINGS
})

export const fetchReservationSettingsSuccess = data => ({
  type: FETCH_RESERVATIONSETTINGS_SUCCESS,
  data
})

export const fetchReservationSettingsFailure = error => ({
  type: FETCH_RESERVATIONSETTINGS_FAILURE,
  error
})

export const getReservationSettings = () => {
  return dispatch => {
    dispatch(fetchReservationSettings())

    dispatchFetchRequest(
      api.reservation.settings,
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchReservationSettingsSuccess(data))
        })
      },
      response => {
        dispatch(fetchReservationSettingsFailure(response))
      }
    ).then()
  }
}

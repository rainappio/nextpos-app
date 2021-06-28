import {api, dispatchFetchRequest} from '../constants/Backend'
export const FETCH_RESERVATION = 'FETCH_RESERVATION'
export const FETCH_RESERVATION_SUCCESS = 'FETCH_RESERVATION_SUCCESS'
export const FETCH_RESERVATION_FAILURE = 'FETCH_RESERVATION_FAILURE'
export const CLEAR_RESERVATION = 'CLEAR_RESERVATION'

export const fetchReservation = id => ({
  type: FETCH_RESERVATION,
  id
})

export const fetchReservationSuccess = data => ({
  type: FETCH_RESERVATION_SUCCESS,
  data
})

export const fetchReservationFailure = error => ({
  type: FETCH_RESERVATION_FAILURE,
  error
})

export const clearReservation = () => ({
  type: CLEAR_RESERVATION
})

export const getReservation = id => {
  return dispatch => {
    dispatch(fetchReservation(id))

    dispatchFetchRequest(
      api.reservation.getReservationById(id),
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchReservationSuccess(data))
        })
      },
      response => {
        dispatch(fetchReservationFailure(response))
      }
    ).then()
  }
}

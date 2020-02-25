import { api, dispatchFetchRequest } from '../constants/Backend'
export const FETCH_TIME_CARD = 'FETCH_TIME_CARD'
export const FETCH_TIME_CARD_SUCCESS = 'FETCH_TIME_CARD_SUCCESS'
export const FETCH_TIME_CARD_FAILURE = 'FETCH_TIME_CARD_FAILURE'
export const CLEAR_TIME_CARD = 'CLEAR_TIME_CARD'

export const fetchTimeCard = id => ({
  type: FETCH_TIME_CARD,
  id
})

export const fetchTimeCardSuccess = data => ({
  type: FETCH_TIME_CARD_SUCCESS,
  data
})

export const fetchTimeCardFailure = error => ({
  type: FETCH_TIME_CARD_FAILURE,
  error
})

export const clearTimeCard = () => ({
  type: CLEAR_TIME_CARD
})

export const getTimeCard = id => {
  return dispatch => {
    dispatch(fetchTimeCard(id))

    dispatchFetchRequest(
      api.timecard.getById(id),
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchTimeCardSuccess(data))
        })
      },
      response => {
        dispatch(fetchTimeCardFailure(response))
      }
    ).then()
  }
}

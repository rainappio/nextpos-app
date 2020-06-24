import { api, dispatchFetchRequest } from '../constants/Backend'
export const FETCH_TIME_CARDS = 'FETCH_TIME_CARDS'
export const FETCH_TIME_CARDS_SUCCESS = 'FETCH_TIME_CARDS_SUCCESS'
export const FETCH_TIME_CARDS_FAILURE = 'FETCH_TIME_CARDS_FAILURE'

export const fetchTimeCards = () => ({
  type: FETCH_TIME_CARDS
})

export const fetchTimeCardsSuccess = data => ({
  type: FETCH_TIME_CARDS_SUCCESS,
  data
})

export const fetchTimeCardsFailure = error => ({
  type: FETCH_TIME_CARDS_FAILURE,
  error
})

export const getTimeCards = (year, month) => {
  return dispatch => {
    dispatch(fetchTimeCards())

    dispatchFetchRequest(
      api.timecard.timeCards(year, month),
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchTimeCardsSuccess(data))
        })
      },
      response => {
        dispatch(fetchTimeCardsFailure(response))
      }
    ).then()
  }
}

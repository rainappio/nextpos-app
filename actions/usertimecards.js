import { api, dispatchFetchRequest } from '../constants/Backend'
export const FETCH_USER_TIME_CARDS = 'FETCH_USER_TIME_CARDS'
export const FETCH_USER_TIME_CARDS_SUCCESS = 'FETCH_USER_TIME_CARDS_SUCCESS'
export const FETCH_USER_TIME_CARDS_FAILURE = 'FETCH_USER_TIME_CARDS_FAILURE'
export const CLEAR_USER_TIME_CARDS = 'CLEAR_USER_TIME_CARDS'

export const fetchUserTimeCards = name => ({
  type: FETCH_USER_TIME_CARDS,
  name
})

export const fetchUserTimeCardsSuccess = data => ({
  type: FETCH_USER_TIME_CARDS_SUCCESS,
  data
})

export const fetchUserTimeCardsFailure = error => ({
  type: FETCH_USER_TIME_CARDS_FAILURE,
  error
})

export const clearUserTimeCards = () => ({
  type: CLEAR_USER_TIME_CARDS
})

export const getUserTimeCards = (username, year, month) => {
  return dispatch => {
    dispatch(fetchUserTimeCards(username))

    dispatchFetchRequest(
      api.timecard.get(username, year, month),
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchUserTimeCardsSuccess(data))
        })
      },
      response => {
        dispatch(fetchUserTimeCardsFailure(response))
      }
    ).then()
  }
}

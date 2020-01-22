import { api, dispatchFetchRequest } from '../constants/Backend'
export const FETCH_GLOBAL_ORDER_OFFERS = 'FETCH_GLOBAL_ORDER_OFFERS'
export const FETCH_GLOBAL_ORDER_OFFERS_SUCCESS =
  'FETCH_GLOBAL_ORDER_OFFERS_SUCCESS'
export const FETCH_GLOBAL_ORDER_OFFERS_FAILURE =
  'FETCH_GLOBAL_ORDER_OFFERS_FAILURE'

export const fetchglobalOrderOffers = () => ({
  type: FETCH_GLOBAL_ORDER_OFFERS
})

export const fetchglobalOrderOffersSuccess = data => ({
  type: FETCH_GLOBAL_ORDER_OFFERS_SUCCESS,
  data
})

export const fetchglobalOrderOffersFailure = error => ({
  type: FETCH_GLOBAL_ORDER_OFFERS_FAILURE,
  error
})

export const getfetchglobalOrderOffers = () => {
  return dispatch => {
    dispatch(fetchglobalOrderOffers())

    dispatchFetchRequest(
      api.order.getGlobalOrderOffers,
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchglobalOrderOffersSuccess(data))
        })
      },
      response => {
        dispatch(fetchglobalOrderOffersFailure(response))
      }
    ).then()
  }
}

function handleErrors (response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

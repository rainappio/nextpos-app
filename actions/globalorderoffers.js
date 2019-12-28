import { api, makeFetchRequest } from '../constants/Backend'
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

    makeFetchRequest(token => {
      fetch(api.order.get_globalOrderOffers, {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
          Authorization: 'Bearer ' + token.access_token
        }
      })
        .then(res => res.json())
        .then(data => {
          dispatch(fetchglobalOrderOffersSuccess(data))
          return data
        })
        .catch(error => dispatch(fetchglobalOrderOffersFailure(error)))
    })
  }
}

function handleErrors (response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

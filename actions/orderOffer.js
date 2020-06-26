import { api, dispatchFetchRequest } from '../constants/Backend'
export const FETCH_ORDER_OFFER = 'FETCH_ORDER_OFFER'
export const FETCH_ORDER_OFFER_SUCCESS = 'FETCH_ORDER_OFFER_SUCCESS'
export const FETCH_ORDER_OFFER_FAILURE = 'FETCH_ORDER_OFFER_FAILURE'
export const CLEAR_ORDER_OFFER = 'CLEAR_ORDER_OFFER'

export const fetchOrderOffer = id => ({
  type: FETCH_ORDER_OFFER,
  id
})

export const fetchOrderOfferSuccess = data => ({
  type: FETCH_ORDER_OFFER_SUCCESS,
  data
})

export const fetchOrderOfferFailure = error => ({
  type: FETCH_ORDER_OFFER_FAILURE,
  error
})

export const clearOrderOffer = () => ({
  type: CLEAR_ORDER_OFFER
})

export const getOrderOffer = id => {
  return dispatch => {
    dispatch(fetchOrderOffer(id))

    dispatchFetchRequest(
      api.order.getOrderOfferById(id),
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchOrderOfferSuccess(data))
        })
      },
      response => {
        dispatch(fetchOrderOfferFailure(response))
      }
    ).then()
  }
}

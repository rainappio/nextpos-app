import { api, dispatchFetchRequest } from '../constants/Backend'

export const FETCH_GLOBAL_ORDER_OFFERS = 'FETCH_GLOBAL_ORDER_OFFERS'
export const FETCH_GLOBAL_ORDER_OFFERS_SUCCESS = 'FETCH_GLOBAL_ORDER_OFFERS_SUCCESS'
export const FETCH_GLOBAL_ORDER_OFFERS_FAILURE = 'FETCH_GLOBAL_ORDER_OFFERS_FAILURE'

export const FETCH_GLOBAL_PRODUCT_OFFERS = 'FETCH_GLOBAL_PRODUCT_OFFERS'
export const FETCH_GLOBAL_PRODUCT_OFFERS_SUCCESS = 'FETCH_GLOBAL_PRODUCT_OFFERS_SUCCESS'
export const FETCH_GLOBAL_PRODUCT_OFFERS_FAILURE = 'FETCH_GLOBAL_PRODUCT_OFFERS_FAILURE'

export const FETCH_OFFERS = 'FETCH_OFFERS'
export const FETCH_OFFERS_SUCCESS = 'FETCH_OFFERS_SUCCESS'
export const FETCH_OFFERS_FAILURE = 'FETCH_OFFERS_FAILURE'

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

export const fetchGlobalProductOffers = () => ({
  type: FETCH_GLOBAL_PRODUCT_OFFERS
})

export const fetchGlobalProductOffersSuccess = data => ({
  type: FETCH_GLOBAL_PRODUCT_OFFERS_SUCCESS,
  data
})

export const fetchGlobalProductOffersFailure = error => ({
  type: FETCH_GLOBAL_PRODUCT_OFFERS_FAILURE,
  error
})

export const fetchOffers = () => ({
  type: FETCH_OFFERS
})

export const fetchOffersSuccess = data => ({
  type: FETCH_OFFERS_SUCCESS,
  data
})

export const fetchOffersFailure = error => ({
  type: FETCH_OFFERS_FAILURE,
  error
})

export const getfetchglobalOrderOffers = () => {
  return dispatch => {
    dispatch(fetchglobalOrderOffers())

    dispatchFetchRequest(api.order.getGlobalOrderOffers, {
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

export const getGlobalProductOffers = () => {
  return dispatch => {
    dispatch(fetchGlobalProductOffers())

    dispatchFetchRequest(api.order.getGlobalProductOffers, {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',
      headers: {}
    },
      response => {
        response.json().then(data => {
          dispatch(fetchGlobalProductOffersSuccess(data))
        })
      },
      response => {
        dispatch(fetchGlobalProductOffersFailure(response))
      }
    ).then()
  }
}

export const getOffers = () => {
  return dispatch => {
    dispatch(fetchOffers())

    dispatchFetchRequest(api.order.getOffers, {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',
      headers: {}
    },
      response => {
        response.json().then(data => {
          dispatch(fetchOffersSuccess(data))
        })
      },
      response => {
        dispatch(fetchOffersFailure(response))
      }
    ).then()
  }
}



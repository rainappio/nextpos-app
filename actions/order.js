import { api, dispatchFetchRequest } from '../constants/Backend'
export const FETCH_ORDER = 'FETCH_ORDER'
export const FETCH_ORDER_SUCCESS = 'FETCH_ORDER_SUCCESS'
export const FETCH_ORDER_FAILURE = 'FETCH_ORDER_FAILURE'
export const CLEAR_ORDER = 'CLEAR_ORDER'
export const GET_PREV_ORDER = 'GET_PREV_ORDER'

export const fetchOrder = id => ({
  type: FETCH_ORDER,
  id
})

export const fetchOrderSuccess = data => ({
  type: FETCH_ORDER_SUCCESS,
  data
})

export const fetchOrderFailure = error => ({
  type: FETCH_ORDER_FAILURE,
  error
})

export const getPrevOrder = () => ({
  type: GET_PREV_ORDER
})
export const clearOrder = () => ({
  type: CLEAR_ORDER
})

export const getOrder = id => {
  return dispatch => {
    dispatch(fetchOrder(id))

    dispatchFetchRequest(
      api.order.getById(id),
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchOrderSuccess(data))
        })
      },
      response => {
        dispatch(fetchOrderFailure(response))
      }
    ).then()
  }
}

import { api, dispatchFetchRequest } from '../constants/Backend'
export const FETCH_ORDERS_BY_DATE_RANGE = 'FETCH_ORDERS_BY_DATE_RANGE'
export const FETCH_ORDERS_BY_DATE_RANGE_SUCCESS =
  'FETCH_ORDERS_BY_DATE_RANGE_SUCCESS'
export const FETCH_ORDERS_BY_DATE_RANGE_FAILURE =
  'FETCH_ORDERS_BY_DATE_RANGE_FAILURE'

export const fetchOrdersByDateRange = () => ({
  type: FETCH_ORDERS_BY_DATE_RANGE
})

export const fetchOrdersByDateRangeSuccess = data => ({
  type: FETCH_ORDERS_BY_DATE_RANGE_SUCCESS,
  data
})

export const fetchOrdersByDateRangeFailure = error => ({
  type: FETCH_ORDERS_BY_DATE_RANGE_FAILURE,
  error
})

export const getOrdersByDateRange = () => {
  return dispatch => {
    dispatch(fetchOrdersByDateRange())

    dispatchFetchRequest(
      api.order.getordersByDateRange,
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchOrdersByDateRangeSuccess(data))
        })
      },
      response => {
        dispatch(fetchOrdersByDateRangeFailure(response))
      }
    ).then()
  }
}

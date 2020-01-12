import { api, makeFetchRequest } from '../constants/Backend'
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

    makeFetchRequest(token => {
      fetch(api.order.getordersByDateRange, {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
          Authorization: 'Bearer ' + token.access_token
        }
      })
        .then(res => res.json())
        .then(data => {
          dispatch(fetchOrdersByDateRangeSuccess(data))
          return data
        })
        .catch(error => dispatch(fetchOrdersByDateRangeFailure(error)))
    })
  }
}

function handleErrors (response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

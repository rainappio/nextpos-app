import {api, dispatchFetchRequest} from "../constants/Backend"
export const FETCH_ORDERS_INFLGHT = 'FETCH_ORDERS_INFLGHT'
export const FETCH_ORDERS_INFLGHT_SUCCESS = 'FETCH_ORDERS_INFLGHT_SUCCESS'
export const FETCH_ORDERS_INFLGHT_FAILURE = 'FETCH_ORDERS_INFLGHT_FAILURE'
export const fetchOrderInflights = () => ({
  type: FETCH_ORDERS_INFLGHT
})

export const fetchOrderInflightsSuccess = data => ({
  type: FETCH_ORDERS_INFLGHT_SUCCESS,
  data
})

export const fetchOrderInflightsFailure = error => ({
  type: FETCH_ORDERS_INFLGHT_FAILURE,
  error
})

export const getfetchOrderInflights = () => {
  return dispatch => {
    dispatch(fetchOrderInflights())

    dispatchFetchRequest(api.order.inflightOrders, {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchOrderInflightsSuccess(data))
        })
      },
      response => {
        dispatch(fetchOrderInflightsFailure(response))
      }).then()
  }
}

import {api, dispatchFetchRequest} from '../constants/Backend'
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

    dispatchFetchRequest(
      api.order.inflightOrders,
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
          // when shift is not active, this is expected so suppress error.
          'x-suppress-error': true
        }
      },
      response => {
        response.json().then(data => {
          dispatchFetchRequest(
            api.order.getAllOrderSets,
            {
              method: 'GET',
              withCredentials: true,
              credentials: 'include',
              headers: {

              }
            },
            response => {
              response.json().then(setData => {
                dispatch(fetchOrderInflightsSuccess({...data, setData: setData}))
              })
            },
            response => {
              dispatch(fetchOrderInflightsFailure(response))
            }
          ).then()
        })
      },
      response => {
        dispatch(fetchOrderInflightsFailure(response))
      }
    ).then()
  }
}

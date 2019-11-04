import { AsyncStorage } from 'react-native'
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
    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        return JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      var auth = 'Bearer ' + tokenObj.access_token
      return fetch('http://35.234.63.193/orders/inflight', {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': tokenObj.clientId,
          Authorization: auth
        }
      })
        .then(res => res.json())
        .then(data => {
          dispatch(fetchOrderInflightsSuccess(data))
          return data
        })
        .catch(error => dispatch(fetchOrderInflightsFailure(error)))
    })
  }
}

function handleErrors (response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

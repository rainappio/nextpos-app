import { AsyncStorage } from 'react-native'
export const FETCH_ORDER = 'FETCH_ORDER'
export const FETCH_ORDER_SUCCESS = 'FETCH_ORDER_SUCCESS'
export const FETCH_ORDER_FAILURE = 'FETCH_ORDER_FAILURE'
export const CLEAR_ORDER = 'CLEAR_ORDER'

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

export const clearOrder = () => ({
  type: CLEAR_ORDER
})

export const getOrder = id => {
  return dispatch => {
    dispatch(fetchOrder(id))
    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        return JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      var auth = 'Bearer ' + tokenObj.access_token
      return fetch(`http://35.234.63.193/orders/${id}`, {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'x-client-id': tokenObj.clientId,
          Authorization: auth
        }
      })
        .then(res => res.json())
        .then(data => {
          dispatch(fetchOrderSuccess(data))
          return data
        })
        .catch(error => dispatch(fetchOrderFailure(error)))
    })
  }
}

function handleErrors (response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

import { AsyncStorage } from 'react-native'
export const FETCH_PRODUCT = 'FETCH_PRODUCT'
export const FETCH_PRODUCT_SUCCESS = 'FETCH_PRODUCT_SUCCESS'
export const FETCH_PRODUCT_FAILURE = 'FETCH_PRODUCT_FAILURE'
export const CLEAR_PRODUCT = 'CLEAR_PRODUCT'

export const fetchProduct = id => ({
  type: FETCH_PRODUCT,
  id
})

export const fetchProductSuccess = data => ({
  type: FETCH_PRODUCT_SUCCESS,
  data
})

export const fetchProductFailure = error => ({
  type: FETCH_PRODUCT_FAILURE,
  error
})

export const clearProduct = () => ({
  type: CLEAR_PRODUCT
})

export const getProduct = id => {
  return dispatch => {
    dispatch(fetchProduct(id))
    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        return JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      var auth = 'Bearer ' + tokenObj.access_token
      return fetch(`http://35.234.63.193/products/${id}/?version=DESIGN`, {
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
          dispatch(fetchProductSuccess(data))
          return data
        })
        .catch(error => dispatch(fetchProductFailure(error)))
    })
  }
}

function handleErrors (response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

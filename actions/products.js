import { AsyncStorage } from 'react-native'
export const FETCH_PRODUCTS = 'FETCH_PRODUCTS'
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS'
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE'

export const fetchProducts = () => ({
  type: FETCH_PRODUCTS
})

export const fetchProductsSuccess = data => ({
  type: FETCH_PRODUCTS_SUCCESS,
  data
})

export const fetchProductsFailure = error => ({
  type: FETCH_PRODUCTS_FAILURE,
  error
})

export const getProducts = () => {
  return dispatch => {
    dispatch(fetchProducts())
    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        return JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      var auth = 'Bearer ' + tokenObj.access_token
      return fetch(
        'http://35.234.63.193/searches/products/grouped?state=DESIGN',
        {
          method: 'GET',
          withCredentials: true,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'x-client-id': tokenObj.clientId,
            Authorization: auth
          }
        }
      )
        .then(res => res.json())
        .then(data => {
          dispatch(fetchProductsSuccess(data))
          return data
        })
        .catch(error => dispatch(fetchProductsFailure(error)))
    })
  }
}

function handleErrors (response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

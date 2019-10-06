import { AsyncStorage } from 'react-native'
export const FETCH_PRODUCT_OPTIONS = 'FETCH_PRODUCT_OPTIONS'
export const FETCH_PRODUCT_OPTIONS_SUCCESS = 'FETCH_PRODUCT_OPTIONS_SUCCESS'
export const FETCH_PRODUCT_OPTIONS_FAILURE = 'FETCH_PRODUCT_OPTIONS_FAILURE'
export const CLEAR_PRODUCT_OPTIONS = 'CLEAR_PRODUCT_OPTIONS'

export const fetchProductOptions = () => ({
  type: FETCH_PRODUCT_OPTIONS,
})

export const fetchProductOptionsSuccess = data => ({
  type: FETCH_PRODUCT_OPTIONS_SUCCESS,
  data
})

export const fetchProductOptionsFailure = error => ({
  type: FETCH_PRODUCT_OPTIONS_FAILURE,
  error
})

export const getProductOptions = () => {
  return dispatch => {
    dispatch(fetchProductOptions())
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
        `http://35.234.63.193/productoptions`,
        {
          method: 'GET',
          withCredentials: true,
          credentials: 'include',
          headers: {
            'x-client-id': tokenObj.clientId,
            Authorization: auth
          }
        }
      )
        .then(res => res.json())
        .then(data => {
          dispatch(fetchProductOptionsSuccess(data))
          return data
        })
        .catch(error => dispatch(fetchProductOptionsFailure(error)))
    })
  }
}

function handleErrors (response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

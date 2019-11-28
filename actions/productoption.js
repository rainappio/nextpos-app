import { AsyncStorage } from 'react-native'
export const FETCH_PRODUCT_OPTION = 'FETCH_PRODUCT_OPTION'
export const FETCH_PRODUCT_OPTION_SUCCESS = 'FETCH_PRODUCT_OPTION_SUCCESS'
export const FETCH_PRODUCT_OPTION_FAILURE = 'FETCH_PRODUCT_OPTION_FAILURE'
export const CLEAR_PRODUCT_OPTION = 'CLEAR_PRODUCT_OPTION'

export const fetchProductOption = id => ({
  type: FETCH_PRODUCT_OPTION,
  id
})

export const fetchProductOptionSuccess = data => ({
  type: FETCH_PRODUCT_OPTION_SUCCESS,
  data
})

export const fetchProductOptionFailure = error => ({
  type: FETCH_PRODUCT_OPTION_FAILURE,
  error
})

export const clearProductOption = () => ({
  type: CLEAR_PRODUCT_OPTION
})

export const getProductOption = id => {
  return dispatch => {
    dispatch(fetchProductOption(id))
    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        return JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      var auth = 'Bearer ' + tokenObj.access_token
      return fetch(`http://35.234.63.193/productoptions/${id}?version=DESIGN`, {
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
          dispatch(fetchProductOptionSuccess(data))
          return data
        })
        .catch(error => dispatch(fetchProductOptionFailure(error)))
    })
  }
}

function handleErrors (response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

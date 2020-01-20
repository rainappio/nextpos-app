import { api, dispatchFetchRequest } from '../constants/Backend'
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

    dispatchFetchRequest(
      api.product.getById(id),
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchProductSuccess(data))
        })
      },
      response => {
        dispatch(fetchProductFailure(response))
      }
    ).then()
  }
}

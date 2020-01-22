import { api, dispatchFetchRequest } from '../constants/Backend'
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

    dispatchFetchRequest(
      api.product.getAllGrouped,
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchProductsSuccess(data))
        })
      },
      response => {
        dispatch(fetchProductsFailure(response))
      }
    ).then()
  }
}

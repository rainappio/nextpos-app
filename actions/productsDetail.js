import {api, dispatchFetchRequest} from '../constants/Backend'
export const FETCH_PRODUCTSDETAIL = 'FETCH_PRODUCTSDETAIL'
export const FETCH_PRODUCTSDETAIL_SUCCESS = 'FETCH_PRODUCTSDETAIL_SUCCESS'
export const FETCH_PRODUCTSDETAIL_FAILURE = 'FETCH_PRODUCTSDETAIL_FAILURE'

export const fetchProductsDetail = () => ({
  type: FETCH_PRODUCTSDETAIL
})

export const fetchProductsDetailSuccess = data => ({
  type: FETCH_PRODUCTSDETAIL_SUCCESS,
  data
})

export const fetchProductsDetailFailure = error => ({
  type: FETCH_PRODUCTSDETAIL_FAILURE,
  error
})

export const getProductsDetail = () => {
  return dispatch => {
    dispatch(fetchProductsDetail())

    dispatchFetchRequest(
      api.product.getAllDetail,
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchProductsDetailSuccess(data))
        })
      },
      response => {
        dispatch(fetchProductsDetailFailure(response))
      }
    ).then()
  }
}

import {api, dispatchFetchRequest} from "../constants/Backend"
export const FETCH_PRODUCT_OPTIONS = 'FETCH_PRODUCT_OPTIONS'
export const FETCH_PRODUCT_OPTIONS_SUCCESS = 'FETCH_PRODUCT_OPTIONS_SUCCESS'
export const FETCH_PRODUCT_OPTIONS_FAILURE = 'FETCH_PRODUCT_OPTIONS_FAILURE'
export const CLEAR_PRODUCT_OPTIONS = 'CLEAR_PRODUCT_OPTIONS'

export const fetchProductOptions = () => ({
  type: FETCH_PRODUCT_OPTIONS
})

export const fetchProductOptionsSuccess = data => ({
  type: FETCH_PRODUCT_OPTIONS_SUCCESS,
  data
})

export const fetchProductOptionsFailure = error => ({
  type: FETCH_PRODUCT_OPTIONS_FAILURE,
  error
})

export const getProductOptions = labelId => {
  return dispatch => {
    dispatch(fetchProductOptions())
    dispatchFetchRequest(api.productOption.getAll(labelId), {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',
      headers: {}
    }, response => {
      response.json().then(data => {
        dispatch(fetchProductOptionsSuccess(data))
      })
    }, response => {
      dispatch(fetchProductOptionsFailure(response))
    }).then()
  }
}

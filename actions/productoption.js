import { api, dispatchFetchRequest } from '../constants/Backend'
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

    dispatchFetchRequest(
      api.productOption.getById(id),
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchProductOptionSuccess(data))
        })
      },
      response => {
        dispatch(fetchProductOptionFailure(response))
      }
    ).then()
  }
}

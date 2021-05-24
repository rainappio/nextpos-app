import {api, dispatchFetchRequest} from '../constants/Backend'

export const FETCH_PAYMENTMETHODS = 'FETCH_PAYMENTMETHODS'
export const FETCH_PAYMENTMETHODS_SUCCESS = 'FETCH_PAYMENTMETHODS_SUCCESS'
export const FETCH_PAYMENTMETHODS_FAILURE = 'FETCH_PAYMENTMETHODS_FAILURE'

export const fetchPaymentMethods = () => ({
  type: FETCH_PAYMENTMETHODS
})

export const fetchPaymentMethodsSuccess = data => ({
  type: FETCH_PAYMENTMETHODS_SUCCESS,
  data
})

export const fetchPaymentMethodsFailure = error => ({
  type: FETCH_PAYMENTMETHODS_FAILURE,
  error
})

export const getPaymentMethods = () => {
  return dispatch => {
    dispatch(fetchPaymentMethods())

    dispatchFetchRequest(
      api.client.getPaymentMethodsList,
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchPaymentMethodsSuccess(data))
        })
      },
      response => {
        dispatch(fetchPaymentMethodsFailure(response))
      }
    ).then()
  }
}

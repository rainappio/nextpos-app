import { api, dispatchFetchRequest } from '../constants/Backend'
export const FETCH_PRINTERS = 'FETCH_PRINTERS'
export const FETCH_PRINTERS_SUCCESS = 'FETCH_PRINTERS_SUCCESS'
export const FETCH_PRINTERS_FAILURE = 'FETCH_PRINTERS_FAILURE'

export const fetchPrinters = () => ({
  type: FETCH_PRINTERS
})

export const fetchPrintersSuccess = data => ({
  type: FETCH_PRINTERS_SUCCESS,
  data
})

export const fetchPrintersFailure = error => ({
  type: FETCH_PRINTERS_FAILURE,
  error
})

export const getPrinters = () => {
  return dispatch => {
    dispatch(fetchPrinters())

    dispatchFetchRequest(
      api.printer.getPrinters,
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchPrintersSuccess(data))
        })
      },
      response => {
        dispatch(fetchPrintersFailure(response))
      }
    ).then()
  }
}

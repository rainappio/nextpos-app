import {api, dispatchFetchRequest} from '../constants/Backend'
export const FETCH_PRINTER = 'FETCH_PRINTER'
export const FETCH_PRINTER_SUCCESS = 'FETCH_PRINTER_SUCCESS'
export const FETCH_PRINTER_FAILURE = 'FETCH_PRINTER_FAILURE'
export const CLEAR_PRINTER = 'CLEAR_PRINTER'

export const fetchPrinter = id => ({
  type: FETCH_PRINTER,
  id
})

export const fetchPrinterSuccess = data => ({
  type: FETCH_PRINTER_SUCCESS,
  data
})

export const fetchPrinterFailure = error => ({
  type: FETCH_PRINTER_FAILURE,
  error
})

export const clearPrinter = () => ({
  type: CLEAR_PRINTER
})

export const getPrinter = id => {
  return dispatch => {
    dispatch(fetchPrinter(id))

    dispatchFetchRequest(api.printer.getPrinter(id), {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchPrinterSuccess(data))
        })
      },
      response => {
        dispatch(fetchPrinterFailure(response))
      }).then()
  }
}

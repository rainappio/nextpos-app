import { api, makeFetchRequest } from '../constants/Backend'
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
    makeFetchRequest(token => {
      fetch(api.printer.getPrinter + `${id}`, {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': token.application_client_id,
          Authorization: 'Bearer ' + token.access_token
        }
      })
        .then(res => res.json())
        .then(data => {
          dispatch(fetchPrinterSuccess(data))
          return data
        })
        .catch(error => dispatch(fetchPrinterFailure(error)))
    })
  }
}

function handleErrors (response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

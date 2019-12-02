import { api, makeFetchRequest } from '../constants/Backend'
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

    makeFetchRequest(token => {
      fetch(api.printer.getPrinters, {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
          Authorization: 'Bearer ' + token.access_token
        }
      })
        .then(res => res.json())
        .then(data => {
          dispatch(fetchPrintersSuccess(data))
          return data
        })
        .catch(error => dispatch(fetchPrintersFailure(error)))
    })
  }
}

function handleErrors (response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

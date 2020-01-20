import { api, dispatchFetchRequest } from '../constants/Backend'
export const FETCH_TABLES_AVAILABLE = 'FETCH_TABLES_AVAILABLE'
export const FETCH_TABLES_AVAILABLE_SUCCESS = 'FETCH_TABLES_AVAILABLE_SUCCESS'
export const FETCH_TABLES_AVAILABLE_FAILURE = 'FETCH_TABLES_AVAILABLE_FAILURE'

export const fetchTablesAvailable = id => ({
  type: FETCH_TABLES_AVAILABLE,
  id
})

export const fetchTablesAvailableSuccess = data => ({
  type: FETCH_TABLES_AVAILABLE_SUCCESS,
  data
})

export const fetchTablesAvailableFailure = error => ({
  type: FETCH_TABLES_AVAILABLE_FAILURE,
  error
})

export const getTablesAvailable = () => {
  return dispatch => {
    dispatch(fetchTablesAvailable())

    dispatchFetchRequest(
      api.table.getavailTable,
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
          // when shift is not active, this is expected so suppress error.
          'x-suppress-error': true
        }
      },
      response => {
        response.json().then(data => {
          dispatch(fetchTablesAvailableSuccess(data))
        })
      },
      response => {
        dispatch(fetchTablesAvailableFailure(response))
      }
    ).then()
  }
}

import { api, makeFetchRequest } from '../constants/Backend'
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
    makeFetchRequest(token => {
      fetch(api.table.getavailTable, {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token.access_token
        }
      })
        .then(res => res.json())
        .then(data => {
          dispatch(fetchTablesAvailableSuccess(data))
          return data
        })
        .catch(error => dispatch(fetchTablesAvailableFailure(error)))
    })
  }
}

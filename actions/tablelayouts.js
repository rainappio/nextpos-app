import {api, dispatchFetchRequest} from '../constants/Backend'
export const FETCH_TABLES = 'FETCH_TABLES'
export const FETCH_TABLES_SUCCESS = 'FETCH_TABLES_SUCCESS'
export const FETCH_TABLES_FAILURE = 'FETCH_TABLES_FAILURE'

export const fetchTableLayouts = () => ({
  type: FETCH_TABLES
})

export const fetchTableLayoutsSuccess = data => ({
  type: FETCH_TABLES_SUCCESS,
  data
})

export const fetchTableLayoutsFailure = error => ({
  type: FETCH_TABLES_FAILURE,
  error
})

export const getTableLayouts = () => {
  return dispatch => {
    dispatch(fetchTableLayouts())

    dispatchFetchRequest(
      api.tablelayout.getAll,
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchTableLayoutsSuccess(data))
        })
      },
      response => {
        dispatch(fetchTableLayoutsFailure(response))
      }
    ).then()
  }
}

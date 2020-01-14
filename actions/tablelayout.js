import {api, dispatchFetchRequest} from "../constants/Backend"
export const FETCH_TABLELAYOUT = 'FETCH_TABLELAYOUT'
export const FETCH_TABLELAYOUT_SUCCESS = 'FETCH_TABLELAYOUT_SUCCESS'
export const FETCH_TABLELAYOUT_FAILURE = 'FETCH_TABLELAYOUT_FAILURE'
export const CLEAR_TABLELAYOUT = 'CLEAR_TABLELAYOUT'

export const fetchTableLayout = id => ({
  type: FETCH_TABLELAYOUT,
  id
})

export const fetchTableLayoutSuccess = data => ({
  type: FETCH_TABLELAYOUT_SUCCESS,
  data
})

export const fetchTableLayoutFailure = error => ({
  type: FETCH_TABLELAYOUT_FAILURE,
  error
})

export const clearTableLayout = () => ({
  type: CLEAR_TABLELAYOUT
})

export const getTableLayout = id => {
  return dispatch => {
    dispatch(fetchTableLayout(id))

    dispatchFetchRequest(api.tablelayout.getById(id), {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchTableLayoutSuccess(data))
        })
      }, response => {
        dispatch(fetchTableLayoutFailure(response))
      }).then()
  }
}

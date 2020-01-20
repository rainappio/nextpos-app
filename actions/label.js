import { api, dispatchFetchRequest } from '../constants/Backend'
export const FETCH_LABEL = 'FETCH_LABEL'
export const FETCH_LABEL_SUCCESS = 'FETCH_LABEL_SUCCESS'
export const FETCH_LABEL_FAILURE = 'FETCH_LABEL_FAILURE'
export const CLEAR_LABEL = 'CLEAR_LABEL'

export const fetchLabel = id => ({
  type: FETCH_LABEL,
  id
})

export const fetchLabelSuccess = data => ({
  type: FETCH_LABEL_SUCCESS,
  data
})

export const fetchLabelFailure = error => ({
  type: FETCH_LABEL_FAILURE,
  error
})

export const clearLabel = () => ({
  type: CLEAR_LABEL
})

export const getLabel = id => {
  return dispatch => {
    dispatch(fetchLabel(id))

    dispatchFetchRequest(
      api.productLabel.getById(id),
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchLabelSuccess(data))
        })
      },
      response => {
        dispatch(fetchLabelFailure(response))
      }
    ).then()
  }
}

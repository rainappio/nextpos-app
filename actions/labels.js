import {api, dispatchFetchRequest} from "../constants/Backend"
export const FETCH_LABELS = 'FETCH_LABELS'
export const FETCH_LABELS_SUCCESS = 'FETCFETCH_LABELS_SUCCESSH_L'
export const FETCH_LABELS_FAILURE = 'FETCH_LABELS_FAILURE'

export const fetchLabels = () => ({
  type: FETCH_LABELS
})

export const fetchLabelsSuccess = data => ({
  type: FETCH_LABELS_SUCCESS,
  data
})

export const fetchLabelsFailure = error => ({
  type: FETCH_LABELS_FAILURE,
  error
})

export const getLables = () => {
  return dispatch => {
    dispatch(fetchLabels())

    dispatchFetchRequest(api.productLabel.getAll, {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchLabelsSuccess(data))
        })
      },
      response => {
        dispatch(fetchLabelsFailure(response))
      }).then()
  }
}

function handleErrors (response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

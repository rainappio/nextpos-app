import {api, dispatchFetchRequest} from '../constants/Backend'
export const FETCH_WORKING_AREA = 'FETCH_WORKING_AREA'
export const FETCH_WORKING_AREA_SUCCESS = 'FETCH_WORKING_AREA_SUCCESS'
export const FETCH_WORKING_AREA_FAILURE = 'FETCH_WORKING_AREA_FAILURE'
export const CLEAR_WORKING_AREA = 'CLEAR_WORKING_AREA'

export const fetchWorkingArea = id => ({
  type: FETCH_WORKING_AREA,
  id
})

export const fetchWorkingAreaSuccess = data => ({
  type: FETCH_WORKING_AREA_SUCCESS,
  data
})

export const fetchWorkingAreaFailure = error => ({
  type: FETCH_WORKING_AREA_FAILURE,
  error
})

export const clearWorkingArea = () => ({
  type: CLEAR_WORKING_AREA
})

export const getWorkingArea = id => {
  return dispatch => {
    dispatch(fetchWorkingArea(id))

    dispatchFetchRequest(api.workingarea.getById(id), {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchWorkingAreaSuccess(data))
        })
      },
      response => {
        dispatch(fetchWorkingAreaFailure(response))
      }).then()
  }
}

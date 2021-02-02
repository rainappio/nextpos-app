import {api, dispatchFetchRequest} from '../constants/Backend'
export const FETCH_WORKING_AREAS = 'FETCH_WORKING_AREA'
export const FETCH_WORKING_AREAS_SUCCESS = 'FETCH_WORKING_AREAS_SUCCESS'
export const FETCH_WORKING_AREAS_FAILURE = 'FETCH_WORKING_AREAS_FAILURE'

export const fetchWorkingAreas = (visibility) => ({
  type: FETCH_WORKING_AREAS,
  visibility
})

export const fetchWorkingAreasSuccess = data => ({
  type: FETCH_WORKING_AREAS_SUCCESS,
  data
})

export const fetchWorkingAreasFailure = error => ({
  type: FETCH_WORKING_AREAS_FAILURE,
  error
})

export const getWorkingAreas = (visibility = 'ALL') => {
  console.log('visibility', visibility)
  return dispatch => {
    dispatch(fetchWorkingAreas(visibility))

    dispatchFetchRequest(
      `${api.workingarea.getAll}?visibility=${visibility}`,
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchWorkingAreasSuccess(data))
        })
      },
      response => {
        dispatch(fetchWorkingAreasFailure(response))
      }
    ).then()
  }
}

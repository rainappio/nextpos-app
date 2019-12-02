import { api, makeFetchRequest } from '../constants/Backend'
export const FETCH_WORKING_AREAS = 'FETCH_WORKING_AREA'
export const FETCH_WORKING_AREAS_SUCCESS = 'FETCH_WORKING_AREAS_SUCCESS'
export const FETCH_WORKING_AREAS_FAILURE = 'FETCH_WORKING_AREAS_FAILURE'

export const fetchWorkingAreas = () => ({
  type: FETCH_WORKING_AREAS
})

export const fetchWorkingAreasSuccess = data => ({
  type: FETCH_WORKING_AREAS_SUCCESS,
  data
})

export const fetchWorkingAreasFailure = error => ({
  type: FETCH_WORKING_AREAS_FAILURE,
  error
})

export const getWorkingAreas = () => {
  return dispatch => {
    dispatch(fetchWorkingAreas())

    makeFetchRequest(token => {
      fetch(api.workingarea.getWorkingAreas, {
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
          dispatch(fetchWorkingAreasSuccess(data))
          return data
        })
        .catch(error => dispatch(fetchWorkingAreasFailure(error)))
    })
  }
}

function handleErrors (response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

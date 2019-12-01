export const FETCH_WORKING_AREA = 'FETCH_WORKING_AREA'
export const FETCH_WORKING_AREA_SUCCESS = 'FETCH_WORKING_AREA_SUCCESS'
export const FETCH_WORKING_AREA_FAILURE = 'FETCH_WORKING_AREA_FAILURE'
export const CLEAR_WORKING_AREA = 'CLEAR_WORKING_AREA'
import { api, makeFetchRequest } from '../constants/Backend'

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
  makeFetchRequest(token => {
    fetch(api.workingarea.getworkingArea + `${id}`,{
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
        dispatch(fetchWorkingAreaSuccess(data))
        return data
      })
      .catch(error => dispatch(fetchWorkingAreaFailure(error)))
    })
  }
}

function handleErrors (response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

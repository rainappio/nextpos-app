import {api, dispatchFetchRequest} from '../constants/Backend'
export const FETCH_ACTUATOR = 'FETCH_ACTUATOR'
export const FETCH_ACTUATOR_SUCCESS = 'FETCH_ACTUATOR_SUCCESS'
export const FETCH_ACTUATOR_FAILURE = 'FETCH_ACTUATOR_FAILURE'

export const fetchActuator = () => ({
  type: FETCH_ACTUATOR
})

export const fetchActuatorSuccess = data => ({
  type: FETCH_ACTUATOR_SUCCESS,
  data
})

export const fetchActuatorFailure = error => ({
  type: FETCH_ACTUATOR_FAILURE,
  error
})

export const getActuatorStatus = () => {
  return async dispatch => {
    dispatch(fetchActuator())

    return await dispatchFetchRequest(
      api.actuator.get,
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchActuatorSuccess(data))
        })
      },
      response => {
        dispatch(fetchActuatorFailure(response))
      }
    ).then()
  }
}

import {api, dispatchFetchRequest} from '../constants/Backend'

export const FETCH_CLIENT = 'FETCH_CLIENT'
export const FETCH_CLIENT_SUCCESS = 'FETCH_CLIENT_SUCCESS'
export const FETCH_CLIENT_FAILURE = 'FETCH_CLIENT_FAILURE'
export const CLEAR_CLIENT = 'CLEAR_CLIENT'

export const fetchClient = () => ({
  type: FETCH_CLIENT
})

export const fetchClientSuccess = data => ({
  type: FETCH_CLIENT_SUCCESS,
  data
})

export const fetchClientFailure = error => ({
  type: FETCH_CLIENT_FAILURE,
  error
})

export const getCurrentClient = () => {
  return dispatch => {
    dispatch(fetchClient())

    dispatchFetchRequest(
      api.client.get,
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatchFetchRequest(api.client.getStatus, {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
          }, response => {
            response.json().then(data2 => {
              dispatch(fetchClientSuccess({...data, localClientStatus: data2}))
            })
          }).then()
        })
      },
      response => {
        dispatch(fetchClientFailure(response))
      }
    ).then()
  }
}

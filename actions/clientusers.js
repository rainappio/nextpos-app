import { api, dispatchFetchRequest } from '../constants/Backend'
export const FETCH_CLIENTUSERS = 'FETCH_CLIENTUSERS'
export const FETCH_CLIENTUSERS_SUCCESS = 'FETCH_CLIENTUSERS_SUCCESS'
export const FETCH_CLIENTUSERS_FAILURE = 'FETCH_CLIENTUSERS_FAILURE'

export const fetchClientsUsers = () => ({
  type: FETCH_CLIENTUSERS
})

export const fetchClientsUsersSuccess = data => ({
  type: FETCH_CLIENTUSERS_SUCCESS,
  data
})

export const fetchClientsUsersFailure = error => ({
  type: FETCH_CLIENTUSERS_FAILURE,
  error
})

export const getClientUsrs = () => {
  return dispatch => {
    dispatch(fetchClientsUsers())

    dispatchFetchRequest(
      api.clientUser.getAll,
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchClientsUsersSuccess(data))
        })
      },
      response => {
        dispatch(fetchClientsUsersFailure(response))
      }
    ).then()
  }
}

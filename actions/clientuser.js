import { api, dispatchFetchRequest } from '../constants/Backend'
export const FETCH_CLIENT = 'FETCH_CLIENT'
export const FETCH_CLIENT_SUCCESS = 'FETCH_CLIENT_SUCCESS'
export const FETCH_CLIENT_FAILURE = 'FETCH_CLIENT_FAILURE'
export const CLEAR_CLIENT = 'CLEAR_CLIENT'

export const fetchClient = name => ({
  type: FETCH_CLIENT,
  name
})

export const fetchClientSuccess = data => ({
  type: FETCH_CLIENT_SUCCESS,
  data
})

export const fetchClientFailure = error => ({
  type: FETCH_CLIENT_FAILURE,
  error
})

export const clearClient = () => ({
  type: CLEAR_CLIENT
})

export const getClientUsr = name => {
  return dispatch => {
    dispatch(fetchClient(name))

    dispatchFetchRequest(
      api.clientUser.get(name),
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchClientSuccess(data))
        })
      },
      response => {
        dispatch(fetchClientFailure(response))
      }
    ).then()
  }
}

export const resolveRoles = selectedRoleIndex => {
  let roles = [ 'USER' ]

  switch (selectedRoleIndex) {
    case 1:
      roles = [ ...roles, 'MANAGER']
      break
    case 2:
      roles = [ ...roles, 'MANAGER', 'OWNER']
      break
  }

  return roles
}

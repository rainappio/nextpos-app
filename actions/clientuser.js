import { api, dispatchFetchRequest } from '../constants/Backend'
export const FETCH_CLIENT_USER = 'FETCH_CLIENT_USER'
export const FETCH_CLIENT_USER_SUCCESS = 'FETCH_CLIENT_USER_SUCCESS'
export const FETCH_CLIENT_USER_FAILURE = 'FETCH_CLIENT_USER_FAILURE'
export const CLEAR_CLIENT_USER = 'CLEAR_CLIENT_USER'

export const fetchClientUser = name => ({
  type: FETCH_CLIENT_USER,
  name
})

export const fetchClientUserSuccess = data => ({
  type: FETCH_CLIENT_USER_SUCCESS,
  data
})

export const fetchClientUserFailure = error => ({
  type: FETCH_CLIENT_USER_FAILURE,
  error
})

export const clearClientUser = () => ({
  type: CLEAR_CLIENT_USER
})

export const getClientUsr = name => {
  return dispatch => {
    dispatch(fetchClientUser(name))

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
          dispatch(fetchClientUserSuccess(data))
        })
      },
      response => {
        dispatch(fetchClientUserFailure(response))
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

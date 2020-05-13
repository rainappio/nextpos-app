import { api, dispatchFetchRequest } from '../constants/Backend'
export const FETCH_USER_ROLES = 'FETCH_USER_ROLES'
export const FETCH_USER_ROLES_SUCCESS = 'FETCH_USER_ROLES_SUCCESS'
export const FETCH_USER_ROLES_FAILURE = 'FETCH_USER_ROLES_FAILURE'

export const fetchUserRoles = () => ({
  type: FETCH_USER_ROLES
})

export const fetchUserRolesSuccess = data => ({
  type: FETCH_USER_ROLES_SUCCESS,
  data
})

export const fetchUserRolesFailure = error => ({
  type: FETCH_USER_ROLES_FAILURE,
  error
})

export const getUserRoles = () => {
  return dispatch => {
    dispatch(fetchUserRoles())

    dispatchFetchRequest(
      api.clientUser.getuserRoles,
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchUserRolesSuccess(data))
        })
      },
      response => {
        dispatch(fetchUserRolesFailure(response))
      }
    ).then()
  }
}

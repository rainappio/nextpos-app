import { api, dispatchFetchRequest } from '../constants/Backend'
export const FETCH_USER_ROLE = 'FETCH_USER_ROLE'
export const FETCH_USER_ROLE_SUCCESS = 'FETCH_USER_ROLE_SUCCESS'
export const FETCH_USER_ROLE_FAILURE = 'FETCH_USER_ROLE_FAILURE'
export const CLEAR_USER_ROLE = 'CLEAR_USER_ROLE'

export const fetchUserRole = id => ({
  type: FETCH_USER_ROLE,
  id
})

export const fetchUserRoleSuccess = data => ({
  type: FETCH_USER_ROLE_SUCCESS,
  data
})

export const fetchUserRoleFailure = error => ({
  type: FETCH_USER_ROLE_FAILURE,
  error
})

export const clearUserRole = () => ({
  type: CLEAR_USER_ROLE
})

export const getUserRole = id => {
  return dispatch => {
    dispatch(fetchUserRole(id))

    dispatchFetchRequest(
      api.clientUser.getuserRole(id),
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchUserRoleSuccess(data))
        })
      },
      response => {
        dispatch(fetchUserRoleFailure(response))
      }
    ).then()
  }
}

import { api, dispatchFetchRequest } from '../constants/Backend'
export const FETCH_PERMISSIONS = 'FETCH_PERMISSIONS'
export const FETCH_PERMISSIONS_SUCCESS = 'FETCH_PERMISSIONS_SUCCESS'
export const FETCH_PERMISSIONS_FAILURE = 'FETCH_PERMISSIONS_FAILURE'

export const fetchPermissions = () => ({
  type: FETCH_PERMISSIONS
})

export const fetchPermissionsSuccess = data => ({
  type: FETCH_PERMISSIONS_SUCCESS,
  data
})

export const fetchPermissionsFailure = error => ({
  type: FETCH_PERMISSIONS_FAILURE,
  error
})

export const getPermissions = () => {
  return dispatch => {
    dispatch(fetchPermissions())

    dispatchFetchRequest(
      api.clientUser.getPermissions,
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchPermissionsSuccess(data))
        })
      },
      response => {
        dispatch(fetchPermissionsFailure(response))
      }
    ).then()
  }
}

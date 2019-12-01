import {api, makeFetchRequest} from "../constants/Backend";

export const FETCH_CLIENT = 'FETCH_CLIENT'
export const FETCH_CLIENT_SUCCESS = 'FETCH_CLIENT_SUCCESS'
export const FETCH_CLIENT_FAILURE = 'FETCH_CLIENT_FAILURE'

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

    makeFetchRequest((token) => {
      return fetch(
        api.client.get,
        {
          method: 'GET',
          withCredentials: true,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.access_token}`
          }
        }
      )
        .then(res => res.json())
        .then(data => {
          console.log(`returned client: ${data}`)
          dispatch(fetchClientSuccess(data))
          return data
        })
        .catch(error => dispatch(fetchClientFailure(error)))
    })
  }
}

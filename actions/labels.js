import { AsyncStorage } from 'react-native'
export const FETCH_LABELS = 'FETCH_LABELS'
export const FETCH_LABELS_SUCCESS = 'FETCFETCH_LABELS_SUCCESSH_L'
export const FETCH_LABELS_FAILURE = 'FETCH_LABELS_FAILURE'

export const fetchLabels = () => ({
  type: FETCH_LABELS
})

export const fetchLabelsSuccess = data => ({
  type: FETCH_LABELS_SUCCESS,
  data
})

export const fetchLabelsFailure = error => ({
  type: FETCH_LABELS_FAILURE,
  error
})

export const getLables = () => {
  return dispatch => {
    dispatch(fetchLabels())
    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      var auth = 'Bearer ' + tokenObj.access_token
      return fetch('http://35.234.63.193/labels', {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-client-id': tokenObj.clientId,
          Authorization: auth
        }
      })
        .then(res => res.json())
        .then(data => {
          dispatch(fetchLabelsSuccess(data))
          return data
        })
        .catch(error => dispatch(fetchLabelsFailure(error)))
    })
  }
}

function handleErrors (response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

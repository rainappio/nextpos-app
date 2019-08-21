import { AsyncStorage } from 'react-native'
export const FETCH_LABEL = 'FETCH_LABEL'
export const FETCH_LABEL_SUCCESS = 'FETCH_LABEL_SUCCESS'
export const FETCH_LABEL_FAILURE = 'FETCH_LABEL_FAILURE'

export const fetchLabel = id => ({
  type: FETCH_LABEL,
  id
})

export const fetchLabelSuccess = data => ({
  type: FETCH_LABEL_SUCCESS,
  data
})

export const fetchLabelFailure = error => ({
  type: FETCH_LABEL_FAILURE,
  error
})

export const getLabel = id => {
  return dispatch => {
    dispatch(fetchLabel(id))
    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      var auth = 'Bearer ' + tokenObj.access_token
      return fetch(`http://35.234.63.193/labels/${id}`, {
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
          dispatch(fetchLabelSuccess(data))
          return data
        })
        .catch(error => dispatch(fetchLabelFailure(error)))
    })
  }
}

function handleErrors (response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

import { AsyncStorage } from 'react-native'
export const FETCH_WORKING_AREAS = 'FETCH_WORKING_AREA'
export const FETCH_WORKING_AREAS_SUCCESS = 'FETCH_WORKING_AREAS_SUCCESS'
export const FETCH_WORKING_AREAS_FAILURE = 'FETCH_WORKING_AREAS_FAILURE'

export const fetchWorkingAreas = () => ({
  type: FETCH_WORKING_AREAS
})

export const fetchWorkingAreasSuccess = data => ({
  type: FETCH_WORKING_AREAS_SUCCESS,
  data
})

export const fetchWorkingAreasFailure = error => ({
  type: FETCH_WORKING_AREAS_FAILURE,
  error
})

export const getWorkingAreas = () => {
  return dispatch => {
    dispatch(fetchWorkingAreas())
    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        return JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      var auth = 'Bearer ' + tokenObj.access_token
      return fetch(
        'http://35.234.63.193/workingareas',
        {
          method: 'GET',
          withCredentials: true,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'x-client-id': tokenObj.clientId,
            Authorization: auth
          }
        }
      )
        .then(res => res.json())
        .then(data => {
          dispatch(fetchWorkingAreasSuccess(data))
          return data
        })
        .catch(error => dispatch(fetchWorkingAreasFailure(error)))
    })
  }
}

function handleErrors (response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

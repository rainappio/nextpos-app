import { api, dispatchFetchRequest } from '../constants/Backend'
export const FETCH_ANNOUNCEMENTS = 'FETCH_ANNOUNCEMENTS'
export const FETCH_ANNOUNCEMENTS_SUCCESS = 'FETCH_ANNOUNCEMENTS_SUCCESS'
export const FETCH_ANNOUNCEMENTS_FAILURE = 'FETCH_ANNOUNCEMENTS_FAILURE'

export const fetchAnnouncements = () => ({
  type: FETCH_ANNOUNCEMENTS
})

export const fetchAnnouncementsSuccess = data => ({
  type: FETCH_ANNOUNCEMENTS_SUCCESS,
  data
})

export const fetchAnnouncementsFailure = error => ({
  type: FETCH_ANNOUNCEMENTS_FAILURE,
  error
})

export const getAnnouncements = () => {
  return dispatch => {
    dispatch(fetchAnnouncements())

    dispatchFetchRequest(
      api.announcements.get,
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchAnnouncementsSuccess(data))
        })
      },
      response => {
        dispatch(fetchAnnouncementsFailure(error))
      }
    ).then()
  }
}
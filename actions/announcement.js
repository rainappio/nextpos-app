import { api, dispatchFetchRequest } from '../constants/Backend'
export const FETCH_ANNOUNCEMENT = 'FETCH_ANNOUNCEMENT'
export const FETCH_ANNOUNCEMENT_SUCCESS = 'FETCH_ANNOUNCEMENT_SUCCESS'
export const FETCH_ANNOUNCEMENT_FAILURE = 'FETCH_ANNOUNCEMENT_FAILURE'
export const CLEAR_ANNOUNCEMENT = 'CLEAR_ANNOUNCEMENT'

export const fetchAnnouncement = id => ({
  type: FETCH_ANNOUNCEMENT,
  id
})

export const fetchAnnouncementSuccess = data => ({
  type: FETCH_ANNOUNCEMENT_SUCCESS,
  data
})

export const fetchAnnouncementFailure = error => ({
  type: FETCH_ANNOUNCEMENT_FAILURE,
  error
})

export const clearAnnouncement = () => ({
  type: CLEAR_ANNOUNCEMENT
})

export const getAnnouncement = id => {
  return dispatch => {
    dispatch(fetchAnnouncement(id))

    dispatchFetchRequest(
      api.announcements.getById(id),
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchAnnouncementSuccess(data))
        })
      },
      response => {
        dispatch(fetchAnnouncementFailure(response))
      }
    ).then()
  }
}
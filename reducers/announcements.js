import {
  FETCH_ANNOUNCEMENTS,
  FETCH_ANNOUNCEMENTS_SUCCESS,
  FETCH_ANNOUNCEMENTS_FAILURE
} from '../actions'

const initialState = {
  data: {},
  loading: false,
  haveData: false,
  haveError: false,
  error: null
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ANNOUNCEMENTS:
      return {
        ...state,
        loading: true,
        haveData: false,
        haveError: false,
        error: null
      }
    case FETCH_ANNOUNCEMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        haveData: true,
        haveError: false,
        data: action.data
      }
    case FETCH_ANNOUNCEMENTS_FAILURE:
      return {
        ...state,
        loading: false,
        haveData: false,
        haveError: true,
        error: action.error,
        data: {}
      }
    default:
      return state
  }
}

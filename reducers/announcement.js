import {
  FETCH_ANNOUNCEMENT,
  FETCH_ANNOUNCEMENT_SUCCESS,
  FETCH_ANNOUNCEMENT_FAILURE,
  CLEAR_ANNOUNCEMENT
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
    case FETCH_ANNOUNCEMENT:
      return {
        ...state,
        loading: true,
        haveData: false,
        haveError: false,
        error: null
      }
    case FETCH_ANNOUNCEMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        haveData: true,
        haveError: false,
        data: action.data
      }
    case FETCH_ANNOUNCEMENT_FAILURE:
      return {
        ...state,
        loading: false,
        haveData: false,
        haveError: true,
        error: action.error,
        data: {}
      }
    case CLEAR_ANNOUNCEMENT:
      return initialState
    default:
      return state
  }
}

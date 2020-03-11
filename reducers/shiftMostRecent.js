import {
  FETCH_SHIFT_MOST_RECENT,
  FETCH_SHIFT_MOST_RECENT_SUCCESS,
  FETCH_SHIFT_MOST_RECENT_FAILURE
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
    case FETCH_SHIFT_MOST_RECENT:
      return {
        ...state,
        loading: true,
        haveData: false,
        haveError: false,
        error: null
      }
    case FETCH_SHIFT_MOST_RECENT_SUCCESS:
      return {
        ...state,
        loading: false,
        haveData: true,
        haveError: false,
        data: action.data
      }
    case FETCH_SHIFT_MOST_RECENT_FAILURE:
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

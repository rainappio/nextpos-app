import {
  FETCH_LABELS,
  FETCH_LABELS_SUCCESS,
  FETCH_LABELS_FAILURE
} from '../actions'

const initialState = {
  data: [],
  loading: true,
  error: null
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LABELS:
      return {
        ...state,
        loading: true,
        error: null
      }
    case FETCH_LABELS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.data
      }
    case FETCH_LABELS_FAILURE:
      return {
        ...state,
        loading: true,
        error: action.error,
        data: []
      }
    default:
      return state
  }
}

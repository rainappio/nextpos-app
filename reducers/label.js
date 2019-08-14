import {
  FETCH_LABEL,
  FETCH_LABEL_SUCCESS,
  FETCH_LABEL_FAILURE
} from '../actions'

const initialState = {
  data: [],
  loading: true,
  error: null
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LABEL:
      return {
        ...state,
        loading: true,
        error: null
      }
    case FETCH_LABEL_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.data
      }
    case FETCH_LABEL_FAILURE:
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

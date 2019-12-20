import {
  FETCH_TABLES_AVAILABLE,
  FETCH_TABLES_AVAILABLE_SUCCESS,
  FETCH_TABLES_AVAILABLE_FAILURE
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
    case FETCH_TABLES_AVAILABLE:
      return {
        ...state,
        loading: true,
        haveData: false,
        haveError: false,
        error: null
      }
    case FETCH_TABLES_AVAILABLE_SUCCESS:
      return {
        ...state,
        loading: false,
        haveData: true,
        haveError: false,
        data: action.data
      }
    case FETCH_TABLES_AVAILABLE_FAILURE:
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

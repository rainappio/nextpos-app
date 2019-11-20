import {
  FETCH_TABLELAYOUT,
  FETCH_TABLELAYOUT_SUCCESS,
  FETCH_TABLELAYOUT_FAILURE,
  CLEAR_TABLELAYOUT
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
    case FETCH_TABLELAYOUT:
      return {
        ...state,
        loading: true,
        haveData: false,
        haveError: false,
        error: null
      }
    case FETCH_TABLELAYOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        haveData: true,
        haveError: false,
        data: action.data
      }
    case FETCH_TABLELAYOUT_FAILURE:
      return {
        ...state,
        loading: false,
        haveData: false,
        haveError: true,
        error: action.error,
        data: {}
      }
    case CLEAR_TABLELAYOUT:
      return initialState
    default:
      return state
  }
}

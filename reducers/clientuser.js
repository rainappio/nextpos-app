import {
  FETCH_CLIENT_USER,
  FETCH_CLIENT_USER_SUCCESS,
  FETCH_CLIENT_USER_FAILURE,
  CLEAR_CLIENT_USER
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
    case FETCH_CLIENT_USER:
      return {
        ...state,
        loading: true,
        haveData: false,
        haveError: false,
        error: null
      }
    case FETCH_CLIENT_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        haveData: true,
        haveError: false,
        data: action.data
      }
    case FETCH_CLIENT_USER_FAILURE:
      return {
        ...state,
        loading: false,
        haveData: false,
        haveError: true,
        error: action.error,
        data: {}
      }
    case CLEAR_CLIENT_USER:
      return initialState
    default:
      return state
  }
}

import {
  FETCH_PERMISSIONS,
  FETCH_PERMISSIONS_SUCCESS,
  FETCH_PERMISSIONS_FAILURE
} from '../actions'

const initialState = {
  data: [],
  loading: false,
  haveData: false,
  haveError: false,
  error: null
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PERMISSIONS:
      return {
        ...state,
        loading: true,
        haveData: false,
        haveError: false,
        error: null
      }
    case FETCH_PERMISSIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        haveData: true,
        haveError: false,
        data: action.data
      }
    case FETCH_PERMISSIONS_FAILURE:
      return {
        ...state,
        loading: false,
        haveData: false,
        haveError: true,
        error: action.error,
        data: []
      }
    default:
      return state
  }
}

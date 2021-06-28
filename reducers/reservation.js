import {
  FETCH_RESERVATION,
  FETCH_RESERVATION_SUCCESS,
  FETCH_RESERVATION_FAILURE,
  CLEAR_RESERVATION
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
    case FETCH_RESERVATION:
      return {
        ...state,
        loading: true,
        haveData: false,
        haveError: false,
        error: null
      }
    case FETCH_RESERVATION_SUCCESS:
      return {
        ...state,
        loading: false,
        haveData: true,
        haveError: false,
        data: action.data
      }
    case FETCH_RESERVATION_FAILURE:
      return {
        ...state,
        loading: false,
        haveData: false,
        haveError: true,
        error: action.error,
        data: {}
      }
    case CLEAR_RESERVATION:
      return initialState
    default:
      return state
  }
}

import {
  FETCH_USER_TIME_CARDS,
  FETCH_USER_TIME_CARDS_SUCCESS,
  FETCH_USER_TIME_CARDS_FAILURE,
  CLEAR_USER_TIME_CARDS
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
    case FETCH_USER_TIME_CARDS:
      return {
        ...state,
        loading: true,
        haveData: false,
        haveError: false,
        error: null
      }
    case FETCH_USER_TIME_CARDS_SUCCESS:
      return {
        ...state,
        loading: false,
        haveData: true,
        haveError: false,
        data: action.data
      }
    case FETCH_USER_TIME_CARDS_FAILURE:
      return {
        ...state,
        loading: false,
        haveData: false,
        haveError: true,
        error: action.error,
        data: []
      }
    case CLEAR_USER_TIME_CARDS:
      return initialState
    default:
      return state
  }
}

import {
  FETCH_TIME_CARD,
  FETCH_TIME_CARD_SUCCESS,
  FETCH_TIME_CARD_FAILURE,
  CLEAR_TIME_CARD
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
    case FETCH_TIME_CARD:
      return {
        ...state,
        loading: true,
        haveData: false,
        haveError: false,
        error: null
      }
    case FETCH_TIME_CARD_SUCCESS:
      return {
        ...state,
        loading: false,
        haveData: true,
        haveError: false,
        data: action.data
      }
    case FETCH_TIME_CARD_FAILURE:
      return {
        ...state,
        loading: false,
        haveData: false,
        haveError: true,
        error: action.error,
        data: {}
      }
    case CLEAR_TIME_CARD:
      return initialState
    default:
      return state
  }
}

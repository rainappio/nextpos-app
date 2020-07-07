import {
  FETCH_ORDER_OFFER,
  FETCH_ORDER_OFFER_SUCCESS,
  FETCH_ORDER_OFFER_FAILURE,
  CLEAR_ORDER_OFFER
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
    case FETCH_ORDER_OFFER:
      return {
        ...state,
        loading: true,
        haveData: false,
        haveError: false,
        error: null
      }
    case FETCH_ORDER_OFFER_SUCCESS:
      return {
        ...state,
        loading: false,
        haveData: true,
        haveError: false,
        data: action.data
      }
    case FETCH_ORDER_OFFER_FAILURE:
      return {
        ...state,
        loading: false,
        haveData: false,
        haveError: true,
        error: action.error,
        data: {}
      }
    case CLEAR_ORDER_OFFER:
      return initialState
    default:
      return state
  }
}

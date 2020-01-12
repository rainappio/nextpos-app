import {
  FETCH_ORDERS_BY_DATE_RANGE,
  FETCH_ORDERS_BY_DATE_RANGE_SUCCESS,
  FETCH_ORDERS_BY_DATE_RANGE_FAILURE
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
    case FETCH_ORDERS_BY_DATE_RANGE:
      return {
        ...state,
        loading: true,
        haveData: false,
        haveError: false,
        error: null
      }
    case FETCH_ORDERS_BY_DATE_RANGE_SUCCESS:
      return {
        ...state,
        loading: false,
        haveData: true,
        haveError: false,
        data: action.data
      }
    case FETCH_ORDERS_BY_DATE_RANGE_FAILURE:
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

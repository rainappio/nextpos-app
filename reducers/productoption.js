import {
  FETCH_PRODUCT_OPTION,
  FETCH_PRODUCT_OPTION_SUCCESS,
  FETCH_PRODUCT_OPTION_FAILURE,
  CLEAR_PRODUCT_OPTION
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
    case FETCH_PRODUCT_OPTION:
      return {
        ...state,
        loading: true,
        haveData: false,
        haveError: false,
        error: null
      }
    case FETCH_PRODUCT_OPTION_SUCCESS:
      return {
        ...state,
        loading: false,
        haveData: true,
        haveError: false,
        data: action.data
      }
    case FETCH_PRODUCT_OPTION_FAILURE:
      return {
        ...state,
        loading: false,
        haveData: false,
        haveError: true,
        error: action.error,
        data: {}
      }
    case CLEAR_PRODUCT_OPTION:
      return initialState
    default:
      return state
  }
}

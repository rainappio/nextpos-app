import {
  FETCH_PRODUCTS,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE
} from '../actions'

const initialState = {
  data: [],
  loading: true,
  error: null
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS:
      return {
        ...state,
        loading: true,
        error: null
      }
    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.data
      }
    case FETCH_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: true,
        error: action.error,
        data: []
      }
    default:
      return state
  }
}

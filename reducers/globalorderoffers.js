import {
  FETCH_GLOBAL_ORDER_OFFERS,
  FETCH_GLOBAL_ORDER_OFFERS_FAILURE,
  FETCH_GLOBAL_ORDER_OFFERS_SUCCESS,
  FETCH_GLOBAL_PRODUCT_OFFERS,
  FETCH_GLOBAL_PRODUCT_OFFERS_FAILURE,
  FETCH_GLOBAL_PRODUCT_OFFERS_SUCCESS,
  FETCH_OFFERS,
  FETCH_OFFERS_SUCCESS,
  FETCH_OFFERS_FAILURE
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
    case FETCH_GLOBAL_ORDER_OFFERS:
      return {
        ...state,
        loading: true,
        haveData: false,
        haveError: false,
        error: null
      }
    case FETCH_GLOBAL_ORDER_OFFERS_SUCCESS:
      return {
        ...state,
        loading: false,
        haveData: true,
        haveError: false,
        data: action.data
      }
    case FETCH_GLOBAL_ORDER_OFFERS_FAILURE:
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

export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_GLOBAL_PRODUCT_OFFERS:
      return {
        ...state,
        loading: true,
        haveData: false,
        haveError: false,
        error: null
      }
    case FETCH_GLOBAL_PRODUCT_OFFERS_SUCCESS:
      return {
        ...state,
        loading: false,
        haveData: true,
        haveError: false,
        data: action.data
      }
    case FETCH_GLOBAL_PRODUCT_OFFERS_FAILURE:
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

export const offersReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_OFFERS:
      return {
        ...state,
        loading: true,
        haveData: false,
        haveError: false,
        error: null
      }
    case FETCH_OFFERS_SUCCESS:
      return {
        ...state,
        loading: false,
        haveData: true,
        haveError: false,
        data: action.data
      }
    case FETCH_OFFERS_FAILURE:
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
import {
  FETCH_CLIENTUSERS,
  FETCH_CLIENTUSERS_SUCCESS,
  FETCH_CLIENTUSERS_FAILURE
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
    case FETCH_CLIENTUSERS:
      return {
        ...state,
        loading: true,
        haveData: false,
        haveError: false,
        error: null
      }
    case FETCH_CLIENTUSERS_SUCCESS:
      return {
        ...state,
        loading: false,
        haveData: true,
        haveError: false,
        data: action.data
      }
    case FETCH_CLIENTUSERS_FAILURE:
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

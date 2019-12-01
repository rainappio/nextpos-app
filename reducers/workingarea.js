import {
  FETCH_WORKING_AREA,
  FETCH_WORKING_AREA_SUCCESS,
  FETCH_WORKING_AREA_FAILURE,
  CLEAR_WORKING_AREA
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
    case FETCH_WORKING_AREA:
      return {
        ...state,
        loading: true,
        haveData: false,
        haveError: false,
        error: null
      }
    case FETCH_WORKING_AREA_SUCCESS:
      return {
        ...state,
        loading: false,
        haveData: true,
        haveError: false,
        data: action.data
      }
    case FETCH_WORKING_AREA_FAILURE:
      return {
        ...state,
        loading: false,
        haveData: false,
        haveError: true,
        error: action.error,
        data: {}
      }
    case CLEAR_WORKING_AREA:
      return initialState
    default:
      return state
  }
}

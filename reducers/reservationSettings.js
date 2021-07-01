import {
  FETCH_RESERVATIONSETTINGS,
  FETCH_RESERVATIONSETTINGS_SUCCESS,
  FETCH_RESERVATIONSETTINGS_FAILURE,
} from '../actions'

const initialState = {
  data: {},
  loading: false,
  haveData: false,
  haveError: false,
  error: null
}

export const reducer = (state = initialState, action) => {
  // console.debug(`state: ${JSON.stringify(state)}, action: ${JSON.stringify(action)}`)

  switch (action.type) {
    case FETCH_RESERVATIONSETTINGS:
      return {
        ...state,
        loading: true,
        haveData: false,
        haveError: false,
        error: null
      }
    case FETCH_RESERVATIONSETTINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        haveData: true,
        haveError: false,
        data: action.data
      }
    case FETCH_RESERVATIONSETTINGS_FAILURE:
      return {
        ...state,
        loading: false,
        haveData: false,
        haveError: true,
        error: action.error,
        data: {}
      }
    default:
      return state
  }
}

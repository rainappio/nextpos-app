import {
  FETCH_CLIENT,
  FETCH_CLIENT_SUCCESS,
  FETCH_CLIENT_FAILURE,
  CLEAR_CLIENT
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
    case FETCH_CLIENT:
      return {
        ...state,
        loading: true,
        haveData: false,
        haveError: false,
        error: null
      }
    case FETCH_CLIENT_SUCCESS:
      return {
        ...state,
        loading: false,
        haveData: true,
        haveError: false,
        data: action.data
      }
    case FETCH_CLIENT_FAILURE:
      return {
        ...state,
        loading: false,
        haveData: false,
        haveError: true,
        error: action.error,
        data: {}
      }
    case CLEAR_CLIENT:
      return initialState
    default:
      return state
  }
}

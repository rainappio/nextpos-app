import {
  FETCH_PAYMENTMETHODS,
  FETCH_PAYMENTMETHODS_SUCCESS,
  FETCH_PAYMENTMETHODS_FAILURE,
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
    case FETCH_PAYMENTMETHODS:
      return {
        ...state,
        loading: true,
        haveData: false,
        haveError: false,
        error: null
      }
    case FETCH_PAYMENTMETHODS_SUCCESS:
      return {
        ...state,
        loading: false,
        haveData: true,
        haveError: false,
        data: action.data
      }
    case FETCH_PAYMENTMETHODS_FAILURE:
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

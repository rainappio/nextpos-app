import {
  FETCH_CUSTOMER_TRAFFIC_REPORT,
  FETCH_CUSTOMER_TRAFFIC_REPORT_SUCCESS,
  FETCH_CUSTOMER_TRAFFIC_REPORT_FAILURE
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
    case FETCH_CUSTOMER_TRAFFIC_REPORT:
      return {
        ...state,
        loading: true,
        haveData: false,
        haveError: false,
        error: null
      }
    case FETCH_CUSTOMER_TRAFFIC_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        haveData: true,
        haveError: false,
        data: action.data
      }
    case FETCH_CUSTOMER_TRAFFIC_REPORT_FAILURE:
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

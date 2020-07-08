import {
  FETCH_RANGED_SALES_REPORT,
  FETCH_RANGED_SALES_REPORT_SUCCESS,
  FETCH_RANGED_SALES_REPORT_FAILURE, FETCH_SALES_RANKING_REPORT, FETCH_SALES_RANKING_REPORT_SUCCESS, FETCH_SALES_RANKING_REPORT_FAILURE
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
    case FETCH_RANGED_SALES_REPORT:
      return {
        ...state,
        loading: true,
        haveData: false,
        haveError: false,
        error: null
      }
    case FETCH_RANGED_SALES_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        haveData: true,
        haveError: false,
        data: action.data
      }
    case FETCH_RANGED_SALES_REPORT_FAILURE:
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

export const salesRankingReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SALES_RANKING_REPORT:
      return {
        ...state,
        loading: true,
        haveData: false,
        haveError: false,
        error: null
      }
    case FETCH_SALES_RANKING_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        haveData: true,
        haveError: false,
        data: action.data
      }
    case FETCH_SALES_RANKING_REPORT_FAILURE:
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

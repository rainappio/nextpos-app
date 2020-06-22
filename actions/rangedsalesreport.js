import { api, dispatchFetchRequest } from '../constants/Backend'
export const FETCH_RANGED_SALES_REPORT = 'FETCH_RANGED_SALES_REPORT'
export const FETCH_RANGED_SALES_REPORT_SUCCESS =
  'FETCH_RANGED_SALES_REPORT_SUCCESS'
export const FETCH_RANGED_SALES_REPORT_FAILURE =
  'FETCH_RANGED_SALES_REPORT_FAILURE'

export const fetchRangedSalesReport = () => ({
  type: FETCH_RANGED_SALES_REPORT
})

export const fetchRangedSalesReportSuccess = data => ({
  type: FETCH_RANGED_SALES_REPORT_SUCCESS,
  data
})

export const fetchRangedSalesReportFailure = error => ({
  type: FETCH_RANGED_SALES_REPORT_FAILURE,
  error
})

export const getRangedSalesReport = (rangeType, fromDate, toDate) => {
  return dispatch => {
    dispatch(fetchRangedSalesReport())

    dispatchFetchRequest(
      api.report.getrangedSalesReport(rangeType, fromDate, toDate),
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchRangedSalesReportSuccess(data))
        })
      },
      response => {
        dispatch(fetchRangedSalesReportFailure(response))
      }
    ).then()
  }
}

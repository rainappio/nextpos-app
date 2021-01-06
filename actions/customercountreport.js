import {api, dispatchFetchRequest} from '../constants/Backend'
export const FETCH_CUSTOMER_COUNT_REPORT = 'FETCH_CUSTOMER_COUNT_REPORT'
export const FETCH_CUSTOMER_COUNT_REPORT_SUCCESS =
  'FETCH_CUSTOMER_COUNT_REPORT_SUCCESS'
export const FETCH_CUSTOMER_COUNT_REPORT_FAILURE =
  'FETCH_CUSTOMER_COUNT_REPORT_FAILURE'

export const fetchCustomerCountReport = () => ({
  type: FETCH_CUSTOMER_COUNT_REPORT
})

export const fetchCustomerCountReportSuccess = data => ({
  type: FETCH_CUSTOMER_COUNT_REPORT_SUCCESS,
  data
})

export const fetchCustomerCountReportFailure = error => ({
  type: FETCH_CUSTOMER_COUNT_REPORT_FAILURE,
  error
})

export const getCustomerCountReport = (rangeType, fromDate, toDate) => {
  return dispatch => {
    dispatch(fetchCustomerCountReport())

    dispatchFetchRequest(
      api.report.getcustomerCountReport(rangeType, fromDate, toDate),
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {'version': 'v2'}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchCustomerCountReportSuccess(data))
        })
      },
      response => {
        dispatch(fetchCustomerCountReportFailure(response))
      }
    ).then()
  }
}

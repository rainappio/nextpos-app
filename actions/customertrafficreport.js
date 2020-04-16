import {api, dispatchFetchRequest} from '../constants/Backend'

export const FETCH_CUSTOMER_TRAFFIC_REPORT = 'FETCH_CUSTOMER_TRAFFIC_REPORT'
export const FETCH_CUSTOMER_TRAFFIC_REPORT_SUCCESS = 'FETCH_CUSTOMER_TRAFFIC_REPORT_SUCCESS'
export const FETCH_CUSTOMER_TRAFFIC_REPORT_FAILURE = 'FETCH_CUSTOMER_TRAFFIC_REPORT_FAILURE'

export const fetchCustomerTrafficReport = () => ({
  type: FETCH_CUSTOMER_TRAFFIC_REPORT
})

export const fetchCustomerTrafficReportSuccess = data => ({
  type: FETCH_CUSTOMER_TRAFFIC_REPORT_SUCCESS,
  data
})

export const fetchCustomerTrafficReportFailure = error => ({
  type: FETCH_CUSTOMER_TRAFFIC_REPORT_FAILURE,
  error
})

export const getCustomerTrafficReport = (year, month) => {
  return dispatch => {
    dispatch(fetchCustomerTrafficReport())

    dispatchFetchRequest(
      api.report.getCustomerTrafficReport(year, month),
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchCustomerTrafficReportSuccess(data))
        })
      },
      response => {
        dispatch(fetchCustomerTrafficReportFailure(response))
      }
    ).then()
  }
}

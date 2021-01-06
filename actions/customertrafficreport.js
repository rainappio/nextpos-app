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

export const getCustomerTrafficReport = (rangeType, fromDate, toDate) => {
  return dispatch => {
    dispatch(fetchCustomerTrafficReport())

    dispatchFetchRequest(
      api.report.getCustomerTrafficReport(rangeType, fromDate, toDate),
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {'version': 'v2'}
      },
      response => {
        console.log('response2', response.url)
        response.json().then(data => {
          console.log('response', JSON.stringify(data))
          dispatch(fetchCustomerTrafficReportSuccess(data))
        })
      },
      response => {
        dispatch(fetchCustomerTrafficReportFailure(response))
      }
    ).then()
  }
}

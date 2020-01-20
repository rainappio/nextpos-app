import { api, dispatchFetchRequest } from '../constants/Backend'
export const FETCH_SALES_DISTRIBUTION_REPORT = 'FETCH_SALES_DISTRIBUTION_REPORT'
export const FETCH_SALES_DISTRIBUTION_REPORT_SUCCESS =
  'FETCH_SALES_DISTRIBUTION_REPORT_SUCCESS'
export const FETCH_SALES_DISTRIBUTION_REPORT_FAILURE =
  'FETCH_SALES_DISTRIBUTION_REPORT_FAILURE'

export const fetchSalesDistributionReport = () => ({
  type: FETCH_SALES_DISTRIBUTION_REPORT
})

export const fetchSalesDistributionReportSuccess = data => ({
  type: FETCH_SALES_DISTRIBUTION_REPORT_SUCCESS,
  data
})

export const fetchSalesDistributionReportFailure = error => ({
  type: FETCH_SALES_DISTRIBUTION_REPORT_FAILURE,
  error
})

export const getSalesDistributionReport = () => {
  return dispatch => {
    dispatch(fetchSalesDistributionReport())

    dispatchFetchRequest(
      api.report.getsalesDistributionReport,
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          dispatch(fetchSalesDistributionReportSuccess(data))
        })
      },
      response => {
        dispatch(fetchSalesDistributionReportFailure(error))
      }
    ).then()
  }
}

function handleErrors (response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

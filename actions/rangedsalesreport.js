import { api, makeFetchRequest } from '../constants/Backend'
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

export const getRangedSalesReport = () => {
  return dispatch => {
    dispatch(fetchRangedSalesReport())

    makeFetchRequest(token => {
      fetch(api.report.getrangedSalesReport, {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
          Authorization: 'Bearer ' + token.access_token
        }
      })
        .then(res => res.json())
        .then(data => {
          dispatch(fetchRangedSalesReportSuccess(data))
          return data
        })
        .catch(error => dispatch(fetchRangedSalesReportFailure(error)))
    })
  }
}

function handleErrors (response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

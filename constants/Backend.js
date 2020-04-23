import { AsyncStorage } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import * as Sentry from 'sentry-expo';
import NavigationService from "../navigation/NavigationService";
import i18n from 'i18n-js'

const storage = {
  clientAccessToken: 'token',
  clientUserAccessToken: 'clientusrToken'
}

const apiRoot = 'http://35.234.63.193'

export const api = {
  apiRoot,
  getAuthToken: `${apiRoot}/oauth/token`,
  client: {
    get: `${apiRoot}/clients/me`,
    new: `${apiRoot}/clients`,
    update: `${apiRoot}/clients/me`
  },
  clientUser: {
    new: `${apiRoot}/clients/me/users`,
    get: name => {
      return `${apiRoot}/clients/me/users/${name}`
    },
    getAll: `${apiRoot}/clients/me/users/`,
    update: name => {
      return `${apiRoot}/clients/me/users/${name}`
    },
    updateCurrentUserPassword: `${apiRoot}/clients/me/users/currentUser/password`,
    updatePassword: name => {
      return `${apiRoot}/clients/me/users/${name}/password`
    },
    delete: name => {
      return `${apiRoot}/clients/me/users/${name}`
    }
  },
  timecard: {
    getActive: `${apiRoot}/timecards/active`,
    clockin: `${apiRoot}/timecards/clockin`,
    clockout: `${apiRoot}/timecards/clockout`,
    mostRecent: `${apiRoot}/timecards/mostRecent`,
    timeCards: `${apiRoot}/reporting/timeCardReport`,
    get: clientusername => {
      return `${apiRoot}/timecards?username=${clientusername}`
    },
    getById: id => {
      return `${apiRoot}/timecards/${id}`
    },
    getByMonthYr: (year, month) => {
    	return `${apiRoot}/reporting/timeCardReport?year=${year}&month=${month}`
    },
    getByMonthYrUsr: (year, month, username) => {
    	return `${apiRoot}/timecards?year=${year}&month=${month}&username=${username}`
    }
  },
  product: {
    new: `${apiRoot}/products`,
    getById: id => {
      return `${apiRoot}/products/${id}/?version=DESIGN`
    },
    getAllGrouped: `${apiRoot}/searches/products/grouped?state=DESIGN`,
    update: id => {
      return `${apiRoot}/products/${id}`
    },
    delete: id => {
      return `${apiRoot}/products/${id}`
    },
    togglePin: id => {
    	return `${apiRoot}/products/${id}/togglePin`
    }
  },
  productLabel: {
    getById: id => {
      return `${apiRoot}/labels/${id}`
    },
    getAll: `${apiRoot}/labels`,
    new: `${apiRoot}/labels`
  },
  productOption: {
    new: `${apiRoot}/productoptions`,
    getById: id => {
      return `${apiRoot}/productoptions/${id}?version=DESIGN`
    },
    getAll: labelId => {
      return `${apiRoot}/productoptions${
        labelId === undefined ? '' : `?productLabelId=${labelId}`
      }`
    },
    update: id => {
      return `${apiRoot}/productoptions/${id}`
    },
    deleteById: id => {
      return `${apiRoot}/productoptions/${id}`
    }
  },
  order: {
    openShift: `${apiRoot}/shifts/open`,
    closeShift: `${apiRoot}/shifts/close`,
    new: `${apiRoot}/orders`,
    getById: id => {
      return `${apiRoot}/orders/${id}`
    },
    newLineItem: orderId => {
      return `${apiRoot}/orders/${orderId}/lineitems`
    },
    updateLineItem: (orderId, lineItemId) => {
      return `${api.apiRoot}/orders/${orderId}/lineitems/${lineItemId}`
    },
    deliverLineItems: orderId => {
      return `${apiRoot}/orders/${orderId}/lineitems/deliver`
    },
    process: orderId => {
      return `${apiRoot}/orders/${orderId}/process`
    },
    delete: orderId => {
      return `${apiRoot}/orders/${orderId}`
    },
    waiveServiceCharge: (orderId, waive) => {
      return `${apiRoot}/orders/${orderId}/waiveServiceCharge?apply=${waive}`
    },
    applyDiscount: orderId => {
      return `${apiRoot}/orders/${orderId}/applyDiscount`
    },
    resetOrderOffers: orderId => {
      return `${apiRoot}/orders/${orderId}/resetOrderOffers`
    },
    inflightOrders: `${apiRoot}/orders/inflight`,
    getGlobalOrderOffers: `${apiRoot}/offers/globalOrderOffers`,
    getOrdersByDateAndRange: (dateRange, shiftId, fromDate, toDate) => {
      let params = ''

      if (dateRange !== undefined) {
        params += `dateRange=${dateRange}`
      }
      if (shiftId !== undefined) {
        params += `&shiftId=${shiftId}`
      }

      if (fromDate !== undefined && fromDate !== null && toDate !== undefined && toDate !== null) {
        params += `&fromDate=${fromDate}&toDate=${toDate}`
      }

      return `${apiRoot}/orders?${params}`
    }
  },
  printer: {
    create: `${apiRoot}/printers`,
    getPrinters: `${apiRoot}/printers`,
    getPrinter: id => {
      return `${apiRoot}/printers/${id}`
    },
    update: id => {
      return `${apiRoot}/printers/${id}`
    }
  },
  workingarea: {
    create: `${apiRoot}/workingareas`,
    getById: id => {
      return `${apiRoot}/workingareas/${id}`
    },
    getAll: `${apiRoot}/workingareas`,
    update: id => {
      return `${apiRoot}/workingareas/${id}`
    }
  },
  shift: {
    open: `${apiRoot}/shifts/open`,
    close: `${apiRoot}/shifts/close`,
    active: `${apiRoot}/shifts/active`,
    mostRecent: `${apiRoot}/shifts/mostRecent`,
    getAll: `${apiRoot}/shifts`,
    initiate: `${apiRoot}/shifts/initiateClose`,
    confirm: `${apiRoot}/shifts/confirmClose`,
    abort: `${apiRoot}/shifts/abortClose`
  },
  tablelayout: {
    create: `${apiRoot}/tablelayouts`,
    getById: id => {
      return `${apiRoot}/tablelayouts/${id}`
    },
    getAll: `${apiRoot}/tablelayouts`,
    update: id => {
      return `${apiRoot}/tablelayouts/${id}`
    },
    delete: layoutId => {
      return `${apiRoot}/tablelayouts/${layoutId}`
    },
    createTable: layoutId => {
      return `${api.apiRoot}/tablelayouts/${layoutId}/tables`
    },
    updateTable: (layoutId, tableId) => {
      return `${apiRoot}/tablelayouts/${layoutId}/tables/${tableId}`
    },
    deleteTable: (layoutId, tableId) => {
      return `${apiRoot}/tablelayouts/${layoutId}/tables/${tableId}`
    },
    updateTablePosition: (layoutId, tableId) => {
			return `${apiRoot}/tablelayouts/${layoutId}/tables/${tableId}/position`
    } 
  },
  payment: {
    charge: `${apiRoot}/orders/transactions`
  },
  table: {
    getavailTable: `${apiRoot}/orders/availableTables`
  },
  report: {
    getrangedSalesReport: `${apiRoot}/reporting/rangedSalesReport`,
    getsalesDistributionReport: `${apiRoot}/reporting/salesDistribution?`,
    getcustomerCountReport: `${apiRoot}/reporting/customerStats`,
    getCustomerTrafficReport: (year, month) => {
      if (year !== undefined && month !== undefined) {
        return `${apiRoot}/reporting/customerTraffic?year=${year}&month=${month}`
      }

      return `${apiRoot}/reporting/customerTraffic`
    },
    getrangedSalesReportByDate: (date) => {
    	return `${apiRoot}/reporting/rangedSalesReport?date=${date}`
    },
    getcustomerStatsReportByDateMonth: (year, month) => {
    	return `${apiRoot}/reporting/customerStats?year=${year}&month=${month}`
    }
  },
  announcements: {
    create: `${apiRoot}/announcements`,
    get: `${apiRoot}/announcements`,
    getById: id => {
      return `${apiRoot}/announcements/${id}`
    },
    update: id => {
      return `${apiRoot}/announcements/${id}`
    },
    delete: id => {
      return `${apiRoot}/announcements/${id}`
    }
  }
}

export const getToken = async () => {
  let token = await AsyncStorage.getItem(storage.clientUserAccessToken)

  if (token == null) {
    token = await AsyncStorage.getItem(storage.clientAccessToken)
  }

  return JSON.parse(token)
}

export const removeToken = async () => {
  await AsyncStorage.removeItem(storage.clientUserAccessToken)
  await AsyncStorage.removeItem(storage.clientAccessToken)
}

// todo: delete this
export const makeFetchRequest = async fetchRequest => {
  try {
    let useClientUserToken = true
    let token = await AsyncStorage.getItem(storage.clientUserAccessToken)

    if (token == null) {
      useClientUserToken = false
      token = await AsyncStorage.getItem(storage.clientAccessToken)
    }

    if (token != null) {
      console.debug(`Use client user token: ${useClientUserToken}`)
      const tokenObj = JSON.parse(token)
      fetchRequest(tokenObj)
    } else {
      alert('Token does not exist')
    }
  } catch (error) {
    console.error(error)
  }
}

export const dispatchFetchRequest = async (
  endpoint,
  payload,
  successCallback,
  failCallback
) => {

  return dispatchFetchRequestWithOption(endpoint, payload, { defaultMessage: true }, successCallback, failCallback)
}

export const dispatchFetchRequestWithOption = async (
  endpoint,
  payload,
  options,
  successCallback,
  failCallback
) => {
  try {
    let useClientUserToken = true
    let token = await AsyncStorage.getItem(storage.clientUserAccessToken)

    if (token == null) {
      useClientUserToken = false
      token = await AsyncStorage.getItem(storage.clientAccessToken)
    }

    if (token != null) {
      console.trace(`Use client user token: ${useClientUserToken}`)
      const tokenObj = JSON.parse(token)
      payload.headers.Authorization = `Bearer ${tokenObj.access_token}`

      const suppressError = payload.headers['x-suppress-error']
      const response = await fetch(endpoint, payload)

      if (!response.ok) {
        if (suppressError === undefined || !suppressError) {
          errorAlert(response)
        }

        if (failCallback !== undefined) {
          failCallback(response)
        }
      } else {
        const isUpdateOperation = ['POST', 'PATCH', 'DELETE'].includes(payload.method)

        if (isUpdateOperation && options.defaultMessage) {
          successMessage(i18n.t(`backend.${payload.method}`))
        }

        successCallback(response)
      }

      return response
    } else {
      const errorMessage = 'Token does not exist. Please consult your service provider.'

      showMessage({
        message: errorMessage,
        type: 'warning',
        autoHide: true
      })
    }
  } catch (error) {
    console.error(error)
    Sentry.getCurrentHub().captureException(new Error(error))

  }
}

export const successMessage = message => {
  showMessage({
    message: message,
    type: 'success',
    autoHide: true
  })
}

export const errorAlert = response => {
  let errorMessage = null

  response.json().then(content => {
    console.debug(`${response.status} - ${JSON.stringify(content)}`)

    switch (response.status) {
      case 401:
        errorMessage = 'Your are not authenticated for this operation.'
        break
      case 403:
        errorMessage = i18n.t('backend.403')
        break
      case 404:
        errorMessage = i18n.t('backend.404')
        break
      case 412:
        errorMessage = content.localizedMessageKey != null ? i18n.t(`backend.${content.localizedMessageKey}`) : content.message
        break
      default:
        errorMessage = `Encountered an error with your request. (${content.message})`
    }

    if (response.status === 401) {
      NavigationService.navigate('Login')
    }

    showMessage({
      message: errorMessage,
      type: 'warning',
      icon: 'auto',
      autoHide: true
    })
  })
}

export const warningMessage = message => {
  showMessage({
    message: message,
    type: 'warning',
    autoHide: true
  })
}

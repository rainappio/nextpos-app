import {AsyncStorage} from 'react-native'
import {showMessage} from 'react-native-flash-message'
import * as Sentry from 'sentry-expo';
import NavigationService from "../navigation/NavigationService";
import i18n from 'i18n-js'
import {order} from '../assets/images';

export const storage = {
  clientAccessToken: 'token',
  clientUserAccessToken: 'clientusrToken',
  clientUsername: 'clientUsername',
  clientPassword: 'clientPassword'
}

//export const apiRoot = 'http://104.199.147.121'
//export const apiRoot = 'http://10.0.4.9:8080'
//export const apiRoot = 'http://192.168.1.102:8080'
//export const apiRoot = 'http://192.168.2.244:8080'
export const apiRoot = 'https://api.rain-app.io'


export const api = {
  apiRoot,
  getAuthToken: `${apiRoot}/oauth/token`,
  getClientUserTokens: `${apiRoot}/clientUserTokens`,
  account: {
    sendResetPasscode: (clientEmail) => {
      return `${apiRoot}/account/sendResetPasscode?clientEmail=${clientEmail}`
    },
    verifyResetPasscode: `${apiRoot}/account/verifyResetPasscode`,
    resetClientPassword: `${apiRoot}/account/resetClientPassword`,
  },
  client: {
    get: `${apiRoot}/clients/me`,
    getStatus: `${apiRoot}/clientstatus/me`,
    new: `${apiRoot}/clients`,
    update: `${apiRoot}/clients/me`,
    info: `${apiRoot}/clients/me/info`,
    changeClientType: `${apiRoot}/clients/me/clientType`,
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
    },
    createuserRole: `${apiRoot}/roles`,
    getuserRoles: `${apiRoot}/roles`,
    getuserRole: userroleId => {
      return `${apiRoot}/roles/${userroleId}`
    },
    updateuserRole: userroleId => {
      return `${apiRoot}/roles/${userroleId}`
    },
    deleteuserRole: userroleId => {
      return `${apiRoot}/roles/${userroleId}`
    },
    getPermissions: `${apiRoot}/roles/permissions`
  },
  timecard: {
    getActive: `${apiRoot}/timecards/active`,
    clockin: `${apiRoot}/timecards/clockin`,
    clockout: `${apiRoot}/timecards/clockout`,
    mostRecent: `${apiRoot}/timecards/mostRecent`,
    timeCards: (year, month) => {
      return `${apiRoot}/reporting/timeCardReport?year=${year}&month=${month}`
    },
    get: (username, year, month) => {
      return `${apiRoot}/timecards?username=${username}&year=${year}&month=${month}`
    },
    getById: id => {
      return `${apiRoot}/timecards/${id}`
    }
  },
  inventory: {
    new: `${apiRoot}/inventories`,
    getById: id => {
      return `${apiRoot}/inventories/${id}`
    },
    update: (id, sku) => {
      return `${apiRoot}/inventories/${id}/quantities/${sku}`
    },
    delete: id => {
      return `${apiRoot}/inventories/${id}`
    },
    addQuantity: id => {
      return `${apiRoot}/inventories/${id}/quantities`
    },
    deleteQuantity: (id, sku) => {
      return `${apiRoot}/inventories/${id}/quantities/${sku}`
    },
    getByKeyword: key => {
      return `${apiRoot}/inventories?keyword=${key}`
    },
  },
  inventoryOrders: {
    new: `${apiRoot}/inventoryOrders`,
    getById: id => {
      return `${apiRoot}/inventoryOrders/${id}`
    },
    process: id => {
      return `${apiRoot}/inventoryOrders/${id}/process`
    },
    copy: id => {
      return `${apiRoot}/inventoryOrders/${id}/copy`
    },
    delete: id => {
      return `${apiRoot}/inventoryOrders/${id}`
    },
  },
  product: {
    new: `${apiRoot}/products`,
    getById: id => {
      return `${apiRoot}/products/${id}/?version=DESIGN`
    },
    getAllGrouped: `${apiRoot}/searches/products/grouped?state=DESIGN`,
    search: (keyword) => {
      return `${apiRoot}/products?keyword=${keyword}`
    },
    update: id => {
      return `${apiRoot}/products/${id}`
    },
    delete: id => {
      return `${apiRoot}/products/${id}`
    },
    togglePin: id => {
      return `${apiRoot}/products/${id}/togglePin`
    },
    toggleOutOfStock: id => {
      return `${apiRoot}/products/${id}/toggleOutOfStock`
    }
  },
  productLabel: {
    getById: id => {
      return `${apiRoot}/labels/${id}`
    },
    getAll: `${apiRoot}/labels`,
    new: `${apiRoot}/labels`,
    sortPrdList: prdLabelId => {
      return `${apiRoot}/labels/${prdLabelId}/order`
    },
    changeProductLabel: prdId => {
      return `${apiRoot}/products/${prdId}/label`
    },
    delete: prdLabelId => {
      return `${apiRoot}/labels/${prdLabelId}`
    },
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
    update: id => {
      return `${apiRoot}/orders/${id}`
    },
    getById: id => {
      return `${apiRoot}/orders/${id}`
    },
    newLineItem: orderId => {
      return `${apiRoot}/orders/${orderId}/lineitems`
    },
    updateLineItem: (orderId, lineItemId) => {
      return `${api.apiRoot}/orders/${orderId}/lineitems/${lineItemId}`
    },
    deleteLineItem: (orderId, lineItemId) => {
      return `${api.apiRoot}/orders/${orderId}/lineitems/${lineItemId}`
    },
    prepareLineItem: (orderId) => {
      return `${apiRoot}/orders/${orderId}/lineitems/prepare`
    },
    deliverLineItems: orderId => {
      return `${apiRoot}/orders/${orderId}/lineitems/deliver`
    },
    updateLineItemPrice: (orderId, lineItemId) => {
      return `${apiRoot}/orders/${orderId}/lineitems/${lineItemId}/price`
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
    removeDiscount: orderId => {
      return `${apiRoot}/orders/${orderId}/removeDiscount`
    },
    resetOrderOffers: orderId => {
      return `${apiRoot}/orders/${orderId}/resetOrderOffers`
    },
    copyOrder: orderId => {
      return `${apiRoot}/orders/${orderId}/copy`
    },
    inflightOrders: `${apiRoot}/orders/inflight`,
    getAllOrderSets: `${apiRoot}/ordersets`,
    deleteOrderSet: setId => {
      return `${apiRoot}/ordersets/${setId}`
    },
    mergeOrderSet: setId => {
      return `${apiRoot}/ordersets/${setId}/merge`
    },
    getGlobalOrderOffers: `${apiRoot}/offers/globalOrderOffers`,
    getGlobalProductOffers: `${apiRoot}/offers/globalProductOffers`,
    cancelInvoice: (id) => {
      return `${apiRoot}/orders/transactions/${id}/cancel`
    },
    getOrdersByDateAndRange: (dateRange, shiftId, fromDate, toDate, tableName) => {
      let params = ''

      if (dateRange != null) {
        params += `dateRange=${dateRange}`
      }

      if (shiftId != null) {
        params += `&shiftId=${shiftId}`
      }

      if (fromDate != null && toDate != null) {
        params += `&fromDate=${fromDate}&toDate=${toDate}`
      }

      if (tableName != null) {
        params += `&table=${tableName}`
      }

      return `${apiRoot}/orders?${params}`
    },
    getOrdersByInvoiceNumber: (num) => {
      return `${apiRoot}/orders/search?invoiceNumber=${num}`
    },
    getOffers: `${apiRoot}/offers`,
    getOrderOfferById: offerId => {
      return `${apiRoot}/offers/${offerId}`
    },
    updateOrderOfferById: offerId => {
      return `${apiRoot}/offers/${offerId}`
    },
    deleteOrderOfferById: offerId => {
      return `${apiRoot}/offers/${offerId}`
    },
    getPrdOfferById: prdofferId => {
      return `${apiRoot}/offers/${prdofferId}`
    },
    updatePrdOfferById: prdofferId => {
      return `${apiRoot}/offers/${prdofferId}`
    },
    deletePrdOfferById: prdofferId => {
      return `${apiRoot}/offers/${prdofferId}`
    },
    activateOrderOfferById: offerId => {
      return `${apiRoot}/offers/${offerId}/activate`
    },
    deactivateOrderOfferById: offerId => {
      return `${apiRoot}/offers/${offerId}/deactivate`
    },
    createOffer: `${apiRoot}/offers`,
    quickCheckout: id => {
      return `${apiRoot}/orders/${id}/quickCheckout`
    },
    printWorkingOrder: id => {
      return `${apiRoot}/orders/${id}/orderToWorkingArea`
    },
    printOrderDetails: id => {
      return `${apiRoot}/orders/${id}/orderDetails`
    },
    lineItemOrdering: `${apiRoot}/orders/lineItemOrdering`,
    orderOrdering: `${apiRoot}/orders/orderOrdering`,
  },
  splitOrder: {
    new: `${apiRoot}/splitOrders`,
    moveItem: orderId => {
      return `${apiRoot}/splitOrders/${orderId}`
    },
    revert: orderId => {
      return `${apiRoot}/splitOrders/${orderId}/revert`
    },
    splitByHead: orderId => {
      return `${apiRoot}/splitOrders/headcount/${orderId}`
    },
  },
  printer: {
    create: `${apiRoot}/printers`,
    getPrinters: `${apiRoot}/printers`,
    getOnePrinter: `${apiRoot}/printers/checkout`,
    getPrinter: id => {
      return `${apiRoot}/printers/${id}`
    },
    update: id => {
      return `${apiRoot}/printers/${id}`
    },
    delete: id => {
      return `${apiRoot}/printers/${id}`
    },
  },
  workingarea: {
    create: `${apiRoot}/workingareas`,
    getById: id => {
      return `${apiRoot}/workingareas/${id}`
    },
    getAll: `${apiRoot}/workingareas`,
    update: id => {
      return `${apiRoot}/workingareas/${id}`
    },
    delete: id => {
      return `${apiRoot}/workingareas/${id}`
    },
  },
  shift: {
    open: `${apiRoot}/shifts/open`,
    close: `${apiRoot}/shifts/close`,
    active: `${apiRoot}/shifts/active`,
    mostRecent: `${apiRoot}/shifts/mostRecent`,
    getAll: date => {
      if (date !== undefined) {
        return `${apiRoot}/shifts?date=${date}`
      }

      return `${apiRoot}/shifts`
    },
    initiate: `${apiRoot}/shifts/initiateClose`,
    confirm: `${apiRoot}/shifts/confirmClose`,
    abort: `${apiRoot}/shifts/abortClose`,
    sendEmail: shiftId => {
      return `${apiRoot}/shifts/${shiftId}/email`
    },
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
    charge: `${apiRoot}/orders/transactions`,
    getTransaction: id => {
      return `${apiRoot}/orders/transactions/${id}`
    },
    getTransactionReprint: id => {
      return `${apiRoot}/orders/transactions/${id}?reprint=true`
    },
  },
  table: {
    getavailTable: `${apiRoot}/orders/availableTables`
  },
  report: {
    getrangedSalesReport: (rangeType, fromDate, toDate) => {

      const xRangeType = rangeType == null ? 'WEEK' : rangeType
      let queryParams = `rangeType=${xRangeType}`

      if (fromDate != null) {
        queryParams += `&from=${fromDate}`
      }

      if (toDate != null) {
        queryParams += `&to=${toDate}`
      }

      return `${apiRoot}/reporting/rangedSalesReport?${queryParams}`
    },
    getSalesRankingReport: (rangeType, fromDate, toDate, labelId) => {

      const xRangeType = rangeType == null ? 'WEEK' : rangeType
      let queryParams = `rangeType=${xRangeType}`

      if (fromDate != null) {
        queryParams += `&from=${fromDate}`
      }

      if (toDate != null) {
        queryParams += `&to=${toDate}`
      }

      queryParams += `&labelId=${labelId}`

      return `${apiRoot}/reporting/salesRankingReport?${queryParams}`
    },
    getsalesDistributionReport: `${apiRoot}/reporting/salesDistribution?`,
    getcustomerCountReport: (rangeType, fromDate, toDate) => {
      const xRangeType = rangeType == null ? 'WEEK' : rangeType
      let queryParams = `rangeType=${xRangeType}`

      if (fromDate != null) {
        queryParams += `&from=${fromDate}`
      }

      if (toDate != null) {
        queryParams += `&to=${toDate}`
      }

      return `${apiRoot}/reporting/customerStats?${queryParams}`
    },
    getCustomerTrafficReport: (rangeType, fromDate, toDate) => {
      const xRangeType = rangeType == null ? 'WEEK' : rangeType
      let queryParams = `rangeType=${xRangeType}`

      if (fromDate != null) {
        queryParams += `&from=${fromDate}`
      }

      if (toDate != null) {
        queryParams += `&to=${toDate}`
      }


      return `${apiRoot}/reporting/customerTraffic?${queryParams}`
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
    },
    getGlobal: `${apiRoot}/admin/globalAnnouncements`,
    markAsRead: id => {
      return `${apiRoot}/admin/globalAnnouncements/${id}/read`
    },
  },
  eInvoice: {
    create: `${apiRoot}/invoiceNumbers`,
    getByUbn: ubn => {
      return `${apiRoot}/invoiceNumbers/${ubn}`
    },
    getAllByUbn: ubn => {
      return `${apiRoot}/invoiceNumbers/${ubn}/all`
    },
    add: (ubn, id) => {
      return `${apiRoot}/invoiceNumbers/${ubn}/ranges/${id}`
    },
    delete: (ubn, id, rangeFrom = null) => {
      if (!!rangeFrom)
        return `${apiRoot}/invoiceNumbers/${ubn}/ranges/${id}/numberRanges/${rangeFrom}`
      else
        return `${apiRoot}/invoiceNumbers/${ubn}/ranges/${id}`
    },
    checkEligibility: `${apiRoot}/einvoices/checkEligibility`,
    generateAESKey: `${apiRoot}/clients/me/aeskey`,
  },
  subscription: {
    getCurrent: `${apiRoot}/clientSubscriptions/current`,
    getAllPlans: (country) => {
      return `${apiRoot}/admin/subscriptionPlans?country=${country}`
    },
    selectPlan: `${apiRoot}/clientSubscriptions`,
    lapse: `${apiRoot}/clientSubscriptions/current/lapse`,
    cancel: `${apiRoot}/clientSubscriptions/current/cancel`,
  },
  rosterEvent: {
    createEvents: `${apiRoot}/rosterEvents`,
    getEvents: `${apiRoot}/rosterEvents/me`,
    getEventsById: (id) => {
      return `${apiRoot}/rosterEvents/${id}`
    },
    getEventsByDate: (year, month) => {
      return `${apiRoot}/rosterEvents?year=${year}&month=${month}`
    },
    updateEventResources: (id) => {
      return `${apiRoot}/rosterEvents/${id}/resources`
    },
  },
  roster: {
    getAllPlans: `${apiRoot}/rosterPlans`,
    getPlan: (id) => {
      return `${apiRoot}/rosterPlans/${id}`
    },
    createPlan: `${apiRoot}/rosterPlans`,
    deletePlan: (id) => {
      return `${apiRoot}/rosterPlans/${id}`
    },
    createEntry: (id) => {
      return `${apiRoot}/rosterPlans/${id}/entries`
    },
    deleteEntry: (pid, eid) => {
      return `${apiRoot}/rosterPlans/${pid}/entries/${eid}`
    },
    createEvents: (id) => {
      return `${apiRoot}/rosterPlans/${id}/events`
    },
    getEvents: (id) => {
      return `${apiRoot}/rosterPlans/${id}/events`
    },
    getEventsById: (pid, eid) => {
      return `${apiRoot}/rosterPlans/${pid}/events/${eid}`
    },
    deleteEvents: (id) => {
      return `${apiRoot}/rosterPlans/${id}/events`
    },
    assign: (pid, eid) => {
      return `${apiRoot}/rosterPlans/${pid}/events/${eid}/assign`
    },
    remove: (pid, eid) => {
      return `${apiRoot}/rosterPlans/${pid}/events/${eid}/remove`
    },
    editResources: (pid, eid) => {
      return `${apiRoot}/rosterPlans/${pid}/events/${eid}/resources`
    },
  },
  membership: {
    get: (id) => {
      return `${apiRoot}/memberships/${id}`
    },
    update: (id) => {
      return `${apiRoot}/memberships/${id}`
    },
    creat: `${apiRoot}/memberships`,
    getByPhone: (num) => {
      return `${apiRoot}/memberships?phoneNumber=${num}`
    },
    updateOrderMembership: (orderId) => {
      return `${apiRoot}/orders/${orderId}/membership`
    },
    getMembers: `${apiRoot}/memberships`,
    deleteById: (id) => {
      return `${apiRoot}/memberships/${id}`
    },
  },
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

  return dispatchFetchRequestWithOption(endpoint, payload, {defaultMessage: true, ignoreErrorMessage: false}, successCallback, failCallback)
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
      payload.headers.Authorization = payload?.headers?.Authorization ?? `Bearer ${tokenObj.access_token}`

      const suppressError = options?.ignoreErrorMessage
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
      case 409:
        errorMessage = content.localizedMessageKey != null ? i18n.t(`backend.${content.localizedMessageKey}`) : content.message
        break
      default:
        errorMessage = `Encountered an error with your request. (${response.status} ${content.message})`
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

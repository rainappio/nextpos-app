import { AsyncStorage } from 'react-native'
import { showMessage } from 'react-native-flash-message'

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
    update: `${apiRoot}/clients/me`
  },
  timecard: {
    getActive: `${apiRoot}/timecards/active`,
    clockin: `${apiRoot}/timecards/clockin`,
    clockout: `${apiRoot}/timecards/clockout`
  },
  product: {
    update: id => {
      return `${apiRoot}/products/${id}`
    },
    delete: id => {
      return `${apiRoot}/products/${id}`
    }
  },
  productLabel: {
    getById: id => {
      return `${apiRoot}/labels/${id}`
    }
  },
  productOption: {
    new: `${apiRoot}/productoptions`,
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
    get_globalOrderOffers: `${apiRoot}/offers/globalOrderOffers`
  },
  printer: {
    create: `${apiRoot}/printers`,
    getPrinters: `${apiRoot}/printers`,
    getPrinter: `${apiRoot}/printers/`,
    update: `${apiRoot}/printers/`
  },
  workingarea: {
    create: `${apiRoot}/workingareas`,
    getWorkingAreas: `${apiRoot}/workingareas`,
    getworkingArea: `${apiRoot}/workingareas/`,
    update: `${apiRoot}/workingareas/`
  },
  shift: {
    open: `${apiRoot}/shifts/open`,
    close: `${apiRoot}/shifts/close`,
    active: `${apiRoot}/shifts/active`
  },
  tablelayout: {
    create: `${apiRoot}/tablelayouts`,
    getlayouts: `${apiRoot}/tablelayouts`,
    getlayout: `${apiRoot}/tablelayouts/`,
    update: `${apiRoot}/tablelayouts/`
  },
  payment: {
    charge: `${apiRoot}/orders/transactions`
  },
  table: {
    getavailTable: `${apiRoot}/orders/availableTables`
  },
  report: {
    getrangedSalesReport: `${apiRoot}/reporting/rangedSalesReport`
  }
}

export const makeFetchRequest = async fetchRequest => {
  try {
    let useClientUserToken = true
    let token = await AsyncStorage.getItem(storage.clientUserAccessToken)
    // let token = await AsyncStorage.getItem(storage.clientAccessToken)

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

  // AsyncStorage.getItem(storage.clientAccessToken, (err, value) => {
  //   if (err) {
  //     console.error(err)
  //   } else {
  //     JSON.parse(value)
  //   }
  // }).then(accessToken => {
  //   const tokenObj = JSON.parse(accessToken)
  //   fetchRequest(tokenObj)
  // })
}

export function fetchAuthenticatedRequest (fetchRequest) {
  AsyncStorage.getItem(storage.clientUserAccessToken, (err, value) => {
    if (err) {
      console.error(err)
    } else {
      JSON.parse(value)
    }
  }).then(accessToken => {
    const tokenObj = JSON.parse(accessToken)
    fetchRequest(tokenObj)
  })
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
        errorMessage = 'You are not authorized for this operation.'
        break
      case 412:
        errorMessage = content.message
        break
      default:
        errorMessage =
          'Encountered an error with your request. Please consult service provider.'
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

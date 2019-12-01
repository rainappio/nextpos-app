import { AsyncStorage } from 'react-native'

const storage = {
  clientAccessToken: 'token',
  clientUserAccessToken: 'clientusrToken'
}

const apiRoot = 'http://35.234.63.193'

export const api = {
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
  order: {
    new: `${apiRoot}/orders`
  }
}

export const makeFetchRequest = async (fetchRequest) => {

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

import { AsyncStorage } from 'react-native'

const storage = {
  clientAccessToken: 'token',
  clientUserAccessToken: 'clientusrToken'
};

const apiRoot = 'http://35.234.63.193'

export const api = {
  getAuthToken: `${apiRoot}/oauth/token`,
  timecard: {
    getActive: `${apiRoot}/timecards/active`,
    clockin: `${apiRoot}/timecards/clockin`,
    clockout: `${apiRoot}/timecards/clockout`
  },
  product: {
    update: (id) => { return `${apiRoot}/products/${id}`},
    delete: (id) => { return `${apiRoot}/products/${id}`}
  },
  productLabel: {
    getById: (id) => { return `${apiRoot}/labels/${id}`}
  }
};

export const makeFetchRequest = (fetchRequest) => {
  AsyncStorage.getItem(storage.clientAccessToken, (err, value) => {
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

export function fetchAuthenticatedRequest(fetchRequest) {

  AsyncStorage.getItem(storage.clientUserAccessToken, (err, value) => {
    if (err) {
      console.error(err)
    } else {
      JSON.parse(value)
    }
  }).then(accessToken => {
    let tokenObj = JSON.parse(accessToken)
    fetchRequest(tokenObj)
  });
}


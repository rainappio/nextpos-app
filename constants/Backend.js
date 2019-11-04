import { AsyncStorage } from 'react-native'

const storage = {
  accessToken: 'clientusrToken'
}

const apiRoot = 'http://35.234.63.193'

const api = {
  getAuthToken: `${apiRoot}/oauth/token`,
  timecard: {
    getActive: `${apiRoot}/timecards/active`,
    clockin: `${apiRoot}/timecards/clockin`,
    clockout: `${apiRoot}/timecards/clockout`
  }
}

export function fetchAuthenticatedRequest (fetchRequest) {
  AsyncStorage.getItem(storage.accessToken, (err, value) => {
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

export default {
  api
}

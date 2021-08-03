import {Platform} from 'react-native';
import moment from "moment-timezone";
import {api, dispatchFetchRequest} from "../constants/Backend";


let selectedTimeZone = 'Asia/Taipei'

export const getSettingTimezone = () => {
  dispatchFetchRequest(
    api.client.get,
    {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',
      headers: {}
    },
    response => {
      response.json().then(data => {
        selectedTimeZone = data.timezone
      })
    }
  ).then()
}


/**
 * Format date string.
 */
export const formatDateObj = (dateStr) => {

  if (dateStr != null && selectedTimeZone !== null) {
    const dateObj = new Date(dateStr)

    return moment(dateObj).tz(selectedTimeZone).format("YYYY/MM/DD, hh:mm:ss A")
  }

  return null
}

/**
 * Format date from millisecond
 */
export const formatDateFromMillis = dateMillis => {
  const dateObj = new Date(dateMillis)
  return dateObj.toLocaleString('en-TW', {
    dateStyle: 'long',
    //timeZone: 'Asia/Taipei'
  })
}

/**
 * Format date from backend date string.
 */
export const formatDate = (date) => {

  if ((date === undefined || date === null) && selectedTimeZone !== null) {
    return undefined
  }

  const dateObj = useDateObj(date)
  return moment(dateObj).tz(selectedTimeZone).format("YYYY/MM/DD, HH:mm:ss")

}

export const formatDateOnly = (date) => {

  if ((date === undefined || date === null) && selectedTimeZone !== null) {
    return undefined
  }

  const dateObj = useDateObj(date)
  return moment(dateObj).tz(selectedTimeZone).format("YYYY/MM/DD")

}

export const formatTime = (date) => {

  if ((date === undefined || date === null) && selectedTimeZone !== null) {
    return undefined
  }

  const dateObj = useDateObj(date)
  return moment(dateObj).tz(selectedTimeZone).format('HH:mm:ss')

}

export const getTimeDifference = date => {
  const dateObj = useDateObj(date)

  return Date.now() - dateObj
}


export const formatCurrency = number => {
  if (number != null) {
    return new Intl.NumberFormat('en-US',
      {style: 'currency', currency: 'USD'}).format(number)
  }
}

export function calculatePercentage(Amount, percent) {
  return (Amount * percent) / 100
}


const useDateObj = (date) => {
  let plusIndex = (date.lastIndexOf('+') === -1 ? date.length : date.lastIndexOf('+'))
  const majorVersionIOS = parseInt(Platform.Version, 10)
  let dateParseStr = date.slice(0, plusIndex)
  if (majorVersionIOS >= 14) {
    dateParseStr += 'Z'
  }
  const dateMillis = Date.parse(dateParseStr)
  const dateObj = new Date(dateMillis)
  return dateObj
}

export const normalizeTimeString = (time, formatString = null) => {
  if (!!time) {


    return moment(time).tz(selectedTimeZone).format(formatString ?? 'YYYY-MM-DD HH:mm:ss')
  } else {
    return moment().tz(selectedTimeZone).format(formatString ?? 'YYYY-MM-DD HH:mm:ss')
  }
}


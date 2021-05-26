import TimeZoneService from "../helpers/TimeZoneService";
import {Platform} from 'react-native';
import moment from "moment-timezone";

const timezone = TimeZoneService.getTimeZone()

export const customFormatLocaleDate = (date, format = null) => {
  return moment(date ?? new Date()).tz(timezone).format(format ?? "YYYY-MM-DD HH:mm")
}

/**
 * Format date string.
 */
export const formatDateObj = dateStr => {
  if (dateStr != null) {
    const dateObj = new Date(dateStr)
    return dateObj.toLocaleString('en-TW', {
      dateStyle: 'long',
      //timeZone: timezone //comment because Android error
    })
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

  if (date === undefined || date === null) {
    return undefined
  }

  const dateObj = useDateObj(date)

  return dateObj.toLocaleString('en-TW', {
    dateStyle: 'long',
    //timeZone: timezone,
    hour12: false
  })
}

export const formatDateOnly = date => {

  if (date === undefined || date === null) {
    return undefined
  }

  const dateObj = useDateObj(date)
  return dateObj.toLocaleDateString('en-TW', {
    dateStyle: 'long',
    //timeZone: timezone
  })
}

export const formatTime = date => {

  if (date === undefined || date === null) {
    return undefined
  }

  const dateObj = useDateObj(date)

  return moment(dateObj).format('HH:mm:ss')
  // return dateObj.toLocaleTimeString('en-TW', {
  //   dateStyle: 'long',
  //   //timeZone: timezone
  //   hour12: false
  // })
}

export const getTimeDifference = date => {
  const dateObj = useDateObj(date)

  return Date.now() - dateObj
}

export const dateToLocaleString = dateObj => {
  return dateObj.toLocaleString('en-TW', {
    dateStyle: 'long',
    //timeZone: timezone
  })
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


    return moment(time).tz(timezone).format(formatString ?? 'YYYY-MM-DD HH:mm:ss')
  } else {
    return moment().tz(timezone).format(formatString ?? 'YYYY-MM-DD HH:mm:ss')
  }
}


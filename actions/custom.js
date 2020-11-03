import TimeZoneService from "../helpers/TimeZoneService";

const timezone = TimeZoneService.getTimeZone()

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

  let plusIndex = (date.lastIndexOf('+') === -1 ? date.length : date.lastIndexOf('+'))
  const dateMillis = Date.parse(date)
  //const dateMillis = Date.parse(date.slice(0, plusIndex))
  const dateObj = new Date(dateMillis)

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

  let plusIndex = (date.lastIndexOf('+') === -1 ? date.length : date.lastIndexOf('+'))
  //const dateMillis = Date.parse(date.slice(0, plusIndex))
  const dateMillis = Date.parse(date)
  const dateObj = new Date(dateMillis)
  return dateObj.toLocaleDateString('en-TW', {
    dateStyle: 'long',
    //timeZone: timezone
  })
}

export const formatTime = date => {

  if (date === undefined || date === null) {
    return undefined
  }

  let plusIndex = (date.lastIndexOf('+') === -1 ? date.length : date.lastIndexOf('+'))
  //const dateMillis = Date.parse(date.slice(0, plusIndex))
  const dateMillis = Date.parse(date)
  const dateObj = new Date(dateMillis)
  return dateObj.toLocaleTimeString('en-TW', {
    dateStyle: 'long',
    //timeZone: timezone
  })
}

export const getTimeDifference = date => {
  let plusIndex = (date.lastIndexOf('+') === -1 ? date.length : date.lastIndexOf('+'))
  //ios 13 use this parse method,but new method can work both ios 13 and ios 14
  //const dateMillis = Date.parse(date.slice(0, plusIndex))
  const dateMillis = Date.parse(date)
  const dateObj = new Date(dateMillis)

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

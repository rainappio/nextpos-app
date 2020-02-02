import Devices from 'react-native-device-detection'
/**
 * Format date string.
 */
export const formatDateObj = dateStr => {
  if (dateStr != null) {
    const dateObj = new Date(dateStr)
    return dateObj.toLocaleString('en-TW', {
      dateStyle: 'long',
      timeZone: 'Asia/Taipei'
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
    timeZone: 'Asia/Taipei'
  })
}

/**
 * Format date from backend date string.
 */
export const formatDate = date => {
  const dateMillis = Date.parse(date.slice(0, date.length - 5))
  const dateObj = new Date(dateMillis)
  return dateObj.toLocaleString('en-TW', {
    dateStyle: 'long',
    timeZone: 'Asia/Taipei'
  })
}

export const getTimeDifference = date => {
  const dateMillis = Date.parse(date.slice(0, date.length - 5))
  const dateObj = new Date(dateMillis)

  return Date.now() - dateObj
}

export const dateToLocaleString = dateObj => {
  return dateObj.toLocaleString('en-TW', {
    dateStyle: 'long',
    timeZone: 'Asia/Taipei'
  })
}

export function calculatePercentage (Amount, percent) {
  return (Amount * percent) / 100
}

export const isTablet = Devices.isTablet ? true : false
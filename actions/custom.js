export function get_time_diff (datetime) {
  var t = datetime.split(/[- :T]/)
  var date = new Date(
    parseInt(t[0]),
    parseInt(t[1] - 1),
    parseInt(t[2]),
    parseInt(t[3]),
    parseInt(t[4]),
    parseInt(t[5])
  )
  var orderStart = new Date(date).getTime()
  var now = new Date().getTime()
  var timeZoneOffset = new Date(date).getTimezoneOffset()

  if (isNaN(orderStart)) {
    return ''
  }
  if (orderStart < now) {
    var milisec_diff = now - orderStart
  } else {
    var milisec_diff = orderStart - now
  }

  var days = Math.floor(milisec_diff / 1000 / 60 / (60 * 24))
  var minutes = Math.floor(milisec_diff / 1000 / 60) + timeZoneOffset
  return minutes
}

export function checkNaN (value) {
  var value = parseInt(value)
  isNaN(value) ? 0 : value
}

/**
 * Format date string.
 */
export const formatDateObj = dateStr => {

  if (dateStr != null) {
    const dateObj = new Date(dateStr);
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

export const dateToLocaleString = dateObj => {

  return dateObj.toLocaleString('en-TW', {
    dateStyle: 'long',
    timeZone: 'Asia/Taipei'
  })
}

export function calculatePercentage (Amount, percent) {
  return (Amount * percent) / 100
}

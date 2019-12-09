import { AsyncStorage } from 'react-native'

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

export const readableDateFormat = date => {
  var shortDate = date.slice(0, 10)
  var subShortDate = shortDate.split('-')
  var monthCount = subShortDate[1].replace(/\b(0(?!\b))+/g, '')

  var t = date.split(/[- :T]/)
  var date = new Date(
    parseInt(t[0]),
    parseInt(t[1] - 1),
    parseInt(t[2]),
    parseInt(t[3]),
    parseInt(t[4]),
    parseInt(t[5])
  )
  var getHours = new Date(date).getHours()
  var getMinutes = new Date(date).getMinutes()
  function getMonthName (monthCount) {
    switch (monthCount) {
      case '1':
        return 'Jan'
      case '2':
        return 'Feb'
      case '3':
        return 'Mar'
      case '4':
        return 'April'
      case '5':
        return 'May'
      case '6':
        return 'Jun'
      case '7':
        return 'Jul'
      case '8':
        return 'Aug'
      case '9':
        return 'Sept'
      case '10':
        return 'Oct'
      case '11':
        return 'Nov'
      case '12':
        return 'Dec'
      default:
        return 'pls check ur dateCount'
    }
  }
  var formattedDateTime =
    subShortDate[2] +
    ' ' +
    getMonthName(monthCount) +
    ' ' +
    subShortDate[0] +
    ' ' +
    getHours +
    ':' +
    getMinutes
  return formattedDateTime
}

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

export const formatDateOnly = date => {
  const dateMillis = Date.parse(date.slice(0, date.length - 5))
  const dateObj = new Date(dateMillis)
  return dateObj.toLocaleDateString('en-TW', {
    dateStyle: 'long',
    timeZone: 'Asia/Taipei'
  })
}

export const formatTime = date => {
  const dateMillis = Date.parse(date.slice(0, date.length - 5))
  const dateObj = new Date(dateMillis)
  return dateObj.toLocaleTimeString('en-TW', {
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

export function getMonthName(monthCount){
		switch(monthCount){
			case 1:
				return "JANUARY";
			case 2:
				return "FEBRUARY";
			case 3:
				return "MARCH";
			case 4:
				return "APRIL";
			case 5:
				return "MAY";
			case 6:
				return "JUNE";
			case 7:
				return "JULY";
			case 8:
				return "AUGUST";
			case 9:
				return "SEPTEMBER";
			case 10:
				return "OCTOBER";
			case 11:
				return "NOVEMBER";
			case 12:
				return "DECEMBER";
			default:
				return "pls check ur dateCount";
		}
	}

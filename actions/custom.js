export function timeConverter (minutes) {
  var hours = minutes / 60
  var rhours = Math.floor(hours)
  var minutes = (hours - rhours) * 60
  var rminutes = Math.round(minutes)
  return rminutes + 'min'
}

export function checkNaN (value) {
  var value = parseInt(value)
  isNaN(value) ? 0 : value
}

export const readableDateFormat = (date) => {
	var shortDate = date.slice(0,10);
	var subShortDate = shortDate.split("-");
	var monthCount = subShortDate[1].replace(/\b(0(?!\b))+/g, "");

	function getMonthName(monthCount){
		switch(monthCount){
			case "1":
				return "Jan";
			case "2":
				return "Feb";
			case "3":			
				return "Mar";
			case "4":
				return "April";
			case "5":
				return "May";
			case "6":			
				return "Jun";
			case "7":
				return "Jul";
			case "8":
				return "Aug";
			case "9":			
				return "Sept";
			case "10":
				return "Oct";
			case "11":
				return "Nov";
			case "12":			
				return "Dec";
			default:
				return "pls check ur dateCount";
		}
	}
	var formattedDateTime = subShortDate[2] + " " + getMonthName(monthCount) + " " + subShortDate[0];
	return formattedDateTime;
}

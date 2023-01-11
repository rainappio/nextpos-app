import {useContext, useEffect, useState} from "react"
import {View} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from "moment-timezone"
import TimeZoneService from "../helpers/TimeZoneService"
import {LocaleContext} from "../locales/LocaleContext"

export const SimpleDateTimePicker = ({initDate, onChange2}) => {
  const {customMainThemeColor} = useContext(LocaleContext)

  const mode = 'datetime'
  const timezone = TimeZoneService.getTimeZone()
  let dateToUse = new Date()

  if (initDate !== null) {
    const i18nMoment = moment(moment(initDate)).tz(timezone)
    dateToUse = i18nMoment.toDate()
  }

  console.log('initial date', dateToUse)

  // const [date, setDate] = useState(i18nMoment.toDate())
  //
  // const onChange = (event, selectedDate) => {
  //   const currentDate = selectedDate
  //   console.log('selected current date', currentDate)
  //
  //   setDate(currentDate)
  //   onChange2(selectedDate)
  // }

  return (
    <View style={{flex: 1}}>
      <DateTimePicker
        testID="dateTimePicker"
        value={dateToUse}
        mode={mode}
        is24Hour={true}
        onChange={onChange2}
        locale={'zh-TW'}
        style={
          {
            //backgroundColor: 'white',
            borderRadius: 5,
            marginVertical: 5,
          }
        }
      />
    </View>
  )
}

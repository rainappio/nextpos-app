import React from 'react'
import {connect} from 'react-redux'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {LocaleContext} from '../locales/LocaleContext'
import moment from 'moment'
import styles from '../styles'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import RNPickerSelect from 'react-native-picker-select'
import Icon from 'react-native-vector-icons/Ionicons'
import {getOrdersByDateRange} from '../actions'

class DateTimeFilterControlledForm extends React.Component {
  static contextType = LocaleContext
  state = {
    date: new Date(),
    time: new Date(),
    todate: new Date(),
    totime: new Date(),
    readonly: true,
    show: false,
    mode: 'date',
    from: {
      show: false
    },
    to: {
      show: false
    },
    searchFilter: {
      dateRange: 'SHIFT',
      shiftId: null,
      fromDate: new Date(),
      toDate: new Date()
    }
  }

  componentDidMount() {

    this.context.localize({
      en: {
        dateRange: {
          SHIFT: 'Shift Duration',
          TODAY: 'Today',
          WEEK: 'This Week',
          MONTH: 'This Month',
          RANGE: 'Date Range'
        }
      },
      zh: {
        dateRange: {
          SHIFT: '開帳期間',
          TODAY: '今日',
          WEEK: '本週',
          MONTH: '本月',
          RANGE: '自訂日期'
        }
      }
    })
  }

  showDatepicker = (which) => {

    if (which === 'from') {
      this.setState({
        from: {
          show: !this.state.from.show
        }
      })
      this.showMode('date');

    } else if (which === 'to') {
      this.setState({
        to: {
          show: !this.state.to.show
        }
      })
      this.showMode('date');
    }
  };

  showMode = (currentMode) => {
    this.setState({
      show: true,
      mode: currentMode
    })
  };

  componentDidUpdate() {
    if (this.props.onChange) {
      this.props.onChange(this.state);
    }
  }

  formatDate = (date, time) => {
    return moment(date).format('YYYY-MM-DD') + ' ' + moment(time).format('HH:mm')
  }

  showDatePicker = () => {
    this.setState({
      mode: 'time',
      show: true,
      from: {
        show: true
      },
      to: {
        show: false
      },
    })
  }


  showTimePicker = () => {
    this.setState({
      mode: 'date',
      show: false,
      from: {
        show: false
      },
      to: {
        show: true
      }
    })
  }

  //https://stackoverflow.com/questions/58925515/using-react-native-community-datetimepicker-how-can-i-display-a-datetime-picker
  onChange = (event, selectedDate, from) => {
    if (from) {
      this.setState({
        show: false
      })

      if (this.state.mode === 'date') {
        const currentDate = selectedDate || new Date();
        this.setState({date: currentDate})
        this.showDatePicker()
      } else {
        const currentTime = selectedDate || new Date();
        this.setState({time: currentTime})
        this.showTimePicker()
      }
    } else {
      this.setState({
        show: false
      })

      if (this.state.mode === 'date') {
        const currentDate = selectedDate || new Date();
        this.setState({todate: currentDate})
        this.showDatePicker()
      } else {
        const currentTime = selectedDate || new Date();
        this.setState({totime: currentTime})
        this.showTimePicker()
      }
    }
  };

  handleOrderSearchSimpleForm = () => {
    console.log('handleOrderSearchSimpleForm hit')
    const {date, time, todate, totime, dateRange, shiftId, searchFilter} = this.state;
    const pickRange = searchFilter.dateRange != null ? searchFilter.dateRange : 'SHIFT'
    const pickshiftId = searchFilter.shiftId != null ? searchFilter.shiftId : null
    const fromDate = moment(date).format('YYYY-MM-DD') + 'T' + moment(time).format('HH:mm:ss');
    const toDate = moment(todate).format('YYYY-MM-DD') + 'T' + moment(time).format('HH:mm:ss')

    this.setState({
      searchFilter: {
        dateRange: pickRange,
        shiftId: pickshiftId,
        fromDate: fromDate,
        toDate: toDate
      }
    })

    console.log(`Order screen selected dates - from: ${fromDate} to: ${toDate}`)
    //return;
    //this.props.getOrdersByDateRange(dateRange, shiftId, fromDate, toDate)
  }

  //# dateTime picking

  render() {
    const {handleSubmit, handlegetDate, showAndroidDateTimeOnly, startDate, endDate} = this.props
    const {t} = this.context
    const {date, time} = this.state;

    return (
      <View>
        {
          !showAndroidDateTimeOnly
            ?
            <View style={[styles.tableRowContainer]}>
              <View style={{flex: 3, marginRight: 5}}>
                <RNPickerSelect
                  items={[
                    {label: t('dateRange.RANGE'), value: 'RANGE'},
                    {label: t('dateRange.SHIFT'), value: 'SHIFT'},
                    {label: t('dateRange.TODAY'), value: 'TODAY'},
                    {label: t('dateRange.WEEK'), value: 'WEEK'},
                    {label: t('dateRange.MONTH'), value: 'MONTH'}
                  ]}
                  value={this.state.searchFilter.dateRange}
                  useNativeAndroidPickerStyle={false}
                  onValueChange={(value) => {
                    this.setState({
                      readonly: value !== 'RANGE',
                      searchFilter: {
                        dateRange: value
                      }
                    })
                  }}
                  style={pickerSelectStyles}
                  Icon={() => {
                    return (
                      <Icon name='md-arrow-dropdown' size={30} style={{position: 'absolute', top: -9, right: 0, borderWidth: 0}} />
                    )
                    //return <Chevron size={1.5} color="gray" />;
                  }}
                />
              </View>
              <View style={{flex: 1, justifyContent: 'flex-end'}}>
                <TouchableOpacity
                  onPress={this.handleOrderSearchSimpleForm}
                >
                  <Text
                    style={[
                      styles.searchButton
                    ]}
                  >
                    {t('action.search')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            :
            null
        }

        {/* #datetime picking */}
        <View style={[styles.sectionContainer]}>
          <View style={[styles.tableRowContainer]}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <TouchableOpacity onPress={() => this.showDatepicker('from')} style={styles.datetimeBorder}>
                <Text style={{marginRight: 8, fontSize: 13}}>
                  <FontAwesomeIcon
                    name="calendar"
                    size={20}
                    style={[styles.orange_color]}
                  />&nbsp;
                  {/*moment(this.props.startDate).format("YYYY-MM-DD HH:mm A")*/}
                  {this.formatDate(this.state.date, this.state.time)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.showDatepicker('to')} style={styles.datetimeBorder}>
                <Text style={{fontSize: 13}}>
                  <FontAwesomeIcon
                    name="calendar"
                    size={20}
                    style={[styles.orange_color]}
                  />&nbsp;
                  {this.formatDate(this.state.todate, this.state.totime)}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {this.state.show && (
          <RNDateTimePicker
            value={this.state.date}
            mode={this.state.mode}
            is24Hour={true}
            display="default"
            onChange={
              (e, d) => this.onChange(e, d, this.state.from.show)}
          />
        )}
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getOrdersByDateRange: (dateRange, shiftId, fromDate, toDate) => dispatch(getOrdersByDateRange(dateRange, shiftId, fromDate, toDate))
})

export default connect(
  null,
  mapDispatchToProps
)(DateTimeFilterControlledForm)

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    color: 'black'
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black'
  },
  iconContainer: {
    top: 18,
    right: 15,
  }
});


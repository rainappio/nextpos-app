import React from 'react'
import {FlatList, Text, View} from 'react-native'
import {connect} from 'react-redux'
import {formatDate, getShifts} from '../actions'
import {ListItem} from 'react-native-elements'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import {NavigationEvents} from "react-navigation";
import ScreenHeader from "../components/ScreenHeader";
import LoadingScreen from "./LoadingScreen";
import {renderShiftStatus} from "../helpers/shiftActions";
import MonthPicker from "../components/MonthPicker";
import moment from "moment";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {StyledText} from "../components/StyledText";
import {withContext} from "../helpers/contextHelper";
import {compose} from "redux";


class ShiftHistory extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        shiftHistoryTitle: 'Shift History',
        shiftStartDate: 'Shift Start Date',
        shiftOpenedBy: 'Opened by',
        shiftTotal: 'Total',
        shiftStatus: 'Status'
      },
      zh: {
        shiftHistoryTitle: '關帳紀錄',
        shiftStartDate: '開帳日期',
        shiftOpenedBy: '開帳員工',
        shiftTotal: '總營業額',
        shiftStatus: '帳狀態'
      }
    })

    this.state = {
      currentDate: moment(new Date()),
      selectedFilter: 0
    }
  }

  componentDidMount() {
    this.props.getShifts()
  }

  keyExtractor = (order, index) => index.toString()

  renderItem = ({item}) => {
    let shiftTotal = 0

    if (item.close !== undefined) {
      const closingShiftReport = item.close.closingShiftReport

      if (closingShiftReport !== null) {
        if (closingShiftReport.totalByPaymentMethod.hasOwnProperty('CASH')) {
          shiftTotal += closingShiftReport.totalByPaymentMethod['CASH'].orderTotal
        }

        if (closingShiftReport.totalByPaymentMethod.hasOwnProperty('CARD')) {
          shiftTotal += closingShiftReport.totalByPaymentMethod['CARD'].orderTotal
        }
      }
    }

    return (
      <ListItem
        key={item.id}
        title={
          <View style={[styles.tableRowContainer]}>
            <View style={[styles.tableCellView, {flex: 3}]}>
              <StyledText>{formatDate(item.open.timestamp)}</StyledText>
            </View>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText>{item.shiftStatus !== 'ACTIVE' ? `$${shiftTotal}` : '-'}</StyledText>
            </View>
            <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-end'}]}>
              <StyledText>{renderShiftStatus(item.shiftStatus)}</StyledText>
            </View>
          </View>
        }
        onPress={() =>
          this.props.navigation.navigate('ShiftDetails', {
            shift: item
          })
        }
        bottomDivider
        containerStyle={[styles.dynamicVerticalPadding(12), {padding: 0, backgroundColor: this.context?.customBackgroundColor}]}
      />
    )
  }

  render() {
    const {isLoading, haveData, shifts} = this.props
    const {t, customMainThemeColor} = this.context

    if (isLoading) {
      return (
        <LoadingScreen />
      )
    } else if (haveData) {
      return (
        <ThemeScrollView>
          <View style={[styles.fullWidthScreen]}>
            <NavigationEvents
              onWillFocus={() => {
                const dateToUse = this.state.currentDate.format('YYYY-MM-DD')

                this.props.getShifts(dateToUse)
              }}
            />
            <ScreenHeader backNavigation={true}
              parentFullScreen={true}
              title={t('shiftHistoryTitle')}
            />

            <MonthPicker
              currentDate={this.state.currentDate}
              selectedFilter={this.state.selectedFilter}
              handleMonthChange={(date, selectedFilter) => {
                this.setState({currentDate: date, selectedFilter: selectedFilter})

                this.props.getShifts(date.format('YYYY-MM-DD'))
              }} />

            <View style={{flex: 5}}>
              <View style={[styles.sectionBar]}>
                <View style={{flex: 3}}>
                  <Text style={styles?.sectionBarTextSmall(customMainThemeColor)}>{t('shiftStartDate')}</Text>
                </View>

                <View style={{flex: 1}}>
                  <Text style={[styles?.sectionBarTextSmall(customMainThemeColor)]}>{t('shiftTotal')}</Text>
                </View>

                <View style={{flex: 2, alignItems: 'flex-end'}}>
                  <Text style={[styles?.sectionBarTextSmall(customMainThemeColor)]}>{t('shiftStatus')}</Text>
                </View>
              </View>


              <FlatList
                keyExtractor={this.keyExtractor}
                data={shifts}
                renderItem={this.renderItem}
                ListEmptyComponent={
                  <View>
                    <StyledText style={styles.messageBlock}>{t('order.noOrder')}</StyledText>
                  </View>
                }
              //onScroll={this.handleScroll}
              />
            </View>
          </View>
        </ThemeScrollView>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = state => ({
  shifts: state.shifts.data.shifts,
  haveData: state.shifts.haveData,
  haveError: state.shifts.haveError,
  isLoading: state.shifts.loading
})
const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getShifts: (date) => dispatch(getShifts(date))
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withContext
)

export default enhance(ShiftHistory)

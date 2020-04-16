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
        shiftHistoryTitle: '帳歷史',
        shiftStartDate: '開帳日期',
        shiftOpenedBy: '開帳員工',
        shiftTotal: '總營業額',
        shiftStatus: '帳狀態'
      }
    })
    this.state = {
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
              <Text>{formatDate(item.open.timestamp)}</Text>
            </View>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <Text>{item.shiftStatus !== 'ACTIVE' ? `$${shiftTotal}` : '-'}</Text>
            </View>
            <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-end'}]}>
              <Text>{renderShiftStatus(item.shiftStatus)}</Text>
            </View>
          </View>
        }
        onPress={() =>
          this.props.navigation.navigate('ShiftDetails', {
            shift: item
          })
        }
        bottomDivider
        containerStyle={[styles.dynamicVerticalPadding(12), {padding: 0}]}
      />
    )
  }

  render() {
    const {isLoading, haveData, shifts} = this.props
    const {t} = this.context

    if (isLoading) {
      return (
        <LoadingScreen/>
      )
    } else if (haveData) {
      return (
        <View style={[styles.fullWidthScreen]}>
          <NavigationEvents
            onWillFocus={() => {
              this.props.getShifts()
            }}
          />
          <ScreenHeader backNavigation={true}
                        parentFullScreen={true}
                        title={t('shiftHistoryTitle')}
          />

          <View style={{flex: 5}}>
            <View style={[styles.sectionBar]}>
              <View style={{flex: 3}}>
                <Text style={styles.sectionBarTextSmall}>{t('shiftStartDate')}</Text>
              </View>

              <View style={{flex: 1}}>
                <Text style={[styles.sectionBarTextSmall]}>{t('shiftTotal')}</Text>
              </View>

              <View style={{flex: 2, alignItems: 'flex-end'}}>
                <Text style={[styles.sectionBarTextSmall]}>{t('shiftStatus')}</Text>
              </View>
            </View>

            {shifts.length === 0 && (
              <View>
                <Text style={styles.messageBlock}>{t('order.noOrder')}</Text>
              </View>
            )}

            {shifts.length > 0 &&(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={shifts}
                renderItem={this.renderItem}
                //onScroll={this.handleScroll}
              />
            )}
          </View>
        </View>
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
  getShifts: () => dispatch(getShifts())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShiftHistory)

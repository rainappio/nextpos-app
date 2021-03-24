import React from 'react'
import {connect} from 'react-redux'
import {FlatList, Text, TouchableOpacity, View} from 'react-native'
import {formatDate, getUserTimeCards, normalizeTimeString} from '../actions'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import {warningMessage} from '../constants/Backend'
import ScreenHeader from "../components/ScreenHeader";
import LoadingScreen from "./LoadingScreen";
import {UserTimeCardFilterForm} from "./StaffTimeCardFilterForm";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {StyledText} from "../components/StyledText";
import moment from 'moment-timezone'

class UserTimeCards extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context);

    context.localize({
      en: {
        timeCardDate: 'Date',
        timeCardTime: 'Time',
        userTimeCardTitle: "User Time Cards",
        day: "Shift",
        totalHr: "Total Hours",
        arriveLateMinutes: 'Arrive Late Minutes',
        leaveEarlyMinutes: 'Leave Early Minutes',
        minute: 'min'
      },
      zh: {
        timeCardDate: '打卡日期',
        timeCardTime: '上班/下班時間',
        userTimeCardTitle: "職員打卡",
        day: "值班",
        totalHr: "總時數",
        arriveLateMinutes: '遲到時數',
        leaveEarlyMinutes: '早退時數',
        minute: '分'
      }
    })

    this.state = {
      timecardId: null,
      selectedYear: props.navigation.getParam('year'),
      selectedMonth: props.navigation.getParam('month')
    }
  }



  handleFilter = (values) => {
    const month = values.month;
    const year = values.year;
    const username = this.props.navigation.state.params.name;

    if (!month || !year) {
      warningMessage('Please Choose Both Year and Month')
      return
    }

    this.setState({selectedYear: year, selectedMonth: month})

    this.props.getUserTimeCards(username, year, month)
  }

  componentDidMount() {
    const username = this.props.navigation.getParam('name')
    const year = this.props.navigation.getParam('year')
    const month = this.props.navigation.getParam('month')

    this.props.getUserTimeCards(username, year, month)
  }

  render() {
    const {t, customMainThemeColor} = this.context
    const {usertimeCards, haveData, haveError, loading, timeCard} = this.props

    Item = ({timecard}) => {
      const active = timecard.timeCardStatus === 'ACTIVE'
      console.log('timecard', timecard)

      return (
        <View
          style={styles.tableRowContainerWithBorder}

        >
          <View style={[styles.tableCellView, {flex: 3.2, alignItems: 'flex-start'}]}>
            <StyledText style={{fontWeight: active ? 'bold' : 'normal'}}>
              {normalizeTimeString(timecard?.clockIn, 'YYYY/MM/DD dd')}
            </StyledText>

          </View>
          <View style={[styles.tableCellView, {flex: 3, alignItems: 'flex-start'}]}>
            <StyledText style={{fontWeight: active ? 'bold' : 'normal'}}>
              {normalizeTimeString(timecard?.clockIn, 'hh:mm')}~{!!timecard?.clockOut && normalizeTimeString(timecard?.clockOut, 'hh:mm')}
            </StyledText>

          </View>

          <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-start'}]}>
            <StyledText>
              {timecard.hours}&nbsp;{t('timecard.hours')}&nbsp;{timecard.minutes}&nbsp;{t('timecard.minutes')}
            </StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 1.2, justifyContent: 'flex-end'}]}>
            <StyledText>
              {timecard?.arriveLateMinutes ?? '0'}{t('minute')}
            </StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 1.2, justifyContent: 'flex-end'}]}>
            <StyledText>
              {timecard?.leaveEarlyMinutes ?? '0'}{t('minute')}
            </StyledText>
          </View>
        </View>
      )
    }

    if (loading) {
      return (
        <LoadingScreen />
      )
    }
    return (
      <ThemeScrollView>
        <View style={styles.fullWidthScreen}>
          <ScreenHeader backNavigation={true}
            parentFullScreen={true}
            title={t('userTimeCardTitle')}
          />

          <View>
            <Text style={styles?.screenSubTitle(customMainThemeColor)}>{this.props.navigation.getParam('displayName')}</Text>
          </View>

          <UserTimeCardFilterForm
            onSubmit={this.handleFilter}
            initialValues={{
              year: this.state.selectedYear,
              month: this.state.selectedMonth
            }}
          />

          {/*<UserTimeCardsFilterForm
							onSubmit={this.handleFilter}
							displayName={this.props.navigation.state.params.displayName}
            />*/}

          <View style={[styles.sectionBar]}>
            <View style={[styles.tableCellView, {flex: 3.2, alignItems: 'flex-start'}]}>
              <Text style={styles?.sectionBarText(customMainThemeColor)}>
                {t('timeCardDate')}
              </Text>

            </View>
            <View style={[styles.tableCellView, {flex: 3, alignItems: 'flex-start'}]}>
              <Text style={styles?.sectionBarText(customMainThemeColor)}>
                {t('timeCardTime')}
              </Text>

            </View>

            <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-start'}]}>
              <Text style={[styles?.sectionBarText(customMainThemeColor)]}>{t('totalHr')}</Text>
            </View>
            <View style={[styles.tableCellView, {flex: 1.2, justifyContent: 'flex-end'}]}>
              <Text style={styles?.sectionBarText(customMainThemeColor)}>
                {t('arriveLateMinutes')}
              </Text>
            </View>
            <View style={[styles.tableCellView, {flex: 1.2, justifyContent: 'flex-end'}]}>
              <Text style={styles?.sectionBarText(customMainThemeColor)}>
                {t('leaveEarlyMinutes')}
              </Text>
            </View>
          </View>




          <FlatList
            data={usertimeCards}
            renderItem={({item, index}) => (
              <Item
                timecard={item}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </ThemeScrollView>
    )
  }
}

const mapStateToProps = state => ({
  usertimeCards: state.usertimecards.data.timeCards,
  haveData: state.usertimecards.haveData,
  haveError: state.usertimecards.haveError,
  loading: state.usertimecards.loading
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getUserTimeCards: (username, year, month) => dispatch(getUserTimeCards(username, year, month)),
  clearTimeCard: () => dispatch(clearTimeCard())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserTimeCards)

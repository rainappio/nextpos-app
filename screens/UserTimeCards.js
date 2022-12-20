import React from 'react'
import {connect} from 'react-redux'
import {FlatList, Text, TouchableOpacity, View} from 'react-native'
import {getUserTimeCards, normalizeTimeString} from '../actions'
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

    this.state = {
      timecardId: null,
      selectedYear: props.route.params?.year,
      selectedMonth: props.route.params?.month,
    }
  }

  handleFilter = (values) => {
    const month = values.month;
    const year = values.year;
    const username = this.props.route.params.name;

    if (!month || !year) {
      warningMessage('Please Choose Both Year and Month')
      return
    }

    this.setState({selectedYear: year, selectedMonth: month})

    this.props.getUserTimeCards(username, year, month)
  }

  componentDidMount() {
    const username = this.props.route.params?.name
    const year = this.props.route.params?.year
    const month = this.props.route.params?.month

    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.props.getUserTimeCards(username, year, month)
    });
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  render() {
    const {t, customMainThemeColor} = this.context
    const {usertimeCards, haveData, haveError, loading, timeCard} = this.props

    const Item = ({timecard}) => {
      const active = timecard.timeCardStatus === 'ACTIVE'

      return (
        <TouchableOpacity
          //style={styles.tableRowContainerWithBorder}
          onPress={() => {
            this.props.navigation.navigate('UserTimeCardDetails', {
              timeCardId: timecard.id
            })
          }}
        >
          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, {flex: 2.5, alignItems: 'flex-start'}]}>
              <StyledText style={{fontWeight: active ? 'bold' : 'normal'}}>
                {normalizeTimeString(timecard?.clockIn, 'YYYY/MM/DD dd')}
              </StyledText>

            </View>
            <View style={[styles.tableCellView, {flex: 3, alignItems: 'flex-start'}]}>
              <StyledText style={{fontWeight: active ? 'bold' : 'normal'}}>
                {normalizeTimeString(timecard?.clockIn, 'HH:mm')}~{!!timecard?.clockOut && normalizeTimeString(timecard?.clockOut, 'HH:mm')}
              </StyledText>

            </View>

            <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-start'}]}>
              <StyledText>
                {timecard.hours}&nbsp;{t('timecard.hours')}&nbsp;{timecard.minutes}&nbsp;{t('timecard.minutes')}
              </StyledText>
            </View>

            <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-start'}]}>
              <StyledText>
                {timecard.actualWorkingHours}&nbsp;{t('timecard.hours')}&nbsp;{timecard.actualWorkingMinutes}&nbsp;{t('timecard.minutes')}
              </StyledText>
            </View>
            {/*<View style={[styles.tableCellView, {flex: 1.2, justifyContent: 'flex-end'}]}>
            <StyledText>
              {timecard?.arriveLateMinutes ?? '0'}{t('minute')}
            </StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 1.2, justifyContent: 'flex-end'}]}>
            <StyledText>
              {timecard?.leaveEarlyMinutes ?? '0'}{t('minute')}
            </StyledText>
          </View>*/}
          </View>
        </TouchableOpacity>
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
            title={t('timecard.userTimeCardTitle')}
          />

          <View>
            <Text style={styles?.screenSubTitle(customMainThemeColor)}>{this.props.route.params?.displayName}</Text>
          </View>

          <UserTimeCardFilterForm
            onSubmit={this.handleFilter}
            initialValues={{
              year: this.state.selectedYear,
              month: this.state.selectedMonth
            }}
          />

          <View style={[styles.sectionBar]}>
            <View style={[styles.tableCellView, {flex: 2.5, alignItems: 'flex-start'}]}>
              <Text style={styles?.sectionBarText(customMainThemeColor)}>
                {t('timecard.timeCardDate')}
              </Text>

            </View>
            <View style={[styles.tableCellView, {flex: 3, alignItems: 'flex-start'}]}>
              <Text style={styles?.sectionBarText(customMainThemeColor)}>
                {t('timecard.timeCardTime')}
              </Text>
            </View>

            <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-start'}]}>
              <Text style={[styles?.sectionBarText(customMainThemeColor)]}>{t('timecard.totalHours')}</Text>
            </View>

            <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-start'}]}>
              <Text style={[styles?.sectionBarText(customMainThemeColor)]}>{t('timecard.actualHours')}</Text>
            </View>
            {/*<View style={[styles.tableCellView, {flex: 1.2, justifyContent: 'flex-end'}]}>
              <Text style={styles?.sectionBarText(customMainThemeColor)}>
                {t('arriveLateMinutes')}
              </Text>
            </View>
            <View style={[styles.tableCellView, {flex: 1.2, justifyContent: 'flex-end'}]}>
              <Text style={styles?.sectionBarText(customMainThemeColor)}>
                {t('leaveEarlyMinutes')}
              </Text>
            </View>*/}
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

import React from 'react'
import { connect } from 'react-redux'
import { ScrollView, Text, View, TouchableOpacity, Image, ActivityIndicator, FlatList } from 'react-native'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import Icon from 'react-native-vector-icons/Ionicons'
import {getTimeCards} from '../actions'
import { api, dispatchFetchRequest, errorAlert, warningMessage } from '../constants/Backend'
import images from '../assets/images'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import StaffTimeCardFilterForm from './StaffTimeCardFilterForm'
import ScreenHeader from "../components/ScreenHeader";
import LoadingScreen from "./LoadingScreen";
import moment from "moment";
import {NavigationEvents} from "react-navigation";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {StyledText} from "../components/StyledText";

class StaffTimeCard extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context);

    context.localize({
      en: {
        title: 'Staff Time Cards',
        yearLabel: 'Year',
        monthLabel: 'Month',
        firstColTitle: 'Staff',
        secColTitle: 'Total Shifts',
        thirdColTitle: 'Total Hours',

        userTimeCardTitle: "User Time Cards",
        day: "Shift",
        totalHr: "Total Hours"
      },
      zh: {
        title: '職員打卡表',
        yearLabel: '年',
        monthLabel: '月',
        firstColTitle: '員工',
        secColTitle: '總班數',
        thirdColTitle: '總時數',

        userTimeCardTitle: "職員打卡",
        day: "值班",
        totalHr: "總時數"
      }
    })

    this.state = {
      selectedYear: String(moment().format('YYYY')),
      selectedMonth: String(moment().month() + 1)
    }
  }

  componentDidMount() {
    this.props.getTimeCards(this.state.selectedYear, this.state.selectedMonth)
  }

  handleFilter = (values) => {
  	const month = values.month;
  	const year = values.year;

  	if (!month || !year) {
      warningMessage('Please Choose Both Year and Month')
      return
    }

  	this.setState({ selectedYear: year, selectedMonth: month })

    this.props.getTimeCards(year, month)
  }

  render() {
    const {t} = this.context
    const {timecards, haveData, haveError, loading} = this.props

    Item = ({timecard, layoutId, index}) => {
      const displayName = timecard.nickname != null ? timecard.nickname : timecard.id

      return (
        <TouchableOpacity
          style={styles.tableRowContainerWithBorder}
          onPress={() => {
            this.props.navigation.navigate('UserTimeCards', {
              name: timecard.id,
              year: this.state.selectedYear,
              month: this.state.selectedMonth,
              displayName: displayName
            })
          }}
        >
          <View style={[styles.tableCellView, {flex: 5}]}>
            <StyledText>{displayName}</StyledText>
          </View>

          <View style={[styles.tableCellView, {flex: 2}]}>
            <StyledText>{timecard.totalShifts}</StyledText>
          </View>

          <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
            <StyledText>{timecard.totalHours.toFixed(2)}</StyledText>
          </View>
        </TouchableOpacity>
      )
    }

    if (loading) {
      return (
        <LoadingScreen/>
      )
    } else if (haveData) {
      return (
        <ThemeScrollView>
          <NavigationEvents
            onWillFocus={() => {
              console.log("loading staff time cards")
              console.log(this.state)

              this.props.getTimeCards(this.state.selectedYear, this.state.selectedMonth)
            }}
          />
          <View style={styles.fullWidthScreen}>
            <ScreenHeader backNavigation={true}
                          parentFullScreen={true}
                          title={t('title')}
            />

            <StaffTimeCardFilterForm
              onSubmit={this.handleFilter}
              initialValues={{
                year: this.state.selectedYear,
                month: this.state.selectedMonth
              }}
            />

            <View style={[styles.sectionBar]}>
              <View style={[styles.tableCellView, {flex: 5}]}>
                <Text style={[styles.sectionBarText]}>{t('firstColTitle')}</Text>
              </View>

              <View style={[styles.tableCellView, {flex: 2}]}>
                <Text style={[styles.sectionBarText]}>{t('secColTitle')}</Text>
              </View>

              <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                <Text style={[styles.sectionBarText, {textAlign: 'right'}]}>{t('thirdColTitle')}</Text>
              </View>
            </View>

            <FlatList
              data={timecards}
              renderItem={({item, index}) => (
                <Item timecard={item} layoutId={item.id} index={index}/>
              )}
              keyExtractor={item => item.id}
            />
          </View>
        </ThemeScrollView>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = state => ({
  timecards: state.timecards.data.userTimeCards,
  haveData: state.timecards.haveData,
  haveError: state.timecards.haveError,
  loading: state.timecards.loading
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getTimeCards: (year, month) => dispatch(getTimeCards(year, month))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StaffTimeCard)

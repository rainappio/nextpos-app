import React from 'react'
import {connect} from 'react-redux'
import {FlatList, Text, TouchableOpacity, View} from 'react-native'
import {getTimeCards} from '../actions'
import {api, dispatchFetchRequestWithOption, successMessage, warningMessage} from '../constants/Backend'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import {StaffTimeCardFilterForm} from './StaffTimeCardFilterForm'
import ScreenHeader from "../components/ScreenHeader";
import LoadingScreen from "./LoadingScreen";
import moment from "moment";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {StyledText} from "../components/StyledText";
import {LinearProgress} from 'react-native-elements';
import i18n from 'i18n-js'

class StaffTimeCard extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context);

    this.state = {
      selectedYear: String(moment().format('YYYY')),
      selectedMonth: String(moment().month() + 1),
      exporting: false
    }
  }

  componentDidMount() {
    this.props.getTimeCards(this.state.selectedYear, this.state.selectedMonth)

    this._getTimeCards = this.props.navigation.addListener('focus', () => {

      this.props.getTimeCards(this.state.selectedYear, this.state.selectedMonth)
    })
  }

  componentWillUnmount() {
    this._getTimeCards()
  }

  onChange = (values) => {
    this.updateYearAndMonth(values)
  }

  handleFilter = (values) => {
    this.updateYearAndMonth(values)

    this.props.getTimeCards(values.year, values.month)
  }

  updateYearAndMonth = (values) => {

    console.log(`Updating year and month: ${JSON.stringify(values)}`)

    const month = values.month;
    const year = values.year;

    if (!month || !year) {
      warningMessage('Please Choose Both Year and Month')
      return
    }

    this.setState({selectedYear: year, selectedMonth: month})
  }

  handleExport = () => {

    const month = this.state.selectedMonth;
    const year = this.state.selectedYear;

    if (!month || !year) {
      warningMessage('Please Choose Both Year and Month')
      return
    }

    console.log(`exporting time cards of selected ${month} and ${year}`)

    const formData = new FormData()
    formData.append('month', month)
    formData.append('year', year)

    this.setState({'exporting': true})

    dispatchFetchRequestWithOption(
      api.timecard.export,
      {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {},
        body: formData
      }, {
        defaultMessage: false
      },
      response => {
        successMessage(i18n.t('timecard.exportSuccess'))
        this.setState({exporting: false})
      }
    ).then()
  }

  render() {
    const {t, customMainThemeColor} = this.context
    const {timecards, haveData, haveError, loading} = this.props

    const Item = ({timecard, layoutId, index}) => {
      const displayName = timecard?.displayName ?? timecard.id

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

          <View style={[styles.tableCellView, {flex: 1.5}]}>
            <StyledText>{timecard.totalShifts}</StyledText>
          </View>

          <View style={[styles.tableCellView, {flex: 3.5, justifyContent: 'flex-end'}]}>
            <StyledText>
              {timecard.hours} {t('timecard.hours')}&nbsp;
            </StyledText>
            <StyledText>
              {timecard.minutes} {t('timecard.minutes')}
            </StyledText>
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
          <View style={styles.fullWidthScreen}>
            <ScreenHeader backNavigation={true}
                          parentFullScreen={true}
                          title={t('timecard.title')}
            />

            <StaffTimeCardFilterForm
              onSubmit={this.handleFilter}
              handleExport={this.handleExport}
              onChange={this.onChange}
              initialValues={{
                year: this.state.selectedYear,
                month: this.state.selectedMonth
              }}
            />

            <View style={[styles.sectionBar]}>
              <View style={[styles.tableCellView, {flex: 5}]}>
                <Text style={[styles?.sectionBarText(customMainThemeColor)]}>{t('timecard.firstColTitle')}</Text>
              </View>

              <View style={[styles.tableCellView, {flex: 1.5}]}>
                <Text style={[styles?.sectionBarText(customMainThemeColor)]}>{t('timecard.secColTitle')}</Text>
              </View>

              <View style={[styles.tableCellView, {flex: 3.5, justifyContent: 'flex-end'}]}>
                <Text
                  style={[styles?.sectionBarText(customMainThemeColor), {textAlign: 'right'}]}>{t('timecard.thirdColTitle')}</Text>
              </View>
            </View>

            {this.state.exporting && (
              <View>
                <LinearProgress color={customMainThemeColor}/>
              </View>
            )}

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

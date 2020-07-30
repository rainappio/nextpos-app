import React from 'react'
import {connect} from 'react-redux'
import {FlatList, Text, TouchableOpacity, View} from 'react-native'
import {formatDate, getUserTimeCards} from '../actions'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import {warningMessage} from '../constants/Backend'
import ScreenHeader from "../components/ScreenHeader";
import LoadingScreen from "./LoadingScreen";
import StaffTimeCardFilterForm from "./StaffTimeCardFilterForm";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {StyledText} from "../components/StyledText";
import UserTimeCardDetail from "./UserTimeCardDetail";

class UserTimeCards extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  state = {
    timecardId: null,
    selectedYear: this.props.navigation.getParam('year'),
    selectedMonth: this.props.navigation.getParam('month')
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
    const {t} = this.context
    const {usertimeCards, haveData, haveError, loading, timeCard} = this.props

    Item = ({timecard}) => {
      const active = timecard.timeCardStatus === 'ACTIVE'

      return (
        <TouchableOpacity
          style={styles.tableRowContainerWithBorder}
          onPress={() => {
            this.props.navigation.navigate('UserTimeCardDetail', {
              timecardId: timecard.id
            })
          }}
        >
          <View style={[styles.tableCellView, {flex: 1}]}>
            <StyledText style={{fontWeight: active ? 'bold' : 'normal'}}>
              {formatDate(timecard.clockIn)}
            </StyledText>
          </View>

          <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
            <StyledText>
              {timecard.hours}&nbsp;{t('timecard.hours')}&nbsp;{timecard.minutes}&nbsp;{t('timecard.minutes')}
            </StyledText>
          </View>
        </TouchableOpacity>
      )
    }

    if (loading) {
      return (
        <LoadingScreen/>
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
            <Text style={styles.screenSubTitle}>{this.props.navigation.getParam('displayName')}</Text>
          </View>

          <StaffTimeCardFilterForm
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
            <View style={[styles.tableCellView, {flex: 1}]}>
              <Text style={styles.sectionBarText}>{t('day')}</Text>
            </View>

            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
              <Text style={[styles.sectionBarText]}>{t('totalHr')}</Text>
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

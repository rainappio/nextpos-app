import React from "react";
import {LocaleContext} from "../locales/LocaleContext";
import {KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View} from "react-native";
import styles from "../styles";
import ScreenHeader from "../components/ScreenHeader";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {formatDateOnly, formatTime, getTimeCard} from "../actions";
import {compose} from "redux";
import {connect} from "react-redux";
import {withContext} from "../helpers/contextHelper";
import {StyledText} from "../components/StyledText";
import {api, dispatchFetchRequest, dispatchFetchRequestWithOption} from "../constants/Backend";

class UserTimeCardDetails extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context);

    this.state = {
      timeCardId: props.route.params?.timeCardId,
      actualWorkingHours: String(this.props.timeCardDetails.actualWorkingHours),
      actualWorkingMinutes: String(this.props.timeCardDetails.actualWorkingMinutes)
    }
  }

  componentDidMount() {
    this.props.getTimeCard(this.state.timeCardId)
  }

  /**
   * Used to update state actual values after redux state is updated.
   */
  componentDidUpdate(prevProps, prevState, snapshot) {

    console.trace(`current: ${this.props.timeCardDetails.actualWorkingHours} ${this.props.timeCardDetails.actualWorkingMinutes}`)
    console.trace(`prev: ${prevProps.timeCardDetails.actualWorkingHours} ${prevProps.timeCardDetails.actualWorkingMinutes}`)

    const hoursChanged = this.props.timeCardDetails.actualWorkingHours !== prevProps.timeCardDetails.actualWorkingHours
    const minutesChanged = this.props.timeCardDetails.actualWorkingMinutes !== prevProps.timeCardDetails.actualWorkingMinutes

    if (hoursChanged || minutesChanged) {
      this.setState({
        actualWorkingHours: String(this.props.timeCardDetails.actualWorkingHours),
        actualWorkingMinutes: String(this.props.timeCardDetails.actualWorkingMinutes)
      })
    }
  }

  handleUpdateWorkingTime = () => {

    const request = {
      workingHours: this.state.actualWorkingHours,
      workingMinutes: this.state.actualWorkingMinutes
    }

    dispatchFetchRequest(api.timecard.updateWorkingTime(this.state.timeCardId), {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    }, response => {
      console.log("Working time updated")
    }).then()
  }

  render() {
    const {timeCardDetails, complexTheme} = this.props
    const {t, customMainThemeColor} = this.context

    return (
      <ThemeScrollView>
        <View style={styles.fullWidthScreen}>
          <ScreenHeader backNavigation={true}
                        parentFullScreen={true}
                        title={t('timecard.userTimeCardTitle')}
          />

          <View>
            <Text style={styles?.screenSubTitle(customMainThemeColor)}>{timeCardDetails.displayName}</Text>
          </View>

          <View style={[styles.tableRowContainerWithBorder]}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText>{t('timecard.timeCardDate')}</StyledText>
            </View>
            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
              <StyledText>
                {formatDateOnly(timeCardDetails.clockIn)}
              </StyledText>
            </View>
          </View>

          <View style={[styles.tableRowContainerWithBorder]}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText>{t('timecard.timeCardTime')}</StyledText>
            </View>
            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
              <StyledText>
                {formatTime(timeCardDetails.clockIn)} ~ {formatTime(timeCardDetails.clockOut)}
              </StyledText>
            </View>
          </View>

          <View style={[styles.tableRowContainerWithBorder]}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText>{t('timecard.totalHours')}</StyledText>
            </View>
            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
              <StyledText>
                {timeCardDetails.hours}&nbsp;{t('timecard.hours')}&nbsp;{timeCardDetails.minutes}&nbsp;{t('timecard.minutes')}
              </StyledText>
            </View>
          </View>


          <KeyboardAvoidingView behavior='position'>
            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <StyledText>{t('timecard.actualWorkingHours')}</StyledText>
              </View>
              <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                <TextInput
                  name="actualWorkingHours"
                  value={this.state.actualWorkingHours}
                  onChangeText={(value) => this.setState({actualWorkingHours: value})}
                  placeholder={t('timecard.actualWorkingHours')}
                  keyboardType="numeric"
                  style={[complexTheme, styles?.rootInput(this.context), styles?.withBorder(this.context), {flex: 1}]}
                />
              </View>
            </View>

            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <StyledText>{t('timecard.actualWorkingMinutes')}</StyledText>
              </View>
              <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                <TextInput
                  name="actualWorkingMinutes"
                  value={this.state.actualWorkingMinutes}
                  onChangeText={(value) => this.setState({actualWorkingMinutes: value})}
                  placeholder={t('timecard.actualWorkingMinutes')}
                  keyboardType="numeric"
                  style={[complexTheme, styles?.rootInput(this.context), styles?.withBorder(this.context), {flex: 1}]}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>

        <View style={[styles.bottom, styles.horizontalMargin]}>
          <TouchableOpacity
            onPress={() => this.handleUpdateWorkingTime()}
          >
            <Text
              style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
              {t('timecard.updateWorkingTime')}
            </Text>
          </TouchableOpacity>
        </View>
      </ThemeScrollView>
    )
  }
}

const mapStateToProps = state => ({
  timeCardDetails: state.timecard.data,
  workingTime: {
    hours: state.timecard.data.actualWorkingHours,
    minutes: state.timecard.data.actualWorkingMinutes,

  },
  haveData: state.timecard.haveData,
  haveError: state.timecard.haveError,
  isLoading: state.timecard.loading
})
const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getTimeCard: (timeCardId) => dispatch(getTimeCard(timeCardId)),
  timeCardId: props?.timeCardId
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withContext
)

export default enhance(UserTimeCardDetails)

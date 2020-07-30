import React from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import {connect} from 'react-redux'
import {formatDateOnly, formatTime, getTimeCard} from '../actions'
import styles from '../styles'
import {LocaleContext} from "../locales/LocaleContext";
import LoadingScreen from "./LoadingScreen";
import {compose} from "redux";
import {withContext} from "../helpers/contextHelper";
import {ThemeContainer} from "../components/ThemeContainer";
import {StyledText} from "../components/StyledText";

class UserTimeCardDetail extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  componentDidMount() {
    this.props.getTimeCard(this.props.navigation.state.params.timecardId)

    this.context.localize({
      en: {
        clkIn: 'Clock In',
        clkOut: 'Clock Out',
        totalhrs: 'Total Hours',
      },
      zh: {
        clkIn: '上班時間',
        clkOut: '下班時間',
        totalhrs: '總時數',
      }
    })
  }

  render() {
    const {order, timecardDetail, isLoading, haveData, themeStyle} = this.props
    const {t} = this.context

    if (isLoading) {
      return (
        <LoadingScreen/>
      )
    } else if (haveData) {
      return (
        <ThemeContainer>
          <View style={[styles.container]}>
            <View style={[styles.boxShadow, styles.popUpLayout, themeStyle]}>
              <Text style={styles.screenTitle}>
                {formatDateOnly(timecardDetail.clockIn)}
              </Text>

              <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
                <View style={{flex: 4}}>
                  <Text style={styles.orange_color}>{t('clkIn')}</Text>
                </View>
                <View style={{flex: 6}}>
                  <StyledText style={{textAlign: 'right'}}>
                    {formatTime(timecardDetail.clockIn)}
                  </StyledText>
                </View>
              </View>

              {timecardDetail.timeCardStatus === 'COMPLETE' && (
                <View>
                  <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
                    <View style={{flex: 4}}>
                      <Text style={styles.orange_color}>{t('clkOut')}</Text>
                    </View>
                    <View style={{flex: 6}}>
                      <StyledText style={{textAlign: 'right'}}>
                        {formatTime(timecardDetail.clockOut)}
                      </StyledText>
                    </View>
                  </View>

                  <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
                    <View style={{flex: 4}}>
                      <Text style={styles.orange_color}>{t('totalhrs')}</Text>
                    </View>
                    <View style={{flex: 6}}>
                      <StyledText style={{textAlign: 'right'}}>
                        {timecardDetail.hours}&nbsp;{t('timecard.hours')}&nbsp;{timecardDetail.minutes}&nbsp;{t('timecard.minutes')}
                      </StyledText>
                    </View>
                  </View>
                </View>
              )}

              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('UserTimeCards')}
              >
                <Text
                  style={[
                    styles.bottomActionButton,
                    styles.actionButton,
                    styles.mgrtotop20,
                    {alignSelf: 'center', justifyContent: 'center', width: 120}
                  ]}
                >
                  {t('action.ok')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ThemeContainer>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = state => ({
  timecardDetail: state.timecard.data,
  haveData: state.timecard.haveData,
  haveError: state.timecard.haveError,
  isLoading: state.timecard.loading
})
const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getTimeCard: () => dispatch(getTimeCard(props.navigation.state.params.timecardId))
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withContext
)
export default enhance(UserTimeCardDetail)

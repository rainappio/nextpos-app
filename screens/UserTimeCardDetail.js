import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlight,
  TextInput,
  FlatList,
  ActivityIndicator,
  Modal
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import images from '../assets/images'
import {getTimeCard, formatDate, formatDateObj, formatTime, formatDateOnly} from '../actions'
import styles from '../styles'
import {LocaleContext} from "../locales/LocaleContext";

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
    const { order, timecardDetail, isLoading, haveData } = this.props
    const { t } = this.context

    if (isLoading) {
      return (
        <View style={[styles.container]}>
          <ActivityIndicator size="large" color="#ccc" />
        </View>
      )
    } else if (haveData) {
      return (
        <View style={[styles.container, { marginLeft: 8, marginRight: 8 }]}>
          <View style={[styles.whiteBg, styles.boxShadow, styles.popUpLayout]}>
           <Text style={styles.screenTitle}>
              {formatDateOnly(timecardDetail.clockIn)}
            </Text>

             <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
              <View style={{flex: 4}}>
                <Text style={styles.orange_color}>{t('clkIn')}</Text>
              </View>
              <View style={{flex: 6}}>
                <Text style={{ textAlign: 'right' }}>
                  {formatTime(timecardDetail.clockIn)}
                </Text>
              </View>
            </View>

            {timecardDetail.timeCardStatus === 'COMPLETE' && (
              <View>
                <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
                  <View style={{flex: 4}}>
                    <Text style={styles.orange_color}>{t('clkOut')}</Text>
                  </View>
                  <View style={{flex: 6}}>
                    <Text style={{textAlign: 'right'}}>
                      {formatTime(timecardDetail.clockOut)}
                    </Text>
                  </View>
                </View>

                <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
                  <View style={{flex: 4}}>
                    <Text style={styles.orange_color}>{t('totalhrs')}</Text>
                  </View>
                  <View style={{flex: 6}}>
                    <Text style={{textAlign: 'right'}}>
                      {timecardDetail.hours}&nbsp;{t('timecard.hours')}&nbsp;{timecardDetail.minutes}&nbsp;{t('timecard.minutes')}
                    </Text>
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
                  styles.cancelButton,
                  styles.mgrtotop20,
                  { alignSelf: 'center', justifyContent: 'center', width: 120 }
                ]}
              >
                {t('action.ok')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserTimeCardDetail)

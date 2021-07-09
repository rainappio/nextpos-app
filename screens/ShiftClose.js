import React from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import {connect} from 'react-redux'
import {formatDate, getMostRecentShiftStatus, getShiftStatus} from '../actions'
import {api, dispatchFetchRequestWithOption} from '../constants/Backend'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import {handleOpenShift, renderShiftStatus} from "../helpers/shiftActions";
import ScreenHeader from "../components/ScreenHeader";
import LoadingScreen from "./LoadingScreen";
import {StyledText} from "../components/StyledText";
import {ThemeContainer} from "../components/ThemeContainer";
import {OpenShiftScreen} from "./OpenShiftScreen";

class ShiftClose extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      balance: 0,
      isOpenShift: false
    }
  }

  componentDidMount() {
    this.props.getShiftStatus()
    this.props.getMostRecentShiftStatus()
    this._getShift = this.props.navigation.addListener('focus', () => {
      this.props.getShiftStatus()
      this.props.getMostRecentShiftStatus()
    })
  }
  componentWillUnmount() {
    this._getShift()
  }

  handleOpenShift = (balance) => {
    handleOpenShift(balance, (response) => {
      this.props.dispatch(getShiftStatus())
      this.props.getMostRecentShiftStatus()
    })
  }

  handleinitiateCloseShift = () => {
    dispatchFetchRequestWithOption(api.shift.initiate, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: ''
    }, {
      defaultMessage: false
    }, response => {
      this.props.getShiftStatus()
      this.props.getMostRecentShiftStatus()
      this.props.navigation.navigate('AccountClose')
    }).then()
  }

  render() {
    const {loading, shift, haveData, mostRecentShift} = this.props
    const {t, customMainThemeColor} = this.context

    if (loading) {
      return (
        <LoadingScreen />
      )
    } else if (this.state?.isOpenShift) {
      return (
        <OpenShiftScreen handleOpenShift={() => {
          this.props.getShiftStatus()
          this.props.getMostRecentShiftStatus()
          this.setState({isOpenShift: false})
        }}
          handleCancel={() => this.setState({isOpenShift: false})} />
      )
    }

    else {
      return (
        <ThemeContainer>
          <View style={[styles.fullWidthScreen]}>
            <ScreenHeader parentFullScreen={true}
              title={t('shift.shiftTitle')} />

            <View style={{flex: 3, justifyContent: 'center'}}>
              <View style={styles.tableRowContainerWithBorder}>
                <View style={[styles.tableCellView, {flex: 1}]}>
                  <StyledText style={[styles.fieldTitle]}>
                    {t('shift.shiftStatus')}
                  </StyledText>
                </View>
                <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                  <StyledText>{renderShiftStatus(mostRecentShift.shiftStatus)}</StyledText>
                </View>
              </View>

              {mostRecentShift.close !== undefined && mostRecentShift.shiftStatus !== 'ACTIVE' && (
                <View>
                  <View style={styles.tableRowContainerWithBorder}>
                    <View style={[styles.tableCellView, {flex: 1}]}>
                      <StyledText style={[styles.fieldTitle]}>
                        {t('shift.closedAt')}
                      </StyledText>
                    </View>
                    <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                      <StyledText>{formatDate(mostRecentShift.close.timestamp)}</StyledText>
                    </View>
                  </View>
                  <View style={styles.tableRowContainerWithBorder}>
                    <View style={[styles.tableCellView, {flex: 1}]}>
                      <StyledText style={[styles.fieldTitle]}>
                        {t('shift.closedBy')}
                      </StyledText>
                    </View>
                    <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                      <StyledText>{mostRecentShift.close.who}</StyledText>
                    </View>
                  </View>
                </View>
              )}

              {shift.shiftStatus === 'ACTIVE' && (
                <View>
                  <View style={styles.tableRowContainerWithBorder}>
                    <View style={[styles.tableCellView, {flex: 1}]}>
                      <StyledText style={[styles.fieldTitle]}>
                        {t('shift.openAt')}
                      </StyledText>
                    </View>
                    <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                      <StyledText>{formatDate(shift.open.timestamp)}</StyledText>
                    </View>
                  </View>
                  <View style={styles.tableRowContainerWithBorder}>
                    <View style={[styles.tableCellView, {flex: 1}]}>
                      <StyledText style={[styles.fieldTitle]}>
                        {t('shift.openBalance')}
                      </StyledText>
                    </View>
                    <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                      <StyledText>{shift.open.balance}</StyledText>
                    </View>
                  </View>
                  <View style={styles.tableRowContainerWithBorder}>
                    <View style={[styles.tableCellView, {flex: 1}]}>
                      <StyledText style={[styles.fieldTitle]}>
                        {t('shift.openBy')}
                      </StyledText>
                    </View>
                    <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                      <StyledText>{shift.open.who}</StyledText>
                    </View>
                  </View>
                </View>
              )}
            </View>

            <View style={[styles.bottom, styles.horizontalMargin]}>
              {
                ['ACTIVE', 'CLOSING', 'CONFIRM_CLOSE'].includes(mostRecentShift.shiftStatus) ? (
                  <TouchableOpacity
                    onPress={this.handleinitiateCloseShift}
                  >
                    <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                      {t('shift.closeShift')}
                    </Text>
                  </TouchableOpacity>
                ) : (
                    <View>

                      <TouchableOpacity
                        onPress={() => this.setState({isOpenShift: true})}
                      >
                        <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                          {t('shift.openShiftAction')}
                        </Text>
                      </TouchableOpacity>

                    </View>
                  )
              }
            </View>
          </View>
        </ThemeContainer>
      )
    }
  }
}

const mapStateToProps = state => ({
  shift: state.shift.data,
  mostRecentShift: state.mostRecentShift.data,
  loading: state.mostRecentShift.loading,
  haveData: state.mostRecentShift.haveData
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getShiftStatus: () => dispatch(getShiftStatus()),
  getMostRecentShiftStatus: () => dispatch(getMostRecentShiftStatus())
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShiftClose)

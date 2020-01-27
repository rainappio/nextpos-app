import React from 'react'
import {ActivityIndicator, Text, TextInput, View, TouchableOpacity} from 'react-native'
import {connect} from 'react-redux'
import BackBtnCustom from '../components/BackBtnCustom'
import { formatDate, getShiftStatus } from '../actions'
import {
  api,
  dispatchFetchRequest,
  successMessage
} from '../constants/Backend'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import ConfirmActionButton from '../components/ConfirmActionButton'
import { DismissKeyboard } from '../components/DismissKeyboard'

class ShiftClose extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        shiftTitle: 'Manage Shift',
        shiftStatus: 'Current Shift Status',
        lastShiftStatus: 'Last Shift Status',
        openAt: 'Open at',
        openBalance: 'Open Balance',
        openBy: 'Open by',
        closedAt: 'Closed at',
        closedBalance: 'Close Balance',
        difference: 'Cash Difference',
        closedBy: 'Closed by',
        cash: 'Open/Close Cash',
        openShiftAction: 'Open Shift',
        closeShiftAction: 'Close Shift'
      },
      zh: {
        shiftTitle: '開關帳',
        shiftStatus: '目前帳狀態',
        lastShiftStatus: '上次帳狀態',
        openAt: '開帳時間',
        openBalance: '開帳現金',
        openBy: '開帳員工',
        closedAt: '關帳時間',
        closedBalance: '關帳現金',
        difference: '現金差額',
        closedBy: '關帳員工',
        cash: '開關帳現金',
        openShiftAction: '開帳',
        closeShiftAction: '關帳'
      }
    })

    this.state = {
      balance: 0,
      mostRecentShift: null
    }
  }

  componentDidMount() {
    this.props.getShiftStatus()
    this.getMostRecentShift()
  }

  getMostRecentShift = () => {

    dispatchFetchRequest(api.shift.mostRecent, {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          this.setState({mostRecentShift: data})
        })
      }).then()
  }

  handleOpenShift = () => {
    dispatchFetchRequest(
      api.shift.open,
      {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          balance: this.state.balance
        })
      },
      respponse => {
        successMessage('Shift opened')
        this.props.dispatch(getShiftStatus())
      }
    ).then()
  }

  handleCloseShift = () => {
    dispatchFetchRequest(
      api.shift.close,
      {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          balance: this.state.balance
        })
      },
      respponse => {
        successMessage('Shift closed')
        this.props.dispatch(getShiftStatus())
        this.getMostRecentShift()
      }).then()
  }

  render() {
    const {haveData, haveError, isLoading, shift} = this.props
    const { t } = this.context
    const { mostRecentShift } = this.state

    if (mostRecentShift == null) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#ccc"/>
        </View>
      )
    } else {
      return (
  
          <View style={styles.container}>
            <View>
              <BackBtnCustom
                onPress={() => this.props.navigation.navigate('LoginSuccess')}
              />
              <Text style={[
            		styles.welcomeText,
            		styles.orange_color,
            		styles.textBold,
            		styles.nomgrBottom
          		]}>
                {t('shiftTitle')}
              </Text>
            </View>

            <View style={{flex: 3, justifyContent: 'center'}}>
              <View style={styles.fieldContainer}>
                <View style={{width: '60%'}}>
                  <Text style={[styles.fieldTitle, styles.defaultfontSize]}>
                    {t('shiftStatus')}
                  </Text>
                </View>
                <View style={{width: '40%'}}>
                  <Text style={[{alignSelf: 'flex-end'}, styles.defaultfontSize]}>{shift.shiftStatus}</Text>
                </View>
              </View>

              {shift.shiftStatus === 'INACTIVE' && mostRecentShift !== undefined && (
                <View>
                  <View style={styles.fieldContainer}>
                    <View style={{flex: 1}}>
                      <Text style={[styles.fieldTitle, styles.defaultfontSize]}>
                        {t('lastShiftStatus')}
                      </Text>
                    </View>
                    <View style={{flex: 3}}>
                      <Text style={{alignSelf: 'flex-end'}}>{mostRecentShift.shiftStatus}</Text>
                    </View>
                  </View>

                  <View style={styles.fieldContainer}>
                    <View style={{flex: 1}}>
                      <Text style={[styles.fieldTitle, styles.defaultfontSize]}>
                        {t('closedAt')}
                      </Text>
                    </View>
                    <View style={{flex: 3}}>
                      <Text style={{alignSelf: 'flex-end'}}>{formatDate(mostRecentShift.close.timestamp)}</Text>
                    </View>
                  </View>
                  <View style={styles.fieldContainer}>
                    <View style={{flex: 1}}>
                      <Text style={[styles.fieldTitle, styles.defaultfontSize]}>
                        {t('closedBalance')}
                      </Text>
                    </View>
                    <View style={{flex: 3}}>
                      <Text style={{alignSelf: 'flex-end'}}>{mostRecentShift.close.balance}</Text>
                    </View>
                  </View>
                  <View style={styles.fieldContainer}>
                    <View style={{flex: 1}}>
                      <Text style={[styles.fieldTitle, styles.defaultfontSize]}>
                        {t('difference')}
                      </Text>
                    </View>
                    <View style={{flex: 3}}>
                      <Text style={{alignSelf: 'flex-end'}}>{mostRecentShift.difference}</Text>
                    </View>
                  </View>
                  <View style={styles.fieldContainer}>
                    <View style={{flex: 1}}>
                      <Text style={[styles.fieldTitle, styles.defaultfontSize]}>
                        {t('closedBy')}
                      </Text>
                    </View>
                    <View style={{flex: 3}}>
                      <Text style={[{alignSelf: 'flex-end'}, styles.defaultfontSize]}>{mostRecentShift.close.who}</Text>
                    </View>
                  </View>
                </View>
              )}

              {shift.shiftStatus === 'ACTIVE' && (
                <View>
                  <View style={styles.fieldContainer}>
                    <View style={{flex: 1}}>
                      <Text style={[styles.fieldTitle, styles.defaultfontSize]}>
                        {t('openAt')}
                      </Text>
                    </View>
                    <View style={{flex: 3}}>
                      <Text style={[{alignSelf: 'flex-end'}, styles.defaultfontSize]}>{formatDate(shift.open.timestamp)}</Text>
                    </View>
                  </View>
                  <View style={styles.fieldContainer}>
                    <View style={{flex: 1}}>
                      <Text style={[styles.fieldTitle, styles.defaultfontSize]}>
                        {t('openBalance')}
                      </Text>
                    </View>
                    <View style={{flex: 3}}>
                      <Text style={[{alignSelf: 'flex-end'}, styles.defaultfontSize]}>{shift.open.balance}</Text>
                    </View>
                  </View>
                  <View style={styles.fieldContainer}>
                    <View style={{flex: 1}}>
                      <Text style={[styles.fieldTitle, styles.defaultfontSize]}>
                        {t('openBy')}
                      </Text>
                    </View>
                    <View style={{flex: 3}}>
                      <Text style={[{alignSelf: 'flex-end'}, styles.defaultfontSize]}>{shift.open.who}</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>


            <View style={[styles.bottom]}>
              <View style={[styles.fieldContainer]}>
                <Text style={[styles.fieldTitle, {flex: 2}, styles.defaultfontSize]}>
                  {t('cash')}
                </Text>
                <TextInput
                  name="balance"
                  value={String(this.state.balance)}
                  type='text'
                  onChangeText={(value) => this.setState({balance: value})}
                  placeholder={t('cash')}
                  keyboardType={`numeric`}
                  style={[{flex: 3, height: 44, borderBottomColor: '#f1f1f1', borderBottomWidth: 1}]}
                />
              </View>              
            </View>
						
						 
            	{
                shift.shiftStatus === 'ACTIVE' ?
                  (
                    <ConfirmActionButton
                      handleConfirmAction={this.handleCloseShift}
                      buttonTitle="closeShiftAction"
                    />
                  ) :
                  (
                    <ConfirmActionButton
                      handleConfirmAction={this.handleOpenShift}
                      buttonTitle="openShiftAction"
                    />
                  )
              }             
            
          </View>
      )
    }
  }
}

const mapStateToProps = state => ({
  shift: state.shift.data,
  haveData: state.shift.haveData
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getShiftStatus: () => dispatch(getShiftStatus())
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShiftClose)

import React from 'react'
import {
  ActivityIndicator,
  InputAccessoryView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import {connect} from 'react-redux'
import BackBtnCustom from '../components/BackBtnCustom'
import { formatDate, getShiftStatus, getMostRecentShiftStatus } from '../actions'
import {
  api,
  dispatchFetchRequest,
  successMessage, warningMessage
} from '../constants/Backend'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import ConfirmActionButton from '../components/ConfirmActionButton'
import { DismissKeyboard } from '../components/DismissKeyboard'
import {handleCloseShift, handleOpenShift, checkBalanceInput} from "../helpers/shiftActions";
import BackBtn from "../components/BackBtn";
import AccountCloseConfirm from './AccountCloseConfirm'

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
        closeShiftAction: 'Close Shift Init'
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
      balance: 0
    }
  }

  componentDidMount() {
    this.props.getShiftStatus()
    this.props.getMostRecentShiftStatus()
  }

  handleOpenShift = (balance) => {
    handleOpenShift(balance, (response) => {
      successMessage('Shift opened')
      this.props.dispatch(getShiftStatus())
      this.props.getMostRecentShiftStatus()
    })
  }

  handleinitiateCloseShift = () => {
  	dispatchFetchRequest(
    	api.shift.initiate,
    	{
      	method: 'POST',
      	withCredentials: true,
      	credentials: 'include',
      	headers: {
        	'Content-Type': 'application/json'
      	},
      	body: ''
    	},
    	response => {   	
      	this.props.getShiftStatus()
      	this.props.getMostRecentShiftStatus()
      	this.props.navigation.navigate('AccountClose')
    	}).then()
	}

  render() {
    const {loading, shift, haveData, mostRecentShift} = this.props
    const { t } = this.context

    if (loading) {
      return (
        <View style={[styles.container]}>
          <ActivityIndicator size="large" color="#ccc"/>
        </View>
      )
    } else {
      return (
        <DismissKeyboard>
  				<View style={styles.container}>
            <View>
              <BackBtn/>
              <Text style={styles.screenTitle}>
                {t('shiftTitle')}
              </Text>
            </View>

            <View style={{flex: 3, justifyContent: 'center'}}>
              <View style={styles.fieldContainer}>
                <View style={{flex: 1}}>
                  <Text style={[styles.fieldTitle]}>
                    {t('shiftStatus')}
                  </Text>
                </View>
                <View style={{flex: 3}}>
                  <Text style={{alignSelf: 'flex-end'}}>{shift.shiftStatus}</Text>
                </View>
              </View>

              {shift.shiftStatus === 'INACTIVE' && mostRecentShift != null && mostRecentShift.close !== undefined && mostRecentShift.shiftStatus !== 'ACTIVE' && (
                <View>
                  <View style={styles.fieldContainer}>
                    <View style={{flex: 1}}>
                      <Text style={[styles.fieldTitle]}>
                        {t('lastShiftStatus')}
                      </Text>
                    </View>
                    <View style={{flex: 3}}>
                      <Text style={{alignSelf: 'flex-end'}}>{mostRecentShift.shiftStatus}</Text>
                    </View>
                  </View>

                  <View style={styles.fieldContainer}>
                    <View style={{flex: 1}}>
                      <Text style={[styles.fieldTitle]}>
                        {t('closedAt')}
                      </Text>
                    </View>
                    <View style={{flex: 3}}>
                      <Text style={{alignSelf: 'flex-end'}}>{mostRecentShift.close.timestamp !== null && formatDate(mostRecentShift.close.timestamp)}</Text>
                    </View>
                  </View>
                  <View style={styles.fieldContainer}>
                    <View style={{flex: 1}}>
                      <Text style={[styles.fieldTitle]}>
                        {t('closedBalance')}
                      </Text>
                    </View>
                    <View style={{flex: 3}}>
                      <Text style={{alignSelf: 'flex-end'}}>{mostRecentShift.close.balance}</Text>
                    </View>
                  </View>
                  <View style={styles.fieldContainer}>
                    <View style={{flex: 1}}>
                      <Text style={[styles.fieldTitle]}>
                        {t('difference')}
                      </Text>
                    </View>
                    <View style={{flex: 3}}>
                      <Text style={{alignSelf: 'flex-end'}}>{mostRecentShift.difference}</Text>
                    </View>
                  </View>
                  <View style={styles.fieldContainer}>
                    <View style={{flex: 1}}>
                      <Text style={[styles.fieldTitle]}>
                        {t('closedBy')}
                      </Text>
                    </View>
                    <View style={{flex: 3}}>
                      <Text style={{alignSelf: 'flex-end'}}>{mostRecentShift.close.who}</Text>
                    </View>
                  </View>
                </View>
              )}

              {shift.shiftStatus === 'ACTIVE' && (
                <View>
                  <View style={styles.fieldContainer}>
                    <View style={{flex: 1}}>
                      <Text style={[styles.fieldTitle]}>
                        {t('openAt')}
                      </Text>
                    </View>
                    <View style={{flex: 3}}>
                      <Text style={{alignSelf: 'flex-end'}}>{shift.open.timestamp !== null && formatDate(shift.open.timestamp)}</Text>
                    </View>
                  </View>
                  <View style={styles.fieldContainer}>
                    <View style={{flex: 1}}>
                      <Text style={[styles.fieldTitle]}>
                        {t('openBalance')}
                      </Text>
                    </View>
                    <View style={{flex: 3}}>
                      <Text style={{alignSelf: 'flex-end'}}>{shift.open.balance}</Text>
                    </View>
                  </View>
                  <View style={styles.fieldContainer}>
                    <View style={{flex: 1}}>
                      <Text style={[styles.fieldTitle]}>
                        {t('openBy')}
                      </Text>
                    </View>
                    <View style={{flex: 3}}>
                      <Text style={{alignSelf: 'flex-end'}}>{shift.open.who}</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>

            <KeyboardAvoidingView style={styles.bottom} behavior="padding" enabled>              
              {
                ['ACTIVE', 'CLOSING', 'CONFIRM_CLOSE'].includes(mostRecentShift.shiftStatus) 
                ?
                  (
     								<TouchableOpacity
       								onPress={this.handleinitiateCloseShift}
     									>
     									<Text style={[styles.bottomActionButton, styles.actionButton]}>
        								{t('closeShiftAction')}
      								</Text>
    								</TouchableOpacity>
    							) 
                  :
                  	(
                  		<View>
                  			<View style={[styles.fieldContainer]}>
                					<Text style={[styles.fieldTitle, {flex: 2}]}>
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
                  					inputAccessoryViewID="shiftBalance"
                					/>
                					{Platform.OS === 'ios' && (
                  					<InputAccessoryView nativeID="shiftBalance">
                    					<TouchableOpacity
                      					onPress={() => Keyboard.dismiss()}
                      					style={[{ flex: 1, flexDirection: 'row-reverse' }, styles.grayBg]}
                    						>
                      					<Text
                        					style={[
                          					styles.margin_15,
                          					{ fontSize: 16, fontWeight: 'bold', color: '#F39F86' }
                        					]}
                      						>
                        					Done
                      					</Text>
                    					</TouchableOpacity>
                  					</InputAccessoryView>
                					)}
              					</View>
                				<ConfirmActionButton
                  				handleConfirmAction={this.handleOpenShift}
                  				params={this.state.balance}
                  				buttonTitle="openShiftAction"
                				/>
              				</View>
            				)
              }
            </KeyboardAvoidingView>
          </View>      
        </DismissKeyboard>
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

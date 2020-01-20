import React from 'react'
import { Text, TextInput, View } from 'react-native'
import { connect } from 'react-redux'
import BackBtnCustom from '../components/BackBtnCustom'
import { formatDate, getShiftStatus } from '../actions'
import {
  api,
  dispatchFetchRequest,
  errorAlert,
  makeFetchRequest,
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
        shiftStatus: 'Shift Status',
        openAt: 'Open at',
        openBalance: 'Open Balance',
        openBy: 'Open by',
        cash: 'Open/Close Cash',
        openShiftAction: 'Open Shift',
        closeShiftAction: 'Close Shift'
      },
      zh: {
        shiftTitle: '開關帳',
        shiftStatus: '帳狀態',
        openAt: '開帳時間',
        openBalance: '開帳現金',
        openBy: '開帳員工',
        cash: '開關帳現金',
        openShiftAction: '開帳',
        closeShiftAction: '關帳'
      }
    })

    this.state = {
      t: context.t,
      balance: 0
    }
  }

  componentDidMount() {
    this.props.getShiftStatus()
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
      }
    ).then()
  }

  render() {
    const { haveData, haveError, isLoading, shift } = this.props
    const { t } = this.state

    return (
      <DismissKeyboard>
        <View style={styles.container}>
          <View>
            <BackBtnCustom
              onPress={() => this.props.navigation.navigate('LoginSuccess')}
            />
            <Text style={styles.screenTitle}>{t('shiftTitle')}</Text>
          </View>

          <View style={{ flex: 3, justifyContent: 'center' }}>
            <View style={styles.fieldContainer}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldTitle]}>{t('shiftStatus')}</Text>
              </View>
              <View style={{ flex: 3 }}>
                <Text style={{ alignSelf: 'flex-end' }}>
                  {shift.shiftStatus}
                </Text>
              </View>
            </View>

            {shift.shiftStatus === 'ACTIVE' && (
              <View>
                <View style={styles.fieldContainer}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.fieldTitle]}>{t('openAt')}</Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <Text style={{ alignSelf: 'flex-end' }}>
                      {formatDate(shift.open.timestamp)}
                    </Text>
                  </View>
                </View>
                <View style={styles.fieldContainer}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.fieldTitle]}>{t('openBalance')}</Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <Text style={{ alignSelf: 'flex-end' }}>
                      {shift.open.balance}
                    </Text>
                  </View>
                </View>
                <View style={styles.fieldContainer}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.fieldTitle]}>{t('openBy')}</Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <Text style={{ alignSelf: 'flex-end' }}>
                      {shift.open.who}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          <View style={[styles.bottom]}>
            <View style={[styles.fieldContainer]}>
              <Text style={[styles.fieldTitle, { flex: 2 }]}>{t('cash')}</Text>
              <TextInput
                name="balance"
                value={String(this.state.balance)}
                type="text"
                onChangeText={value => this.setState({ balance: value })}
                placeholder={t('cash')}
                keyboardType={`numeric`}
                style={[
                  {
                    flex: 3,
                    height: 44,
                    borderBottomColor: '#f1f1f1',
                    borderBottomWidth: 1
                  }
                ]}
              />
            </View>

            {shift.shiftStatus === 'ACTIVE' ? (
              <ConfirmActionButton
                handleConfirmAction={this.handleCloseShift}
                buttonTitle="closeShiftAction"
              />
            ) : (
              <ConfirmActionButton
                handleConfirmAction={this.handleOpenShift}
                buttonTitle="openShiftAction"
              />
            )}
          </View>
        </View>
      </DismissKeyboard>
    )
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

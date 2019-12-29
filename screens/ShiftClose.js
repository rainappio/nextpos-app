import React from 'react'
import {Text, View} from 'react-native'
import {connect} from 'react-redux'
import BackBtnCustom from '../components/BackBtnCustom'
import {getShiftStatus} from '../actions'
import {api, errorAlert, makeFetchRequest, successMessage} from '../constants/Backend'
import styles from '../styles'
import {LocaleContext} from "../locales/LocaleContext";
import ConfirmActionButton from "../components/ConfirmActionButton";

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
        openBy: 'Open by',
        closeShift: 'Close Shift'
      },
      zh: {
        shiftTitle: '開關帳',
        shiftStatus: '帳狀態',
        openAt: '開帳時間',
        openBy: '開帳員工',
        closeShift: '關帳'
      }
    })

    this.state = {
      t: context.t
    }
  }

  componentDidMount() {
    this.props.getShiftStatus()
  }


  handleCloseShift = () => {
    makeFetchRequest(token => {
      fetch(api.shift.close, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer' + token.access_token
        },
        body: JSON.stringify({
          balance: '1000'
        })
      }).then(response => {
        if (response.status === 200) {
          successMessage('Shift closed successfully')
          this.props.dispatch(getShiftStatus())
          this.props.navigation.navigate('LoginSuccess')
        } else {
          errorAlert(response)
        }
      })
    })
  }

  render() {
    const {
      haveData,
      haveError,
      isLoading,
      shift,
    } = this.props
    const {t} = this.state

    return (
      <View style={styles.container}>
        <View>
          <BackBtnCustom
            onPress={() => this.props.navigation.navigate('LoginSuccess')}
          />
          <Text
            style={[
              styles.welcomeText,
              styles.orange_color,
              styles.textMedium,
              styles.textBold,
              styles.nomgrBottom
            ]}
          >
            {t('shiftTitle')}
          </Text>
        </View>

        <View style={{flex: 3, justifyContent: 'center'}}>
          <Text style={[styles.fieldTitle]}>
            {t('shiftStatus')}: {shift.shiftStatus}
          </Text>

          {shift.shiftStatus === 'ACTIVE' &&
          <View>
            <Text style={[styles.fieldTitle]}>{t('openAt')}: {shift.open.timestamp}</Text>
            <Text style={[styles.fieldTitle]}>{t('openBy')}: {shift.open.who}</Text>
          </View>
          }
        </View>

        <View style={[styles.bottom]}>
          <ConfirmActionButton
            handleConfirmAction={this.handleCloseShift}
            buttonTitle='closeShift'
          />
        </View>
      </View>
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

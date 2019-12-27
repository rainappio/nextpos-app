import React from 'react'
import {ScrollView, Text, TouchableOpacity, View} from 'react-native'
import {connect} from 'react-redux'
import {DismissKeyboard} from '../components/DismissKeyboard'
import BackBtnCustom from '../components/BackBtnCustom'
import {getShiftStatus} from '../actions'
import {api, errorAlert, makeFetchRequest, successMessage} from '../constants/Backend'
import styles from '../styles'

let tblsArr = []

class ShiftClose extends React.Component {
  static navigationOptions = {
    header: null
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
      navigation,
      haveData,
      haveError,
      isLoading,
      shiftStatus,
      ordersInflight
    } = this.props

    return (
      <ScrollView>
        <DismissKeyboard>
          <View style={styles.container}>
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
              Manage Shift
            </Text>

            <View style={[styles.bottom]}>
              <TouchableOpacity onPress={() => this.handleCloseShift()}>
                <Text style={[styles.bottomActionButton, styles.actionButton]}>
                  Close Shift
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </DismissKeyboard>
      </ScrollView>
    )
  }
}

const mapStateToProps = state => ({
  checkS: state
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShiftClose)

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
  ActivityIndicator,
  TouchableWithoutFeedback,
  AsyncStorage,
  RefreshControl,
  FlatList
} from 'react-native'
import { connect } from 'react-redux'
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtnCustom from '../components/BackBtnCustom'
import AddBtn from '../components/AddBtn'
import Icon from 'react-native-vector-icons/Ionicons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { getShiftStatus } from '../actions'
import { api, makeFetchRequest, successMessage } from '../constants/Backend'
import styles from '../styles'

let tblsArr = []

class ShiftClose extends React.Component {
  static navigationOptions = {
    header: null
  }

  handleCloseShift = () => {
    makeFetchRequest(tokenObj => {
      const formData = new FormData()
      formData.append('grant_type', 'password')
      formData.append('username', tokenObj.cli_userName)
      formData.append('password', tokenObj.cli_masterPwd)

      var auth =
        'Basic ' + btoa(tokenObj.cli_userName + ':' + tokenObj.cli_masterPwd)

      fetch(api.getAuthToken, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          Authorization: auth
        },
        body: formData
      })
        .then(response => response.json())
        .then(res => {
          AsyncStorage.setItem('orderToken', JSON.stringify(res))
          fetch(api.shift.close, {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer' + res.access_token
            },
            body: JSON.stringify({
              balance: '1000'
            })
          }).then(response => {
            if (response.status === 200) {
              this.props.dispatch(getShiftStatus())
              successMessage('successfully closed')
            } else {
              errorAlert(response)
            }
          })
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
              Close Shift
            </Text>
            <Text
              style={{
                backgroundColor: 'darkblue',
                padding: 8,
                color: '#fff',
                borderRadius: 8,
                margin: 8
              }}
              onPress={() => this.handleCloseShift()}
            >
              CloseShft
            </Text>
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

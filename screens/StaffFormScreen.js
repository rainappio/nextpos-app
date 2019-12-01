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
  RefreshControl,
  AsyncStorage,
  Keyboard
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux'
import { isRequired } from '../validators'
import InputText from '../components/InputText'
import PinCodeInput from '../components/PinCodeInput'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import DropDown from '../components/DropDown'
import MultiDropDown from '../components/MultiDropDown'
import { getClientUsrs } from '../actions'
import EditPasswordPopUp from '../components/EditPasswordPopUp'
import RNSwitch from '../components/RNSwitch'
import styles from '../styles'
import DeleteBtn from "../components/DeleteBtn";
import {errorAlert, successMessage} from "../constants/Backend";
import {Header} from "react-native-elements";

class StaffFormScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);

    this.props.screenProps.localize({
      en: {
        staffTitle: 'Staff',
        nickName: 'Nick Name',
        username: 'User Name',
        password: 'Password',
        manager: 'Manager Role'
      },
      zh: {
        staffTitle: '員工',
        nickName: '匿稱',
        username: '使用者名稱',
        password: '密碼',
        manager: '主管權限'
      }
    })
  }


  handleDelete = values => {
    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      fetch(`http://35.234.63.193/clients/me/users/${values.name}`, {
        method: 'DELETE',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + tokenObj.access_token
        }
      })
        .then(response => {
          if (response.status === 204) {
            successMessage('Deleted')
            this.props.navigation.navigate('StaffsOverview')
            this.setState({ refreshing: true })
            this.props.getClientUsrs() !== undefined &&
              this.props.getClientUsrs().then(() => {
                this.setState({
                  refreshing: false
                })
              })
          } else {
            errorAlert(response)
          }
        })
        .catch(error => {
          console.error(error)
        })
    })
  }

  render() {
    const {
      handleSubmit,
      isEditForm,
      refreshing,
      handleEditCancel,
      initialValues,
      onCancel
    } = this.props
    const { t } = this.props.screenProps

    return (
      <DismissKeyboard>
        <View style={styles.container_nocenterCnt}>
          <View>
            {isEditForm ? (
              <Text
                style={[
                  styles.welcomeText,
                  styles.orange_color,
                  styles.textMedium,
                  styles.textBold,
                  styles.mgrbtn80
                ]}
              >
                {t('staffTitle')} - {this.props.navigation.state.params.staffname}
              </Text>
            ) : (
              <Text
                style={[
                  styles.welcomeText,
                  styles.orange_color,
                  styles.textMedium,
                  styles.textBold,
                  styles.mgrbtn80
                ]}
              >
                {t('staffTitle')}
              </Text>
            )}

            {/*<View style={styles.colordelIcon}>*/}
            {/*  <Icon*/}
            {/*    name="md-trash"*/}
            {/*    size={25}*/}
            {/*    color="#f18d1a"*/}
            {/*    onPress={() =>*/}
            {/*      this.handleDelete(*/}
            {/*        this.props.navigation.state.params.staffname*/}
            {/*      )*/}
            {/*    }*/}
            {/*  />*/}
            {/*</View>*/}

            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <View style={[styles.onethirdWidth, styles.mgrtotop8]}>
                <Text>{t('nickName')}</Text>
              </View>
              <View style={[styles.onesixthWidth]}>
                <Field
                  name="nickname"
                  component={InputText}
                  placeholder="Nick Name"
                  secureTextEntry={false}
                  autoFocus={!isEditForm}
                />
              </View>
            </View>

            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <View style={[styles.onethirdWidth, styles.mgrtotop8]}>
                <Text>{t('username')}</Text>
              </View>
              <View style={[styles.onesixthWidth]}>
                <Field
                  name="username"
                  component={InputText}
                  validate={isRequired}
                  placeholder="User Name"
                  secureTextEntry={false}
                  editable={!isEditForm}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <View style={[styles.onethirdWidth, styles.mgrtotop8]}>
                <Text>{t('password')}</Text>
              </View>
              <View style={[styles.onesixthWidth, styles.mgrtotop8]}>
                <Field
                  name="password"
                  component={PinCodeInput}
                  onChange={val => Keyboard.dismiss()}
                  customHeight={40}
                  editable={!isEditForm}
                />
              </View>
            </View>

            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              {isEditForm && (
                <EditPasswordPopUp
                  navigation={this.props.navigation}
                  name={initialValues.username}
                />
              )}
            </View>

            {isEditForm ? (
              <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
                <View style={[styles.onethirdWidth, styles.mgrtotop8]}>
                  <Text>{t('manager')}</Text>
                </View>
                <View style={[styles.onesixthWidth, styles.mgrtotop8]}>
                  <Field name="roles" component={RNSwitch} />
                </View>
              </View>
            ) : (
              <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
                <View style={[styles.onethirdWidth, styles.mgrtotop20]}>
                  <Text>{t('manager')}</Text>
                </View>
                <View style={[styles.onesixthWidth, styles.mgrtotop20]}>
                  <Field name="roles" component={RNSwitch} />
                </View>
              </View>
            )}
          </View>

          <View style={[styles.bottom]}>
            <TouchableOpacity onPress={handleSubmit}>
              <Text style={[styles.bottomActionButton, styles.actionButton]}>{t('action.save')}</Text>
            </TouchableOpacity>

            {isEditForm ? (
              <View>
                <TouchableOpacity onPress={handleEditCancel}>
                  <Text style={[styles.bottomActionButton, styles.cancelButton]}>{t('action.cancel')}</Text>
                </TouchableOpacity>
                <DeleteBtn handleDeleteAction={this.handleDelete}
                           params={{name: this.props.navigation.state.params.staffname}}
                />
              </View>
            ) : (
              <View>
                <TouchableOpacity onPress={onCancel}>
                  <Text style={[styles.bottomActionButton, styles.cancelButton]}>{t('action.cancel')}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </DismissKeyboard>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
  getClientUsrs: () => dispatch(getClientUsrs())
})

StaffFormScreen = reduxForm({
  form: 'staffForm'
})(StaffFormScreen)

export default connect(
  null,
  mapDispatchToProps
)(StaffFormScreen)

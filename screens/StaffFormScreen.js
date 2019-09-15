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
  AsyncStorage
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux'
import { isRequired } from '../validators'
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import DropDown from '../components/DropDown'
import MultiDropDown from '../components/MultiDropDown'
import { getClientUsrs } from '../actions'
import styles from '../styles'

class StaffFormScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    roles: [
      {
        id: 'ADMIN',
        name: 'ADMIN'
      },
      {
        id: 'USER',
        name: 'USER'
      }
    ]
  }

  handleDelete = name => {
    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      fetch(`http://35.234.63.193/clients/me/users/${name}`, {
        method: 'DELETE',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': tokenObj.clientId,
          Authorization: 'Bearer ' + tokenObj.access_token
        }
      })
        .then(response => {
          console.log(response)
          if (response.status === 204) {
            this.props.navigation.navigate('StaffsOverview')
            this.setState({ refreshing: true })
            this.props.getClientUsrs() !== undefined &&
              this.props.getClientUsrs().then(() => {
                this.setState({
                  refreshing: false
                })
              })
          } else {
            alert('pls try again')
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
      handleEditCancel
    } = this.props

    return (
      <DismissKeyboard>
        <View style={styles.container_nocenterCnt}>
          {isEditForm ? (
            <View>
              <Text
                style={[
                  styles.welcomeText,
                  styles.orange_color,
                  styles.textMedium,
                  styles.textBold,
                  styles.mgrbtn80
                ]}
              >
                Edit Staff
              </Text>

              <View style={styles.colordelIcon}>
                <Icon
                  name="md-trash"
                  size={25}
                  color="#f18d1a"
                  onPress={() =>
                    this.handleDelete(
                      this.props.navigation.state.params.staffname
                    )
                  }
                />
              </View>
            </View>
          ) : (
            <View>
              <BackBtn />
              <Text
                style={[
                  styles.welcomeText,
                  styles.orange_color,
                  styles.textMedium,
                  styles.textBold
                ]}
              >
                Create Staff
              </Text>
            </View>
          )}

          <Field
            name="nickname"
            component={InputText}
            placeholder="Nick Name"
            secureTextEntry={false}
          />

          <Field
            name="username"
            component={InputText}
            validate={isRequired}
            placeholder="User Name"
            secureTextEntry={false}
          />

          <Field
            name="password"
            component={InputText}
            validate={isRequired}
            placeholder="Password"
            secureTextEntry={true}
            keyboardType={'numeric'}
          />

          <Field
            component={MultiDropDown}
            name="roles"
            items={this.state.roles}
            search
            selection
            fluid
            placeholder="Staff Roles"
          />

          {/*  <MultiDropDown/>*/}

          <View
            style={[
              {
                width: '100%',
                backgroundColor: '#F39F86',
                position: 'absolute',
                bottom: 48,
                borderRadius: 4
              }
            ]}
          >
            {isEditForm ? (
              <TouchableHighlight onPress={handleSubmit}>
                <Text style={styles.gsText}>Update</Text>
              </TouchableHighlight>
            ) : (
              <TouchableHighlight onPress={handleSubmit}>
                <Text style={styles.gsText}>Save</Text>
              </TouchableHighlight>
            )}
          </View>
          <View
            style={[
              {
                width: '100%',
                position: 'absolute',
                bottom: 0,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#F39F86'
              }
            ]}
          >
            {isEditForm ? (
              <TouchableHighlight onPress={handleEditCancel}>
                <Text style={styles.signInText}>Cancel</Text>
              </TouchableHighlight>
            ) : (
              <TouchableHighlight
                onPress={() => this.props.navigation.navigate('StaffsOverview')}
              >
                <Text style={styles.signInText}>Cancel</Text>
              </TouchableHighlight>
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

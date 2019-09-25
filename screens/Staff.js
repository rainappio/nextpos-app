import React from 'react'
import { connect } from 'react-redux'
import { AsyncStorage } from 'react-native'
import StaffFormScreen from './StaffFormScreen'
import { getClientUsr, getClientUsrs } from '../actions'

class Staff extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    refreshing: false
  }

  componentDidMount() {
    this.props.getClientUsr()
  }

  handleSubmit = values => {
    var staffVal = {}
    console.log(values.roleStatus) //true
    if (values.roleStatus == true) {
      staffVal['roles'] = ['MANAGER']
    } else if (values.roleStatus == false) {
      staffVal['roles'] = ['ADMIN', 'USER']
    }
    staffVal['nickname'] = values.nickname
    staffVal['username'] = values.username
    staffVal['password'] = values.password

    console.log(staffVal)
    console.log('pp')
    // return;
    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      fetch('http://35.234.63.193/clients/me/users', {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': tokenObj.clientId,
          Authorization: 'Bearer ' + tokenObj.access_token
        },
        body: JSON.stringify(staffVal)
      })
        .then(response => {
          console.log(response) //400 bad request
          if (response.status === 200) {
            this.props.navigation.navigate(
              'StaffsOverview'
              // ,{productId: values.productLabelId}
            )
            this.setState({
              refreshing: true
            })
            this.props.getClientUsrs() !== undefined &&
              this.props.getClientUsrs().then(() => {
                this.setState({
                  refreshing: false
                })
              })
          } else {
            //this.props.navigation.navigate('Login')
            alert('pls try again')
          }
        })
        .catch(error => {
          console.error(error)
        })
    })
  }

  render() {
    const { navigation, clientuser } = this.props
    const { refreshing } = this.state
    return (
      <StaffFormScreen
        onSubmit={this.handleSubmit}
        navigation={navigation}
        refreshing={refreshing}
      />
    )
  }
}

const mapStateToProps = state => ({
  clientuser: state.clientuser.data
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getClientUsr: () => dispatch(getClientUsr()),
  getClientUsrs: () => dispatch(getClientUsrs())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Staff)

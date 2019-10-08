import React from 'react'
import { connect } from 'react-redux'
import { AsyncStorage } from 'react-native'
import OptionFormScreen from './OptionFormScreen'
import { getClientUsr, getClientUsrs, getProductOptions } from '../actions'

class Option extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    refreshing: false
  }

  componentDidMount() {
    this.props.getProductOptions()
  }

  handleSubmit = values => {
    values.optionType === true
      ? (values.optionType = 'MULTIPLE_CHOICE')
      : (values.optionType = 'ONE_CHOICE')
    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      fetch('http://35.234.63.193/productoptions', {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': tokenObj.clientId,
          Authorization: 'Bearer ' + tokenObj.access_token
        },
        body: JSON.stringify(values)
      })
        .then(response => {
          if (response.status === 200) {
          	alert('success')
            this.props.navigation.navigate(
              'CategoryCustomize'
            )
            this.setState({
              refreshing: true
            })
            this.props.getProductOptions() !== undefined &&
              this.props.getProductOptions().then(() => {
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
      <OptionFormScreen
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
  getProductOptions: () => dispatch(getProductOptions())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Option)

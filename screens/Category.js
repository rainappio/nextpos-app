import React from 'react'
import { connect } from 'react-redux'
import { AsyncStorage, View, Text } from 'react-native'
import CategoryFormScreen from './CategoryFormScreen'

class Category extends React.Component {
  static navigationOptions = {
    header: null
  }

  handleSubmit = values => {
    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      fetch('http://35.234.63.193/labels', {
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
          console.log(response)
          if (response.status === 200) {
            this.props.navigation.navigate('CategoryList')
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
    const { navigation } = this.props
    return (
      <CategoryFormScreen
        onSubmit={this.handleSubmit}
        navigation={navigation}
      />
    )
  }
}

export default Category

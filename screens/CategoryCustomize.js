import React from 'react'
import { connect } from 'react-redux'
import { AsyncStorage, View, Text } from 'react-native'
import CategoryCustomizeScreen from './CategoryCustomizeScreen'
import { getProducts } from '../actions'

class CategoryCustomize extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    refreshing: false,
  }

  handleSubmit = values => {
    var prdlabelId = this.props.navigation.state.params.labelId

    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      fetch(`http://35.234.63.193/labels/${prdlabelId}`, {
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
            this.props.navigation.navigate('ProductsOverview')
            this.setState({
              refreshing: true
            })
            this.props.getProducts() !== undefined &&
              this.props.getProducts().then(() => {
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
    const { navigation } = this.props
    const { refreshing } = this.state

    return (
      <CategoryCustomizeScreen
        onSubmit={this.handleSubmit}
        navigation={navigation}
        refreshing={refreshing}
        labelName={navigation.state.params.labelName}
      />
    )
  }
}

const mapStateToProps = state => ({
  label: state.label.data
})

const mapDispatchToProps = dispatch => ({
  getProducts: () => dispatch(getProducts())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryCustomize)

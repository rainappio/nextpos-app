import React from 'react'
import { connect } from 'react-redux'
import OptionFormScreen from './OptionFormScreen'
import { api, errorAlert, makeFetchRequest } from '../constants/Backend'

class Option extends React.Component {
  static navigationOptions = {
    header: null
  }

  handleSubmit = values => {
    values.multipleChoice === true
      ? (values.optionType = 'MULTIPLE_CHOICE')
      : (values.optionType = 'ONE_CHOICE')

    makeFetchRequest(token => {
      fetch(api.productOption.new, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.access_token}`
        },
        body: JSON.stringify(values)
      })
        .then(response => {
          if (response.status === 200) {
            this.props.navigation.navigate(
              this.props.navigation.state.params.customRoute
            )
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
    const { navigation } = this.props
    return (
      <OptionFormScreen
        onSubmit={this.handleSubmit}
        navigation={navigation}
        screenProps={this.props.screenProps}
      />
    )
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Option)

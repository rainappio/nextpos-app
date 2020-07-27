import React from 'react'
import {connect} from 'react-redux'
import OptionFormScreen from './OptionFormScreen'
import {api, dispatchFetchRequest} from '../constants/Backend'

class Option extends React.Component {
  static navigationOptions = {
    header: null
  }

  handleSubmit = values => {
    values.multipleChoice === true ? (values.optionType = 'MULTIPLE_CHOICE') : (values.optionType = 'ONE_CHOICE')

    dispatchFetchRequest(api.productOption.new, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    }, response => {
      this.props.navigation.navigate(this.props.navigation.state.params.customRoute)
    }).then()
  }

  render() {
    const { navigation } = this.props
    return (
      <OptionFormScreen
        onSubmit={this.handleSubmit}
        navigation={navigation}
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

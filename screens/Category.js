import React from 'react'
import { connect } from 'react-redux'
import { AsyncStorage } from 'react-native'
import { getProducts, getLables } from '../actions'
import CategoryFormScreen from './CategoryFormScreen'
import {api, dispatchFetchRequest, successMessage} from "../constants/Backend";

class Category extends React.Component {
  static navigationOptions = {
    header: null
  }

  handleSubmit = values => {
    dispatchFetchRequest(api.productLabel.new, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      },
      response => {
        successMessage('Saved')
        this.props.navigation.navigate('ProductsOverview')
        this.props.getProducts()
        this.props.getLables() !== undefined &&
        this.props.getLables()
      }).then()
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

const mapDispatchToProps = dispatch => ({
  dispatch,
  getProducts: () => dispatch(getProducts()),
  getLables: () => dispatch(getLables())
})
export default connect(
  null,
  mapDispatchToProps
)(Category)

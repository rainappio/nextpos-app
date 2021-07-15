import React from 'react'
import {connect} from 'react-redux'
import {getLables, getProducts} from '../actions'
import {api, dispatchFetchRequest} from '../constants/Backend'
import CategoryCustomizeScreen from "./CategoryCustomizeScreen";

class Category extends React.Component {
  static navigationOptions = {
    header: null
  }

  handleSubmit = values => {
    dispatchFetchRequest(
      api.productLabel.new,
      {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      },
      response => {
        this.props.navigation.navigate('ProductsOverview')
        this.props.getProducts()
        this.props.getLables() !== undefined && this.props.getLables()
      }
    ).then()
  }

  render() {
    const {navigation, route} = this.props

    return (
      <CategoryCustomizeScreen
        isEditForm={false}
        onSubmit={this.handleSubmit}
        navigation={navigation}
        route={route}
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

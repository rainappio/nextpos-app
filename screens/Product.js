import React from 'react'
import { connect } from 'react-redux'
import { AsyncStorage } from 'react-native'
import ProductFormScreen from './ProductFormScreen'
import { getProducts, getLables, getLabel } from '../actions'
import {api, dispatchFetchRequest, dispatchFetchRequestWithOption, successMessage} from '../constants/Backend'

class Product extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    refreshing: false
  }

  componentDidMount() {
    this.props.getLables()
    this.props.getProducts()
  }

  handleSubmit = values => {
    dispatchFetchRequest(api.product.new, {
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
      }
    ).then()
  }

  render() {
    const { labels = [], navigation } = this.props

    return (
      <ProductFormScreen
        labels={labels}
        onSubmit={this.handleSubmit}
        navigation={navigation}
      />
    )
  }
}

const mapStateToProps = state => ({
  labels: state.labels.data.labels,
  subproducts: state.label.data.subLabels,
  products: state.products.data.results
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getLables: () => dispatch(getLables()),
  getProducts: () => dispatch(getProducts())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Product)

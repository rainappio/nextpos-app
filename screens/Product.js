import React from 'react'
import {connect} from 'react-redux'
import ProductFormScreen from './ProductFormScreen'
import {getLables, getProducts} from '../actions'
import {api, dispatchFetchRequest} from '../constants/Backend'

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
    const request = {...values}

    if (request.childProducts != null) {
      request.childProducts = request.childProducts.map(p => {
        return p.id
      })
    }
    if (request.productComboLabels != null) {
      request.productComboLabels = request.productComboLabels.map((item) => {
        let label = {
          productLabelId: item.id,
          multipleSelection: item.multipleSelection ?? false,
        }
        return label
      })
    }

    dispatchFetchRequest(api.product.new, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    },
      response => {
        this.props.navigation.navigate('ProductsOverview')
      }
    ).then()
  }

  render() {
    const {products, labels = [], navigation, route} = this.props

    return (
      <ProductFormScreen
        products={products}
        labels={labels}
        onSubmit={this.handleSubmit}
        navigation={navigation}
        route={route}
        isEditForm={false}
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

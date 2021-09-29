import React, {Component} from 'react'
import {connect} from 'react-redux'
import ProductFormScreen from './ProductFormScreen'
import {clearProduct, getLables, getProduct, getProductOptions, getProducts, getWorkingAreas} from '../actions'
import {api, dispatchFetchRequest, successMessage, dispatchFetchRequestWithOption} from '../constants/Backend'
import LoadingScreen from "./LoadingScreen";

// todo: rename this file to ProductEdit.
class ProductEdit extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props)

    this.state = {
      inventoryData: null
    }

  }


  async componentDidMount() {
    this.props.getLables()
    this.props.getProductOptions()
    await this.props.getWorkingAreas('PRODUCT')
    await this.props.getProduct()
    this.getInventory(this.props.route.params.productId)
  }

  handleEditCancel = () => {
    this.props.clearProduct()
    this.props.getProducts()
    this.props.navigation.navigate('ProductsOverview')
  }

  handleUpdate = values => {
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
          required: item.required ?? false,
        }
        return label
      })
    }

    let prdId = this.props.route.params.productId

    dispatchFetchRequest(api.product.update(prdId), {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    }, response => {
      this.props.navigation.navigate('ProductsOverview')
    }).then()
  }

  handleDelete = () => {
    let productId = this.props.route.params.productId

    dispatchFetchRequest(api.product.delete(productId), {
      method: 'DELETE',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }, response => {
      this.props.navigation.navigate('ProductsOverview')
      this.props.getProducts()
    }).then()
  }

  handlepinToggle = productId => {
    dispatchFetchRequest(
      api.product.togglePin(productId),
      {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      response => {
        successMessage('Toggled')
        this.props.navigation.navigate('ProductsOverview')
        this.props.getProducts()
      }
    ).then()
  }

  getInventory = (productId) => {
    dispatchFetchRequestWithOption(
      api.inventory.getById(productId),
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      }, {
      defaultMessage: false,
      ignoreErrorMessage: true
    },
      response => {
        response.json().then(data => {
          this.setState({inventoryData: data})

        })
      },
      response => {
        this.setState({inventoryData: null})
      }
    ).then()
  }

  addInventory = (values) => {
    const request = {quantity: {...values}}
    let prdId = this.props.route.params.productId
    dispatchFetchRequest(
      api.inventory.addQuantity(prdId),
      {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      },
      response => {
        response.json().then(data => {
          console.log('addInventory', JSON.stringify(data))
          this.setState({inventoryData: data})
        })
      }
    ).then()
  }

  addFirstInventory = (values) => {
    const request = {
      productId: this.props.route.params.productId,
      quantity: {...values}
    }
    dispatchFetchRequest(
      api.inventory.new,
      {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      },
      response => {
        response.json().then(data => {
          this.setState({inventoryData: data})
        })
      }
    ).then()
  }

  handleInventoryUpdate = (values, oldSku) => {
    const request = {quantity: {...values}}
    let prdId = this.props.route.params.productId

    dispatchFetchRequest(api.inventory.update(prdId, oldSku), {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    }, response => {
      response.json().then(data => {
        this.setState({inventoryData: data})
      })
    }).then()
  }

  handleInventoryDelete = (oldSku) => {
    let prdId = this.props.route.params.productId

    dispatchFetchRequest(api.inventory.deleteQuantity(prdId, oldSku), {
      method: 'DELETE',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }, response => {
      this.getInventory(prdId)
    }).then()
  }

  handleDeleteAllInventory = () => {
    let prdId = this.props.route.params.productId

    dispatchFetchRequest(api.inventory.delete(prdId), {
      method: 'DELETE',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }, response => {
      this.getInventory(prdId)
    }).then()
  }


  render() {
    const {
      labels,
      navigation,
      route,
      product,
      products,
      haveData,
      haveError,
      isLoading,
      prodctoptions,
      workingareas
    } = this.props
    product.price !== undefined ? (product.price += '') : null

    if (isLoading) {
      return (
        <LoadingScreen />
      )
    } else if (haveData) {
      return (
        <ProductFormScreen
          products={products}
          labels={labels}
          isEditForm={true}
          navigation={navigation}
          route={route}
          initialValues={product}
          handleEditCancel={this.handleEditCancel}
          handleDeleteProduct={this.handleDelete}
          onSubmit={this.handleUpdate}
          workingareas={workingareas}
          prodctoptions={prodctoptions}
          isPinned={this.props.route.params.isPinned}
          productId={this.props.route.params.productId}
          handlepinToggle={this.handlepinToggle}
          inventoryData={this.state?.inventoryData}
          handleInventoryUpdate={this.handleInventoryUpdate}
          addInventory={this.addInventory}
          handleInventoryDelete={this.handleInventoryDelete}
          handleDeleteAllInventory={this.handleDeleteAllInventory}
          addFirstInventory={this.addFirstInventory}
        />
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = state => ({
  labels: state.labels.data.labels,
  product: state.product.data,
  haveData: state.product.haveData,
  haveError: state.product.haveError,
  isLoading: state.product.loading,
  products: state.products.data.results,
  prodctoptions: state.prodctsoptions.data.results,
  workingareas: state.workingareas.data.workingAreas
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getLables: () => dispatch(getLables()),
  clearProduct: () =>
    dispatch(clearProduct(props.route.params.productId)),
  getProducts: () => dispatch(getProducts()),
  getWorkingAreas: () => dispatch(getWorkingAreas('PRODUCT')),
  getProductOptions: () => {
    const labelId = props.route.params.labelId

    if (labelId !== undefined && labelId != null && labelId !== 'ungrouped') {
      dispatch(getProductOptions(props.route.params.labelId))
    }
  },
  getProduct: () =>
    dispatch(getProduct(props.route.params.productId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductEdit)

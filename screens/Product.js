import React from 'react'
import { connect } from 'react-redux'
import { AsyncStorage } from 'react-native'
import ProductFormScreen from './ProductFormScreen'
import { getProducts, getLables, getLabel } from '../actions'

class Product extends React.Component {
  static navigationOptions = {
    header: null
  }

  state ={
    refreshing: false
  }

  componentDidMount() {
    this.props.getLables()
    this.props.getProducts()
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
      fetch('http://35.234.63.193/products', {
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
            this.props.navigation.navigate('ProductsOverview', {
              productId: values.productLabelId
            })
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
    const { labels = [], navigation } = this.props
    const { refreshing } = this.state
    return (
      <ProductFormScreen
        labels={labels}
        onSubmit={this.handleSubmit}
        navigation={navigation}
        refreshing={refreshing}
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

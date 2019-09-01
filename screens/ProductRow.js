import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  TouchableHighlight,
  TextInput,
  RefreshControl,
  AsyncStorage
} from 'react-native'
import { connect } from 'react-redux'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view'
import Icon from 'react-native-vector-icons/Ionicons'
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import AddBtn from '../components/AddBtn'
import DropDown from '../components/DropDown'
import PopUp from '../components/PopUp'
import { getProducts, getLables, getLabel } from '../actions'
import styles from '../styles'

class ProductRow extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    selectedProducts: [],
    refreshing: false
  }

  handleFilter = key => {
    switch (key) {
      case key:
        this.setState({
          selectedProducts: this.props.products[key]
        })
        break
      default:
    }
  }

  handleDelete = id => {
    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      fetch(`http://35.234.63.193/products/${id}`, {
        method: 'DELETE',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': tokenObj.clientId,
          Authorization: 'Bearer ' + tokenObj.access_token
        }
      })
        .then(response => {
          if (response.status === 204) {
            this.props.navigation.navigate('ProductsOverview')
            this.setState({ refreshing: true })
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
    const {
      products = [],
      labels,
      navigation,
      haveData,
      haveError,
      isLoading
    } = this.props
    const { selectedProducts } = this.state
    const modifyLabels = []

    var LabelsArr =
      products !== undefined &&
      Object.keys(products).filter(key => {
        return typeof key === 'string'
      })

    LabelsArr.map((lbl, ix) => {
      const customObj = {}
      customObj.label = lbl
      customObj.value = lbl
      modifyLabels.push(customObj)
      return modifyLabels
    })

    return (
      <ScrollView
        refreshControl={<RefreshControl refreshing={this.state.refreshing} />}
      >
        <DismissKeyboard>
          <View style={styles.container}>
            <BackBtn />
            <Text
              style={[
                styles.welcomeText,
                styles.orange_color,
                styles.textMedium,
                styles.textBold
              ]}
            >
              Product List
            </Text>
            <PopUp navigation={navigation} />

            <Field
              component={DropDown}
              name="productLabelId"
              options={modifyLabels}
              onChange={this.handleFilter}
              search
              selection
              fluid
              placeholder="Product Label"
            />

            <View style={styles.standalone}>
              <SwipeListView
                data={selectedProducts}
                renderItem={(data, rowMap) => (
                  <View style={styles.rowFront}>
                    <Text
                      key={data.item.id}
                      style={{ paddingTop: 20, paddingBottom: 20 }}
                    >
                      {data.item.name}
                    </Text>
                  </View>
                )}
                renderHiddenItem={(data, rowMap) => (
                  <View style={styles.rowBack} key={data.item.id}>
                    <View style={styles.editIcon}>
                      <Icon
                        name="md-create"
                        size={25}
                        color="black"
                        onPress={() =>
                          this.props.navigation.navigate('ProductEdit', {
                            productId: data.item.id
                          })
                        }
                      />
                    </View>
                    <View style={styles.delIcon}>
                      <Icon
                        name="md-trash"
                        size={25}
                        color="#fff"
                        onPress={() => this.handleDelete(data.item.id)}
                      />
                    </View>
                  </View>
                )}
                leftOpenValue={0}
                rightOpenValue={-80}
              />
            </View>
          </View>
        </DismissKeyboard>
      </ScrollView>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
  getProducts: () => dispatch(getProducts())
})

ProductRow = reduxForm({
  form: 'productlist_searchform'
})(ProductRow)

export default connect(
  null,
  mapDispatchToProps
)(ProductRow)

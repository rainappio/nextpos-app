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
  TextInput
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import AddBtn from '../components/AddBtn'
import DropDown from '../components/DropDown'
import PopUp from '../components/PopUp'
import { getProducts, getLables, getLabel } from '../actions'
import styles from '../styles'

class ProductListScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    selectedProducts: []
  }

  componentDidMount() {
    this.props.load()
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

    if (isLoading) {
      return (
        <View style={styles.container}>
          <Text>loading data ...</Text>
        </View>
      )
    } else if (haveError) {
      return (
        <View style={styles.container}>
          <Text>Error occurs ...</Text>
        </View>
      )
    } else if (products.length === 0) {
      return (
        <View style={styles.container}>
          <Text>no data seems token expires ...</Text>
        </View>
      )
    }

    return (
      <ScrollView>
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
              Product
            </Text>
            <PopUp navigation={navigation} />

            <Field
              component={DropDown}
              name="productLabelId"
              options={modifyLabels}
              //validate={isRequired}
              onChange={this.handleFilter}
              search
              selection
              fluid
              placeholder="Product Label"
            />

            <View>
              {selectedProducts !== undefined &&
                selectedProducts.map(selprd => {
                  return (
                    <View
                      key={selprd.id}
                      style={{
                        borderBottomWidth: 1,
                        marginTop: 8,
                        marginBottom: 8,
                        paddingTop: 12,
                        paddingBottom: 12,
                        borderBottomColor: '#f1f1f1',
                        position: 'relative'
                      }}
                    >
                      <Text>{selprd.name}</Text>

                      <View style={styles.editIcon}>
                        <Icon
                          name="md-create"
                          size={20}
                          color="#fff"
                          onPress={() =>
                            this.props.navigation.navigate('ProductEdit')
                          }
                        />
                      </View>
                      <View style={styles.delIcon}>
                        <Icon
                          name="md-trash"
                          size={20}
                          color="#fff"
                          onPress={() => alert('R U sure?')}
                        />
                      </View>
                    </View>
                  )
                })}
            </View>
          </View>
        </DismissKeyboard>
      </ScrollView>
    )
  }
}

const mapStateToProps = state => ({
  gts: state,
  products: state.products.data.results,
  labels: state.labels.data.labels,
  subproducts: state.label.data.subLabels,
  haveData: state.products.haveData,
  haveError: state.products.haveError,
  isLoading: state.products.loading
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  load: () => {
    dispatch(getProducts())
    dispatch(getLables())
  },
  getLabel: id => dispatch(getLabel(id))
})

ProductListScreen = reduxForm({
  form: 'productlist_searchform'
})(ProductListScreen)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductListScreen)

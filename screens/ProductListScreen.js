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
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import AddBtn from '../components/AddBtn'
import { getProducts, getLables, getLabel } from '../actions'
import styles from '../styles'

class ProductListScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    selectedProducts: [],
    activeId: null
  }

  handleFilter = (key, id) => {
    switch (key) {
      case key:
        this.setState({
          selectedProducts: this.props.products[key],
          activeId: id
        })
        break
      default:
    }
  }

  componentDidMount() {
    this.props.getProducts()
    this.props.getLables()
  }

  render() {
    const { products = [], labels } = this.props

    var LabelsArr =
      products !== undefined &&
      Object.keys(products).filter(key => {
        return typeof key === 'string'
      })

    var Labels = LabelsArr.map((lbl, ix) => {
      return (
        <View key={ix}>
          <Text
            style={[
              styles.mgr_20,
              styles.grayText,
              styles.capitalizeTxt,
              this.state.activeId === ix && styles.isActive
            ]}
            onPress={() => this.handleFilter(lbl, ix)}
          >
            {lbl}
          </Text>
        </View>
      )
    })

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
            <AddBtn />

            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 8 }}
            >
              <View style={styles.textLeftWrapper}>{Labels}</View>
            </ScrollView>

            <Field
              name="product_search"
              component={InputText}
              placeholder="Search"
              secureTextEntry={false}
              isgrayBg={true}
            />

            <View>
              {this.state.selectedProducts.map(selprd => {
                return (
                  <View
                    key={selprd.id}
                    style={{ borderBottomWidth: 1, marginBottom: 4 }}
                  >
                    <Text>{selprd.name}</Text>
                    <Text>{selprd.price}</Text>
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
  subproducts: state.label.data.subLabels
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getProducts: () => dispatch(getProducts()),
  getLables: () => dispatch(getLables()),
  getLabel: id => dispatch(getLabel(id))
})

ProductListScreen = reduxForm({
  form: 'productlist_searchform'
})(ProductListScreen)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductListScreen)

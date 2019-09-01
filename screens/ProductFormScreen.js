import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlight,
  RefreshControl
} from 'react-native'
import { isRequired } from '../validators'
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import DropDown from '../components/DropDown'
import styles from '../styles'

class ProductFormScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    const {
      handleSubmit,
      labels,
      isEditForm,
      refreshing,
      handleEditCancel
    } = this.props

    return (
      <DismissKeyboard>
        <View style={styles.container_nocenterCnt}>
          {isEditForm ? (
            <Text
              style={[
                styles.welcomeText,
                styles.orange_color,
                styles.textMedium,
                styles.textBold,
                styles.mgrbtn80
              ]}
            >
              Edit Product
            </Text>
          ) : (
            <View>
              <BackBtn />
              <Text
                style={[
                  styles.welcomeText,
                  styles.orange_color,
                  styles.textMedium,
                  styles.textBold
                ]}
              >
                Add Product
              </Text>
            </View>
          )}

          <Field
            name="name"
            component={InputText}
            validate={isRequired}
            placeholder="Product Name"
            secureTextEntry={false}
          />

          <Field
            name="sku"
            component={InputText}
            placeholder="SKU"
            secureTextEntry={false}
          />
          <Field
            name="price"
            component={InputText}
            validate={isRequired}
            placeholder="Price"
            secureTextEntry={false}
            keyboardType={'numeric'}
          />

          <Field
            component={DropDown}
            name="productLabelId"
            options={labels}
            search
            selection
            fluid
            placeholder="Product Label"
          />

          <Field
            name="description"
            component={InputText}
            placeholder="Description"
            secureTextEntry={false}
          />

          <View
            style={[
              {
                width: '100%',
                backgroundColor: '#F39F86',
                position: 'absolute',
                bottom: 48,
                borderRadius: 4
              }
            ]}
          >
            {isEditForm ? (
              <TouchableHighlight onPress={handleSubmit}>
                <Text style={styles.gsText}>Update</Text>
              </TouchableHighlight>
            ) : (
              <TouchableHighlight onPress={handleSubmit}>
                <Text style={styles.gsText}>Save</Text>
              </TouchableHighlight>
            )}
          </View>
          <View
            style={[
              {
                width: '100%',
                position: 'absolute',
                bottom: 0,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#F39F86'
              }
            ]}
          >
            {isEditForm ? (
              <TouchableHighlight onPress={handleEditCancel}>
                <Text style={styles.signInText}>Cancel</Text>
              </TouchableHighlight>
            ) : (
              <TouchableHighlight
                onPress={() =>
                  this.props.navigation.navigate('ProductsOverview')
                }
              >
                <Text style={styles.signInText}>Cancel</Text>
              </TouchableHighlight>
            )}
          </View>
        </View>
      </DismissKeyboard>
    )
  }
}

ProductFormScreen = reduxForm({
  form: 'productForm'
})(ProductFormScreen)

export default ProductFormScreen

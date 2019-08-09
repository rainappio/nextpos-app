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
  TextInput
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
    const { handleSubmit, labels } = this.props

    return (
      <DismissKeyboard>
        <View style={styles.container_nocenterCnt}>
          <BackBtn />
          <Text
            style={[
              styles.welcomeText,
              styles.orange_color,
              styles.textMedium,
              styles.textBold,
              styles.mgrbtn40
            ]}
          >
            Add Product
          </Text>

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
            validate={isRequired}
            placeholder="SKU"
            secureTextEntry={false}
          />
          <Field
            name="price"
            component={InputText}
            type="number"
            validate={isRequired}
            placeholder="Price"
            secureTextEntry={false}
          />

          <Field
            component={DropDown}
            name="productLabelId"
            options={labels}
            validate={[isRequired]}
            search
            selection
            fluid
            placeholder="Product Label"
          />

          <Field
            name="description"
            component={InputText}
            validate={isRequired}
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
            <TouchableHighlight onPress={handleSubmit}>
              <Text style={styles.gsText}>Save</Text>
            </TouchableHighlight>
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
            <TouchableHighlight
              onPress={() => this.props.navigation.navigate('ProductList')}
            >
              <Text style={styles.signInText}>Cancel</Text>
            </TouchableHighlight>
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

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
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import AddBtn from '../components/AddBtn'
import styles from '../styles'

class ProductListScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
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
            <View style={styles.textLeftWrapper}>
              <Text style={[styles.mgr_20]}>Drink</Text>
              <Text
                style={[styles.mgr_20, styles.grayText]}
                onPress={() => alert('opps')}
              >
                Entree,
              </Text>
              <Text style={[styles.mgr_20, styles.grayText]}>Main</Text>
              <Text style={[styles.mgr_20, styles.grayText]}>Dessert</Text>
              <Text style={[styles.mgr_20, styles.grayText]}>Others</Text>
            </View>

            <Field
              name="product_search"
              component={InputText}
              placeholder="Search"
              secureTextEntry={false}
              isgrayBg={true}
            />
          </View>
        </DismissKeyboard>
      </ScrollView>
    )
  }
}

ProductListScreen = reduxForm({
  form: 'productlist_searchform'
})(ProductListScreen)

export default ProductListScreen

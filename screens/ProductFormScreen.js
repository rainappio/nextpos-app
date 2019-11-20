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
import AddBtn from '../components/AddBtn'
import RenderRadioBtn from '../components/RadioItem'
import RenderCheckboxGroup from '../components/CheckBoxGroup'
import styles from '../styles'
import DeleteBtn from '../components/DeleteBtn'

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
      handleEditCancel,
      handleDeleteProduct,
      workingareas,
      prodctoptions
    } = this.props

    return (
      <ScrollView>
        <DismissKeyboard>
          <View style={styles.container_nocenterCnt}>
            <BackBtn />
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

            <View style={{ marginBottom: 20 }}>
              <Field
                name="description"
                component={InputText}
                placeholder="Description"
                secureTextEntry={false}
              />
            </View>

            {isEditForm && (
              <View>
                <View
                  style={[
                    styles.borderBottomLine,
                    styles.paddBottom_20,
                    styles.minustopMargin10
                  ]}
                >
                  <Text style={styles.textBold}>Option</Text>
                  <AddBtn
                    onPress={() =>
                      this.props.navigation.navigate('Option', {
                        customRoute: this.props.navigation.state.routeName
                      })
                    }
                  />
                </View>

                <Field
                  name="productOptionIds"
                  component={RenderCheckboxGroup}
                  customarr={prodctoptions}
                />

                <View>
                  <View
                    style={[styles.paddingTopBtn20, styles.borderBottomLine]}
                  >
                    <Text style={styles.textBold}>Working Area</Text>
                  </View>
                  {workingareas !== undefined &&
                    workingareas.map(workarea => (
                      <View
                        style={[
                          styles.borderBottomLine,
                          styles.paddingTopBtn20
                        ]}
                        key={workarea.id}
                      >
                        <Field
                          name="workingAreaId"
                          component={RenderRadioBtn}
                          customValue={workarea.id}
                          optionName={workarea.name}
                        />
                      </View>
                    ))}
                </View>
              </View>
            )}

            <View
              style={[
                {
                  width: '100%',
                  backgroundColor: '#F39F86',
                  marginBottom: 8,
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
                  // position: 'absolute',
                  // bottom: 0,
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
            {isEditForm ? (
              <DeleteBtn handleDeleteAction={handleDeleteProduct} />
            ) : (
              <View />
            )}
          </View>
        </DismissKeyboard>
      </ScrollView>
    )
  }
}

ProductFormScreen = reduxForm({
  form: 'productForm'
})(ProductFormScreen)

export default ProductFormScreen

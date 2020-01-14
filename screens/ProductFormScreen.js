import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
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
import { LocaleContext } from '../locales/LocaleContext'

class ProductFormScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      t: context.t
    }
  }

  componentDidMount() {
    this.context.localize({
      en: {
        newProduct: 'New Product',
        editProduct: 'Edit Product',
        productName: 'Product Name',
        price: 'Price',
        productLabel: 'Product Label',
        description: 'Description',
        options: 'Options',
        workingArea: 'Working Area'
      },
      zh: {
        newProduct: '新增產品',
        editProduct: '修改產品',
        productName: '產品名稱',
        price: '價格',
        productLabel: '產品分類',
        description: '產品敘述',
        options: '產品選項',
        workingArea: '工作區'
      }
    })
  }

  render() {
    const { t } = this.state

    const {
      handleSubmit,
      labels,
      isEditForm,
      handleEditCancel,
      handleDeleteProduct,
      workingareas,
      prodctoptions,
      navigation
    } = this.props

    return (
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
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
                {t('editProduct')}
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
                  {t('newProduct')}
                </Text>
              </View>
            )}

            <Field
              name="name"
              component={InputText}
              validate={isRequired}
              placeholder={t('productName')}
              secureTextEntry={false}
            />

            <Field
              name="price"
              component={InputText}
              validate={isRequired}
              placeholder={t('price')}
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
              placeholder={{ value: null, label: t('productLabel') }}
            />

            <View style={{ marginBottom: 20 }}>
              <Field
                name="description"
                component={InputText}
                placeholder={t('description')}
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
                  <Text style={styles.textBold}>{t('options')}</Text>
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
                  navigation={navigation}
                  customRoute={'OptionEdit'}
                />

                <View>
                  <View
                    style={[styles.paddingTopBtn20, styles.borderBottomLine]}
                  >
                    <Text style={styles.textBold}>{t('workingArea')}</Text>
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

            <View style={[styles.bottom]}>
              <TouchableOpacity onPress={handleSubmit}>
                <Text style={[styles.bottomActionButton, styles.actionButton]}>
                  {t('action.save')}
                </Text>
              </TouchableOpacity>

              {isEditForm ? (
                <View>
                  <TouchableOpacity onPress={handleEditCancel}>
                    <Text
                      style={[styles.bottomActionButton, styles.cancelButton]}
                    >
                      {t('action.cancel')}
                    </Text>
                  </TouchableOpacity>
                  <DeleteBtn handleDeleteAction={handleDeleteProduct} />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('ProductsOverview')
                  }
                >
                  <Text
                    style={[styles.bottomActionButton, styles.cancelButton]}
                  >
                    {t('action.cancel')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
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

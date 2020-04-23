import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
import { isRequired } from '../validators'
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import DropDown from '../components/DropDown'
import AddBtn from '../components/AddBtn'
import RenderCheckboxGroup from '../components/CheckBoxGroup'
import styles from '../styles'
import DeleteBtn from '../components/DeleteBtn'
import { LocaleContext } from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import RadioItemObjPick from "../components/RadioItemObjPick";

class ProductFormScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

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
    const { t } = this.context

    const {
      initialValues,
      handleSubmit,
      labels,
      isEditForm,
      handleEditCancel,
      handleDeleteProduct,
      workingareas,
      prodctoptions,
      navigation,
      isPinned,
      productId,
      handlepinToggle
    } = this.props

    return (
      <ScrollView scrollIndicatorInsets={{ right: 1 }} contentContainerStyle={{flexGrow: 1}}>
        <DismissKeyboard>
          <View style={[styles.fullWidthScreen]}>
            <ScreenHeader parentFullScreen={true}
                          title={isEditForm ? t('editProduct') : t('newProduct')}
                          rightComponent={
                            <AddBtn
                              onPress={() =>
                                this.props.navigation.navigate('Option', {
                                  customRoute: this.props.navigation.state.routeName
                                })
                              }
                            />
                          }
            />

            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, {flex: 3}]}>
                <Text style={styles.fieldTitle}>{t('productName')}</Text>
              </View>
              <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                <Field
                  name="name"
                  component={InputText}
                  validate={isRequired}
                  placeholder={t('productName')}
                  secureTextEntry={false}
                />
              </View>
            </View>

            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <Text style={styles.fieldTitle}>{t('price')}</Text>
              </View>
              <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                <Field
                  name="price"
                  component={InputText}
                  validate={isRequired}
                  placeholder={t('price')}
                  secureTextEntry={false}
                  keyboardType={'numeric'}
                />
              </View>
            </View>

            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, {flex: 3}]}>
                <Text style={styles.fieldTitle}>{t('productLabel')}</Text>
              </View>
               <View style={{flex: 1.5, justifyContent: 'flex-end'}}>
                <Field
                  component={DropDown}
                  name="productLabelId"
                  options={labels}
                  search
                  selection
                  fluid
                  placeholder={{ value: null, label: t('productLabel') }}
                />
              </View>
            </View>

            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <Text style={styles.fieldTitle}>{t('description')}</Text>
              </View>
              <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                <Field
                  name="description"
                  component={InputText}
                  placeholder={t('description')}
                  secureTextEntry={false}
                />
              </View>
            </View>

            {isEditForm && (
              <View>
                <View style={styles.sectionContainer}>
                  <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitleText}>{t('options')}</Text>
                  </View>

                  <View>
                    <Field
                      name="productOptionIds"
                      component={RenderCheckboxGroup}
                      customarr={prodctoptions}
                      navigation={navigation}
                      customRoute={'OptionEdit'}
                    />
                  </View>
                </View>

                <View style={[styles.sectionContainer]}>
                  <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitleText}>{t('workingArea')}</Text>
                  </View>
                  {workingareas !== undefined &&
                    workingareas.map(workarea => (
                      <View key={workarea.id}>
                        <Field
                          name='workingAreaId'
                          component={RadioItemObjPick}
                          customValueOrder={workarea.id}
                          optionName={workarea.name}
                          onCheck={(currentVal, fieldVal) => {
                            return fieldVal !== undefined && currentVal === fieldVal
                          }}
                        />
                      </View>
                    ))}
                </View>
              </View>
            )}

            <View style={[styles.bottom, styles.horizontalMargin]}>
              <TouchableOpacity onPress={handleSubmit}>
                <Text style={[styles.bottomActionButton, styles.actionButton]}>
                  {t('action.save')}
                </Text>
              </TouchableOpacity>

              {isEditForm ? (
                <View>
                	{
                		isPinned &&
                		<TouchableOpacity onPress={() => handlepinToggle(productId)}>
                	    <Text
                	      style={[styles.bottomActionButton, styles.actionButton]}
                	    >
                	      {t('action.unpin')}
                	    </Text>
                	  </TouchableOpacity>
                	}

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

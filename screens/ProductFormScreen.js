import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {Text, TouchableOpacity, View, Alert} from 'react-native'
import {isRequired, isPositiveInteger} from '../validators'
import InputText from '../components/InputText'
import DropDown from '../components/DropDown'
import AddBtn from '../components/AddBtn'
import RenderCheckboxGroup from '../components/CheckBoxGroup'
import styles from '../styles'
import DeleteBtn from '../components/DeleteBtn'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import RadioItemObjPick from "../components/RadioItemObjPick";
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";
import {StyledText} from "../components/StyledText";
import ItemList from "../components/ItemList";
import ProductSelector from "./ProductSelector";
import {backAction} from '../helpers/backActions'
import {CustomTable} from '../components/CustomTable'
import Modal from 'react-native-modal';
import {ThemeContainer} from "../components/ThemeContainer";
import Icon from 'react-native-vector-icons/FontAwesome';
import {ScanView} from '../components/scanView'

class ProductFormScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
    this.state = {
      inventoryModalData: null,
      isShow: false
    }
  }

  componentDidMount() {
    this.context.localize({
      en: {
        newProduct: 'New Product',
        editProduct: 'Edit Product',
        productName: 'Product Name',
        internalProductName: 'Internal Product Name',
        price: 'Price',
        costPrice: 'Cost Price',
        productLabel: 'Product Label',
        description: 'Description',
        childProducts: 'Child Products',
        options: 'Options',
        workingArea: 'Working Area',
        inventoryEdit: '庫存管理',
      },
      zh: {
        newProduct: '新增產品',
        editProduct: '修改產品',
        productName: '產品名稱',
        internalProductName: '內部產品名稱',
        price: '價格',
        costPrice: '成本價',
        productLabel: '產品分類',
        description: '產品敘述',
        childProducts: '子產品',
        options: '產品選項',
        workingArea: '工作區',
        inventoryEdit: '庫存管理',

      }
    })
  }

  handleItemPress = (data) => {
    this.setState({inventoryModalData: data, isShow: true})
  }
  handleInventoryUpdate = (values) => {
    if (!!this.state?.inventoryModalData) {
      this.props?.handleInventoryUpdate && this.props?.handleInventoryUpdate(values, this.state?.inventoryModalData?.sku)
    } else {
      this.props?.addInventory && this.props?.addInventory(values)
    }

    this.setState({inventoryModalData: values, isShow: false})
  }

  handleInventoryDelete = (values) => {
    Alert.alert(
      `${this.context.t('action.confirmMessageTitle')}`,
      `${this.context.t('action.confirmMessage')}`,
      [
        {
          text: `${this.context.t('action.yes')}`,
          onPress: () => {this.props?.handleInventoryDelete && this.props?.handleInventoryDelete(values?.sku)}
        },
        {
          text: `${this.context.t('action.no')}`,
          onPress: () => console.log('Cancelled'),
          style: 'cancel'
        }
      ]
    )

  }
  addFirstInventory = (values) => {
    this.props?.addFirstInventory && this.props?.addFirstInventory(values)
    this.setState({inventoryModalData: values, isShow: false})
  }

  render() {
    const {t, customMainThemeColor, customBackgroundColor} = this.context

    const {
      initialValues,
      handleSubmit,
      products,
      labels,
      isEditForm,
      handleEditCancel,
      handleDeleteProduct,
      workingareas,
      prodctoptions,
      navigation,
      isPinned,
      productId,
      handlepinToggle,
      inventoryData
    } = this.props

    console.log('inventoryModalData', JSON.stringify(inventoryData))

    return (
      <ThemeKeyboardAwareScrollView>
        <View style={[styles.fullWidthScreen]}>
          <ScreenHeader parentFullScreen={true}
            title={isEditForm ? t('editProduct') : t('newProduct')}
            backAction={() => backAction(this.props.navigation)}

          />
          <Modal
            isVisible={this.state?.isShow}
            useNativeDriver
            hideModalContentWhileAnimating
            animationIn='fadeIn'
            animationOut='fadeOut'
            onBackdropPress={() => this.setState({isShow: false})}
            style={{
              margin: 0, flex: 1, flexDirection: 'row', alignItems: 'center'
            }}
          >
            <View style={{maxWidth: 640, flex: 1, borderWidth: 1, borderColor: customMainThemeColor, marginHorizontal: 10, }}>
              <View style={{flexDirection: 'row'}}>
                <InventoryForm
                  initialValues={this.state?.inventoryModalData}
                  onSubmit={!!inventoryData ? this.handleInventoryUpdate : this.addFirstInventory}
                  handleCancel={() => this.setState({isShow: false})}
                />
              </View>
            </View>
          </Modal>

          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText style={styles.fieldTitle}>{t('productName')}</StyledText>
            </View>
            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
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
              <StyledText style={styles.fieldTitle}>{t('productName')}</StyledText>
            </View>
            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
              <Field
                name="internalName"
                component={InputText}
                placeholder={t('internalProductName')}
                secureTextEntry={false}
              />
            </View>
          </View>

          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText style={styles.fieldTitle}>{t('price')}</StyledText>
            </View>
            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
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
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText style={styles.fieldTitle}>{t('costPrice')}</StyledText>
            </View>
            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
              <Field
                name="costPrice"
                component={InputText}
                validate={isRequired}
                placeholder={t('costPrice')}
                secureTextEntry={false}
                keyboardType={'numeric'}
              />
            </View>
          </View>

          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText style={styles.fieldTitle}>{t('productLabel')}</StyledText>
            </View>
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
              <Field
                component={DropDown}
                name="productLabelId"
                options={labels}
                search
                selection
                fluid
                placeholder={{value: null, label: t('productLabel')}}
              />
            </View>
          </View>

          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText style={styles.fieldTitle}>{t('description')}</StyledText>
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

          {(!isEditForm || initialValues.productType === 'PRODUCT_SET') && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionTitleContainer}>
                <StyledText style={styles.sectionTitleText}>{t('childProducts')}</StyledText>
              </View>

              <View>
                <Field
                  name="childProducts"
                  component={ItemList}
                  listSelector={(onChange) =>
                    <ProductSelector
                      products={products}
                      labels={labels}
                      handleOnSelect={onChange}
                    />
                  }
                />
              </View>
            </View>
          )}

          {isEditForm && (
            <View>
              <View style={styles.sectionContainer}>
                <View style={[styles.tableRowContainer, {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
                  <TouchableOpacity onPress={() => {this.setState({inventoryModalData: null, isShow: true})}}>
                    <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                      {t('inventory.addInventory')}
                    </Text>
                  </TouchableOpacity>
                  <StyledText style={styles.sectionTitleText}>{t('inventoryEdit')}</StyledText>
                  {!!inventoryData ? <DeleteBtn handleDeleteAction={this.props?.handleDeleteAllInventory} text={t('inventory.deleteAllInventory')} /> :
                    <View>
                      <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor), {color: customBackgroundColor, backgroundColor: customBackgroundColor, borderColor: customBackgroundColor}]}>
                        {t('inventory.addInventory')}
                      </Text>
                    </View>}
                </View>

                {!!inventoryData ?
                  <View style={styles.tableRowContainer}>
                    <CustomTable
                      tableData={Object.values(inventoryData?.inventoryQuantities)}
                      tableTopBar={[t('inventory.sku'), t('inventory.name'), t('inventory.unitOfMeasure'), t('inventory.baseUnitQuantity'), t('inventory.quantity'), t('inventory.minimumStockLevel')]}
                      tableContent={['sku', 'name', 'unitOfMeasure', 'baseUnitQuantity', 'quantity', 'minimumStockLevel']}
                      occupy={[1, 1, 1, 1, 1, 1]}
                      itemOnPress={(data) => this.handleItemPress(data)}
                      moreActions={[(data) => this.handleItemPress(data), (data) => this.handleInventoryDelete(data)]}
                    />
                  </View>
                  :
                  <>
                    <View style={styles.sectionTitleContainer}>
                      <StyledText >{t('general.noData')}</StyledText>
                    </View>
                  </>
                }
              </View>

              <View style={styles.sectionContainer}>
                <View style={styles.sectionTitleContainer}>
                  <StyledText style={styles.sectionTitleText}>{t('options')}</StyledText>
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
                  <StyledText style={styles.sectionTitleText}>{t('workingArea')}</StyledText>
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
              <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                {t('action.save')}
              </Text>
            </TouchableOpacity>

            {isEditForm ? (
              <View>
                {
                  isPinned ?
                    <TouchableOpacity onPress={() => handlepinToggle(productId)}>
                      <Text
                        style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}
                      >
                        {t('action.unpin')}
                      </Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => handlepinToggle(productId)}>
                      <Text
                        style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}
                      >
                        {t('action.pin')}
                      </Text>
                    </TouchableOpacity>
                }

                <TouchableOpacity onPress={handleEditCancel}>
                  <Text
                    style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}
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
                    style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}
                  >
                    {t('action.cancel')}
                  </Text>
                </TouchableOpacity>
              )}
          </View>
        </View>
      </ThemeKeyboardAwareScrollView>
    )
  }
}

ProductFormScreen = reduxForm({
  form: 'productForm'
})(ProductFormScreen)

export default ProductFormScreen

class InventoryForm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
    this.state = {
      openScanView: false
    }
  }

  handleScanSuccess = (data) => {
    this.props?.change(`sku`, data)
    this.setState({openScanView: false})
  }

  render() {
    const {t, customMainThemeColor} = this.context



    return (
      <ThemeKeyboardAwareScrollView>
        <View style={{paddingTop: 15}}>
          <ScreenHeader parentFullScreen={true}
            title={!!this.props?.initialValues ? t('inventory.inventoryEditFormTitle') : t('inventory.inventoryNewFormTitle')}
            backNavigation={false}

          />
          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText style={styles.fieldTitle}>{t('inventory.sku')}</StyledText>
            </View>
            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
              <Field
                name="sku"
                component={InputText}
                validate={isRequired}
                placeholder={t('inventory.sku')}
                secureTextEntry={false}
              />
              <TouchableOpacity style={{minWidth: 64, alignItems: 'center', }}
                onPress={() => {
                  this.setState({
                    openScanView: !this.state.openScanView
                  })
                }}
              >
                <Icon style={{marginLeft: 10}} name="camera" size={24} color={customMainThemeColor} />
              </TouchableOpacity>
            </View>
          </View>

          {this.state.openScanView && <View >
            <ScanView successCallback={(data) => {this.handleScanSuccess(data)}} style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'flex-end',
              borderRadius: 10,
              paddingVertical: '10%',
              alignItems: 'center'
            }}
              allType />
          </View>}

          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText style={styles.fieldTitle}>{t('inventory.name')}</StyledText>
            </View>
            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
              <Field
                name="name"
                component={InputText}
                validate={isRequired}
                placeholder={t('inventory.name')}
                secureTextEntry={false}
              />
            </View>
          </View>
          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText style={styles.fieldTitle}>{t('inventory.unitOfMeasure')}</StyledText>
            </View>
            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
              <Field
                name="unitOfMeasure"
                component={InputText}
                validate={isRequired}
                placeholder={t('inventory.unitOfMeasure')}
                secureTextEntry={false}
              />
            </View>
          </View>
          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText style={styles.fieldTitle}>{t('inventory.baseUnitQuantity')}</StyledText>
            </View>
            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
              <Field
                name="baseUnitQuantity"
                component={InputText}
                validate={[isRequired, isPositiveInteger]}
                placeholder={t('inventory.baseUnitQuantity')}
                keyboardType={`numeric`}
              />
            </View>
          </View>
          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText style={styles.fieldTitle}>{t('inventory.quantity')}</StyledText>
            </View>
            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
              <Field
                name="quantity"
                component={InputText}
                validate={[isRequired, isPositiveInteger]}
                placeholder={t('inventory.quantity')}
                keyboardType={`numeric`}
              />
            </View>
          </View>
          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText style={styles.fieldTitle}>{t('inventory.minimumStockLevel')}</StyledText>
            </View>
            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
              <Field
                name="minimumStockLevel"
                component={InputText}
                validate={[isRequired, isPositiveInteger]}
                placeholder={t('inventory.minimumStockLevel')}
                keyboardType={`numeric`}
              />
            </View>
          </View>

          <View style={{
            paddingVertical: 8,
            paddingHorizontal: 10
          }}>

            <TouchableOpacity onPress={this.props?.handleSubmit}>
              <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                {t('action.save')}
              </Text>
            </TouchableOpacity>


            <TouchableOpacity onPress={() => {this.props?.handleCancel()}}>
              <Text
                style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}
              >
                {t('action.cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ThemeKeyboardAwareScrollView>
    )
  }
}

InventoryForm = reduxForm({
  form: 'inventoryForm'
})(InventoryForm)


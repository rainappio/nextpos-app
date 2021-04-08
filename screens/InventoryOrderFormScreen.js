import React, {useEffect} from 'react'
import {Field, FieldArray, reduxForm, formValueSelector} from 'redux-form'
import {Text, TouchableOpacity, View, FlatList, Alert, Picker} from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import InputText from '../components/InputText'
import RNSwitch from '../components/RNSwitch'
import styles from '../styles'
import IonIcon from 'react-native-vector-icons/Ionicons'
import {isRequired, isPositiveInteger} from '../validators'
import DeleteBtn from '../components/DeleteBtn'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {StyledText} from "../components/StyledText";
import {WhiteSpace} from "@ant-design/react-native";
import {backAction} from '../helpers/backActions'
import {Ionicons} from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import {ThemeContainer} from "../components/ThemeContainer";
import {connect} from 'react-redux'
import RenderDateTimePicker, {RenderTimePicker} from '../components/DateTimePicker'
import {api, dispatchFetchRequest, successMessage, dispatchFetchRequestWithOption} from '../constants/Backend'
import Modal from 'react-native-modal';
import {SearchBar} from "react-native-elements";
import {ScanView} from '../components/scanView'
import {CustomTable} from '../components/CustomTable'
import {getProducts, getLables} from '../actions'

class InventoryOrderFormScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    static contextType = LocaleContext

    constructor(props, context) {
        super(props, context)


        this.state = {
            data: props?.navigation?.state?.params?.data ?? null,
            initialValuesCount: props?.initialValues?.optionValues?.length ?? 0,
            isShowDatePicker: false,
            inventoryModalData: null,
            isShow: false,
            isProcessed: props?.navigation?.state?.params?.data?.status == 'PROCESSED' ? true : false,
            inventoryFormValues: props?.navigation?.state?.params?.data?.items ?? []
        }


    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState !== this.state;
    }

    componentDidMount() {
        if (!!this.props?.navigation?.state?.params?.data) {
            this.props?.change(`supplierId`, this.props?.navigation?.state?.params?.data?.supplierId)
            this.props?.change(`supplierOrderId`, this.props?.navigation?.state?.params?.data?.supplierOrderId)
            this.props?.change(`orderDate`, new Date(this.props?.navigation?.state?.params?.data?.orderDate))
        }
        this.props.getProducts()
        this.props.getLables()

    }
    exchangeAnimate = (from, to, callback) => {
        Promise.all([
            this.[`renderOptionValRef_${from}`]?.pulse(500).then(endState => endState),
            this.[`renderOptionValRef_${to}`]?.pulse(500).then(endState => endState),]
        ).finally(() => {

        })
        callback()
    }

    deleteAnimate = (index, callback) => {
        this.[`renderOptionValRef_${index}`]?.fadeOutRight(250).then(() => {
            this.[`renderOptionValRef_${index}`]?.animate({0: {opacity: 1}, 1: {opacity: 1}}, 1)
            callback()
        })
    }

    handleSubmit = (data) => {
        let request = {...data, items: this.state?.inventoryFormValues}
        dispatchFetchRequestWithOption(
            api.inventoryOrders.new,
            {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request)
            }, {
            defaultMessage: true,
            ignoreErrorMessage: false
        },
            response => {
                response.json().then(data => {
                    this.props.navigation.goBack()
                })
            },
            response => {
            }
        ).then()
    }

    handleProcess = (orderId) => {
        dispatchFetchRequestWithOption(
            api.inventoryOrders.process(orderId),
            {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
            }, {
            defaultMessage: true,
            ignoreErrorMessage: false
        },
            response => {
                this.props.navigation.navigate('InventoryOrderScreen')
            },
        ).then()
    }

    handleCopy = (orderId) => {
        dispatchFetchRequestWithOption(
            api.inventoryOrders.copy(orderId),
            {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
            }, {
            defaultMessage: true,
            ignoreErrorMessage: false
        },
            response => {
                this.props.navigation.navigate('InventoryOrderScreen')
            },
        ).then()
    }

    handleDelete = (orderId) => {
        dispatchFetchRequestWithOption(
            api.inventoryOrders.delete(orderId),
            {
                method: 'DELETE',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
            }, {
            defaultMessage: true,
            ignoreErrorMessage: false
        },
            response => {
                this.props.navigation.navigate('InventoryOrderScreen')
            },
        ).then()
    }

    handleUpdate = (data) => {
        let request = {...data, items: this.state?.inventoryFormValues}
        dispatchFetchRequestWithOption(
            api.inventoryOrders.getById(this.props?.navigation?.state?.params?.data?.id),
            {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request)
            }, {
            defaultMessage: true,
            ignoreErrorMessage: false
        },
            response => {
                response.json().then(data => {
                    // this.props.navigation.goBack()
                })
            },
            response => {
            }
        ).then()
    }

    handleInventoryFormSubmit = (values) => {
        let tempArr = [...this.state?.inventoryFormValues]
        tempArr.push(values)
        this.setState({inventoryFormValues: tempArr})
    }

    handleInventoryFormUpdate = (values, index) => {
        let tempArr = [...this.state?.inventoryFormValues]
        tempArr.splice(index, 1, values)
        this.setState({inventoryFormValues: tempArr})
    }

    handleItemPress = (data, index) => {
        if (!this.state?.isProcessed) {
            this.setState({inventoryModalData: {...data, dataIndex: index}, isShow: true})
        } else {
            Alert.alert(
                `${this.context.t('inventoryOrder.disableChangeOrderTitle')}`,
                `${this.context.t('inventoryOrder.disableChangeOrderMessage')}`,
                [
                    {
                        text: `${this.context.t('action.ok')}`,
                        onPress: () => console.log('Cancelled'),
                        style: 'cancel'
                    }
                ]
            )
        }
    }

    handleInventoryDelete = (data, index) => {
        if (!this.state?.isProcessed) {
            Alert.alert(
                `${this.context.t('action.confirmMessageTitle')}`,
                `${this.context.t('action.confirmMessage')}`,
                [
                    {
                        text: `${this.context.t('action.yes')}`,
                        onPress: () => {
                            let tempArr = [...this.state?.inventoryFormValues]
                            tempArr.splice(index, 1)
                            this.setState({inventoryFormValues: tempArr})
                        }
                    },
                    {
                        text: `${this.context.t('action.no')}`,
                        onPress: () => console.log('Cancelled'),
                        style: 'cancel'
                    }
                ]
            )
        } else {
            Alert.alert(
                `${this.context.t('inventoryOrder.disableChangeOrderTitle')}`,
                `${this.context.t('inventoryOrder.disableChangeOrderMessage')}`,
                [
                    {
                        text: `${this.context.t('action.ok')}`,
                        onPress: () => console.log('Cancelled'),
                        style: 'cancel'
                    }
                ]
            )
        }

    }

    render() {
        const {t, themeStyle, isTablet, customMainThemeColor, customBackgroundColor} = this.context
        const {handleSubmit, products, labels} = this.props


        return (
            <ThemeScrollView >
                <View style={[styles.fullWidthScreen]}>
                    <ScreenHeader title={t(!!this.state?.data ? 'inventoryOrder.editFormTitle' : 'inventoryOrder.newFormTitle')} />
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
                                    products={products}
                                    labels={labels}
                                    initialValues={this.state?.inventoryModalData}
                                    onSubmit={this.handleInventoryFormSubmit}
                                    handleUpdate={this.handleInventoryFormUpdate}
                                    handleCancel={() => this.setState({isShow: false})}
                                />
                            </View>
                        </View>
                    </Modal>
                    <View>
                        <View style={styles.tableRowContainerWithBorder}>
                            <View style={[styles.tableCellView, {flex: 1}]}>
                                <StyledText style={styles.fieldTitle}>{t('inventoryOrder.orderDate')}</StyledText>
                            </View>
                            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>


                                <Field
                                    name={`orderDate`}
                                    component={RenderDateTimePicker}
                                    onChange={() => {}}
                                    placeholder={t('inventoryOrder.orderDate')}
                                    isShow={this.state.isShowDatePicker ?? false}
                                    showDatepicker={() => this.setState({isShowDatePicker: !this.state?.isShowDatePicker})}

                                />

                            </View>
                        </View>

                        <View style={styles.tableRowContainerWithBorder}>
                            <View style={[styles.tableCellView, {flex: 1}]}>
                                <StyledText style={styles.fieldTitle}>{t('inventoryOrder.supplierId')}</StyledText>
                            </View>
                            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                                <Field
                                    name={`supplierId`}
                                    component={InputText}
                                    placeholder={t('inventoryOrder.supplierId')}
                                    secureTextEntry={false}
                                />

                            </View>
                        </View>

                        <View style={styles.tableRowContainerWithBorder}>
                            <View style={[styles.tableCellView, {flex: 1}]}>
                                <StyledText style={styles.fieldTitle}>{t('inventoryOrder.supplierOrderId')}</StyledText>
                            </View>
                            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                                <Field
                                    name={`supplierOrderId`}
                                    component={InputText}
                                    placeholder={t('inventoryOrder.supplierOrderId')}
                                    secureTextEntry={false}
                                />

                            </View>
                        </View>

                        {!this.state?.isProcessed ? <View style={[styles.tableRowContainer, {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
                            <TouchableOpacity onPress={() => {this.setState({inventoryModalData: null, isShow: true})}}>
                                <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                                    {t('inventory.addInventory')}
                                </Text>
                            </TouchableOpacity>
                            <StyledText style={styles.sectionTitleText}>{t('inventoryOrder.sku')}</StyledText>
                            <DeleteBtn handleDeleteAction={() => {this.setState({inventoryFormValues: []})}} text={t('inventory.deleteAllInventory')} />
                        </View> : <View style={[styles.paddBottom_30]} />}
                        {this.state?.inventoryFormValues?.length > 0 ?
                            <View style={styles.tableRowContainer}>
                                <CustomTable
                                    tableData={this.state?.inventoryFormValues}
                                    tableTopBar={[t('inventory.sku'), t('inventory.quantity'), t('order.unitPrice'),]}
                                    tableContent={['sku', 'quantity', 'unitPrice']}
                                    occupy={[1, 1, 1]}
                                    itemOnPress={(data, index) => this.handleItemPress(data, index)}
                                    moreActions={[(data, index) => this.handleItemPress(data, index), (data, index) => this.handleInventoryDelete(data, index)]}
                                />
                            </View>
                            :
                            <>
                                <View style={[styles.sectionTitleContainer]}>
                                    <StyledText style={[styles.searchNoDataBlock(customMainThemeColor)]}>
                                        {t('general.noData')}
                                        <AntDesignIcon name='unknowfile1' size={32} color={customMainThemeColor} />
                                    </StyledText>
                                </View>
                            </>
                        }


                    </View>
                    <View style={[styles.bottom, styles.horizontalMargin]}>
                        <TouchableOpacity onPress={handleSubmit(data => {
                            if (!this.state?.data)
                                this.handleSubmit(data)
                            else
                                this.handleUpdate(data)
                        })}>
                            <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                                {t('action.save')}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {this.props.navigation.goBack()}}
                        >
                            <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>
                                {t('action.cancel')}
                            </Text>
                        </TouchableOpacity>
                        {this.state?.data?.id ?
                            <View style={[styles?.flex_dir_row]}>

                                {!this.state.isProcessed ?
                                    <TouchableOpacity onPress={handleSubmit(() => {
                                        this.handleProcess(this.state.data.id)
                                    })}
                                        style={{flex: 1, marginRight: 10}}
                                    >
                                        <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                                            {t('inventory.process')}
                                        </Text>
                                    </TouchableOpacity> : null}
                                <TouchableOpacity onPress={handleSubmit(() => {
                                    this.handleCopy(this.state.data.id)

                                })}
                                    style={[this.state.isProcessed ? {flex: 2} : {flex: 1}]}
                                >
                                    <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                                        {t('inventory.copy')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            : null}

                        {this.state?.data && !this.state.isProcessed ?
                            <DeleteBtn handleDeleteAction={handleSubmit(() => {this.handleDelete(this.state.data.id)})} style={[this.state.isProcessed ? {flex: 1} : {flex: 2}]} />
                            : null}

                    </View>
                </View>
            </ThemeScrollView>
        )



    }
}

const mapStateToProps = state => ({
    isLoading: state.offers.loading,
    client: state.client.data,
    currentUser: state.clientuser.data,
    products: state.products.data.results,
    labels: state.labels.data.labels,
})

const mapDispatchToProps = dispatch => ({
    dispatch,
    getCurrentClient: () => dispatch(getCurrentClient()),
    getProducts: () => dispatch(getProducts()),
    getLables: () => dispatch(getLables())
})

InventoryOrderFormScreen = reduxForm({
    form: 'InventoryOrderForm'
})(InventoryOrderFormScreen)

export default connect(mapStateToProps, mapDispatchToProps)(InventoryOrderFormScreen)


class InventoryForm extends React.Component {
    static navigationOptions = {
        header: null
    }
    static contextType = LocaleContext

    constructor(props, context) {
        super(props, context)
        this.state = {
            products: props?.products,
            labels: props?.labels,
            openScanView: false,
            openProductView: false,
            searchKeyword: props?.initialValues?.sku ?? '',
            searching: false,
            searchResults: [],
            selectedSku: '',
            selectedSkuLabel: '',
            selectedSkuProduct: '',
            screenMode: 'SkuOnly',
            inventoryId: null,
            selectedToggleItems: new Map(),
            collapsedId: '',
            productId: null,
            selectedProductName: '',
            selectedProductInventory: null
        }

    }

    handleScanSuccess = (data) => {
        this.props?.change(`sku`, data)
        this.setState({openScanView: false})
    }

    searchSku = (keyword) => {
        if (keyword !== '') {
            this.setState({searching: true})

            dispatchFetchRequest(api.inventory.getByKeyword(keyword), {
                method: 'GET',
                withCredentials: true,
                credentials: 'include',
                headers: {}
            }, response => {
                response.json().then(data => {
                    this.setState({
                        searchResults: data.results,
                        searching: false,
                        searchKeyword: keyword,
                        inventoryId: null
                    })
                })
            }).then()
        } else {
            this.setState({
                searchResults: [],
                searching: false,
                searchKeyword: null
            })
        }

    }

    quickCreateProduct = (data) => {
        this.setState({selectedSku: data?.sku, selectedSkuProduct: data?.name})

        let request = {...data}
        dispatchFetchRequest(api.product.new, {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        }, response => {
            response.json().then(data => {
                console.log('quickCreate ', data)
                this.props?.change(`sku`, Object.keys(data?.inventory.inventoryQuantities)[0])
                this.props?.change(`inventoryId`, data?.inventory?.id)
                this.props?.change(`selectedSku`, Object.keys(data?.inventory.inventoryQuantities)[0])


                this.setState({searchResults: [], searchKeyword: Object.keys(data?.inventory?.inventoryQuantities)[0], screenMode: 'SkuOnly', inventoryId: data?.inventory?.id})
            })
        }).then()
    }

    Item = (item, isSearch = false) => {
        return (
            <View style={[styles.rowFront, isSearch && {borderBottomColor: this.contetx?.customMainThemeColor}]}>
                <TouchableOpacity
                    onPress={() => {
                        this.props?.change(`sku`, item?.sku)
                        this.props?.change(`inventoryId`, item?.inventoryId)
                        this.setState({searchResults: [], searchKeyword: item?.sku, inventoryId: item?.inventoryId, selectedSku: item?.sku, selectedSkuProduct: item?.productName, selectedSkuLabel: item?.skuName})
                    }}
                    style={{flexDirection: 'row', justifyContent: 'space-between'}}
                >
                    <StyledText style={styles.rowFrontText}>{item?.productName}-{item?.sku}{!!item?.skuName && `(${item?.skuName})`}</StyledText>

                </TouchableOpacity>
            </View >
        );
    }


    // existed product new sku

    onSelect = (id) => {
        const newSelected = new Map(this.state.selectedToggleItems);
        newSelected.set(id, !this.state.selectedToggleItems.get(id));
        this.setState({
            selectedToggleItems: newSelected
        })
    }

    handleCollapsed = id => {
        this.setState({collapsedId: id})
    }


    getInventory = (prdId) => {
        dispatchFetchRequestWithOption(
            api.inventory.getById(prdId),
            {
                method: 'GET',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            }, {
            defaultMessage: false,
            ignoreErrorMessage: true
        },
            response => {
                response.json().then(data => {
                    this.setState({selectedProductInventory: data})

                })
            },
            response => {
                this.setState({selectedProductInventory: null})
            }
        ).then()
    }

    addProductInventory = (value, prdId) => {
        this.setState({selectedSku: value?.sku, selectedSkuProduct: this.state?.selectedProductName, selectedSkuLabel: value?.name})
        let initUnit = value?.unitOfMeasure ?? 'EACH'
        let initUnitQuantity = values?.baseUnitQuantity ?? 1
        const request = {quantity: {...value, unitOfMeasure: initUnit, baseUnitQuantity: initUnitQuantity, quantity: 0, minimumStockLevel: 0}}
        dispatchFetchRequest(
            api.inventory.addQuantity(prdId),
            {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request)
            },
            response => {
                response.json().then(data => {
                    console.log('addInventory ', data)

                    this.props?.change(`sku`, Object.keys(data?.inventory?.inventoryQuantities)[0])
                    this.props?.change(`inventoryId`, data?.inventory?.id)
                    this.setState({screenMode: 'SkuOnly', inventoryId: data?.inventory?.id, selectedProductInventory: null})

                })
            }
        ).then()
    }
    addFirstInventory = (values, prdId) => {
        this.setState({selectedSku: values?.sku, selectedSkuProduct: this.state?.selectedProductName, selectedSkuLabel: values?.name})
        let initUnit = values?.unitOfMeasure ?? 'EACH'
        let initUnitQuantity = values?.baseUnitQuantity ?? 1
        const request = {
            productId: prdId,
            quantity: {...values, unitOfMeasure: initUnit, baseUnitQuantity: initUnitQuantity, quantity: 0, minimumStockLevel: 0}
        }
        dispatchFetchRequest(
            api.inventory.new,
            {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request)
            },
            response => {
                response.json().then(data => {
                    console.log('add fist Inventory ', data)
                    this.props?.change(`sku`, Object.keys(data?.inventoryQuantities)[0])
                    this.props?.change(`inventoryId`, data.id)
                    this.setState({screenMode: 'SkuOnly', inventoryId: data.id})
                })
            }
        ).then()
    }

    _renderSectionHeader = (item, index, isActive, isEmptyLabel) => {
        return (
            <TouchableOpacity
                style={{
                    backgroundColor: isActive ? "#ccc" : '',
                }}
                onPress={() => this.onSelect(item.id)}
            >
                <View style={[styles.productPanel, {borderColor: this.context?.customMainThemeColor, borderBottomWidth: 1}]}>
                    <View style={[styles.flex(1)]}>
                        <StyledText style={[styles.listPanelText]}>{item.label}</StyledText>
                    </View>
                    <View style={[styles.tableCellView, styles.flex(1), styles.justifyRight]}>
                        <AntDesignIcon name={this.state.selectedToggleItems.get(item.id) ? 'up' : 'down'} size={22} color="#ccc" />
                    </View>
                </View>
                {(isEmptyLabel && this.state.selectedToggleItems.get(item.id)) &&
                    <View style={[styles.productPanel]}>
                        <View style={[styles.flex(1)]}>
                            <StyledText style={[styles.listPanelText, {paddingLeft: 32}]}>({this?.context?.t('empty')})</StyledText>
                        </View>

                    </View>
                }
            </TouchableOpacity>
        );
    }

    ProductItem = ({item, index, isActive}) => {
        const map = this.props.products;

        let products = map[item.label]

        if (products == null) {
            products = map[item.id]
        }
        if (item.aType === 'LABEL') {
            return (
                <View>
                    {this._renderSectionHeader(item, index, isActive, (!products || products?.length === 0))}
                </View>
            );
        } else {
            let data = item
            return (
                (this.state.selectedToggleItems.get(item.productLabelId) ?
                    <View style={[styles.productPanel, {paddingLeft: 32}]} key={data.id}>
                        <TouchableOpacity style={styles.flex(1)}
                            onPress={() => {
                                this.setState({selectedProductName: item?.name, selectedSkuProduct: item?.name, productId: item?.id, openProductView: false})
                            }}>
                            <StyledText style={styles.listPanelText}>{data.name}</StyledText>
                        </TouchableOpacity>
                    </View>
                    : null)


            );
        }

    };


    render() {
        const {t, customMainThemeColor, customBackgroundColor} = this.context
        const {products, labels} = this.props

        var getlabels = labels !== undefined && labels

        let resultArr = []
        let labelIndexArr = []
        let productIndexArr = []
        let arrIndexCount = 0
        let emptyLabelArr = []
        getlabels.forEach((label) => {
            resultArr.push({...label, aType: 'LABEL'})
            labelIndexArr.push(arrIndexCount)
            arrIndexCount++
            if (this.props.products[label.label]?.length === 0) {
                emptyLabelArr.push(label.label)
            } else {
                this.props.products[label.label]?.forEach((product) => {
                    resultArr.push({...product, aType: 'PRODUCT'})
                    productIndexArr.push(arrIndexCount)
                    arrIndexCount++
                })
            }
        })
        resultArr.push({label: t('product.ungrouped'), id: 'ungrouped', aType: 'LABEL'})
        this.props.products?.ungrouped?.forEach((product) => {
            resultArr.push({...product, aType: 'PRODUCT', productLabelId: 'ungrouped'})
            productIndexArr.push(arrIndexCount)
            arrIndexCount++
        })


        if (this.state?.screenMode === 'SkuOnly') {
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
                            <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                                <View style={{flex: 1, }}>
                                    <SearchBar placeholder={t('inventory.searchSkuName')}
                                        onChangeText={text => this.searchSku(text)}
                                        onClear={() => {
                                            this.setState({searchResults: []})
                                        }}
                                        value={this.state.searchKeyword}
                                        showLoading={this.state.searching}
                                        lightTheme={false}
                                        // reset the container style.
                                        containerStyle={{
                                            padding: 2,
                                            borderRadius: 4,
                                            borderWidth: 0,
                                            borderTopWidth: 0,
                                            borderBottomWidth: 0,
                                            backgroundColor: customMainThemeColor
                                        }}
                                        inputStyle={{backgroundColor: customBackgroundColor}}
                                        inputContainerStyle={{borderRadius: 2, backgroundColor: customBackgroundColor}}
                                    />



                                </View>
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

                        {this.state.openScanView ? <View >
                            <ScanView successCallback={(data) => {this.handleScanSuccess(data)}} style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                borderRadius: 10,
                                paddingVertical: '10%',
                                alignItems: 'center'
                            }}
                                allType />
                        </View> : <FlatList
                                style={{maxHeight: 150, paddingBottom: 0, borderBottomColor: '#ccc'}}
                                numColumns={1}
                                data={this.state.searchResults}
                                renderItem={({item}) => this.Item(item, true)}
                                ListEmptyComponent={
                                    <>
                                        {!!this.state?.inventoryId || <View>
                                            <StyledText style={[styles.messageBlock, styles.paddingTopBtn20, styles.sectionTitleText]}>{t('general.noData')}</StyledText>
                                            <View style={{flexDirection: 'row', width: '100%'}}>
                                                <TouchableOpacity
                                                    style={{flex: 1, marginHorizontal: 10}}
                                                    onPress={() => {
                                                        this.props.change(`sku`, this.state?.searchKeyword)
                                                        this.setState({screenMode: 'existPrdSku'})
                                                    }}>
                                                    <Text
                                                        style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}
                                                    >
                                                        {t('inventory.addSkuByProduct')}
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={{flex: 1, marginHorizontal: 10}}
                                                    onPress={() => {
                                                        this.props.change(`sku`, this.state?.searchKeyword)
                                                        this.setState({screenMode: 'newPrdSku'})
                                                    }}>
                                                    <Text
                                                        style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}
                                                    >
                                                        {t('inventory.addNewProductAndSku')}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        }
                                    </>
                                }
                            />}

                        <View>
                            {this.state?.inventoryId ?

                                <StyledText style={[styles.messageBlock, styles.paddingTopBtn20, styles.sectionTitleText]}>
                                    {this.state.selectedSkuProduct} - {this.state.selectedSku} - {this.state.selectedSkuLabel}
                                </StyledText>
                                : null}
                        </View>
                        <View style={styles.tableRowContainerWithBorder}>
                            <View style={[styles.tableCellView, {flex: 1}]}>
                                <StyledText style={styles.fieldTitle}>{t('inventoryOrder.quantity')}</StyledText>
                            </View>
                            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                                <Field
                                    name="quantity"
                                    component={InputText}
                                    validate={[isRequired, isPositiveInteger]}
                                    placeholder={t('inventoryOrder.quantity')}
                                    keyboardType={`numeric`}
                                    props={t}
                                />
                            </View>
                        </View>
                        <View style={styles.tableRowContainerWithBorder}>
                            <View style={[styles.tableCellView, {flex: 1}]}>
                                <StyledText style={styles.fieldTitle}>{t('inventoryOrder.unitPrice')}</StyledText>
                            </View>
                            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                                <Field
                                    name="unitPrice"
                                    component={InputText}
                                    validate={[isRequired, isPositiveInteger]}
                                    placeholder={t('inventoryOrder.unitPrice')}
                                    keyboardType={`numeric`}
                                />
                            </View>
                        </View>

                        <View style={{
                            paddingVertical: 8,
                            paddingHorizontal: 10,
                        }}>

                            <TouchableOpacity onPress={this.props?.handleSubmit(data => {
                                if (!!this.state?.inventoryId) {
                                    if (!!this.props?.initialValues) {
                                        this.props?.handleUpdate(data, this.props?.initialValues?.dataIndex)
                                        this.props?.handleCancel()
                                    } else {
                                        this.props?.onSubmit(data)
                                        this.props?.reset()
                                        this.setState({searchResults: [], searchKeyword: null})
                                    }
                                }

                            })}>
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
        } else if (this.state?.screenMode === 'newPrdSku') {
            return (
                <ThemeKeyboardAwareScrollView>
                    <View style={{paddingTop: 15}}>
                        <ScreenHeader parentFullScreen={true}
                            title={!!this.props?.initialValues ? t('inventory.inventoryEditFormTitle') : t('inventory.inventoryNewFormTitle')}
                            backNavigation={false}
                        />

                        <View style={styles.tableRowContainerWithBorder}>
                            <View style={[styles.tableCellView, {flex: 1}]}>
                                <StyledText style={styles.fieldTitle}>{t('inventoryOrder.productName')}</StyledText>
                            </View>
                            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                                <Field
                                    name="name"
                                    component={InputText}
                                    validate={[isRequired]}
                                    placeholder={t('inventoryOrder.productName')}
                                />
                            </View>
                        </View>
                        <View style={styles.tableRowContainerWithBorder}>
                            <View style={[styles.tableCellView, {flex: 1}]}>
                                <StyledText style={styles.fieldTitle}>{t('product.price')}</StyledText>
                            </View>
                            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                                <Field
                                    name="price"
                                    component={InputText}
                                    validate={[isRequired]}
                                    placeholder={t('product.price')}
                                    keyboardType={`numeric`}
                                />
                            </View>
                        </View>
                        <View style={styles.tableRowContainerWithBorder}>
                            <View style={[styles.tableCellView, {flex: 1}]}>
                                <StyledText style={styles.fieldTitle}>{t('inventoryOrder.sku')}</StyledText>
                            </View>
                            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                                <Field
                                    name="sku"
                                    component={InputText}
                                    validate={[isRequired]}
                                    placeholder={t('inventoryOrder.sku')}
                                    keyboardType={`numeric`}
                                />
                            </View>
                        </View>


                        <View style={{
                            paddingVertical: 8,
                            paddingHorizontal: 10,
                            marginTop: 120
                        }}>

                            <TouchableOpacity onPress={this.props?.handleSubmit(data => {
                                this.quickCreateProduct(data)

                            })}>
                                <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                                    {t('action.save')}
                                </Text>
                            </TouchableOpacity>


                            <TouchableOpacity onPress={() => {this.setState({screenMode: 'SkuOnly'})}}>
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
        } else {
            return (
                <ThemeKeyboardAwareScrollView>
                    <View style={{paddingTop: 15}}>
                        <ScreenHeader parentFullScreen={true}
                            title={!!this.props?.initialValues ? t('inventory.inventoryEditFormTitle') : t('inventory.inventoryNewFormTitle')}
                            backNavigation={false}
                        />

                        <View style={styles.tableRowContainerWithBorder}>
                            <View style={[styles.tableCellView, {flex: 1}]}>
                                <StyledText style={styles.fieldTitle}>{t('inventoryOrder.productName')}</StyledText>
                            </View>
                            <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                                {this.state?.selectedProductName ? <Text style={[styles?.screenSubTitle(customMainThemeColor)]} onPress={() => this.setState({selectedProductName: '', openProductView: true})}>
                                    {this.state?.selectedProductName}
                                </Text>

                                    : <Text onPress={() => this.setState({openProductView: true})} style={{color: '#ccc'}}>
                                        {t('inventory.selectExistingProduct')}
                                    </Text>}
                            </View>
                        </View>

                        <View>
                            {!this.state?.selectedProductName && this.state?.openProductView ?
                                <FlatList
                                    style={{maxHeight: 150}}
                                    data={resultArr}
                                    renderItem={(item, index, isActive) => this.ProductItem(item, index, isActive)}
                                />
                                : null}

                        </View>
                        <View style={styles.tableRowContainerWithBorder}>
                            <View style={[styles.tableCellView, {flex: 1}]}>
                                <StyledText style={styles.fieldTitle}>{t('inventory.sku')}</StyledText>
                            </View>
                            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                                <Field
                                    name="sku"
                                    component={InputText}
                                    validate={[isRequired]}
                                    placeholder={t('inventory.sku')}
                                    keyboardType={`numeric`}
                                />
                            </View>
                        </View>
                        <View style={styles.tableRowContainerWithBorder}>
                            <View style={[styles.tableCellView, {flex: 1}]}>
                                <StyledText style={styles.fieldTitle}>{t('inventory.labelName')}</StyledText>
                            </View>
                            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                                <Field
                                    name="name"
                                    component={InputText}
                                    placeholder={t('inventory.labelName')}
                                    keyboardType={`numeric`}
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
                                    placeholder={t('inventory.unitOfMeasureDefault')}
                                    keyboardType={`numeric`}
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
                                    placeholder={t('inventory.baseUnitQuantityDefault')}
                                    keyboardType={`numeric`}
                                />
                            </View>
                        </View>

                        <View style={{
                            paddingVertical: 8,
                            paddingHorizontal: 10
                        }}>

                            <TouchableOpacity onPress={this.props?.handleSubmit(data => {

                                this.getInventory(this.state.productId)

                                if (!!this.state?.selectedProductInventory) {
                                    this.addProductInventory(data, this.state.productId)

                                } else {
                                    this.addFirstInventory(data, this.state.productId)

                                }
                            })}>
                                <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                                    {t('action.save')}
                                </Text>
                            </TouchableOpacity>


                            <TouchableOpacity onPress={() => {this.setState({screenMode: 'SkuOnly'})}}>
                                <Text
                                    style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}
                                >
                                    {t('action.cancel')}
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ThemeKeyboardAwareScrollView >
            )
        }

    }
}

InventoryForm = reduxForm({
    form: 'inventoryForm_order'
})(InventoryForm)

import React, {useEffect} from 'react'
import {Field, FieldArray, reduxForm} from 'redux-form'
import {Text, TouchableOpacity, View, FlatList, Alert} from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import InputText from '../components/InputText'
import RNSwitch from '../components/RNSwitch'
import styles from '../styles'
import IonIcon from 'react-native-vector-icons/Ionicons'
import {isRequired} from '../validators'
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
                    this.props.navigation.goBack()
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
        this.setState({inventoryModalData: {...data, dataIndex: index}, isShow: true})
    }

    handleInventoryDelete = (data, index) => {
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

    }

    render() {
        const {t, themeStyle, isTablet, customMainThemeColor, customBackgroundColor} = this.context
        const {handleSubmit} = this.props




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
                                    name="supplierId"
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
                                    name="supplierOrderId"
                                    component={InputText}
                                    placeholder={t('inventoryOrder.supplierOrderId')}
                                    secureTextEntry={false}
                                />

                            </View>
                        </View>

                        <View style={[styles.tableRowContainer, {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
                            <TouchableOpacity onPress={() => {this.setState({inventoryModalData: null, isShow: true})}}>
                                <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                                    {t('inventory.addInventory')}
                                </Text>
                            </TouchableOpacity>
                            <StyledText style={styles.sectionTitleText}>{t('inventoryOrder.sku')}</StyledText>
                            <DeleteBtn handleDeleteAction={() => {this.setState({inventoryFormValues: []})}} text={t('inventory.deleteAllInventory')} />

                        </View>
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
                                <View style={styles.sectionTitleContainer}>
                                    <StyledText >{t('general.noData')}</StyledText>
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
})

const mapDispatchToProps = dispatch => ({
    dispatch,
    getCurrentClient: () => dispatch(getCurrentClient())
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
            openScanView: false,
            searchKeyword: props?.initialValues?.sku ?? '',
            searching: false,
            searchResults: [],
            screenMode: 'SkuOnly',
            inventoryId: null
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
            })
        }

    }

    quickCreateProduct = (data) => {
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
                this.props?.change(`sku`, Object.keys(data?.inventory?.inventoryQuantities)[0])
                this.props?.change(`inventoryId`, data?.inventory?.id)
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
                        this.setState({searchResults: [], searchKeyword: item?.sku, inventoryId: item?.inventoryId})
                    }}
                    style={{flexDirection: 'row', justifyContent: 'space-between'}}
                >
                    <StyledText style={styles.rowFrontText}>{item?.productName}-{item?.sku}{!!item?.skuName && `(${item?.skuName})`}</StyledText>

                </TouchableOpacity>
            </View >
        );
    }

    render() {
        const {t, customMainThemeColor, customBackgroundColor} = this.context


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
                            <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-end'}]}>
                                <View style={{flex: 1, }}>
                                    <SearchBar placeholder={t('inventory.sku')}
                                        onChangeText={this.searchSku}
                                        onClear={() => {
                                            this.setState({searchResults: []})
                                        }}
                                        value={this.state.searchKeyword}
                                        showLoading={this.state.searching}
                                        lightTheme={false}
                                        // reset the container style.
                                        containerStyle={{
                                            padding: 4,
                                            borderRadius: 0,
                                            borderWidth: 0,
                                            borderTopWidth: 0,
                                            borderBottomWidth: 0,
                                            backgroundColor: customMainThemeColor
                                        }}
                                        inputStyle={{backgroundColor: customBackgroundColor}}
                                        inputContainerStyle={{borderRadius: 0, backgroundColor: customBackgroundColor}}
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
                                style={{height: 150, paddingBottom: 1}}
                                data={this.state.searchResults}
                                renderItem={({item}) => this.Item(item, true)}
                                ListEmptyComponent={
                                    <>
                                        {!!this.state?.inventoryId || <View>
                                            <StyledText style={styles.messageBlock}>{t('general.noData')}</StyledText>
                                            <View style={{flexDirection: 'row', width: '100%'}}>
                                                <TouchableOpacity
                                                    style={{flex: 1, marginHorizontal: 10}}
                                                    onPress={() => {}}>
                                                    <Text
                                                        style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}
                                                    >
                                                        {'從現有產品裡新增一筆Sku'}
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
                                                        {'新增新產品與一筆Sku'}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>}
                                    </>
                                }
                            />}


                        <View style={styles.tableRowContainerWithBorder}>
                            <View style={[styles.tableCellView, {flex: 1}]}>
                                <StyledText style={styles.fieldTitle}>{t('inventory.quantity')}</StyledText>
                            </View>
                            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                                <Field
                                    name="quantity"
                                    component={InputText}
                                    validate={[isRequired]}
                                    placeholder={t('inventory.quantity')}
                                    keyboardType={`numeric`}
                                    props={t}
                                />
                            </View>
                        </View>
                        <View style={styles.tableRowContainerWithBorder}>
                            <View style={[styles.tableCellView, {flex: 1}]}>
                                <StyledText style={styles.fieldTitle}>{t('order.unitPrice')}</StyledText>
                            </View>
                            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                                <Field
                                    name="unitPrice"
                                    component={InputText}
                                    validate={[isRequired]}
                                    placeholder={t('order.unitPrice')}
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
                                <StyledText style={styles.fieldTitle}>{t('inventoryOrder.price')}</StyledText>
                            </View>
                            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                                <Field
                                    name="price"
                                    component={InputText}
                                    validate={[isRequired]}
                                    placeholder={t('inventoryOrder.price')}
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
                                <StyledText style={styles.fieldTitle}>{t('inventoryOrder.price')}</StyledText>
                            </View>
                            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                                <Field
                                    name="price"
                                    component={InputText}
                                    validate={[isRequired]}
                                    placeholder={t('inventoryOrder.price')}
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
                                    placeholder={t('order.unitPrice')}
                                    keyboardType={`numeric`}
                                />
                            </View>
                        </View>


                        <View style={{
                            paddingVertical: 8,
                            paddingHorizontal: 10
                        }}>

                            <TouchableOpacity onPress={this.props?.handleSubmit(data => {
                                if (!!this.props?.initialValues) {
                                    this.props?.handleUpdate(data, this.props?.initialValues?.dataIndex)
                                    this.props?.handleCancel()
                                } else {
                                    this.props?.onSubmit(data)
                                    this.props?.reset()
                                    this.setState({searchResults: [], searchKeyword: null})
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
        }

    }
}

InventoryForm = reduxForm({
    form: 'inventoryForm_order'
})(InventoryForm)

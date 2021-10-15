import React, {useState, useEffect, Component, useContext} from "react";
import {Field, reduxForm} from 'redux-form'
import {connect} from 'react-redux'
import {Alert, Text, View, TouchableOpacity, KeyboardAvoidingView, ScrollView} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'
import TableRenderCheckboxGroup from '../components/TableRenderCheckboxGroup'
import {isRequired} from '../validators'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import {StyledText} from "../components/StyledText";
import {api, dispatchFetchRequest, successMessage} from '../constants/Backend'
import {getTablesAvailable, getTableLayouts, getOrder} from '../actions'
import LoadingScreen from "./LoadingScreen";
import BackendErrorScreen from "./BackendErrorScreen";
import Modal from 'react-native-modal';


const OrderItemMoveTableModal = (props) => {
    const {customMainThemeColor} = useContext(LocaleContext);
    const [tableModalVisible, setTableModalVisible] = useState(props?.tableModalVisible ?? false);

    useEffect(() => {
        setTableModalVisible(props?.tableModalVisible ?? false);
    }, [props?.tableModalVisible]);

    return (
        <Modal
            isVisible={tableModalVisible}
            backdropOpacity={0.5}
            onBackdropPress={() => props.toggleModal(false)}
            animationIn='fadeInDown'
            animationOut='fadeOutUp'
            useNativeDriver
            hideModalContentWhileAnimating
        >
            <View style={{
                borderRadius: 10,
                width: '100%',
                height: '90%',
                marginTop: 53,
                justifyContent: 'center',
                marginBottom: 53,
                alignSelf: 'center',
            }}>
                <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={0}>
                    <ConnectedMoveTable
                        navigation={props.navigation}
                        route={props.route}
                        toggleModal={props.toggleModal}
                        reset={props.reset}
                        modalData={props?.data}
                    />
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

class ConnectedMoveTableBase extends React.Component {
    static navigationOptions = {
        header: null
    }
    static contextType = LocaleContext

    constructor(props, context) {
        super(props, context)
    }

    componentDidMount() {
        this.props.getTablesAvailable()
        this.props.getTableLayouts()
    }

    handleSubmit = values => {
        const orderId = this.props.route.params.orderId

        const newTable = !!values.tableInfo && values.tableInfo.find(value => typeof value === 'object')

        let request = {
            lineItemIds: values.lineItemIds,
            tableId: newTable.tableId
        }
        Alert.alert(
            `${this.context.t('orderForm.moveSelectedLineItems', {tableName: newTable.tableName})}`,
            ``,
            [
                {
                    text: `${this.context.t('action.yes')}`,
                    onPress: () => {
                        dispatchFetchRequest(api.order.moveLineItems(orderId), {
                            method: 'POST',
                            withCredentials: true,
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(request)
                        }, response => {
                            response.json().then(data => {
                                this.props.navigation.navigate('OrderFormII', {
                                    orderId: data.orderId
                                })
                                this.props.getOrder(data.orderId)
                                this.props.reset()
                            })
                        }).then()
                    }
                },
                {
                    text: `${this.context.t('action.no')}`,
                    onPress: () => {},
                    style: 'cancel'
                }
            ]
        )
    }


    render() {
        const {availableTables, tableLayouts, haveError, isLoading, toggleModal} = this.props

        const initialValues = {
            lineItemIds: this.props?.modalData,
        }
        if (isLoading) {
            return (
                <LoadingScreen />
            )
        } else if (haveError) {
            return (
                <BackendErrorScreen />
            )
        }
        return (
            <MoveTableList
                onSubmit={this.handleSubmit}
                availableTables={availableTables}
                tableLayouts={tableLayouts}
                initialValues={initialValues}
                toggleModal={toggleModal}
            />
        )
    }
}

const mapStateToProps = state => ({
    tableLayouts: state.tablelayouts.data.tableLayouts,
    availableTables: state.tablesavailable.data.availableTables,
    haveData: state.tablesavailable.haveData || state.tablelayouts.haveData,
    haveError: state.tablesavailable.haveError,
    isLoading: state.tablesavailable.loading || state.tablelayouts.loading,
})

const mapDispatchToProps = (dispatch, props) => ({
    dispatch,
    getTableLayouts: () => dispatch(getTableLayouts()),
    getOrder: (orderId) => dispatch(getOrder(orderId)),
    getTablesAvailable: () => dispatch(getTablesAvailable()),
})

const ConnectedMoveTable = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedMoveTableBase)

class MoveTableList extends React.Component {
    static navigationOptions = {
        header: null
    }
    static contextType = LocaleContext

    constructor(props, context) {
        super(props, context)
    }

    render() {
        const {availableTables, tableLayouts} = this.props
        const {t, themeStyle, customMainThemeColor, customBackgroundColor, complexTheme} = this.context

        return (
            <View style={{height: '100%'}}>
                <View style={[styles.customBorderAndBackgroundColor(this.context), {maxWidth: 540, alignSelf: 'center', minHeight: 620, maxHeight: '70%', width: '100%', borderRadius: 16, paddingHorizontal: 8}]}>
                    <View style={[styles.tableRowContainer, styles.dynamicVerticalPadding(24), {justifyContent: 'center'}]}>
                        <StyledText style={[styles?.announcementTitle(customMainThemeColor)]}>{t('orderForm.selectTargetTable')}</StyledText>
                        <TouchableOpacity style={{position: 'absolute', right: 10, top: 8, zIndex: 100}}
                            onPress={() => this.props?.toggleModal(false)}
                        >
                            <Icon name="close" size={32} color={customMainThemeColor} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={{maxHeight: 480}}>
                        <View>
                            {!tableLayouts && (
                                <View style={[styles.sectionContent]}>
                                    <View style={[styles.jc_alignIem_center]}>
                                        <StyledText>({t('empty')})</StyledText>
                                    </View>
                                </View>
                            )}

                            {tableLayouts?.map((layout, layoutIndex) => {
                                return (
                                    <View key={layoutIndex}>
                                        <View style={[complexTheme.shade, {flex: 1, marginTop: 12, height: 36, alignItems: 'center', justifyContent: 'center'}]}>
                                            <StyledText style={{fontSize: 18, }}>{layout.layoutName}</StyledText>
                                        </View>

                                        <Field
                                            name={`tableInfo`}
                                            component={TableRenderCheckboxGroup}
                                            customarr={tableLayouts?.[layoutIndex]?.tables}
                                            limitOne={true}
                                            validate={[isRequired]}
                                        />
                                    </View>
                                )
                            })
                            }

                        </View>
                    </ScrollView>
                    <View style={[styles.bottom]}>
                        <TouchableOpacity onPress={this.props.handleSubmit}
                            style={[styles.dynamicHorizontalPadding(12)]}>
                            <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                                {t('action.save')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

MoveTableList = reduxForm({
    form: 'MoveTableList'
})(MoveTableList)



export default OrderItemMoveTableModal;
import React from 'react'
import {FlatList, Text, TouchableOpacity, View} from 'react-native'
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import {formatDate, getOrdersByDateRange, getOrdersByInvoiceNumber, formatCurrency} from '../actions'
import {ListItem} from 'react-native-elements'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import {renderOrderState} from "../helpers/orderActions";
import ScreenHeader from "../components/ScreenHeader";
import OrderFilterForm from './OrderFilterForm'
import LoadingScreen from "./LoadingScreen";
import moment from "moment";
import DateTimeFilterControlledForm from './DateTimeFilterControlledForm'
import {ThemeContainer} from "../components/ThemeContainer";
import {compose} from "redux";
import {withContext} from "../helpers/contextHelper";
import {StyledText} from "../components/StyledText";
import BackendErrorScreen from "./BackendErrorScreen";
import {Octicons} from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import AddBtn from '../components/AddBtn'
import {api, dispatchFetchRequest, successMessage, dispatchFetchRequestWithOption} from '../constants/Backend'


class InventoryOrderScreen extends React.Component {
    handleViewRef = ref => this.view = ref;
    static navigationOptions = {
        header: null
    }
    static contextType = LocaleContext

    constructor(props, context) {
        super(props, context)

        this.state = {
            scrollPosition: 0,
            searchFilter: {
                searchTypeIndex: 0,
                tableName: null,
                dateRange: 0,
                shiftId: null,
                fromDate: new Date(),
                toDate: new Date(),
                invoiceNumber: null,
                showFilter: false
            },
            selectedStatusOptions: new Set(['OPEN', 'IN_PROCESS', 'DELIVERED', 'SETTLED', 'COMPLETED', 'DELETED', 'CANCELLED', 'PAYMENT_IN_PROCESS']),
            inventoryOrdersData: []
        }

    }

    componentDidMount() {
        this.props.getOrdersByDateRange()
        this.getInventoryOrders()
        this._getInventoryOrders = this.props.navigation.addListener('focus', () => {
            this.getInventoryOrders()
        })
    }
    componentWillUnmount() {
        this._getInventoryOrders()
    }

    getInventoryOrders = () => {
        dispatchFetchRequestWithOption(
            api.inventoryOrders.new,
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
                    console.log('getInventoryOrders', JSON.stringify(data))
                    this.setState({inventoryOrdersData: data?.results})
                })
            },
            response => {
            }
        ).then()
    }

    upButtonHandler = () => {
        //OnCLick of Up button we scrolled the list to top
        if (this.ListView_Ref != null) {
            this.ListView_Ref?.scrollToOffset({offset: 0, animated: true})
        }
    }

    keyExtractor = (order, index) => index.toString()

    handleOrderSearch = values => {
        const rangeTypeMapping = ['SHIFT', 'TODAY', 'RANGE', 'RANGE', 'RANGE']
        const searchTypeIndex = values?.searchTypeIndex ?? 0
        if (searchTypeIndex === 0) {
            const tableName = values?.tableName ?? null
            const dateRange = (typeof (values?.dateRange) === 'number') ? rangeTypeMapping?.[values.dateRange] : (values.dateRange != null ? values.dateRange : 'SHIFT')
            const shiftId = values.shiftId != null ? values.shiftId : null
            const fromDate = moment(values.fromDate).format("YYYY-MM-DDTHH:mm:ss")
            const toDate = moment(values.toDate).format("YYYY-MM-DDTHH:mm:ss")

            this.setState({
                searchFilter: {
                    ...this.state.searchFilter,
                    searchTypeIndex: searchTypeIndex,
                    tableName: tableName,
                    dateRange: values.dateRange,
                    shiftId: shiftId,
                    fromDate: values.fromDate,
                    toDate: values.toDate
                }
            })

            this.props.getOrdersByDateRange(dateRange, shiftId, fromDate, toDate, tableName)
        } else {
            const invoiceNumber = values?.invoiceNumber ?? null
            this.setState({
                searchFilter: {
                    ...this.state.searchFilter,
                    searchTypeIndex: searchTypeIndex,
                    invoiceNumber: invoiceNumber
                }
            })
            this.props.getOrdersByInvoiceNumber(invoiceNumber)
        }
    }

    renderItem = ({item}) => (
        <ListItem
            key={item.orderId}
            onPress={() =>
                this.props.navigation.navigate('InventoryOrderFormScreen', {
                    data: item
                })
            }
            bottomDivider
            containerStyle={[styles.dynamicVerticalPadding(12), {padding: 0, backgroundColor: this.props.themeStyle.backgroundColor}, styles?.customBorderAndBackgroundColor(this.context)]}
        >
          <View style={[styles.tableRowContainer]}>
            <View style={[styles.tableCellView, {flex: 3}]}>
              <StyledText>{item.id}</StyledText>
            </View>
            <View style={[styles.tableCellView, {flex: 2}]}>
              <StyledText>{item?.supplierOrderId}</StyledText>
            </View>
            <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
              <StyledText>{formatDate(item?.orderDate)}</StyledText>
            </View>

          </View>
        </ListItem>
    )

    //https://stackoverflow.com/questions/48061234/how-to-keep-scroll-position-using-flatlist-when-navigating-back-in-react-native
    handleScroll = event => {
        if (this.ListView_Ref != null) {
            this.setState({scrollPosition: event.nativeEvent.contentOffset.y})
        }
    }

    bounce = (showFilter) => {
        this.setState({showFilter: true}, () => {
            if (showFilter) {
                this.view.fadeOutUp(100).then(endState => this.setState({showFilter: false}))
            } else {
                this.view.fadeInDown(200).then(endState => this.setState({showFilter: true}))
            }
        })
    }

    render() {
        const {getordersByDateRange, dateRange, isLoading, haveError, haveData, getordersByDateRangeFullData} = this.props
        const {t, customMainThemeColor} = this.context

        const orders = []
        getordersByDateRange !== undefined && getordersByDateRange.forEach(order => {
            if (this.state?.searchTypeIndex === 1) {
                orders.push(order)
            } else if (this.state?.selectedStatusOptions.has(order?.state)) {
                orders.push(order)
            } else {

            }

        })



        if (isLoading) {
            return (
                <LoadingScreen />
            )
        } else if (haveError) {
            return (
                <BackendErrorScreen />
            )
        } else if (haveData) {
            return (
                <ThemeContainer>
                    <View style={[styles.fullWidthScreen]}>
                        <ScreenHeader backNavigation={true}
                            parentFullScreen={true}
                            title={t('inventory.title')}
                            rightComponent={
                                <AddBtn
                                    onPress={() =>
                                        this.props.navigation.navigate('InventoryOrderFormScreen')
                                    }
                                />
                            }
                        />



                        <View style={{flex: 3}}>
                            <View style={[styles.sectionBar]}>
                                <View style={{flex: 3}}>
                                    <Text style={styles?.sectionBarTextSmall(customMainThemeColor)}>{t('inventoryOrder.supplierOrderId')}</Text>
                                </View>

                                <View style={{flex: 2}}>
                                    <Text style={styles?.sectionBarTextSmall(customMainThemeColor)}>{t('inventoryOrder.supplierId')}</Text>
                                </View>

                                <View style={{flex: 3}}>
                                    <Text style={[styles?.sectionBarTextSmall(customMainThemeColor), {textAlign: 'right'}]}>{t('inventoryOrder.orderDate')}</Text>
                                </View>


                            </View>
                            <FlatList
                                keyExtractor={this.keyExtractor}
                                data={this.state?.inventoryOrdersData}
                                renderItem={this.renderItem}
                                ListEmptyComponent={
                                    <View>
                                        <StyledText style={styles.messageBlock}>{t('order.noOrder')}</StyledText>
                                    </View>
                                }
                                ref={ref => {
                                    this.ListView_Ref = ref
                                }}
                                onScroll={this.handleScroll}
                            />

                            {this.state.scrollPosition > 0 ? (
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    onPress={this.upButtonHandler}
                                    style={styles.upButton}
                                >
                                    <Icon
                                        name={'arrow-up'}
                                        size={32}
                                        style={[styles?.buttonIconStyle(customMainThemeColor), {marginRight: 10}]}
                                    />
                                </TouchableOpacity>
                            ) : null}
                        </View>
                    </View>
                </ThemeContainer>
            )
        } else {
            return null
        }
    }
}

const mapStateToProps = state => ({
    getordersByDateRange: state.ordersbydaterange.data.orders,
    getordersByDateRangeFullData: state.ordersbydaterange.data,
    dateRange: state.ordersbydaterange.data.dateRange,
    haveData: state.ordersbydaterange.haveData,
    haveError: state.ordersbydaterange.haveError,
    isLoading: state.ordersbydaterange.loading
})
const mapDispatchToProps = (dispatch, props) => ({
    dispatch,
    getOrdersByDateRange: (dateRange, shiftId, fromDate, toDate, tableName) => dispatch(getOrdersByDateRange(dateRange, shiftId, fromDate, toDate, tableName)),
    getOrdersByInvoiceNumber: (invoiceNumber) => dispatch(getOrdersByInvoiceNumber(invoiceNumber))
})

const enhance = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withContext
)
export default enhance(InventoryOrderScreen)

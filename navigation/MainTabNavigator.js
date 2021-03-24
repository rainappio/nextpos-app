import React from 'react'
import {Platform} from 'react-native'
import NavigationService from "../navigation/NavigationService";
import {createStackNavigator} from 'react-navigation-stack'
import {createBottomTabNavigator} from 'react-navigation-tabs'
import {createSwitchNavigator, StackActions} from 'react-navigation'
import TabBarIcon from '../components/TabBarIcon'
import HomeScreen from '../screens/HomeScreen'
import SettingsScreen from '../screens/SettingsScreen'
import IntroAppScreen from '../screens/IntroAppScreen'
import CreateAccScreen from '../screens/CreateAccScreen'
import Login from '../screens/Login'
import LoginSuccessScreen from '../screens/LoginSuccessScreen'
import ProductListScreen from '../screens/ProductListScreen'
import ProductFormScreen from '../screens/ProductFormScreen'
import Product from '../screens/Product'
import ProductEditScreen from '../screens/ProductEditScreen'
import Category from '../screens/Category'
import ProductsOverview from '../screens/ProductsOverview'
import ClientUsers from '../screens/ClientUsers'
import ClientUserLogin from '../screens/ClientUserLogin'
import ClockIn from '../screens/ClockIn'
import StaffsOverview from '../screens/StaffsOverview'
import StaffEditScreen from '../screens/StaffEditScreen'
import Staff from '../screens/Staff'
import TablesScreen from '../screens/TablesScreen'
import OrdersScreen from '../screens/OrdersScreen'
import ReportsScreen from '../screens/ReportsScreen'
import CategoryCustomize from '../screens/CategoryCustomize'
import LoginScreen from '../screens/LoginScreen'
import OptionFormScreen from '../screens/OptionFormScreen'
import Option from '../screens/Option'
import AccountScreen from '../screens/AccountScreen'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import Colors from '../constants/Colors'
import OrderStart from '../screens/OrderStart'
import OrderForm from '../screens/OrderForm'
import OrderFormII from '../screens/OrderFormII'
import OrderFormIII from '../screens/OrderFormIII'
import OrderFormIV from '../screens/OrderFormIV'
import OrdersSummary from '../screens/OrdersSummary'
import Store from '../screens/Store'
import OptionEdit from '../screens/OptionEdit'
import PrinternKDS from '../screens/PrinternKDS'
import PrinterAdd from '../screens/PrinterAdd'
import PrinterEdit from '../screens/PrinterEdit'
import WorkingAreaAdd from '../screens/WorkingAreaAdd'
import WorkingAreaEdit from '../screens/WorkingAreaEdit'
import ShiftClose from '../screens/ShiftClose'
import TableLayouts from '../screens/TableLayouts'
import TableLayoutEdit from '../screens/TableLayoutEdit'
import TableLayoutAdd from '../screens/TableLayoutAdd'
import TableAdd from '../screens/TableAdd'
import TableEdit from '../screens/TableEdit'
import Payment from '../screens/Payment'
import PaymentOrder from '../screens/PaymentOrder'
import CheckoutComplete from '../screens/CheckoutComplete'
import SalesCharts from '../screens/SalesCharts'
import OrderDetail from '../screens/OrderDetail'
import Announcements from '../screens/Announcements'
import AnnouncementsAdd from '../screens/AnnouncementsAdd'
import AnnouncementsEdit from '../screens/AnnouncementsEdit'
import PasswordReset from '../screens/PasswordReset'
import StaffTimeCard from '../screens/StaffTimeCard'
import UserTimeCards from '../screens/UserTimeCards'
import CloseComplete from '../screens/CloseComplete'
import AccountClose from '../screens/AccountClose'
import AccountCloseConfirm from '../screens/AccountCloseConfirm'
import CustomerStats from "../screens/CustomerStats";
import ShiftHistory from "../screens/ShiftHistory";
import ShiftDetails from "../screens/ShiftDetails";
import {getToken} from "../constants/Backend";
import ManageVisualSceen from '../screens/ManageVisualSceen'
import UpdateOrder from "../screens/UpdateOrder";
import EditUserRole from '../screens/EditUserRole'
import NewUserRole from '../screens/NewUserRole'
import ManageUserRole from '../screens/ManageUserRole'
import ManageOffers from '../screens/ManageOffers'
import EinvoiceSettingScreen from '../screens/EinvoiceSettingScreen'
import EinvoiceStatusScreen from '../screens/EinvoiceStatusScreen'
import EinvoiceEditScreen from '../screens/EinvoiceEditScreen'
import NewOffer from '../screens/NewOffer'
import EditOffer from '../screens/EditOffer'
import ProductsOverviewforOffer from '../screens/ProductsOverviewforOffer'
import TabBarBottom from "react-navigation-tabs/src/views/BottomTabBar";
import OrderDisplayScreen from "../screens/OrderDisplayScreen";
import ResetClientPassword from "../screens/ResetClientPassword";
import SpiltBillScreen from "../screens/SpiltBillScreen";
import SplitBillByHeadScreen from "../screens/SplitBillByHeadScreen";
import SubscriptionScreen from '../screens/SubscriptionScreen'
import RostersFormScreen from '../screens/RostersFormScreen'
import CalendarScreen from '../screens/CalendarScreen'
import MemberScreen from '../screens/MemberScreen'
import MemberFormScreen from '../screens/MemberFormScreen'
import RetailOrderForm from '../screens/RetailOrderForm'
import RetailCheckoutComplete from '../screens/RetailCheckoutComplete'
import InventoryScreen from '../screens/InventoryScreen'
import InventoryOrderScreen from '../screens/InventoryOrderScreen'
import InventoryOrderFormScreen from '../screens/InventoryOrderFormScreen'

const Home = createStackNavigator({
  LoginSuccess: LoginSuccessScreen,
  ClientUsers: ClientUsers,
  ClientUserLogin: ClientUserLogin,
  ClockIn: ClockIn,
  PasswordReset: PasswordReset,
  RetailOrderStart: OrderStart,
  RetailOrderForm: RetailOrderForm,
  RetailOrderFormIII: OrderFormIII,
  RetailPayment: Payment,
  RetailCheckoutComplete: RetailCheckoutComplete,
  RetailOrdersSummary: OrdersSummary,
  RetailPaymentOrder: PaymentOrder,
})
Home.navigationOptions = ({screenProps: {t}}) => ({
  title: t('menu.home'),

  tabBarButtonComponent: (props) => (
    <TabBarIcon focused={props?.focused} name={'md-home'} onPress={props?.onPress} />
  ),
})

const Settings = createStackNavigator({
  SettingScr: SettingsScreen,
  Account: AccountScreen,
  Store: Store,
  ProductList: ProductListScreen,
  ProductForm: ProductFormScreen,
  Product: Product,
  ProductEdit: ProductEditScreen,
  ProductsOverview: ProductsOverview,
  Staff: Staff,
  StaffEdit: StaffEditScreen,
  StaffsOverview: StaffsOverview,
  OptionScreen: OptionFormScreen,
  Option: Option,
  OptionEdit: OptionEdit,
  Category: Category,
  CategoryCustomize: CategoryCustomize,
  PrinternKDS: PrinternKDS,
  PrinterAdd: PrinterAdd,
  PrinterEdit: PrinterEdit,
  WorkingAreaAdd: WorkingAreaAdd,
  WorkingAreaEdit: WorkingAreaEdit,
  ShiftClose: ShiftClose,
  TableLayouts: TableLayouts,
  TableLayoutAdd: TableLayoutAdd,
  TableLayoutEdit: TableLayoutEdit,
  TableAdd: TableAdd,
  TableEdit: TableEdit,
  Announcements: Announcements,
  AnnouncementsAdd: AnnouncementsAdd,
  AnnouncementsEdit: AnnouncementsEdit,
  CloseComplete: CloseComplete,
  AccountClose: AccountClose,
  AccountCloseConfirm: AccountCloseConfirm,
  ManageVisualSceen: ManageVisualSceen,
  EditUserRole: EditUserRole,
  NewUserRole: NewUserRole,
  ManageUserRole: ManageUserRole,
  ManageOffers: ManageOffers,
  EinvoiceSettingScreen: EinvoiceSettingScreen,
  EinvoiceStatusScreen: EinvoiceStatusScreen,
  EinvoiceEditScreen: EinvoiceEditScreen,
  NewOffer: NewOffer,
  EditOffer: EditOffer,
  ProductsOverviewforOffer: ProductsOverviewforOffer,
  SubscriptionScreen: SubscriptionScreen,
  MemberScreen: MemberScreen,
  MemberFormScreen: MemberFormScreen
})
Settings.navigationOptions = ({screenProps: {t}}) => ({
  title: t('menu.settings'),
  tabBarButtonComponent: (props) => (
    <TabBarIcon focused={props?.focused} name={Platform.OS === 'ios' ? 'ios-settings' : 'md-settings'} onPress={props?.onPress} />
  ),

})

const Tables = createStackNavigator({
  TablesSrc: TablesScreen,
  OrderDisplayScreen: OrderDisplayScreen,
  OrderStart: OrderStart,
  NewOrderForm: OrderForm,
  OrderFormII: OrderFormII,
  OrderFormIII: OrderFormIII,
  OrderFormIV: OrderFormIV,
  OrdersSummary: OrdersSummary,
  UpdateOrder: UpdateOrder,
  Payment: Payment,
  PaymentOrder: PaymentOrder,
  CheckoutComplete: CheckoutComplete,
  SpiltBillScreen: SpiltBillScreen,
  SplitBillByHeadScreen: SplitBillByHeadScreen,
}, {
  defaultNavigationOptions: {
    gesturesEnabled: false,
  },
})
Tables.navigationOptions = ({screenProps: {t, appType}}) => ({
  title: t('menu.tables'),
  tabBarButtonComponent: (props) => (appType === 'store' ?
    <TabBarIcon focused={props?.focused} name="md-people" onPress={props?.onPress} />
    : null
  ),
})

const Orders = createStackNavigator({
  OrdersScr: OrdersScreen,
  OrderDetail: OrderDetail,
  UpdateOrderFromOrderDetail: UpdateOrder,
  NewOrderForm: OrderForm
})
Orders.navigationOptions = ({screenProps: {t}}) => ({
  title: t('menu.orders'),
  tabBarButtonComponent: (props) => (
    <TabBarIcon focused={props?.focused} name="md-document" onPress={props?.onPress} />
  ),

})



const Reports = createStackNavigator({
  Reports: ReportsScreen,
  SalesCharts: SalesCharts,
  StaffTimeCard: StaffTimeCard,
  UserTimeCards: UserTimeCards,
  CustomerStats: CustomerStats,
  ShiftHistory: ShiftHistory,
  ShiftDetails: ShiftDetails
})
Reports.navigationOptions = ({screenProps: {t}}) => ({
  title: t('menu.reporting'),
  tabBarButtonComponent: (props) => (
    <TabBarIcon focused={props?.focused} name="ios-stats-chart" onPress={props?.onPress} />
  ),
})

const Inventory = createStackNavigator({
  InventoryScreen: InventoryScreen,
  InventoryOrderScreen: InventoryOrderScreen,
  InventoryOrderFormScreen, InventoryOrderFormScreen

})
Inventory.navigationOptions = ({screenProps: {t, appType}}) => ({
  title: t('inventory.title'),
  tabBarButtonComponent: (props) => (appType === 'retail' ?
    <TabBarIcon focused={props?.focused} name="inventory" onPress={props?.onPress} iconLib={'MaterialIcons'} />
    : null
  ),
})

const Rosters = createStackNavigator({
  CalendarScreen: CalendarScreen,
  RostersFormScreen: RostersFormScreen,

})
Rosters.navigationOptions = ({screenProps: {t}}) => ({
  title: t('menu.reporting'),
  tabBarButtonComponent: (props) => {
    return (
      <TabBarIcon focused={props?.focused} name="md-calendar" onPress={() => NavigationService?.navigateToRoute('CalendarScreen', null, props?.onPress)} />
    )
  },
})

const tabBar = createBottomTabNavigator({
  Home: {
    screen: Home,
    navigationOptions: ({navigation, screenProps: {t}}) => {
      if (navigation.state.routes.length > 0) {
        let tabBarVisible = true
        navigation.state.routes.map(route => {
          if (['RetailPayment', 'RetailPaymentOrder', 'RetailCheckoutComplete'].includes(route.routeName)) {
            tabBarVisible = false
          } else {
            tabBarVisible = true
          }
        })
        return {title: '', tabBarVisible}
      }
    }
  },
  Tables: {
    screen: Tables,
    navigationOptions: ({navigation, screenProps: {t}}) => {
      if (navigation.state.routes.length > 0) {
        let tabBarVisible = true
        navigation.state.routes.map(route => {
          if (['Payment', 'PaymentOrder', 'CheckoutComplete', 'SpiltBillScreen', 'SplitBillByHeadScreen'].includes(route.routeName)) {
            tabBarVisible = false
          } else {
            tabBarVisible = true
          }
        })
        return {title: '', tabBarVisible}
      }
    }
  },
  Orders: {
    screen: Orders,

  },
  Reports: {
    screen: Reports
  },
  Inventory: {
    screen: Inventory
  },
  Rosters: {
    screen: Rosters
  },
  Settings: {
    screen: Settings
  }
}, {
  resetOnBlur: true,
  defaultNavigationOptions: {
    tabBarOnPress: async ({navigation, defaultHandler}) => {
      const tokenObj = await getToken()

      if (tokenObj !== null && tokenObj.tokenExp > Date.now()) {
        navigation.dispatch(StackActions.popToTop())
      } else {
        navigation.navigate('Login')
      }

      //navigation.dispatch(StackActions.popToTop())

      /*navigation.dispatch(
        StackActions.reset({
          index: 0,
          key: navigation.state.routes[0].key,
          actions: [
            NavigationActions.navigate({
              routeName: navigation.state.routes[0].routeName
            })
          ]
        })
      )*/
      defaultHandler()
    }
  },
  //https://stackoverflow.com/questions/42910540/react-navigation-how-to-change-tabbar-color-based-on-current-tab
  tabBarComponent: props => {

    return (
      <TabBarBottom
        {...props}
        style={{color: props?.screenProps?.customSecondThemeColor, backgroundColor: props?.screenProps?.customTabBarBackgroundColor}}
      />
    )
  },
  tabBarOptions: {
    showLabel: false
  }
})

export default createSwitchNavigator({
  Home: HomeScreen,
  ClientUsers: ClientUsers,
  ClientUserLogin: ClientUserLogin,
  Intro: IntroAppScreen,
  CreateAcc: CreateAccScreen,
  Login: Login,
  LoginScreen: LoginScreen,
  ResetClientPassword: ResetClientPassword,
  tabBar: {
    screen: tabBar // Calling the tabNavigator, wich contains the other stackNavigators
  }
})

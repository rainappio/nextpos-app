import React from 'react'
import {Platform} from 'react-native'
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
import ReservationScreen from '../screens/ReservationScreen'
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
import UserTimeCardDetail from '../screens/UserTimeCardDetail'
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

const Home = createStackNavigator({
  LoginSuccess: LoginSuccessScreen,
  ClientUsers: ClientUsers,
  ClientUserLogin: ClientUserLogin,
  ClockIn: ClockIn,
  PasswordReset: PasswordReset
})
Home.navigationOptions = ({screenProps: {t}}) => ({
  title: t('menu.home'),
  tabBarIcon: ({focused}) => (
    <TabBarIcon focused={focused} name={'md-home'} />
  )
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
  ClientUsers: ClientUsers,
  ClientUserLoginS: ClientUserLogin,
  LoginSuccess: LoginSuccessScreen,
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
  ProductsOverviewforOffer: ProductsOverviewforOffer

})
Settings.navigationOptions = ({screenProps: {t}}) => ({
  title: t('menu.settings'),
  tabBarIcon: ({focused}) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-settings' : 'md-settings'}
    />
  )
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
})
Tables.navigationOptions = ({screenProps: {t}}) => ({
  title: t('menu.tables'),
  tabBarIcon: ({focused}) => (
    <TabBarIcon focused={focused} name="md-people" />
  )
})

const Orders = createStackNavigator({
  OrdersScr: OrdersScreen,
  OrderDetail: OrderDetail,
  UpdateOrderFromOrderDetail: UpdateOrder,
  NewOrderForm: OrderForm
})
Orders.navigationOptions = ({screenProps: {t}}) => ({
  title: t('menu.orders'),
  tabBarIcon: ({focused}) => (
    <TabBarIcon focused={focused} name="md-document" />
  )
})

const Reservation = createStackNavigator({
  Reservation: ReservationScreen
})
Reservation.navigationOptions = ({screenProps: {t}}) => ({
  title: t('menu.reservations'),
  tabBarIcon: ({focused}) => (
    <TabBarIcon focused={focused} name="ios-calendar" />
  )
})

const Reports = createStackNavigator({
  Reports: ReportsScreen,
  SalesCharts: SalesCharts,
  StaffTimeCard: StaffTimeCard,
  UserTimeCards: UserTimeCards,
  UserTimeCardDetail: UserTimeCardDetail,
  CustomerStats: CustomerStats,
  ShiftHistory: ShiftHistory,
  ShiftDetails: ShiftDetails
})
Reports.navigationOptions = ({screenProps: {t}}) => ({
  title: t('menu.reporting'),
  tabBarIcon: ({focused}) => (
    <FontAwesomeIcon
      focused={focused}
      name="bar-chart"
      size={32}
      color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  )
})

const tabBar = createBottomTabNavigator({
  Home: {
    screen: Home,
    /*navigationOptions: ({ navigation, screenProps: { t } }) => {
      if (navigation.state.routes.length > 0) {
        navigation.state.routes.map(route => {
          if (
            route.routeName === 'Home' ||
            route.routeName === 'Intro' ||
            route.routeName === 'Login' ||
            route.routeName === 'PasswordReset'
          ) {
            tabBarVisible = false
          } else {
            tabBarVisible = true
          }
        })
        return { title: '', tabBarVisible }
      }
    }*/
  },
  Tables: {
    screen: Tables
  },
  Orders: {
    screen: Orders
  },
  Reports: {
    screen: Reports
  },
  Settings: {
    screen: Settings
  }
}, {
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
        style={props.screenProps.themeStyle}
      />
    )
  },
  tabBarOptions: {
    showLabel: false
  }
})

export default createSwitchNavigator({
  Home: HomeScreen,
  Intro: IntroAppScreen,
  CreateAcc: CreateAccScreen,
  Login: Login,
  LoginScreen: LoginScreen,
  ResetClientPassword: ResetClientPassword,
  tabBar: {
    screen: tabBar // Calling the tabNavigator, wich contains the other stackNavigators
  }
})
